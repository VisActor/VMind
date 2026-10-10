/* Story motion runtime for data-storytelling HTML output.
 * The runtime scans semantic section hooks and initializes
 * GSAP / ScrollTrigger motion behaviors in the browser.
 */

(function () {
  const TEXT_READY_EVENT = "story:text-layout-ready";
  const METRIC_COUNT_UP_SCROLL_START = "top 78%";
  const ALLOWED_MOTION_LEVELS = new Set(["none", "restrained", "guided"]);
  const MOTION_GRAMMAR = {
    "cover-intro": {
      none: [],
      restrained: ["reveal-soft"],
      guided: ["reveal-soft"]
    },
    "hero-impact": {
      none: [],
      restrained: ["reveal-soft", "count-up"],
      guided: ["reveal-soft", "count-up"]
    },
    "chart-narrative": {
      none: [],
      restrained: [],
      guided: ["reveal-soft", "count-up"]
    },
    "baseline-kpis": {
      none: [],
      restrained: ["count-up"],
      guided: ["count-up"]
    },
    "comparison": {
      none: [],
      restrained: ["count-up"],
      guided: ["count-up"]
    },
    "timeline": {
      none: [],
      restrained: [],
      guided: ["line-draw"]
    },
    "action": {
      none: [],
      restrained: [],
      guided: []
    },
    "scrollytelling": {
      none: ["scrolly-core"],
      restrained: ["scrolly-core"],
      guided: ["scrolly-core"]
    }
  };
  const MotionRuntime = {
    prefersReducedMotion: false,
    motionLevel: null,
    initializedSections: new WeakSet(),
    initializedElements: new WeakSet(),
    hasRegisteredPlugin: false,
    waitingForTextLayout: false
  };

  function initStoryMotion() {
    startWhenTextLayoutReady();
  }

  function startWhenTextLayoutReady() {
    if (window.__storyMotionInitialized === true) {
      return;
    }
    if (window.__storyTextLayoutReady === true) {
      bootStoryMotion();
      return;
    }
    if (MotionRuntime.waitingForTextLayout) {
      return;
    }

    const canListenOnWindow = typeof window.addEventListener === 'function';
    const canListenOnDocument = typeof document !== 'undefined' && typeof document.addEventListener === 'function';
    const producerUsesWindow = typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function';
    const producerUsesDocument = !producerUsesWindow &&
      typeof document !== 'undefined' &&
      typeof document.dispatchEvent === 'function' &&
      typeof window.CustomEvent === 'function';

    if ((producerUsesWindow && !canListenOnWindow) ||
        (producerUsesDocument && !canListenOnDocument) ||
        (!producerUsesWindow && !producerUsesDocument)) {
      bootStoryMotion();
      return;
    }

    MotionRuntime.waitingForTextLayout = true;
    const handleReady = function () {
      if (typeof window.removeEventListener === 'function') {
        window.removeEventListener(TEXT_READY_EVENT, handleReady);
      }
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener(TEXT_READY_EVENT, handleReady);
      }
      MotionRuntime.waitingForTextLayout = false;
      bootStoryMotion();
    };

    if (producerUsesWindow && canListenOnWindow) {
      window.addEventListener(TEXT_READY_EVENT, handleReady);
    }
    if (producerUsesDocument && canListenOnDocument) {
      document.addEventListener(TEXT_READY_EVENT, handleReady);
    }
  }

  function bootStoryMotion() {
    if (window.__storyMotionInitialized === true) {
      return;
    }

    window.__storyMotionInitialized = true;
    MotionRuntime.waitingForTextLayout = false;
    MotionRuntime.motionLevel = readMotionLevel();
    window.__storyMotionState = MotionRuntime;
    detectRuntimeState();
    if (!ensureGsapReady()) {
      revealLegacyFallbackElements();
      return;
    }

    initPatternSections();
    initStandaloneMetricTargets();
    initLegacyAnimateOnScrollFallback();
    finalizeMotionSetup();
  }

  function detectRuntimeState() {
    MotionRuntime.prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function readMotionLevel() {
    const value = document.body && document.body.dataset
      ? document.body.dataset.motionLevel
      : "";
    return ALLOWED_MOTION_LEVELS.has(value) ? value : "restrained";
  }

  function allowMotion(kind, pattern) {
    const level = MotionRuntime.prefersReducedMotion ? "none" : MotionRuntime.motionLevel;
    return MOTION_GRAMMAR[pattern] && MOTION_GRAMMAR[pattern][level]
      ? MOTION_GRAMMAR[pattern][level].includes(kind)
      : false;
  }

  function finalizeElement(el) {
    if (!el || MotionRuntime.initializedElements.has(el)) {
      return;
    }

    MotionRuntime.initializedElements.add(el);
    setFinalState(el);
  }

  function finalizeElements(elements) {
    Array.from(elements || []).forEach(finalizeElement);
  }

  function markMotionPrimitive(el, primitive, state = 'active') {
    if (!el) {
      return;
    }

    el.setAttribute('data-motion-primitive', primitive);
    el.setAttribute('data-motion-state', state);
  }

  function revealIfAllowed(el, kind, pattern, options = {}) {
    if (!el) {
      return;
    }

    if (allowMotion(kind, pattern)) {
      revealElement(el, options);
      return;
    }

    finalizeElement(el);
  }

  function maskRevealIfAllowed(el, pattern, options = {}) {
    if (!el) {
      return;
    }

    if (!allowMotion('mask-reveal', pattern)) {
      finalizeElement(el);
      return;
    }

    markMotionPrimitive(el, 'mask-reveal');
    maskRevealElement(el, options);
  }

  function lineDrawIfAllowed(el, pattern, options = {}) {
    if (!el) {
      return;
    }

    const progressVar = options.progressVar || '--timeline-line-progress';

    if (!allowMotion('line-draw', pattern)) {
      setStyleValue(el, progressVar, '1');
      finalizeElement(el);
      return;
    }

    markMotionPrimitive(el, 'line-draw');
    lineDrawElement(el, options);
  }

  function staggerElementsIfAllowed(elements, kind, pattern, options = {}) {
    const filtered = Array.from(elements || []).filter((el) => el && !MotionRuntime.initializedElements.has(el));
    if (filtered.length === 0) {
      return;
    }

    if (allowMotion(kind, pattern)) {
      staggerElements(filtered, options);
      return;
    }

    finalizeElements(filtered);
  }

  function staggerChildrenIfAllowed(parent, selector, kind, pattern, options = {}) {
    if (!parent) {
      return;
    }

    const elements = Array.from(parent.querySelectorAll(selector)).filter((el) => el && !MotionRuntime.initializedElements.has(el));
    if (elements.length === 0) {
      return;
    }

    if (allowMotion(kind, pattern)) {
      staggerChildren(parent, selector, options);
      return;
    }

    finalizeElements(elements);
  }

  function setCountUpFinalState(nodeList) {
    Array.from(nodeList || []).forEach((el) => {
      if (!el || MotionRuntime.initializedElements.has(el)) {
        return;
      }

      MotionRuntime.initializedElements.add(el);
      const target = el.dataset.target;
      if (target) {
        const displayValue = formatMetricDisplayValue(el, target);
        reserveMetricWidth(el, displayValue);
        setPlainMetricValue(el, displayValue);
      }
    });
  }

  function queryUniqueElements(scope, selectors) {
    if (!scope || !selectors) {
      return [];
    }

    const selectorList = Array.isArray(selectors)
      ? selectors
      : String(selectors)
          .split(',')
          .map((selector) => selector.trim())
          .filter(Boolean);
    const seen = new Set();
    const elements = [];

    selectorList.forEach((selector) => {
      Array.from(scope.querySelectorAll(selector) || []).forEach((el) => {
        if (!el || seen.has(el)) {
          return;
        }
        seen.add(el);
        elements.push(el);
      });
    });

    return elements;
  }

  function findPatternSection(el) {
    let current = el;
    while (current) {
      if (current.dataset && current.dataset.pattern) {
        return current;
      }
      current = current.parentNode || null;
    }
    return null;
  }

  function findAncestorWithClass(el, className) {
    let current = el;
    while (current) {
      if (current.classList && typeof current.classList.contains === 'function' && current.classList.contains(className)) {
        return current;
      }
      current = current.parentNode || null;
    }
    return null;
  }

  function findPreviewSharedComponentsScope(el) {
    let current = el;
    while (current) {
      if (current.dataset && current.dataset.previewRole === 'shared-components') {
        return current;
      }
      current = current.parentNode || null;
    }
    return null;
  }

  function ensureGsapReady() {
    if (!window.gsap || !window.ScrollTrigger) {
      return false;
    }
    if (!MotionRuntime.hasRegisteredPlugin) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      MotionRuntime.hasRegisteredPlugin = true;
    }
    return true;
  }

  function finalizeMotionSetup() {
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      window.ScrollTrigger.refresh();
    }
  }

  function initPatternSections() {
    document.querySelectorAll('section[data-pattern]').forEach((section) => {
      if (MotionRuntime.initializedSections.has(section)) {
        return;
      }

      const pattern = section.dataset.pattern;
      const handler = PATTERN_FAMILY_ROUTES[pattern];
      if (typeof handler === 'function') {
        handler(section);
        MotionRuntime.initializedSections.add(section);
      }
    });
  }

  function initLegacyAnimateOnScrollFallback() {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      if (MotionRuntime.initializedElements.has(el)) {
        return;
      }

      if (findPatternSection(el) || findPreviewSharedComponentsScope(el)) {
        finalizeElement(el);
        return;
      }

      if (MotionRuntime.motionLevel === "none" || MotionRuntime.prefersReducedMotion || !window.gsap) {
        finalizeElement(el);
        return;
      }

      revealElement(el);
    });
  }

  function initStandaloneMetricTargets() {
    const targets = queryUniqueElements(document, ['.metric-value[data-target]'])
      .filter((el) => !findPatternSection(el));
    if (targets.length === 0) {
      return;
    }

    if (MotionRuntime.motionLevel === "none" || MotionRuntime.prefersReducedMotion || !window.gsap) {
      setCountUpFinalState(targets);
      return;
    }

    initCountUp(targets);
  }

  function revealLegacyFallbackElements() {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      setFinalState(el);
      MotionRuntime.initializedElements.add(el);
    });
  }

  const PATTERN_FAMILY_ROUTES = {
    'cover-intro': initCoverIntroFamily,
    'hero-impact': initHeroFamily,
    'chart-narrative': initNarrativeFamily,
    'baseline-kpis': initKpiFamily,
    'comparison': initComparisonFamily,
    'timeline': initTimelineFamily,
    'action': initActionFamily,
    'scrollytelling': initScrollyFamily
  };

  function initCoverIntroFamily(section) {
    const copy = section.querySelector('.cover-intro-copy');
    revealIfAllowed(copy, "reveal-soft", "cover-intro", { trigger: section, start: 'top 84%', y: 24 });
  }

  function initHeroFamily(section) {
    const mode = section.dataset.heroMode || 'stat';
    const title = section.querySelector('h1');
    const heroNumber = section.querySelector('.hero-number');
    const heroMetricTargets = queryUniqueElements(section, ['.metric-value[data-target]']);

    if (mode === 'stat') {
      if (MotionRuntime.motionLevel === "guided" && allowMotion("reveal-soft", "hero-impact")) {
        revealIfAllowed(title, "reveal-soft", "hero-impact", { trigger: section, start: 'top 80%', y: 32 });
      } else {
        finalizeElement(title);
      }
    } else {
      if (allowMotion("reveal-soft", "hero-impact")) {
        revealIfAllowed(title, "reveal-soft", "hero-impact", { trigger: section, start: 'top 80%', y: 32 });
      } else {
        finalizeElement(title);
      }
    }

    if (heroMetricTargets.length > 0) {
      if (allowMotion("count-up", "hero-impact")) {
        initCountUp(heroMetricTargets);
      } else {
        setCountUpFinalState(heroMetricTargets);
      }
    }

    if (mode !== 'stat' && heroNumber) {
      finalizeElement(heroNumber);
    }

  }

  function initNarrativeFamily(section) {
    const highlightBox = section.querySelector('.highlight-box');
    finalizeElement(section.querySelector('.section-heading'));
    finalizeElement(section.querySelector('.chart-wrapper'));
    if (highlightBox && allowMotion("reveal-soft", "chart-narrative")) {
      markMotionPrimitive(highlightBox, 'reveal-soft');
      revealElement(highlightBox, {
        trigger: highlightBox,
        start: 'top 90%',
        y: 14,
        duration: 0.62,
        ease: 'power1.out'
      });
    } else {
      finalizeElement(highlightBox);
    }
    finalizeElement(section.querySelector('.body-text'));
    finalizeElement(section.querySelector('.kpi-row'));

    const supportingKpiTargets = queryUniqueElements(section, ['.metric-value[data-target]']);
    if (allowMotion("count-up", "chart-narrative")) {
      initCountUp(supportingKpiTargets);
    } else {
      setCountUpFinalState(supportingKpiTargets);
    }
  }

  function initKpiFamily(section) {
    finalizeElement(section.querySelector('.section-heading'));
    finalizeElement(section.querySelector('.kpi-row'));

    if (allowMotion("count-up", "baseline-kpis")) {
      initCountUp(section.querySelectorAll('.metric-value[data-target]'));
    } else {
      setCountUpFinalState(section.querySelectorAll('.metric-value[data-target]'));
    }
  }

  function initComparisonFamily(section) {
    finalizeElement(section.querySelector('.section-heading'));
    finalizeElement(section.querySelector('.comparison-pair'));
    finalizeElement(section.querySelector('.content-side'));
    finalizeElement(section.querySelector('.visual-side'));

    const comparisonNumberTargets = queryUniqueElements(section, ['.metric-value[data-target]']);
    if (allowMotion("count-up", "comparison")) {
      initCountUp(comparisonNumberTargets);
    } else {
      setCountUpFinalState(comparisonNumberTargets);
    }
  }

  function initTimelineFamily(section) {
    finalizeElement(section.querySelector('.section-heading'));
    finalizeElement(section.querySelector('.chart-wrapper'));
    const mode = section.dataset.timelineMode || '';
    const verticalTimeline = section.querySelector('.timeline-vertical');
    const stripTimeline = section.querySelector('.timeline-strip');

    if (mode === 'chart-stack' && stripTimeline) {
      lineDrawIfAllowed(stripTimeline, "timeline", {
        trigger: stripTimeline,
        start: 'top 86%',
        progressVar: '--timeline-strip-progress'
      });
      if (allowMotion('line-draw', 'timeline')) {
        staggerChildren(stripTimeline, '.timeline-strip-item', {
          trigger: stripTimeline,
          start: 'top 84%',
          y: 18,
          stagger: 0.1,
          duration: 0.55
        });
      } else {
        finalizeElements(stripTimeline.querySelectorAll('.timeline-strip-item'));
      }
      return;
    }

    if (verticalTimeline) {
      lineDrawIfAllowed(verticalTimeline, "timeline", {
        trigger: verticalTimeline || section,
        start: 'top 84%'
      });

      if (mode === 'split-sync') {
        if (allowMotion('line-draw', 'timeline')) {
          staggerChildren(verticalTimeline, '.timeline-item', {
            trigger: verticalTimeline,
            start: 'top 82%',
            y: 18,
            stagger: 0.1,
            duration: 0.55
          });
        } else {
          finalizeElements(verticalTimeline.querySelectorAll('.timeline-item'));
        }
      }
    }
  }

  function initActionFamily(section) {
    finalizeElement(section.querySelector('.section-heading'));
    finalizeElement(section.querySelector('.action-cards'));
  }

  function initScrollyFamily(section) {
    const steps = Array.from(section.querySelectorAll('.scrolly-step'));
    if (steps.length === 0) {
      return;
    }

    finalizeElement(section.querySelector('.section-heading'));

    initScrollySteps(section, steps);
  }

  function initScrollySteps(section, steps = Array.from(section.querySelectorAll('.scrolly-step'))) {
    if (steps.length === 0) {
      return;
    }

    activateScrollySteps(section, steps);
  }

  function revealElement(el, options = {}) {
    if (!el || MotionRuntime.initializedElements.has(el)) {
      return;
    }

    MotionRuntime.initializedElements.add(el);

    if (MotionRuntime.prefersReducedMotion || !window.gsap) {
      setFinalState(el);
      return;
    }

    const trigger = options.trigger || el;
    const fromVars = {
      opacity: 0,
      x: options.x || 0,
      y: options.y != null ? options.y : 24
    };
    const toVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration: options.duration || 0.8,
      delay: options.delay || 0,
      ease: options.ease || 'power2.out',
      scrollTrigger: {
        trigger,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none'
      }
    };

    window.gsap.fromTo(el, fromVars, toVars);
  }

  function maskRevealElement(el, options = {}) {
    if (!el || MotionRuntime.initializedElements.has(el)) {
      return;
    }

    MotionRuntime.initializedElements.add(el);

    if (MotionRuntime.prefersReducedMotion || !window.gsap) {
      setFinalState(el);
      return;
    }

    const trigger = options.trigger || el;
    window.gsap.fromTo(el, {
      opacity: 0,
      clipPath: 'inset(0 0 0 100%)'
    }, {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
      duration: options.duration || 0.75,
      delay: options.delay || 0,
      ease: options.ease || 'power2.out',
      scrollTrigger: {
        trigger,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  function lineDrawElement(el, options = {}) {
    if (!el || MotionRuntime.initializedElements.has(el)) {
      return;
    }

    MotionRuntime.initializedElements.add(el);
    const progressVar = options.progressVar || '--timeline-line-progress';

    if (MotionRuntime.prefersReducedMotion || !window.gsap) {
      setStyleValue(el, progressVar, '1');
      setFinalState(el);
      return;
    }

    const trigger = options.trigger || el;
    window.gsap.fromTo(el, {
      [progressVar]: 0
    }, {
      [progressVar]: 1,
      duration: options.duration || 0.75,
      delay: options.delay || 0,
      ease: options.ease || 'power2.out',
      scrollTrigger: {
        trigger,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  function staggerChildren(parent, selector, options = {}) {
    if (!parent) {
      return;
    }

    const elements = Array.from(parent.querySelectorAll(selector)).filter((el) => !MotionRuntime.initializedElements.has(el));
    if (elements.length === 0) {
      return;
    }

    elements.forEach((el) => MotionRuntime.initializedElements.add(el));

    if (MotionRuntime.prefersReducedMotion || !window.gsap) {
      elements.forEach(setFinalState);
      return;
    }

    window.gsap.fromTo(elements, {
      opacity: 0,
      y: options.y != null ? options.y : 20
    }, {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.6,
      stagger: options.stagger || 0.12,
      ease: options.ease || 'power2.out',
      scrollTrigger: {
        trigger: options.trigger || parent,
        start: options.start || 'top 85%'
      }
    });
  }

  function staggerElements(elements, options = {}) {
    const filtered = Array.from(elements || []).filter((el) => el && !MotionRuntime.initializedElements.has(el));
    if (filtered.length === 0) {
      return;
    }

    filtered.forEach((el) => MotionRuntime.initializedElements.add(el));

    if (MotionRuntime.prefersReducedMotion || !window.gsap) {
      filtered.forEach(setFinalState);
      return;
    }

    window.gsap.fromTo(filtered, {
      opacity: 0,
      y: options.y != null ? options.y : 20,
      x: options.x || 0
    }, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: options.duration || 0.7,
      stagger: options.stagger || 0.12,
      ease: options.ease || 'power2.out',
      scrollTrigger: {
        trigger: options.trigger || filtered[0],
        start: options.start || 'top 85%'
      }
    });
  }

  function initCountUp(nodeList) {
    Array.from(nodeList || []).forEach((el) => {
      if (!el || MotionRuntime.initializedElements.has(el)) {
        return;
      }

      MotionRuntime.initializedElements.add(el);
      const target = el.dataset.target;
      if (!target) {
        return;
      }

      const displayValue = formatMetricDisplayValue(el, target);

      if (MotionRuntime.prefersReducedMotion || !window.gsap) {
        reserveMetricWidth(el, displayValue);
        el.textContent = displayValue;
        return;
      }

      const parsedValue = Number(target);
      if (!Number.isFinite(parsedValue)) {
        el.textContent = target;
        return;
      }

      reserveMetricWidth(el, displayValue);
      setStyleValue(el, 'textAlign', 'right');

      if (buildMetricNumberFlow(el, displayValue)) {
        const countUpVars = {
          duration: 1.05,
          ease: 'power3.out',
          onStart: () => {
            activateMetricNumberFlow(el);
          }
        };
        const scrollTrigger = getMetricCountUpScrollTrigger(el);
        if (scrollTrigger) {
          countUpVars.scrollTrigger = scrollTrigger;
        }
        window.gsap.to(el, countUpVars);
        return;
      }

      el.textContent = '0';
      const countUpVars = {
        textContent: parsedValue,
        duration: 1.2,
        ease: 'power1.out',
        snap: { textContent: parsedValue % 1 === 0 ? 1 : 0.1 },
        onUpdate: () => {
          const current = Number(el.textContent);
          el.textContent = parsedValue % 1 === 0 ? String(Math.round(current)) : current.toFixed(1);
        },
        onComplete: () => {
          el.textContent = displayValue;
        }
      };
      const scrollTrigger = getMetricCountUpScrollTrigger(el);
      if (scrollTrigger) {
        countUpVars.scrollTrigger = scrollTrigger;
      }
      window.gsap.to(el, countUpVars);
    });
  }

  function getMetricCountUpScrollTrigger(el) {
    if (isElementInitiallyVisible(el)) {
      return null;
    }
    return {
      trigger: el,
      start: METRIC_COUNT_UP_SCROLL_START
    };
  }

  function isElementInitiallyVisible(el) {
    if (!el || typeof el.getBoundingClientRect !== 'function') {
      return false;
    }
    const viewportHeight =
      Number.isFinite(window.innerHeight)
        ? window.innerHeight
        : document.documentElement && Number.isFinite(document.documentElement.clientHeight)
          ? document.documentElement.clientHeight
          : 0;
    if (!viewportHeight) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    const top = Number(rect && rect.top);
    const bottom = Number(rect && rect.bottom);
    if (!Number.isFinite(top) || !Number.isFinite(bottom)) {
      return false;
    }
    return bottom > 0 && top < viewportHeight * 0.96;
  }

  function activateScrollySteps(section, steps) {
    let activeStepIndex = 0;
    const activateStep = (index) => {
      activeStepIndex = index;
      steps.forEach((step, stepIndex) => {
        step.classList.toggle('is-active', stepIndex === index);
      });
    };
    const viewportHeight = () => {
      if (Number.isFinite(window.innerHeight)) {
        return window.innerHeight;
      }
      if (document.documentElement && Number.isFinite(document.documentElement.clientHeight)) {
        return document.documentElement.clientHeight;
      }
      return 0;
    };
    const resolveViewportStepIndex = (fallbackIndex) => {
      const height = viewportHeight();
      if (!height) {
        return fallbackIndex;
      }
      const anchor = height * 0.5;
      let bestIndex = null;
      let bestScore = Infinity;

      steps.forEach((step, index) => {
        if (!step || typeof step.getBoundingClientRect !== 'function') {
          return;
        }
        const rect = step.getBoundingClientRect();
        const top = Number(rect && rect.top);
        const bottom = Number(rect && rect.bottom);
        if (!Number.isFinite(top) || !Number.isFinite(bottom)) {
          return;
        }
        const midpoint = (top + bottom) / 2;
        const visible = bottom >= 0 && top <= height;
        const score = Math.abs(midpoint - anchor) + (visible ? 0 : height);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      return bestIndex === null ? fallbackIndex : bestIndex;
    };
    const activateViewportStep = (fallbackIndex) => {
      activateStep(resolveViewportStepIndex(fallbackIndex));
    };

    activateStep(0);

    if (!window.ScrollTrigger) {
      return;
    }

    window.ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => activateViewportStep(0),
      onEnterBack: () => activateViewportStep(steps.length - 1),
      onUpdate: () => activateViewportStep(activeStepIndex)
    });
  }

  function setStyleValue(el, propertyName, value) {
    if (!el || !el.style) {
      return;
    }

    if (typeof el.style.setProperty === 'function') {
      el.style.setProperty(propertyName, value);
      return;
    }

    el.style[propertyName] = value;
  }

  function buildMetricReserveSample(target) {
    return String(target ?? '').replace(/\d/g, '8');
  }

  function formatMetricDisplayValue(el, target) {
    if (el && el.dataset && typeof el.dataset.display === 'string' && el.dataset.display.trim()) {
      return el.dataset.display.trim();
    }
    const raw = String(target ?? '').trim();
    if (!raw) {
      return raw;
    }
    const parsedValue = Number(raw);
    if (!Number.isFinite(parsedValue)) {
      return raw;
    }
    if (Number.isInteger(parsedValue)) {
      return String(parsedValue);
    }
    return parsedValue.toFixed(2).replace(/\.?0+$/, '');
  }

  function setPlainMetricValue(el, displayValue) {
    if (!el) {
      return;
    }
    el.removeAttribute?.('aria-label');
    el.removeAttribute?.('data-number-flow');
    el.removeAttribute?.('data-number-flow-state');
    el.textContent = displayValue;
  }

  function buildMetricNumberFlow(el, displayValue) {
    if (!el || !window.document || typeof window.document.createElement !== 'function') {
      return false;
    }
    const text = String(displayValue ?? '');
    if (!/\d/.test(text)) {
      setPlainMetricValue(el, text);
      return false;
    }

    el.textContent = '';
    el.setAttribute('aria-label', text);
    el.setAttribute('data-number-flow', 'true');
    el.setAttribute('data-number-flow-state', 'idle');

    let digitIndex = 0;
    Array.from(text).forEach((char, charIndex) => {
      if (/\d/.test(char)) {
        el.appendChild(createMetricDigit(char, digitIndex, charIndex));
        digitIndex += 1;
        return;
      }
      el.appendChild(createMetricStaticChar(char, charIndex));
    });
    return true;
  }

  function activateMetricNumberFlow(el) {
    if (!el || el.getAttribute?.('data-number-flow') !== 'true') {
      return;
    }
    el.setAttribute('data-number-flow-state', 'active');
  }

  function createMetricDigit(char, digitIndex, charIndex) {
    const targetDigit = Number(char);
    const digit = window.document.createElement('span');
    digit.setAttribute('class', 'metric-digit');
    digit.setAttribute('aria-hidden', 'true');
    digit.setAttribute('data-digit', char);

    const reel = window.document.createElement('span');
    reel.setAttribute('class', 'metric-digit-reel');
    const targetOffset = targetDigit + 10;
    const fromOffset = 0;
    setStyleValue(reel, '--metric-digit-from', String(fromOffset));
    setStyleValue(reel, '--metric-digit-to', String(targetOffset));
    setStyleValue(reel, '--metric-digit-delay', `${Math.min(charIndex * 0.035, 0.18)}s`);
    setStyleValue(reel, '--metric-digit-duration', `${0.82 + Math.min(digitIndex * 0.045, 0.22)}s`);

    for (let cycle = 0; cycle < 2; cycle += 1) {
      for (let value = 0; value <= 9; value += 1) {
        const glyph = window.document.createElement('span');
        glyph.setAttribute('class', 'metric-digit-glyph');
        glyph.textContent = String(value);
        reel.appendChild(glyph);
      }
    }

    digit.appendChild(reel);
    return digit;
  }

  function createMetricStaticChar(char, charIndex) {
    const node = window.document.createElement('span');
    node.setAttribute('class', 'metric-static-char');
    node.setAttribute('aria-hidden', 'true');
    setStyleValue(node, '--metric-static-delay', `${Math.min(charIndex * 0.028, 0.16)}s`);
    node.textContent = char;
    return node;
  }

  function reserveMetricWidth(el, target) {
    if (!el || !target) {
      return null;
    }

    const valueSlot = findAncestorWithClass(el, 'metric-value-slot');
    const reserveSample = buildMetricReserveSample(target);
    if (valueSlot && typeof valueSlot.setAttribute === 'function') {
      valueSlot.setAttribute('data-reserve', reserveSample);
      return reserveSample;
    }
    return reserveSample;
  }

  function setFinalState(el) {
    if (!el) {
      return;
    }
    setStyleValue(el, 'opacity', '1');
    setStyleValue(el, 'transform', 'none');
  }

  window.initStoryMotion = initStoryMotion;
})();
