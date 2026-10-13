from __future__ import annotations

import json
import subprocess
import textwrap
import unittest
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[2]
STORY_TEXT_LAYOUT = (
    REPO_DIR / "skills" / "data-storytelling" / "build-html" / "scripts" / "story-text-layout.js"
)
STORY_MOTION = (
    REPO_DIR / "skills" / "data-storytelling" / "build-html" / "scripts" / "story-motion.js"
)


def run_story_text_layout_runtime(
    html: str,
    pretext_available: bool,
    *,
    pretext_setup_script: str | None = None,
    execution_script: str | None = None,
    targets_script: str | None = None,
) -> dict[str, object]:
    default_pretext_setup = textwrap.dedent(
        f"""
        if ({"true" if pretext_available else "false"}) {{
          window.StoryTextLayoutPretext = {{
            prepareRichInline(items) {{
              pretextCalls.push(['prepareRichInline', items.length]);
              return {{
                kind: 'prepared-rich-inline',
                items,
                lineCount: 2,
              }};
            }},
            layoutWithLines(prepared) {{
              pretextCalls.push(['layoutWithLines', prepared.lineCount]);
              return prepared;
            }},
            prepareWithSegments(segments) {{
              pretextCalls.push(['prepareWithSegments', segments.length]);
              return segments;
            }},
            walkRichInlineLineRanges(prepared, maxWidth, callback) {{
              pretextCalls.push(['walkRichInlineLineRanges', prepared.lineCount, maxWidth]);
              if (typeof callback === 'function') {{
                callback({{
                  fragments: prepared.items.map((item, index) => ({{
                    itemIndex: index,
                    gapBefore: index === 0 ? 0 : 1,
                  }})),
                  width: prepared.items.length,
                  end: {{
                    itemIndex: prepared.items.length,
                    segmentIndex: 0,
                    graphemeIndex: 0,
                  }},
                }});
              }}
            }},
            materializeRichInlineLineRange(prepared, range) {{
              pretextCalls.push(['materializeRichInlineLineRange', range.fragments.length]);
              return {{
                fragments: range.fragments.map((fragment) => ({{
                  itemIndex: fragment.itemIndex,
                  gapBefore: fragment.gapBefore,
                  text: prepared.items[fragment.itemIndex].text,
                }})),
                width: range.width,
                end: range.end,
              }};
            }},
          }};
          window.pretext = window.StoryTextLayoutPretext;
        }}
        """
    ).strip()
    default_execution = textwrap.dedent(
        """
        await Promise.resolve(window.initStoryTextLayout());
        await new Promise((resolve) => setTimeout(resolve, 0));
        """
    ).strip()
    script = textwrap.dedent(
        f"""
        import fs from 'node:fs';
        import vm from 'node:vm';

        const source = fs.readFileSync({json.dumps(str(STORY_TEXT_LAYOUT))}, 'utf8');
        const readyEvents = [];
        const pretextCalls = [];
        const listeners = new Map();

        function emit(event) {{
          if (!event || typeof event.type !== 'string') {{
            return;
          }}
          const handlers = listeners.get(event.type) ?? [];
          for (const handler of handlers) {{
            handler(event);
          }}
        }}

        function addListener(type, handler) {{
          const handlers = listeners.get(type) ?? [];
          handlers.push(handler);
          listeners.set(type, handlers);
        }}

        function removeListener(type, handler) {{
          const handlers = listeners.get(type);
          if (!handlers) {{
            return;
          }}
          const index = handlers.indexOf(handler);
          if (index >= 0) {{
            handlers.splice(index, 1);
          }}
        }}

        function stripTags(value) {{
          return String(value).replace(/<[^>]+>/g, '');
        }}

        function createTextNode(text) {{
          return {{
            nodeType: 3,
            parentNode: null,
            data: String(text),
            outerHTML: String(text),
            get textContent() {{
              return this.data;
            }},
            set textContent(value) {{
              this.data = String(value);
            }},
            cloneNode() {{
              return createTextNode(this.data);
            }},
          }};
        }}

        function createElement(tagName, attrs = {{}}, children = []) {{
          const node = {{
            nodeType: 1,
            tagName: String(tagName).toUpperCase(),
            parentNode: null,
            ownerDocument: null,
            dataset: Object.create(null),
            style: {{}},
            attributes: Object.create(null),
            childNodes: [],
            clientWidth: 0,
            offsetWidth: 0,
            _rectWidth: 0,
            classList: {{
              add() {{}},
              remove() {{}},
              contains() {{
                return false;
              }},
            }},
            setAttribute(name, value) {{
              const text = String(value);
              this.attributes[name] = text;
              if (name.startsWith('data-')) {{
                const key = name
                  .slice(5)
                  .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                this.dataset[key] = text;
              }}
            }},
            getAttribute(name) {{
              return this.attributes[name] ?? null;
            }},
            removeAttribute(name) {{
              delete this.attributes[name];
            }},
            appendChild(child) {{
              child.parentNode = this;
              this.childNodes.push(child);
              return child;
            }},
            getBoundingClientRect() {{
              return {{
                width: this._rectWidth || this.offsetWidth || this.clientWidth || 0,
                height: 0,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }};
            }},
            replaceChildren(...nextChildren) {{
              this.childNodes = [];
              for (const child of nextChildren) {{
                this.appendChild(child);
              }}
            }},
            querySelectorAll(selector) {{
              const matches = [];
              const visit = (current) => {{
                if (!current || current.nodeType !== 1) {{
                  return;
                }}
                if (
                  selector === 'strong' && current.tagName === 'STRONG' ||
                  selector === '[data-text-layout]' && current.getAttribute('data-text-layout') !== null
                ) {{
                  matches.push(current);
                }}
                for (const child of current.childNodes) {{
                  visit(child);
                }}
              }};
              visit(this);
              return matches;
            }},
            querySelector(selector) {{
              return this.querySelectorAll(selector)[0] ?? null;
            }},
            cloneNode(deep = false) {{
              const clone = createElement(tagName, attrs);
              clone._innerHTML = this._innerHTML;
              clone._textContent = this._textContent;
              if (deep) {{
                for (const child of this.childNodes) {{
                  clone.appendChild(child.cloneNode(true));
                }}
              }}
              return clone;
            }},
          }};

          Object.defineProperties(node, {{
            innerHTML: {{
              get() {{
                return this._innerHTML;
              }},
              set(value) {{
                this._innerHTML = String(value);
                this._textContent = stripTags(this._innerHTML);
              }},
            }},
            outerHTML: {{
              get() {{
                const tag = this.tagName.toLowerCase();
                return `<${{tag}}>${{this.innerHTML}}</${{tag}}>`;
              }},
            }},
            textContent: {{
              get() {{
                return this._textContent;
              }},
              set(value) {{
                this._textContent = String(value);
              }},
            }},
            children: {{
              get() {{
                return this.childNodes.filter((child) => child.nodeType === 1);
              }},
            }},
            parentElement: {{
              get() {{
                return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null;
              }},
            }},
            firstChild: {{
              get() {{
                return this.childNodes[0] ?? null;
              }},
            }},
            lastChild: {{
              get() {{
                return this.childNodes[this.childNodes.length - 1] ?? null;
              }},
            }},
          }});

          for (const [name, value] of Object.entries(attrs)) {{
            node.setAttribute(name, value);
          }}
          node.innerHTML = children
            .map((child) => (child.nodeType === 3 ? child.data : child.outerHTML))
            .join('');
          node._textContent = children.map((child) => child.textContent).join('');
          for (const child of children) {{
            node.appendChild(child);
          }}
          return node;
        }}

        const body = createElement('body');
        const targets = {targets_script or f"[{html}]"};
        const target = targets[0];
        const resizeObservers = [];

        class ResizeObserver {{
          constructor(callback) {{
            this.callback = callback;
            this.targets = new Set();
            resizeObservers.push(this);
          }}
          observe(node) {{
            this.targets.add(node);
          }}
          unobserve(node) {{
            this.targets.delete(node);
          }}
          disconnect() {{
            this.targets.clear();
          }}
        }}

        const document = {{
          body,
          createElement(tagName) {{
            const node = createElement(tagName);
            node.ownerDocument = document;
            return node;
          }},
          createTextNode(text) {{
            return createTextNode(text);
          }},
          getElementById() {{
            return null;
          }},
          querySelector(selector) {{
            if (selector === '[data-text-layout]') {{
              return targets[0] ?? null;
            }}
            return null;
          }},
          querySelectorAll(selector) {{
            if (selector === '[data-text-layout]') {{
              return targets;
            }}
            return [];
          }},
          addEventListener(type, handler) {{
            addListener(type, handler);
          }},
          removeEventListener(type, handler) {{
            removeListener(type, handler);
          }},
          dispatchEvent(event) {{
            emit(event);
            return true;
          }},
        }};

        body.ownerDocument = document;
        targets.forEach((node) => {{
          node.ownerDocument = document;
        }});

        const window = {{
          document,
          addEventListener(type, handler) {{
            addListener(type, handler);
          }},
          removeEventListener(type, handler) {{
            removeListener(type, handler);
          }},
          dispatchEvent(event) {{
            emit(event);
            if (event && event.type === 'story:text-layout-ready') {{
              readyEvents.push(event.type);
            }}
            return true;
          }},
          setTimeout,
          clearTimeout,
          CustomEvent: class CustomEvent {{
            constructor(type, init = {{}}) {{
              this.type = type;
              this.detail = init.detail;
            }}
          }},
          getComputedStyle(node) {{
            return Object.assign({{
              font: '16px Inter, sans-serif',
              lineHeight: '24px',
              display: 'block',
              flexDirection: 'row',
              alignItems: 'stretch',
              alignSelf: 'auto',
              maxWidth: 'none',
              paddingLeft: '0px',
              paddingRight: '0px',
            }}, node && node.style ? node.style : {{}});
          }},
          ResizeObserver,
        }};
        window.window = window;
        window.self = window;
        window.__triggerResizeObserver = function (...nodes) {{
          for (const observer of resizeObservers) {{
            const entries = nodes
              .filter((node) => observer.targets.has(node))
              .map((node) => ({{ target: node }}));
            if (entries.length > 0) {{
              observer.callback(entries);
            }}
          }}
        }};

        globalThis.window = window;
        globalThis.document = document;
        globalThis.CustomEvent = window.CustomEvent;
        globalThis.getComputedStyle = window.getComputedStyle;
        globalThis.Node = {{ ELEMENT_NODE: 1, TEXT_NODE: 3 }};
        globalThis.ResizeObserver = ResizeObserver;
        window.Node = globalThis.Node;

        {pretext_setup_script or default_pretext_setup}

        vm.runInThisContext(source, {{ filename: 'story-text-layout.js' }});
        {execution_script or default_execution}

        console.log(JSON.stringify({{
          readyEvents,
          pretextCalls,
          applied: target.dataset.textLayoutApplied === 'true',
          allApplied: targets.map((node) => node.dataset.textLayoutApplied === 'true'),
          textContent: target.textContent,
          allTextContent: targets.map((node) => node.textContent),
          innerHTML: target.innerHTML,
        }}));
        """
    )

    proc = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_DIR,
        text=True,
        capture_output=True,
    )

    if proc.returncode != 0:
        raise AssertionError(proc.stderr.strip() or proc.stdout.strip())

    return json.loads(proc.stdout)


