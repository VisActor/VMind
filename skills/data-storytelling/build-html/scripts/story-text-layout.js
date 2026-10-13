/* Story text-layout runtime for data-storytelling HTML output.
 * Progressive enhancement only: keep original semantic DOM readable,
 * upgrade selected text blocks with Pretext line layout when available,
 * and always signal readiness so motion can continue.
 */

(function () {
  const READY_EVENT = "story:text-layout-ready";
  const TARGET_SELECTOR = "[data-text-layout]";
  const APPLIED_ATTR = "data-text-layout-applied";
  const LINE_CLASS = "pretext-line";
  const RESIZE_DEBOUNCE_MS = 120;
  const WIDTH_CHANGE_EPSILON = 0.5;

  const RuntimeState = {
    initialized: false,
    ready: false,
    initPromise: null,
    resizeTimer: null,
    resizeBound: false,
    resizeObserver: null,
    pendingTargets: new Set(),
    relayouting: false,
  };

  function initStoryTextLayout() {
    if (RuntimeState.initPromise) {
      return RuntimeState.initPromise;
    }
    RuntimeState.initPromise = Promise.resolve()
      .then(waitForFonts)
      .then(enhanceAllTargets)
      .catch(function () {
        // Fail open: keep the original DOM untouched.
      })
      .finally(function () {
        if (!RuntimeState.initialized) {
          RuntimeState.initPromise = null;
        }
        dispatchReady();
      });
    return RuntimeState.initPromise;
  }

  function waitForFonts() {
    if (!document || !document.fonts) {
      return Promise.resolve();
    }
    if (document.fonts.ready && typeof document.fonts.ready.then === "function") {
      return document.fonts.ready.catch(function () {
        return undefined;
      });
    }
    return Promise.resolve();
  }

  function dispatchReady() {
    if (RuntimeState.ready) {
      return;
    }
    RuntimeState.ready = true;
    window.__storyTextLayoutReady = true;
    if (typeof window.dispatchEvent === "function" && typeof window.CustomEvent === "function") {
      window.dispatchEvent(new window.CustomEvent(READY_EVENT));
      return;
    }
    if (typeof document !== "undefined" && typeof document.dispatchEvent === "function" && typeof window.CustomEvent === "function") {
      document.dispatchEvent(new window.CustomEvent(READY_EVENT));
    }
  }

  function enhanceAllTargets() {
    const api = resolvePretextApi();
    if (!api) {
      return;
    }
    getTargets().forEach(function (node) {
      try {
        enhanceNode(node, api);
      } catch (_error) {
        restoreOriginal(node);
      }
    });
    bindResize();
    RuntimeState.initialized = true;
  }

  function bindResize() {
    if (RuntimeState.resizeBound || typeof window.addEventListener !== "function") {
      return;
    }
    RuntimeState.resizeBound = true;
    window.addEventListener("resize", function () {
      queueRelayoutTargets(getTargets());
    });
  }

  function relayoutAppliedTargets() {
    flushQueuedRelayouts();
  }

  function flushQueuedRelayouts() {
    const api = resolvePretextApi();
    if (!api) {
      return;
    }
    const nodes = RuntimeState.pendingTargets.size > 0
      ? Array.from(RuntimeState.pendingTargets)
      : getTargets();
    RuntimeState.pendingTargets.clear();
    RuntimeState.resizeTimer = null;
    RuntimeState.relayouting = true;
    nodes.forEach(function (node) {
      if (!isApplied(node)) {
        return;
      }
      try {
        restoreOriginal(node);
        enhanceNode(node, api);
      } catch (_error) {
        restoreOriginal(node);
      }
    });
    RuntimeState.relayouting = false;
  }

  function queueRelayoutTargets(nodes) {
    (nodes || []).forEach(function (node) {
      if (node && isApplied(node)) {
        RuntimeState.pendingTargets.add(node);
      }
    });
    if (RuntimeState.pendingTargets.size === 0) {
      return;
    }
    if (RuntimeState.resizeTimer !== null && typeof window.clearTimeout === "function") {
      window.clearTimeout(RuntimeState.resizeTimer);
    }
    if (typeof window.setTimeout !== "function") {
      flushQueuedRelayouts();
      return;
    }
    RuntimeState.resizeTimer = window.setTimeout(function () {
      flushQueuedRelayouts();
    }, RESIZE_DEBOUNCE_MS);
  }

  function getTargets() {
    if (!document || typeof document.querySelectorAll !== "function") {
      return [];
    }
    return Array.from(document.querySelectorAll(TARGET_SELECTOR));
  }

  function enhanceNode(node, api) {
    if (!node || isApplied(node)) {
      return;
    }

    const items = compileRichInlineItems(node);
    if (items.length === 0) {
      return;
    }

    cacheOriginal(node);

    const prepared = api.prepareRichInline(items);
    const measuredWidth = measureMaxWidth(node);
    const lines = materializeLines(api, prepared, measuredWidth, measureLineHeight(node));
    if (lines.length === 0) {
      return;
    }

    renderLines(node, lines, items);
    node.__storyTextLayoutLastMeasuredWidth = measuredWidth;
    markApplied(node);
    observeTarget(node);
  }

  function materializeLines(api, prepared, maxWidth, lineHeight) {
    const lineRanges = [];

    if (typeof api.walkRichInlineLineRanges === "function") {
      if (api.walkRichInlineLineRanges.length >= 3) {
        api.walkRichInlineLineRanges(prepared, maxWidth, function (line) {
          lineRanges.push(line);
        });
      } else {
        api.walkRichInlineLineRanges(prepared, function (line) {
          lineRanges.push(line);
        });
      }
    }

    if (lineRanges.length > 0) {
      return lineRanges
        .map(function (range) {
          return materializeSingleLine(api, prepared, range);
        })
        .filter(Boolean);
    }

    if (typeof api.layoutWithLines === "function") {
      const fallback = api.layoutWithLines(prepared, maxWidth, lineHeight);
      if (fallback && Array.isArray(fallback.lines) && fallback.lines.length > 0) {
        return fallback.lines.map(normalizeLine).filter(Boolean);
      }
    }

    return normalizePreparedItems(prepared);
  }

  function materializeSingleLine(api, prepared, range) {
    if (typeof api.materializeRichInlineLineRange === "function") {
      return normalizeLine(api.materializeRichInlineLineRange(prepared, range));
    }
    return normalizeLine(range);
  }

  function normalizeLine(line) {
    if (!line) {
      return null;
    }
    if (Array.isArray(line)) {
      return {
        fragments: line.map(function (fragment, index) {
          return {
            itemIndex: fragment.itemIndex != null ? fragment.itemIndex : index,
            text: fragment.text != null ? String(fragment.text) : "",
            gapBefore: fragment.gapBefore || 0,
          };
        }),
      };
    }
    if (Array.isArray(line.fragments)) {
      return {
        fragments: line.fragments.map(function (fragment, index) {
          return {
            itemIndex: fragment.itemIndex != null ? fragment.itemIndex : index,
            text: fragment.text != null ? String(fragment.text) : "",
            gapBefore: fragment.gapBefore || 0,
          };
        }),
      };
    }
    if (Array.isArray(line.items)) {
      return {
        fragments: line.items.map(function (item, index) {
          return {
            itemIndex: index,
            text: item.text != null ? String(item.text) : "",
            gapBefore: item.gapBefore || 0,
          };
        }),
      };
    }
    if (typeof line.text === "string") {
      return {
        fragments: [
          {
            itemIndex: 0,
            text: line.text,
            gapBefore: 0,
          },
        ],
      };
    }
    return null;
  }

  function normalizePreparedItems(prepared) {
    if (!prepared || !Array.isArray(prepared.items) || prepared.items.length === 0) {
      return [];
    }
    return [
      {
        fragments: prepared.items.map(function (item, index) {
          return {
            itemIndex: index,
            text: item.text != null ? String(item.text) : "",
            gapBefore: item.gapBefore || 0,
          };
        }),
      },
    ];
  }

  function renderLines(node, lines, items) {
    const doc = node.ownerDocument || document;
    const nextChildren = [];

    lines.forEach(function (line) {
      const lineNode = doc.createElement("span");
      setClassName(lineNode, LINE_CLASS);

      line.fragments.forEach(function (fragment) {
        const sourceItem = items[fragment.itemIndex] || null;
        const fragmentText = fragment.text != null
          ? String(fragment.text)
          : sourceItem && sourceItem.text
            ? String(sourceItem.text)
            : "";

        if (!fragmentText) {
          return;
        }

        if (fragment.gapBefore > 0 && lineNode.childNodes && lineNode.childNodes.length > 0) {
          lineNode.appendChild(doc.createTextNode(" "));
        }

        if (sourceItem && sourceItem.emphasis) {
          const strong = doc.createElement("strong");
          strong.appendChild(doc.createTextNode(fragmentText));
          lineNode.appendChild(strong);
          return;
        }

        lineNode.appendChild(doc.createTextNode(fragmentText));
      });

      nextChildren.push(lineNode);
    });

    if (typeof node.replaceChildren === "function") {
      node.replaceChildren.apply(node, nextChildren);
      return;
    }

    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    nextChildren.forEach(function (child) {
      node.appendChild(child);
    });
  }

  function setClassName(node, className) {
    if (!node) {
      return;
    }
    if (typeof node.setAttribute === "function") {
      node.setAttribute("class", className);
      return;
    }
    node.className = className;
  }

  function cacheOriginal(node) {
    if (node.__storyTextLayoutOriginalHtml == null) {
      node.__storyTextLayoutOriginalHtml = typeof node.innerHTML === "string" ? node.innerHTML : "";
      node.__storyTextLayoutOriginalText = typeof node.textContent === "string" ? node.textContent : "";
    }
  }

  function restoreOriginal(node) {
    if (!node) {
      return;
    }
    if (node.__storyTextLayoutOriginalHtml != null) {
      node.innerHTML = node.__storyTextLayoutOriginalHtml;
    } else if (node.__storyTextLayoutOriginalText != null) {
      node.textContent = node.__storyTextLayoutOriginalText;
    }
    if (typeof node.removeAttribute === "function") {
      node.removeAttribute(APPLIED_ATTR);
    } else if (node.dataset) {
      delete node.dataset.textLayoutApplied;
    }
  }

  function markApplied(node) {
    if (typeof node.setAttribute === "function") {
      node.setAttribute(APPLIED_ATTR, "true");
      return;
    }
    if (node.dataset) {
      node.dataset.textLayoutApplied = "true";
    }
  }

  function isApplied(node) {
    if (!node) {
      return false;
    }
    if (typeof node.getAttribute === "function") {
      return node.getAttribute(APPLIED_ATTR) === "true";
    }
    return !!(node.dataset && node.dataset.textLayoutApplied === "true");
  }

  function compileRichInlineItems(node) {
    // Fail open for interactive/shared inline primitives that the current
    // line-layout runtime cannot preserve without flattening their DOM.
    if (
      typeof node.querySelector === "function" &&
      node.querySelector(".inline-cite, .delta-chip")
    ) {
      return [];
    }

    const baseFont = readFont(node);
    const strongFont = buildStrongFont(baseFont);
    const items = [];
    const children = Array.isArray(node.childNodes) ? node.childNodes : Array.from(node.childNodes || []);

    const isSupported = children.every(function (child) {
      return collectInlineItems(child, {
        emphasis: false,
        font: baseFont,
        strongFont: strongFont,
      }, items);
    });

    if (!isSupported) {
      return [];
    }

    return mergeAdjacentItems(items);
  }

  function collectInlineItems(node, state, items) {
    if (!node) {
      return true;
    }

    const textNodeType = window.Node ? window.Node.TEXT_NODE : 3;
    const elementNodeType = window.Node ? window.Node.ELEMENT_NODE : 1;

    if (node.nodeType === textNodeType) {
      if (node.textContent) {
        items.push({
          emphasis: state.emphasis,
          font: state.emphasis ? state.strongFont : state.font,
          text: String(node.textContent),
        });
      }
      return true;
    }

    if (node.nodeType !== elementNodeType) {
      return true;
    }

    const tagName = String(node.tagName || "").toUpperCase();
    if (tagName !== "SPAN" && tagName !== "STRONG" && tagName !== "B") {
      return false;
    }

    const nextState = {
      emphasis: state.emphasis || tagName === "STRONG" || tagName === "B",
      font: state.font,
      strongFont: state.strongFont,
    };

    const children = Array.isArray(node.childNodes) ? node.childNodes : Array.from(node.childNodes || []);
    if (children.length === 0 && node.textContent) {
      items.push({
        emphasis: nextState.emphasis,
        font: nextState.emphasis ? nextState.strongFont : nextState.font,
        text: String(node.textContent),
      });
      return true;
    }

    return children.every(function (child) {
      return collectInlineItems(child, nextState, items);
    });
  }

  function mergeAdjacentItems(items) {
    const merged = [];
    items.forEach(function (item) {
      if (!item.text) {
        return;
      }
      const previous = merged[merged.length - 1];
      if (previous && previous.emphasis === item.emphasis && previous.font === item.font) {
        previous.text += item.text;
        return;
      }
      merged.push({
        emphasis: item.emphasis,
        font: item.font,
        text: item.text,
      });
    });
    return merged;
  }

  function readFont(node) {
    const styles = getComputedStyle(node);
    return styles && styles.font ? styles.font : "400 16px sans-serif";
  }

  function buildStrongFont(baseFont) {
    if (!baseFont) {
      return "700 16px sans-serif";
    }
    if (/\b(?:normal|bold|bolder|lighter|[1-9]00)\b/.test(baseFont)) {
      return baseFont.replace(/\b(?:normal|bold|bolder|lighter|[1-9]00)\b/, "700");
    }
    return "700 " + baseFont;
  }

  function measureMaxWidth(node) {
    const ownWidth = measureOwnWidth(node);
    const parent = getParentElement(node);
    const parentWidth = measureContentWidth(parent);
    const maxConstraint = measureMaxConstraint(node);

    if (shouldPreferParentWidth(node, ownWidth, parentWidth)) {
      return clampWidth(parentWidth, maxConstraint);
    }
    if (ownWidth > 0) {
      return clampWidth(ownWidth, maxConstraint);
    }
    if (parentWidth > 0) {
      return clampWidth(parentWidth, maxConstraint);
    }
    if (Number.isFinite(maxConstraint) && maxConstraint > 0) {
      return maxConstraint;
    }
    return Number.POSITIVE_INFINITY;
  }

  function observeTarget(node) {
    bindResizeObserver();
    if (!RuntimeState.resizeObserver || !node) {
      return;
    }
    [node, getParentElement(node)].forEach(function (observedNode) {
      if (!isElementNode(observedNode)) {
        return;
      }
      if (!observedNode.__storyTextLayoutTargets) {
        observedNode.__storyTextLayoutTargets = new Set();
      }
      observedNode.__storyTextLayoutTargets.add(node);
      if (observedNode.__storyTextLayoutObserved) {
        return;
      }
      RuntimeState.resizeObserver.observe(observedNode);
      observedNode.__storyTextLayoutObserved = true;
    });
  }

  function bindResizeObserver() {
    if (RuntimeState.resizeObserver || typeof window.ResizeObserver !== "function") {
      return;
    }
    RuntimeState.resizeObserver = new window.ResizeObserver(function (entries) {
      if (RuntimeState.relayouting) {
        return;
      }
      const dirtyTargets = new Set();
      (entries || []).forEach(function (entry) {
        const observedNode = entry && entry.target ? entry.target : null;
        const targets = observedNode && observedNode.__storyTextLayoutTargets
          ? Array.from(observedNode.__storyTextLayoutTargets)
          : [];
        targets.forEach(function (target) {
          const currentWidth = measureMaxWidth(target);
          const previousWidth = target.__storyTextLayoutLastMeasuredWidth;
          if (!Number.isFinite(currentWidth) || currentWidth <= 0) {
            return;
          }
          if (
            Number.isFinite(previousWidth) &&
            Math.abs(currentWidth - previousWidth) < WIDTH_CHANGE_EPSILON
          ) {
            return;
          }
          dirtyTargets.add(target);
        });
      });
      queueRelayoutTargets(Array.from(dirtyTargets));
    });
  }

  function measureOwnWidth(node) {
    if (typeof node.getBoundingClientRect === "function") {
      const rect = node.getBoundingClientRect();
      if (rect && typeof rect.width === "number" && rect.width > 0) {
        return rect.width;
      }
    }
    if (typeof node.clientWidth === "number" && node.clientWidth > 0) {
      return node.clientWidth;
    }
    if (typeof node.offsetWidth === "number" && node.offsetWidth > 0) {
      return node.offsetWidth;
    }
    return 0;
  }

  function measureContentWidth(node) {
    if (!isElementNode(node)) {
      return 0;
    }
    if (typeof node.clientWidth === "number" && node.clientWidth > 0) {
      return node.clientWidth;
    }
    if (typeof node.getBoundingClientRect !== "function") {
      return 0;
    }
    const rect = node.getBoundingClientRect();
    if (!rect || typeof rect.width !== "number" || rect.width <= 0) {
      return 0;
    }
    const styles = safeComputedStyle(node);
    const paddingLeft = parsePixelValue(styles && styles.paddingLeft);
    const paddingRight = parsePixelValue(styles && styles.paddingRight);
    return Math.max(0, rect.width - paddingLeft - paddingRight);
  }

  function measureMaxConstraint(node) {
    const styles = safeComputedStyle(node);
    if (!styles || !styles.maxWidth || styles.maxWidth === "none") {
      return Number.POSITIVE_INFINITY;
    }
    const maxWidth = parsePixelValue(styles.maxWidth);
    return Number.isFinite(maxWidth) && maxWidth > 0
      ? maxWidth
      : Number.POSITIVE_INFINITY;
  }

  function shouldPreferParentWidth(node, ownWidth, parentWidth) {
    if (!(parentWidth > 0)) {
      return false;
    }
    if (!(ownWidth > 0)) {
      return true;
    }
    if (parentWidth <= ownWidth + WIDTH_CHANGE_EPSILON) {
      return false;
    }
    const parent = getParentElement(node);
    if (!isElementNode(parent)) {
      return false;
    }
    const parentStyles = safeComputedStyle(parent);
    const nodeStyles = safeComputedStyle(node);
    const display = String(parentStyles && parentStyles.display ? parentStyles.display : "");
    if (display.indexOf("flex") === -1) {
      return false;
    }
    const direction = String(parentStyles && parentStyles.flexDirection ? parentStyles.flexDirection : "row");
    if (direction.indexOf("column") !== 0) {
      return false;
    }
    const alignItems = String(parentStyles && parentStyles.alignItems ? parentStyles.alignItems : "stretch");
    const alignSelf = String(nodeStyles && nodeStyles.alignSelf ? nodeStyles.alignSelf : "auto");
    const effectiveAlign = alignSelf && alignSelf !== "auto" ? alignSelf : alignItems;
    return effectiveAlign !== "stretch";
  }

  function clampWidth(width, maxConstraint) {
    if (!(width > 0)) {
      return width;
    }
    if (Number.isFinite(maxConstraint) && maxConstraint > 0) {
      return Math.min(width, maxConstraint);
    }
    return width;
  }

  function parsePixelValue(value) {
    const numeric = parseFloat(value);
    return Number.isFinite(numeric) ? numeric : NaN;
  }

  function safeComputedStyle(node) {
    if (!node || typeof getComputedStyle !== "function") {
      return null;
    }
    try {
      return getComputedStyle(node);
    } catch (_error) {
      return null;
    }
  }

  function getParentElement(node) {
    if (!node) {
      return null;
    }
    if (isElementNode(node.parentElement)) {
      return node.parentElement;
    }
    if (isElementNode(node.parentNode)) {
      return node.parentNode;
    }
    return null;
  }

  function isElementNode(node) {
    const elementNodeType = window.Node ? window.Node.ELEMENT_NODE : 1;
    return !!(node && node.nodeType === elementNodeType);
  }

  function measureLineHeight(node) {
    const styles = getComputedStyle(node);
    const explicit = styles ? parseFloat(styles.lineHeight) : NaN;
    if (Number.isFinite(explicit) && explicit > 0) {
      return explicit;
    }
    const fontSize = styles ? parseFloat(styles.fontSize) : NaN;
    if (Number.isFinite(fontSize) && fontSize > 0) {
      return fontSize * 1.4;
    }
    return 24;
  }

  function resolvePretextApi() {
    return window.StoryTextLayoutPretext || window.pretext || null;
  }

  window.initStoryTextLayout = initStoryTextLayout;
})();