def run_story_motion_stack(
    targets_script: str,
    *,
    pre_ready: bool = False,
    omit_window_listener: bool = False,
    run_text_layout: bool = True,
) -> dict[str, object]:
    script = textwrap.dedent(
        f"""
        import fs from 'node:fs';
        import vm from 'node:vm';

        const textSource = fs.readFileSync({json.dumps(str(STORY_TEXT_LAYOUT))}, 'utf8');
        const motionSource = fs.readFileSync({json.dumps(str(STORY_MOTION))}, 'utf8');
        const readyEvents = [];
        const windowListeners = new Map();
        const documentListeners = new Map();
        let registerPluginCalls = 0;
        let refreshCalls = 0;

        function emit(store, event) {{
          if (!event || typeof event.type !== 'string') {{
            return;
          }}
          const handlers = store.get(event.type) ?? [];
          for (const handler of handlers) {{
            handler(event);
          }}
        }}

        function addListener(store, type, handler) {{
          const handlers = store.get(type) ?? [];
          handlers.push(handler);
          store.set(type, handlers);
        }}

        function removeListener(store, type, handler) {{
          const handlers = store.get(type);
          if (!handlers) {{
            return;
          }}
          const index = handlers.indexOf(handler);
          if (index >= 0) {{
            handlers.splice(index, 1);
          }}
        }}

        function createTextNode(text) {{
          return {{
            nodeType: 3,
            data: String(text),
            get textContent() {{
              return this.data;
            }},
            set textContent(value) {{
              this.data = String(value);
            }},
          }};
        }}

        function createElement(tagName, attrs = {{}}, children = []) {{
          const node = {{
            nodeType: 1,
            tagName: String(tagName).toUpperCase(),
            dataset: Object.create(null),
            attributes: Object.create(null),
            childNodes: [],
            classList: {{
              add() {{}},
              remove() {{}},
              contains() {{
                return false;
              }},
            }},
            setAttribute(name, value) {{
              const text = String(value);
              this.attributes[name] = text;
              if (name.startsWith('data-')) {{
                const key = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                this.dataset[key] = text;
              }}
            }},
            getAttribute(name) {{
              return this.attributes[name] ?? null;
            }},
            appendChild(child) {{
              this.childNodes.push(child);
              return child;
            }},
            querySelector() {{
              return null;
            }},
            querySelectorAll() {{
              return [];
            }},
          }};

          Object.defineProperty(node, 'textContent', {{
            get() {{
              return this.childNodes.map((child) => child.textContent).join('');
            }},
            set(value) {{
              this.childNodes = [createTextNode(value)];
            }},
          }});

          for (const [name, value] of Object.entries(attrs)) {{
            node.setAttribute(name, value);
          }}
          for (const child of children) {{
            node.appendChild(child);
          }}
          return node;
        }}

        const targets = {targets_script};
        const section = createElement('section', {{ 'data-pattern': 'hero-impact' }}, []);

        const document = {{
          querySelector(selector) {{
            if (selector === '[data-text-layout]') {{
              return targets[0] ?? null;
            }}
            if (selector === 'section[data-pattern]') {{
              return section;
            }}
            return null;
          }},
          querySelectorAll(selector) {{
            if (selector === '[data-text-layout]') {{
              return targets;
            }}
            if (selector === 'section[data-pattern]') {{
              return [section];
            }}
            return [];
          }},
          addEventListener(type, handler) {{
            addListener(documentListeners, type, handler);
          }},
          removeEventListener(type, handler) {{
            removeListener(documentListeners, type, handler);
          }},
          dispatchEvent(event) {{
            emit(documentListeners, event);
            return true;
          }},
          fonts: {{
            ready: Promise.resolve(),
          }},
        }};

        const window = {{
          document,
          dispatchEvent(event) {{
            emit(windowListeners, event);
            if (event && event.type === 'story:text-layout-ready') {{
              readyEvents.push(event.type);
            }}
            return true;
          }},
          setTimeout,
          clearTimeout,
          matchMedia() {{
            return {{ matches: false }};
          }},
          CustomEvent: class CustomEvent {{
            constructor(type, init = {{}}) {{
              this.type = type;
              this.detail = init.detail;
            }}
          }},
          getComputedStyle() {{
            return {{
              font: '16px Inter, sans-serif',
              lineHeight: '24px',
            }};
          }},
          gsap: {{
            registerPlugin() {{
              registerPluginCalls += 1;
            }},
            fromTo() {{}},
            to() {{}},
            set() {{}},
          }},
          ScrollTrigger: {{
            refresh() {{
              refreshCalls += 1;
            }},
          }},
        }};
        if (!{"true" if omit_window_listener else "false"}) {{
          window.addEventListener = function (type, handler) {{
            addListener(windowListeners, type, handler);
          }};
          window.removeEventListener = function (type, handler) {{
            removeListener(windowListeners, type, handler);
          }};
        }}
        window.window = window;
        window.self = window;
        window.__storyTextLayoutReady = {"true" if pre_ready else "false"};

        globalThis.window = window;
        globalThis.document = document;
        globalThis.CustomEvent = window.CustomEvent;
        globalThis.getComputedStyle = window.getComputedStyle;
        globalThis.Node = {{ ELEMENT_NODE: 1, TEXT_NODE: 3 }};
        window.Node = globalThis.Node;
        globalThis.ScrollTrigger = window.ScrollTrigger;

        vm.runInThisContext(textSource, {{ filename: 'story-text-layout.js' }});
        vm.runInThisContext(motionSource, {{ filename: 'story-motion.js' }});

        const beforeInitCall = registerPluginCalls;
        window.initStoryMotion();
        const afterInitCall = registerPluginCalls;
        if ({"true" if run_text_layout else "false"}) {{
          await Promise.resolve(window.initStoryTextLayout());
          await new Promise((resolve) => setTimeout(resolve, 0));
        }}

        console.log(JSON.stringify({{
          beforeInitCall,
          afterInitCall,
          afterReady: registerPluginCalls,
          refreshCalls,
          readyEvents,
        }}));
        """
    )

    proc = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=REPO_DIR,
        text=True,
        capture_output=True,
    )

    if proc.returncode != 0:
        raise AssertionError(proc.stderr.strip() or proc.stdout.strip())

    return json.loads(proc.stdout)


class StoryTextLayoutRuntimeTest(unittest.TestCase):
    def test_motion_waits_for_text_layout_ready_before_boot(self):
        result = run_story_motion_stack(
            textwrap.dedent(
                """
                [
                  createElement('h1', {"data-text-layout": "headline"}, [
                    createTextNode('Hello world')
                  ])
                ]
                """
            ).strip()
        )

        self.assertEqual(result["beforeInitCall"], 0)
        self.assertEqual(result["afterInitCall"], 0)
        self.assertEqual(result["afterReady"], 1)
        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])

    def test_motion_boots_even_when_no_text_targets_exist(self):
        result = run_story_motion_stack("[]")

        self.assertEqual(result["afterInitCall"], 0)
        self.assertEqual(result["afterReady"], 1)
        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])

    def test_motion_boots_immediately_when_text_layout_is_already_ready(self):
        result = run_story_motion_stack("[]", pre_ready=True, run_text_layout=False)

        self.assertEqual(result["beforeInitCall"], 0)
        self.assertEqual(result["afterInitCall"], 1)
        self.assertEqual(result["afterReady"], 1)
        self.assertEqual(result["readyEvents"], [])

    def test_motion_falls_back_to_immediate_boot_when_window_listener_is_missing(self):
        result = run_story_motion_stack(
            "[]",
            omit_window_listener=True,
        )

        self.assertEqual(result["beforeInitCall"], 0)
        self.assertEqual(result["afterInitCall"], 1)
        self.assertEqual(result["afterReady"], 1)
        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])

    def test_story_text_layout_dispatches_ready_without_pretext(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                createElement('h1', {"data-text-layout": "headline"}, [
                  createTextNode('Hello world')
                ])
                """
            ).strip(),
            pretext_available=False,
        )

        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])
        self.assertEqual(result["pretextCalls"], [])
        self.assertFalse(result["applied"])
        self.assertEqual(result["textContent"], "Hello world")

    def test_story_text_layout_marks_ready_after_enhancement(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                createElement('p', {"data-text-layout": "body"}, [
                  createTextNode('A '),
                  createElement('strong', {}, [createTextNode('bold')]),
                  createTextNode(' move')
                ])
                """
            ).strip(),
            pretext_available=True,
        )

        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])
        self.assertGreater(len(result["pretextCalls"]), 0)
        self.assertTrue(result["applied"])
        self.assertEqual(result["textContent"], "A bold move")

    def test_story_text_layout_retries_after_pretext_appears(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                createElement('p', {"data-text-layout": "body"}, [
                  createTextNode('Retry '),
                  createElement('strong', {}, [createTextNode('works')])
                ])
                """
            ).strip(),
            pretext_available=False,
            execution_script=textwrap.dedent(
                """
                await Promise.resolve(window.initStoryTextLayout());
                window.StoryTextLayoutPretext = {
                  prepareRichInline(items) {
                    pretextCalls.push(['prepareRichInline', items.length]);
                    return { kind: 'prepared-rich-inline', items, lineCount: 1 };
                  },
                  layoutWithLines(prepared) {
                    pretextCalls.push(['layoutWithLines', prepared.lineCount]);
                    return prepared;
                  },
                  prepareWithSegments(segments) {
                    pretextCalls.push(['prepareWithSegments', segments.length]);
                    return segments;
                  },
                  walkRichInlineLineRanges(prepared, maxWidth, callback) {
                    pretextCalls.push(['walkRichInlineLineRanges', prepared.lineCount, maxWidth]);
                    if (typeof callback === 'function') {
                      callback({
                        fragments: prepared.items.map((item, index) => ({
                          itemIndex: index,
                          gapBefore: index === 0 ? 0 : 1,
                        })),
                        width: prepared.items.length,
                        end: {
                          itemIndex: prepared.items.length,
                          segmentIndex: 0,
                          graphemeIndex: 0,
                        },
                      });
                    }
                  },
                  materializeRichInlineLineRange(prepared, range) {
                    pretextCalls.push(['materializeRichInlineLineRange', range.fragments.length]);
                    return {
                      fragments: range.fragments.map((fragment) => ({
                        itemIndex: fragment.itemIndex,
                        gapBefore: fragment.gapBefore,
                        text: prepared.items[fragment.itemIndex].text,
                      })),
                      width: range.width,
                      end: range.end,
                    };
                  }
                };
                window.pretext = window.StoryTextLayoutPretext;
                await Promise.resolve(window.initStoryTextLayout());
                await new Promise((resolve) => setTimeout(resolve, 0));
                """
            ).strip(),
        )

        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])
        self.assertGreater(len(result["pretextCalls"]), 0)
        self.assertTrue(result["applied"])
        self.assertEqual(result["textContent"], "Retry works")

    def test_story_text_layout_skips_unsupported_inline_markup(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                createElement('p', {"data-text-layout": "body"}, [
                  createTextNode('A '),
                  createElement('a', {"href": "#"}, [createTextNode('linked')]),
                  createTextNode(' move')
                ])
                """
            ).strip(),
            pretext_available=True,
        )

        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])
        self.assertEqual(result["pretextCalls"], [])
        self.assertFalse(result["applied"])
        self.assertEqual(result["textContent"], "A linked move")

    def test_story_text_layout_isolates_target_failures(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                createElement('p', {"data-text-layout": "body"}, [
                  createTextNode('Broken')
                ])
                """
            ).strip(),
            pretext_available=False,
            targets_script=textwrap.dedent(
                """
                [
                  createElement('p', {"data-text-layout": "body"}, [
                    createTextNode('Broken')
                  ]),
                  createElement('p', {"data-text-layout": "body"}, [
                    createTextNode('Healthy')
                  ])
                ]
                """
            ).strip(),
            pretext_setup_script=textwrap.dedent(
                """
                let callCount = 0;
                window.StoryTextLayoutPretext = {
                  prepareRichInline(items) {
                    callCount += 1;
                    if (callCount === 1) {
                      throw new Error('boom');
                    }
                    pretextCalls.push(['prepareRichInline', items.length]);
                    return { kind: 'prepared-rich-inline', items, lineCount: 1 };
                  },
                  layoutWithLines(prepared) {
                    pretextCalls.push(['layoutWithLines', prepared.lineCount]);
                    return prepared;
                  },
                  prepareWithSegments(segments) {
                    pretextCalls.push(['prepareWithSegments', segments.length]);
                    return segments;
                  },
                  walkRichInlineLineRanges(prepared, maxWidth, callback) {
                    pretextCalls.push(['walkRichInlineLineRanges', prepared.lineCount, maxWidth]);
                    if (typeof callback === 'function') {
                      callback({
                        fragments: prepared.items.map((item, index) => ({
                          itemIndex: index,
                          gapBefore: index === 0 ? 0 : 1,
                        })),
                        width: prepared.items.length,
                        end: {
                          itemIndex: prepared.items.length,
                          segmentIndex: 0,
                          graphemeIndex: 0,
                        },
                      });
                    }
                  },
                  materializeRichInlineLineRange(prepared, range) {
                    pretextCalls.push(['materializeRichInlineLineRange', range.fragments.length]);
                    return {
                      fragments: range.fragments.map((fragment) => ({
                        itemIndex: fragment.itemIndex,
                        gapBefore: fragment.gapBefore,
                        text: prepared.items[fragment.itemIndex].text,
                      })),
                      width: range.width,
                      end: range.end,
                    };
                  }
                };
                window.pretext = window.StoryTextLayoutPretext;
                """
            ).strip(),
        )

        self.assertEqual(result["readyEvents"], ["story:text-layout-ready"])
        self.assertEqual(result["allApplied"], [False, True])
        self.assertEqual(result["allTextContent"], ["Broken", "Healthy"])

    def test_story_text_layout_uses_parent_width_for_flex_start_column_targets(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                (() => {
                  const parent = createElement('div', {}, [
                    createElement('h2', {"data-text-layout": "headline"}, [
                      createTextNode('章节标题')
                    ])
                  ]);
                  const target = parent.childNodes[0];
                  parent.style.display = 'flex';
                  parent.style.flexDirection = 'column';
                  parent.style.alignItems = 'flex-start';
                  parent.clientWidth = 188;
                  parent.offsetWidth = 188;
                  parent._rectWidth = 188;
                  target.clientWidth = 130;
                  target.offsetWidth = 130;
                  target._rectWidth = 130;
                  return target;
                })()
                """
            ).strip(),
            pretext_available=True,
        )

        walk_calls = [
            call for call in result["pretextCalls"] if call[0] == "walkRichInlineLineRanges"
        ]

        self.assertTrue(result["applied"])
        self.assertEqual(len(walk_calls), 1)
        self.assertAlmostEqual(walk_calls[0][2], 188, delta=0.1)

    def test_story_text_layout_relayouts_when_observed_parent_width_changes(self):
        result = run_story_text_layout_runtime(
            textwrap.dedent(
                """
                (() => {
                  const parent = createElement('div', {}, [
                    createElement('h2', {"data-text-layout": "headline"}, [
                      createTextNode('章节标题')
                    ])
                  ]);
                  const target = parent.childNodes[0];
                  parent.clientWidth = 136;
                  parent.offsetWidth = 136;
                  parent._rectWidth = 136;
                  target.clientWidth = 136;
                  target.offsetWidth = 136;
                  target._rectWidth = 136;
                  return target;
                })()
                """
            ).strip(),
            pretext_available=True,
            execution_script=textwrap.dedent(
                """
                await Promise.resolve(window.initStoryTextLayout());
                const parent = target.parentElement;
                parent.clientWidth = 220;
                parent.offsetWidth = 220;
                parent._rectWidth = 220;
                target.clientWidth = 220;
                target.offsetWidth = 220;
                target._rectWidth = 220;
                window.__triggerResizeObserver(parent, target);
                await new Promise((resolve) => setTimeout(resolve, 180));
                """
            ).strip(),
        )

        walk_calls = [
            call for call in result["pretextCalls"] if call[0] == "walkRichInlineLineRanges"
        ]

        self.assertTrue(result["applied"])
        self.assertEqual(len(walk_calls), 2)
        self.assertAlmostEqual(walk_calls[0][2], 136, delta=0.1)
        self.assertAlmostEqual(walk_calls[1][2], 220, delta=0.1)


if __name__ == "__main__":
    unittest.main()
