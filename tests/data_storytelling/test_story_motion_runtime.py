from __future__ import annotations

import json
import subprocess
import sys
import textwrap
import unittest
from pathlib import Path

from embed_css import build_story_components_css

REPO_DIR = Path(__file__).resolve().parents[2]
SKILL_DIR = REPO_DIR / "skills" / "data-storytelling"
BUILD_HTML_SCRIPTS_DIR = SKILL_DIR / "build-html" / "scripts"
SKILL_SCRIPTS_DIR = SKILL_DIR / "scripts"
if str(BUILD_HTML_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(BUILD_HTML_SCRIPTS_DIR))


STORY_MOTION = (
    REPO_DIR / "skills" / "data-storytelling" / "build-html" / "scripts" / "story-motion.js"
)


def read_story_components_css() -> str:
    return build_story_components_css(SKILL_DIR)


def run_story_motion_runtime(
    body_attrs: dict[str, str],
    sections: list[dict[str, object]],
    include_shared_component_preview: bool = False,
) -> dict[str, object]:
    script = textwrap.dedent(
        f"""
        import fs from 'node:fs';
        import vm from 'node:vm';

        const source = fs.readFileSync({json.dumps(str(STORY_MOTION))}, 'utf8');
        const revealCalls = [];
        const maskRevealCalls = [];
        const staggerCalls = [];
        const countUpCalls = [];
        const countUpStartHookTargets = [];
        const lineDrawCalls = [];
        const scrollTriggerCreates = [];

        function stripSelector(selector) {{
          return String(selector).replace(/^\\./, '');
        }}

        function describeTarget(target) {{
          if (Array.isArray(target)) {{
            return target.map((item) => item._selector ?? item.tagName.toLowerCase());
          }}
          if (!target) {{
            return null;
          }}
          return target._selector ?? target.tagName.toLowerCase();
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
          const classTokens = new Set();
          const node = {{
            nodeType: 1,
            tagName: String(tagName).toUpperCase(),
            dataset: Object.create(null),
            attributes: Object.create(null),
            childNodes: [],
            style: {{}},
            _selector: attrs._selector ?? null,
            classList: {{
              add(...tokens) {{
                tokens.forEach((token) => classTokens.add(token));
              }},
              remove(...tokens) {{
                tokens.forEach((token) => classTokens.delete(token));
              }},
              contains(token) {{
                return classTokens.has(token);
              }},
              toggle(token, force) {{
                const next = force === undefined ? !classTokens.has(token) : !!force;
                if (next) {{
                  classTokens.add(token);
                }} else {{
                  classTokens.delete(token);
                }}
                return next;
              }},
            }},
            setAttribute(name, value) {{
              const text = String(value);
              this.attributes[name] = text;
              if (name === 'class') {{
                text.split(/\\s+/).filter(Boolean).forEach((token) => classTokens.add(token));
              }}
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
            appendChild(child) {{
              child.parentNode = this;
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

          Object.defineProperties(node, {{
            textContent: {{
              get() {{
                return this.childNodes.map((child) => child.textContent).join('');
              }},
              set(value) {{
                this.childNodes = [createTextNode(value)];
              }},
            }},
          }});

          for (const [name, value] of Object.entries(attrs)) {{
            if (name !== '_selector') {{
              node.setAttribute(name, value);
            }}
          }}
          for (const child of children) {{
            node.appendChild(child);
          }}
          return node;
        }}

        function createContainer(tagName, attrs = {{}}, queryMap = {{}}) {{
          const node = createElement(tagName, attrs);
          const lookup = new Map();
          const lookupAll = new Map();
          for (const [selector, value] of Object.entries(queryMap)) {{
            if (Array.isArray(value)) {{
              lookupAll.set(selector, value);
              lookup.set(selector, value[0] ?? null);
            }} else {{
              lookup.set(selector, value);
              lookupAll.set(selector, value ? [value] : []);
            }}
          }}
          node.querySelector = (selector) => lookup.get(selector) ?? null;
          node.querySelectorAll = (selector) => lookupAll.get(selector) ?? [];
          return node;
        }}

        function collectAnimateNodes(root) {{
          const nodes = [];
          function walk(node) {{
            if (!node || node.nodeType !== 1) {{
              return;
            }}
            if (node.classList && node.classList.contains('animate-on-scroll')) {{
              nodes.push(node);
            }}
            for (const child of node.childNodes || []) {{
              walk(child);
            }}
          }}
          walk(root);
          return nodes;
        }}

        function createSection(spec, index) {{
          const heading = createElement('h2', {{ class: 'section-heading', _selector: '.section-heading' }}, [
            createTextNode(spec.pattern),
          ]);

          const lookup = {{
            '.section-heading': heading,
          }};
          const lookupAll = {{}};

          if (spec.pattern === 'comparison') {{
            const comparisonMode = spec.mode ?? spec.attrs?.['data-comparison-mode'] ?? 'pair';
            if (comparisonMode === 'pair') {{
              const cards = [
                createElement('article', {{ class: 'comparison-card', _selector: '.comparison-card[0]' }}),
                createElement('article', {{ class: 'comparison-card', _selector: '.comparison-card[1]' }}),
              ];
              const pair = createContainer(
                'div',
                {{ class: 'comparison-pair', _selector: '.comparison-pair' }},
                {{ '.comparison-card': cards }},
              );
              lookup['.comparison-pair'] = pair;
              lookupAll['.comparison-card'] = cards;
            }} else {{
              const contentSide = createElement('div', {{ class: 'content-side', _selector: '.content-side' }});
              const visualSide = createElement('div', {{ class: 'visual-side', _selector: '.visual-side' }});
              const statMetricValue = createElement('span', {{
                class: 'metric-value',
                'data-target': '42',
                _selector: '.metric-value',
              }}, [
                createTextNode('0'),
              ]);
              const statMetricSuffix = createElement('span', {{
                class: 'metric-suffix',
                _selector: '.metric-suffix',
              }}, [
                createTextNode('%'),
              ]);
              const statValue = createContainer(
                'div',
                {{ class: 'stat-value', _selector: '.stat-value' }},
                {{
                  '.metric-value': statMetricValue,
                  '.metric-suffix': statMetricSuffix,
                  '.metric-value[data-target]': [statMetricValue],
                }},
              );
              statValue.appendChild(statMetricValue);
              statValue.appendChild(statMetricSuffix);
              lookup['.content-side'] = contentSide;
              lookup['.visual-side'] = visualSide;
              lookup['.stat-value'] = statValue;
              lookup['.metric-value'] = statMetricValue;
              lookup['.metric-suffix'] = statMetricSuffix;
              lookupAll['.metric-value[data-target]'] = [statMetricValue];
              lookupAll['[data-target]'] = [statMetricValue];
            }}
          }}

          if (spec.pattern === 'chart-narrative') {{
            const chartWrapper = createElement('div', {{ class: 'chart-wrapper', _selector: '.chart-wrapper' }});
            const highlightBox = createElement('div', {{ class: 'highlight-box', _selector: '.highlight-box' }});
            const bodyText = createElement('p', {{ class: 'body-text', _selector: '.body-text' }}, [
              createTextNode('Body copy'),
            ]);
            const supportingMetricValue = createElement('span', {{
              class: 'metric-value',
              'data-target': '18',
              _selector: '.metric-value',
            }}, [
              createTextNode('0'),
            ]);
            const supportingKpi = createContainer(
              'div',
              {{ class: 'kpi-value', _selector: '.kpi-value' }},
              {{
                '.metric-value': supportingMetricValue,
                '.metric-value[data-target]': [supportingMetricValue],
              }},
            );
            supportingKpi.appendChild(supportingMetricValue);
            const kpiCards = [
              createElement('div', {{ class: 'kpi-card', _selector: '.kpi-card[0]' }}),
              createElement('div', {{ class: 'kpi-card', _selector: '.kpi-card[1]' }}),
            ];
            const kpiRow = createContainer(
              'div',
              {{ class: 'kpi-row animate-on-scroll', _selector: '.kpi-row' }},
              {{ '.kpi-card': kpiCards }},
            );
            lookup['.chart-wrapper'] = chartWrapper;
            lookup['.highlight-box'] = highlightBox;
            lookup['.body-text'] = bodyText;
            lookup['.supporting-kpi'] = supportingKpi;
            lookup['.kpi-value'] = supportingKpi;
            lookup['.metric-value'] = supportingMetricValue;
            lookup['.kpi-row'] = kpiRow;
            lookupAll['.kpi-card'] = kpiCards;
            lookupAll['.metric-value[data-target]'] = [supportingMetricValue];
            lookupAll['[data-target]'] = [supportingMetricValue];
          }}

          if (spec.pattern === 'baseline-kpis') {{
            const kpiMetricValue = createElement('span', {{
              class: 'metric-value',
              'data-target': '128',
              _selector: '.metric-value',
            }}, [
              createTextNode('0'),
            ]);
            if (spec.metricRect) {{
              kpiMetricValue.getBoundingClientRect = () => spec.metricRect;
            }}
            const kpiValue = createContainer(
              'div',
              {{ class: 'kpi-value', _selector: '.kpi-value' }},
              {{
                '.metric-value': kpiMetricValue,
                '.metric-value[data-target]': [kpiMetricValue],
              }},
            );
            kpiValue.appendChild(kpiMetricValue);
            const kpiCards = [
              createElement('div', {{ class: 'kpi-card', _selector: '.kpi-card[0]' }}),
              createElement('div', {{ class: 'kpi-card', _selector: '.kpi-card[1]' }}),
            ];
            const kpiRow = createContainer(
              'div',
              {{ class: 'kpi-row animate-on-scroll', _selector: '.kpi-row' }},
              {{ '.kpi-card': kpiCards }},
            );
            lookup['.kpi-row'] = kpiRow;
            lookup['.kpi-number'] = kpiValue;
            lookup['.kpi-value'] = kpiValue;
            lookup['.metric-value'] = kpiMetricValue;
            lookupAll['.kpi-card'] = kpiCards;
            lookupAll['.metric-value[data-target]'] = [kpiMetricValue];
            lookupAll['[data-target]'] = [kpiMetricValue];
          }}

          if (spec.pattern === 'cover-intro') {{
            const editorialCopy = createElement('div', {{
              class: 'cover-intro-copy animate-on-scroll',
              _selector: '.cover-intro-copy',
            }}, [
              createElement('h1', {{ _selector: 'h1' }}, [
                createTextNode('Editorial lead'),
              ]),
              createElement('p', {{
                class: 'cover-intro-intro',
                _selector: '.cover-intro-intro',
              }}, [
                createTextNode('Intro copy'),
              ]),
            ]);
            lookup['.cover-intro-copy'] = editorialCopy;
          }}

          if (spec.pattern === 'hero-impact') {{
            const heroMode = spec.attrs?.['data-hero-mode'] ?? 'stat';
            const title = createElement('h1', {{ class: 'hero-title', _selector: 'h1' }}, [
              createTextNode('Hero title'),
            ]);
            const subtitle = createElement('p', {{ class: 'hero-number-context', _selector: '.subtitle, .hero-number-context' }}, [
              createTextNode('Hero subtitle'),
            ]);
            function createHeroMetric(metricSelector, target, suffixText = '%') {{
              const heroMetricPrefix = createElement('span', {{
                class: 'metric-prefix',
                _selector: '.metric-prefix',
              }}, [
                createTextNode('$'),
              ]);
              const heroMetricValue = createElement('span', {{
                class: 'metric-value',
                'data-target': String(target),
                _selector: '.metric-value',
              }}, [
                createTextNode('0'),
              ]);
              const heroMetricSuffix = createElement('span', {{
                class: 'metric-suffix',
                _selector: '.metric-suffix',
              }}, [
                createTextNode(suffixText),
              ]);
              const heroMetricSlot = createContainer(
                'span',
                {{ class: 'metric-value-slot', _selector: '.metric-value-slot' }},
                {{
                  '.metric-value': heroMetricValue,
                  '.metric-value[data-target]': [heroMetricValue],
                }},
              );
              const heroMetricShell = createContainer(
                'div',
                {{ class: `${{metricSelector}} metric-shell`, _selector: `.${{metricSelector}}` }},
                {{
                  '.metric-shell': null,
                  '.metric-prefix': heroMetricPrefix,
                  '.metric-value': heroMetricValue,
                  '.metric-value-slot': heroMetricSlot,
                  '.metric-suffix': heroMetricSuffix,
                  '.metric-value[data-target]': [heroMetricValue],
                }},
              );
              heroMetricSlot.appendChild(heroMetricValue);
              heroMetricShell.appendChild(heroMetricPrefix);
              heroMetricShell.appendChild(heroMetricSlot);
              heroMetricShell.appendChild(heroMetricSuffix);
              return {{
                shell: heroMetricShell,
                slot: heroMetricSlot,
                value: heroMetricValue,
                prefix: heroMetricPrefix,
                suffix: heroMetricSuffix,
              }};
            }}

            lookup['h1'] = title;
            lookup['.subtitle, .hero-number-context'] = subtitle;

            if (heroMode === 'stat') {{
              const primaryHeroMetric = createHeroMetric(
                'hero-number',
                spec.metricTarget ?? '42',
                spec.metricSuffix ?? '%',
              );
              lookup['.hero-number'] = primaryHeroMetric.shell;
              lookup['.metric-shell'] = primaryHeroMetric.shell;
              lookup['.metric-prefix'] = primaryHeroMetric.prefix;
              lookup['.metric-value'] = primaryHeroMetric.value;
              lookup['.metric-value-slot'] = primaryHeroMetric.slot;
              lookup['.metric-suffix'] = primaryHeroMetric.suffix;
              lookupAll['.metric-prefix'] = [primaryHeroMetric.prefix];
              lookupAll['.metric-value[data-target]'] = [primaryHeroMetric.value];
              lookupAll['.metric-value-slot'] = [primaryHeroMetric.slot];
              lookupAll['[data-target]'] = [primaryHeroMetric.value];
            }}

          }}

          if (spec.pattern === 'action') {{
            const cards = [
              createElement('article', {{ class: 'action-card', _selector: '.action-card[0]' }}),
              createElement('article', {{ class: 'action-card', _selector: '.action-card[1]' }}),
            ];
            const actionCards = createContainer(
              'div',
              {{ class: 'action-cards animate-on-scroll', _selector: '.action-cards' }},
              {{ '.action-card': cards }},
            );
            lookup['.action-cards'] = actionCards;
            lookupAll['.action-card'] = cards;
          }}

          if (spec.pattern === 'timeline') {{
            const connectorLine = createElement('div', {{ class: 'connector-line', _selector: '.connector-line' }});
            const items = [
              createElement('article', {{ class: 'timeline-item', _selector: '.timeline-item[0]' }}),
              createElement('article', {{ class: 'timeline-item', _selector: '.timeline-item[1]' }}),
            ];
            const timeline = createContainer(
              'div',
              {{ class: 'timeline-vertical', _selector: '.timeline-vertical' }},
              {{ '.timeline-item': items }},
            );
            lookup['.connector-line'] = connectorLine;
            lookup['.timeline-vertical'] = timeline;
            lookupAll['.timeline-item'] = items;
          }}

          if (spec.pattern === 'scrollytelling') {{
            const steps = [
              createElement('article', {{ class: 'scrolly-step', _selector: '.scrolly-step[0]' }}, [
                createTextNode('Step 1'),
              ]),
              createElement('article', {{ class: 'scrolly-step', _selector: '.scrolly-step[1]' }}, [
                createTextNode('Step 2'),
              ]),
            ];
            lookupAll['.scrolly-step'] = steps;
          }}

          const section = createContainer(
            'section',
            {{ ...spec.attrs, 'data-pattern': spec.pattern, 'data-index': String(index), _selector: `section[data-pattern="${{spec.pattern}}"]` }},
            lookup,
          );
          section.querySelectorAll = (selector) => lookupAll[selector] ?? [];
          return section;
        }}

        const body = createElement('body', {json.dumps(body_attrs)});
        const sections = {json.dumps(sections)}.map((spec, index) => createSection(spec, index));
        let sharedPreviewRoot = null;
        let sharedMetricValue = null;
        if ({json.dumps(include_shared_component_preview)}) {{
          const staticHeading = createElement('div', {{
            class: 'section-heading with-bar animate-on-scroll',
            _selector: '.shared-components-heading',
          }}, [createTextNode('Shared heading')]);
          sharedMetricValue = createElement('span', {{
            class: 'metric-value',
            'data-target': '128',
            _selector: '.shared-metric-value',
          }}, [
            createTextNode('0'),
          ]);
          const sharedMetricSlot = createContainer(
            'span',
            {{ class: 'metric-value-slot', _selector: '.shared-metric-slot' }},
            {{
              '.metric-value': sharedMetricValue,
              '.metric-value[data-target]': [sharedMetricValue],
            }},
          );
          const sharedMetricShell = createContainer(
            'div',
            {{ class: 'kpi-value metric-shell', _selector: '.shared-metric-shell' }},
            {{
              '.metric-value': sharedMetricValue,
              '.metric-value[data-target]': [sharedMetricValue],
            }},
          );
          sharedMetricSlot.appendChild(sharedMetricValue);
          sharedMetricShell.appendChild(sharedMetricSlot);
          sharedPreviewRoot = createElement(
            'section',
            {{ 'data-preview-role': 'shared-components', _selector: '[data-preview-role=\"shared-components\"]' }},
            [staticHeading, sharedMetricShell],
          );
        }}
        const animateNodes = sections.flatMap((section) => collectAnimateNodes(section));
        if (sharedPreviewRoot) {{
          animateNodes.push(...collectAnimateNodes(sharedPreviewRoot));
        }}

        const document = {{
          body,
          documentElement: {{ clientHeight: 1000 }},
          createElement(tagName) {{
            if (String(tagName).toLowerCase() === 'canvas') {{
              return {{
                getContext() {{
                  return {{
                    font: '',
                    measureText(text) {{
                      const widths = {{
                        '0': 10,
                        '1': 6,
                        '2': 9,
                        '3': 9,
                        '4': 9,
                        '5': 9,
                        '6': 9,
                        '7': 9,
                        '8': 11,
                        '9': 10,
                        '.': 4,
                        '-': 5,
                      }};
                      const width = String(text).split('').reduce((sum, ch) => sum + (widths[ch] ?? 8), 0);
                      return {{ width }};
                    }},
                  }};
                }},
              }};
            }}
            return createElement(tagName);
          }},
          querySelector(selector) {{
            if (selector === 'section[data-pattern]') {{
              return sections[0] ?? null;
            }}
            return null;
          }},
          querySelectorAll(selector) {{
            if (selector === 'section[data-pattern]') {{
              return sections;
            }}
            if (selector === '.animate-on-scroll') {{
              return animateNodes;
            }}
            if (selector === '.metric-value[data-target]') {{
              return [
                ...sections.flatMap((section) => section.querySelectorAll('.metric-value[data-target]')),
                ...(sharedMetricValue ? [sharedMetricValue] : []),
              ];
            }}
            return [];
          }},
          addEventListener() {{}},
          removeEventListener() {{}},
          dispatchEvent() {{
            return true;
          }},
        }};

        const window = {{
          document,
          innerHeight: 1000,
          __storyTextLayoutReady: true,
          addEventListener() {{}},
          removeEventListener() {{}},
          dispatchEvent() {{
            return true;
          }},
          matchMedia() {{
            return {{ matches: false }};
          }},
          setTimeout,
          clearTimeout,
          CustomEvent: class CustomEvent {{
            constructor(type, init = {{}}) {{
              this.type = type;
              this.detail = init.detail;
            }}
          }},
          gsap: {{
            registerPlugin() {{}},
            fromTo(target, fromVars, toVars) {{
              const entry = {{
                target: describeTarget(target),
                start: toVars?.scrollTrigger?.start ?? null,
                stagger: toVars?.stagger ?? null,
              }};
              const isMaskReveal = !!(fromVars?.clipPath || toVars?.clipPath);
              const isLineDraw = Object.prototype.hasOwnProperty.call(fromVars ?? {{}}, '--timeline-line-progress') ||
                Object.prototype.hasOwnProperty.call(toVars ?? {{}}, '--timeline-line-progress');
              if (isMaskReveal) {{
                maskRevealCalls.push({{
                  ...entry,
                  clipPath: [fromVars?.clipPath ?? null, toVars?.clipPath ?? null],
                }});
              }} else if (isLineDraw) {{
                lineDrawCalls.push({{
                  ...entry,
                  trigger: toVars?.scrollTrigger?.trigger?._selector ?? toVars?.scrollTrigger?.trigger?.tagName?.toLowerCase() ?? null,
                  progress: [fromVars?.['--timeline-line-progress'] ?? null, toVars?.['--timeline-line-progress'] ?? null],
                }});
              }} else {{
                revealCalls.push(entry);
              }}
              if (Array.isArray(target) && !isMaskReveal && !isLineDraw) {{
                staggerCalls.push(entry);
              }}
              return {{}};
            }},
            to(target, vars) {{
              const entry = {{
                target: describeTarget(target),
                trigger: vars?.scrollTrigger?.trigger?._selector ?? vars?.scrollTrigger?.trigger?.tagName?.toLowerCase() ?? null,
                start: vars?.scrollTrigger?.start ?? null,
              }};
              if (Object.prototype.hasOwnProperty.call(vars ?? {{}}, '--timeline-line-progress')) {{
                lineDrawCalls.push({{
                  ...entry,
                  progress: [vars?.['--timeline-line-progress'] ?? null],
                }});
              }} else {{
                countUpCalls.push(entry);
                if (typeof vars?.onStart === 'function') {{
                  countUpStartHookTargets.push(describeTarget(target));
                }}
              }}
              return {{}};
            }},
            set() {{}},
          }},
          ScrollTrigger: {{
            create(config) {{
              scrollTriggerCreates.push({{
                trigger: config?.trigger?._selector ?? config?.trigger?.tagName?.toLowerCase() ?? null,
                start: config?.start ?? null,
              }});
            }},
            refresh() {{}},
          }},
        }};
        window.window = window;
        window.self = window;

        globalThis.window = window;
        globalThis.document = document;
        globalThis.CustomEvent = window.CustomEvent;
        globalThis.Node = {{ ELEMENT_NODE: 1, TEXT_NODE: 3 }};
        globalThis.getComputedStyle = () => ({{ font: '16px Inter, sans-serif', lineHeight: '24px' }});
        window.Node = globalThis.Node;

        vm.runInThisContext(source, {{ filename: 'story-motion.js' }});
        window.initStoryMotion();

        const motionState = window.__storyMotionState ?? {{}};
        const firstTimelineSection = sections.find((section) => section.dataset.pattern === 'timeline') ?? null;
        const firstChartNarrativeSection = sections.find((section) => section.dataset.pattern === 'chart-narrative') ?? null;
        const firstHeroSection = sections.find((section) => section.dataset.pattern === 'hero-impact') ?? null;
        const appliedGrammar = motionState.appliedGrammar ?? [
          motionState.motionLevel ? `motion:${{motionState.motionLevel}}` : 'motion:unset',
          revealCalls.some((call) => call.target === '.section-heading') ? 'shell-heading-reveal' : null,
          staggerCalls.some((call) => call.target.includes?.('.comparison-card')) ? 'comparison-stagger' : null,
          staggerCalls.some((call) => call.target.includes?.('.kpi-card')) ? 'kpi-stagger' : null,
          staggerCalls.some((call) => call.target.includes?.('.action-card')) ? 'action-stagger' : null,
          scrollTriggerCreates.length > 0 ? 'scrolly-step-activation' : null,
        ].filter(Boolean).join(' ');

        console.log(JSON.stringify({{
          motionLevel: motionState.motionLevel ?? null,
          appliedGrammar,
          bodyMotionLevel: body.getAttribute('data-motion-level'),
          revealCalls,
          maskRevealCalls,
          staggerCalls,
          countUpCalls,
          countUpStartHookTargets,
          lineDrawCalls,
          scrollTriggerCreates,
          heroMetricStyles: firstHeroSection?.querySelector('.metric-value')?.style ?? null,
          heroMetricShellStyles: firstHeroSection?.querySelector('.metric-shell')?.style ?? null,
          heroMetricSlotStyles: firstHeroSection?.querySelector('.metric-value-slot')?.style ?? null,
          heroMetricSlotReserve: firstHeroSection?.querySelector('.metric-value-slot')?.getAttribute('data-reserve') ?? null,
          heroMetricText: firstHeroSection?.querySelector('.metric-value')?.textContent ?? null,
          heroMetricAriaLabel: firstHeroSection?.querySelector('.metric-value')?.getAttribute('aria-label') ?? null,
          heroMetricNumberFlowState: firstHeroSection?.querySelector('.metric-value')?.getAttribute('data-number-flow-state') ?? null,
          heroMetricChildClasses: Array.from(firstHeroSection?.querySelector('.metric-value')?.childNodes ?? [])
            .filter((child) => child.nodeType === 1)
            .map((child) => child.getAttribute('class')),
          heroMetricDigitCount: Array.from(firstHeroSection?.querySelector('.metric-value')?.childNodes ?? [])
            .filter((child) => child.nodeType === 1 && child.classList.contains('metric-digit'))
            .length,
          heroMetricStaticCount: Array.from(firstHeroSection?.querySelector('.metric-value')?.childNodes ?? [])
            .filter((child) => child.nodeType === 1 && child.classList.contains('metric-static-char'))
            .length,
          heroMetricDigitStarts: Array.from(firstHeroSection?.querySelector('.metric-value')?.childNodes ?? [])
            .filter((child) => child.nodeType === 1 && child.classList.contains('metric-digit'))
            .map((child) => child.childNodes[0]?.style?.['--metric-digit-from'] ?? null),
          sharedMetricText: sharedMetricValue?.textContent ?? null,
          sharedMetricAriaLabel: sharedMetricValue?.getAttribute('aria-label') ?? null,
          sharedMetricNumberFlowState: sharedMetricValue?.getAttribute('data-number-flow-state') ?? null,
          sharedMetricDigitCount: Array.from(sharedMetricValue?.childNodes ?? [])
            .filter((child) => child.nodeType === 1 && child.classList.contains('metric-digit'))
            .length,
          timelineMotionPrimitive: firstTimelineSection?.querySelector('.timeline-vertical')?.getAttribute('data-motion-primitive') ?? null,
          timelineMotionState: firstTimelineSection?.querySelector('.timeline-vertical')?.getAttribute('data-motion-state') ?? null,
          highlightMotionPrimitive: firstChartNarrativeSection?.querySelector('.highlight-box')?.getAttribute('data-motion-primitive') ?? null,
          highlightMotionState: firstChartNarrativeSection?.querySelector('.highlight-box')?.getAttribute('data-motion-state') ?? null,
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


class StoryMotionRuntimeTest(unittest.TestCase):
    def test_production_hooks_exist_for_mask_reveal_and_line_draw(self):
        css = read_story_components_css()

        self.assertIn('[data-motion-primitive="mask-reveal"]', css)
        self.assertIn('[data-motion-primitive="line-draw"]', css)
        self.assertIn("--timeline-line-progress", css)
        self.assertIn("clip-path", css)

    def test_motion_defaults_missing_level_to_restrained(self):
        result = run_story_motion_runtime(
            body_attrs={},
            sections=[{"pattern": "comparison", "mode": "pair"}],
        )

        self.assertEqual(result["motionLevel"], "restrained")
        self.assertEqual(result["staggerCalls"], [])

    def test_motion_level_none_skips_reveal_and_stagger_calls(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "none"},
            sections=[{"pattern": "chart-narrative"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])

    def test_motion_level_guided_enables_grammar_motion_only_where_allowed(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[
                {"pattern": "comparison", "mode": "alternating"},
                {"pattern": "timeline"},
                {"pattern": "action"},
                {"pattern": "baseline-kpis"},
            ],
        )

        self.assertEqual(result["motionLevel"], "guided")
        self.assertIn(
            {"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"},
            result["countUpCalls"],
        )
        self.assertIn(
            {
                "target": ".timeline-vertical",
                "start": "top 84%",
                "stagger": None,
                "trigger": ".timeline-vertical",
                "progress": [0, 1],
            },
            result["lineDrawCalls"],
        )
        self.assertIn(
            {"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"},
            result["countUpCalls"],
        )
        self.assertEqual(result["staggerCalls"], [])

    def test_guided_chart_narrative_soft_reveals_highlight_and_keeps_body_static(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "chart-narrative"}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": ".highlight-box", "start": "top 90%", "stagger": None}],
        )
        self.assertEqual(result["maskRevealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )
        self.assertEqual(result["highlightMotionPrimitive"], "reveal-soft")
        self.assertEqual(result["highlightMotionState"], "active")

    def test_guided_chart_narrative_counts_supporting_kpi(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "chart-narrative"}],
        )

        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_restrained_baseline_kpis_keeps_count_up_but_not_cards_or_heading(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "baseline-kpis"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_initially_visible_baseline_kpi_count_up_starts_without_scroll_trigger(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[
                {
                    "pattern": "baseline-kpis",
                    "metricRect": {"top": 820, "bottom": 900},
                }
            ],
        )

        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": None, "start": None}],
        )

    def test_below_fold_baseline_kpi_count_up_keeps_scroll_trigger(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[
                {
                    "pattern": "baseline-kpis",
                    "metricRect": {"top": 1100, "bottom": 1180},
                }
            ],
        )

        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_guided_cover_intro_reveals_copy(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "cover-intro"}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": ".cover-intro-copy", "start": "top 84%", "stagger": None}],
        )
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(result["countUpCalls"], [])

    def test_restrained_cover_intro_reveals_copy_softly(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "cover-intro"}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": ".cover-intro-copy", "start": "top 84%", "stagger": None}],
        )
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(result["countUpCalls"], [])

    def test_restrained_hero_without_mode_uses_stat_contract(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "hero-impact"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_restrained_hero_stat_keeps_big_number_count_up_only(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "hero-impact", "attrs": {"data-hero-mode": "stat"}}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_guided_hero_without_mode_uses_stat_contract(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "hero-impact"}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": "h1", "start": "top 80%", "stagger": None}],
        )
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_guided_hero_stat_keeps_headline_and_count_up(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "hero-impact", "attrs": {"data-hero-mode": "stat"}}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": "h1", "start": "top 80%", "stagger": None}],
        )
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_guided_hero_image_reveals_title_without_count_up(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "hero-impact", "attrs": {"data-hero-mode": "image"}}],
        )

        self.assertEqual(
            result["revealCalls"],
            [{"target": "h1", "start": "top 80%", "stagger": None}],
        )
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(result["countUpCalls"], [])

    def test_count_up_reserves_metric_width_for_affixes_with_dom_sample(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "hero-impact", "attrs": {"data-hero-mode": "stat"}}],
        )

        self.assertEqual(result["heroMetricStyles"].get("textAlign"), "right")
        self.assertEqual(result["heroMetricSlotReserve"], "88")
        self.assertNotIn("width", result["heroMetricSlotStyles"])
        self.assertNotIn("minWidth", result["heroMetricSlotStyles"])
        self.assertNotIn("--metric-value-width", result["heroMetricShellStyles"])

    def test_count_up_formats_long_decimal_metrics_to_at_most_two_places(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "none"},
            sections=[
                {
                    "pattern": "hero-impact",
                    "attrs": {"data-hero-mode": "stat"},
                    "metricTarget": "12.049999999999999",
                    "metricSuffix": "pp",
                }
            ],
        )

        self.assertEqual(result["heroMetricText"], "12.05")
        self.assertEqual(result["heroMetricSlotReserve"], "88.88")

    def test_count_up_does_not_add_decimal_places_to_integer_metrics(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "none"},
            sections=[
                {
                    "pattern": "hero-impact",
                    "attrs": {"data-hero-mode": "stat"},
                    "metricTarget": "42",
                }
            ],
        )

        self.assertEqual(result["heroMetricText"], "42")
        self.assertEqual(result["heroMetricSlotReserve"], "88")

    def test_count_up_uses_number_flow_digit_structure_for_metric_motion(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[
                {
                    "pattern": "hero-impact",
                    "attrs": {"data-hero-mode": "stat"},
                    "metricTarget": "12.05",
                    "metricSuffix": "pp",
                }
            ],
        )

        self.assertEqual(result["heroMetricAriaLabel"], "12.05")
        self.assertEqual(result["heroMetricNumberFlowState"], "idle")
        self.assertEqual(result["countUpStartHookTargets"], [".metric-value"])
        self.assertEqual(result["heroMetricDigitStarts"], ["0", "0", "0", "0"])
        self.assertEqual(result["heroMetricDigitCount"], 4)
        self.assertEqual(result["heroMetricStaticCount"], 1)
        self.assertIn("metric-digit", result["heroMetricChildClasses"])
        self.assertIn("metric-static-char", result["heroMetricChildClasses"])

    def test_count_up_reduced_motion_keeps_plain_metric_text(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "none"},
            sections=[
                {
                    "pattern": "hero-impact",
                    "attrs": {"data-hero-mode": "stat"},
                    "metricTarget": "12.05",
                }
            ],
        )

        self.assertEqual(result["heroMetricText"], "12.05")
        self.assertEqual(result["heroMetricDigitCount"], 0)
        self.assertEqual(result["heroMetricStaticCount"], 0)

    def test_restrained_comparison_keeps_count_up_without_relationship_motion(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "comparison", "mode": "alternating"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [{"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"}],
        )

    def test_guided_comparison_and_timeline_keep_relationship_motion(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[
                {"pattern": "comparison", "mode": "alternating"},
                {"pattern": "timeline"},
            ],
        )

        self.assertEqual(result["staggerCalls"], [])
        self.assertIn(
            {"target": ".metric-value", "trigger": ".metric-value", "start": "top 78%"},
            result["countUpCalls"],
        )
        self.assertIn(
            {
                "target": ".timeline-vertical",
                "start": "top 84%",
                "stagger": None,
                "trigger": ".timeline-vertical",
                "progress": [0, 1],
            },
            result["lineDrawCalls"],
        )

    def test_guided_timeline_uses_connector_line_motion_only(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "timeline"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(result["countUpCalls"], [])
        self.assertEqual(
            result["lineDrawCalls"],
            [
                {
                    "target": ".timeline-vertical",
                    "start": "top 84%",
                    "stagger": None,
                    "trigger": ".timeline-vertical",
                    "progress": [0, 1],
                }
            ],
        )
        self.assertEqual(result["timelineMotionPrimitive"], "line-draw")
        self.assertEqual(result["timelineMotionState"], "active")

    def test_restrained_timeline_and_action_stay_static(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[
                {"pattern": "timeline"},
                {"pattern": "action"},
            ],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])

    def test_scrollytelling_guided_keeps_shell_motion_minimal(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "guided"},
            sections=[{"pattern": "scrollytelling"}],
        )

        self.assertEqual(result["motionLevel"], "guided")
        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertGreaterEqual(len(result["scrollTriggerCreates"]), 1)

    def test_scrollytelling_section_update_activates_nearest_viewport_step(self):
        script = textwrap.dedent(
            f"""
            import fs from 'node:fs';
            import vm from 'node:vm';

            const source = fs.readFileSync({json.dumps(str(STORY_MOTION))}, 'utf8');
            const scrollTriggers = [];

            function createElement(tagName, attrs = {{}}) {{
              const classTokens = new Set();
              const node = {{
                nodeType: 1,
                tagName: String(tagName).toUpperCase(),
                dataset: Object.create(null),
                attributes: Object.create(null),
                style: {{}},
                classList: {{
                  add(...tokens) {{
                    tokens.forEach((token) => classTokens.add(token));
                  }},
                  remove(...tokens) {{
                    tokens.forEach((token) => classTokens.delete(token));
                  }},
                  contains(token) {{
                    return classTokens.has(token);
                  }},
                  toggle(token, force) {{
                    const next = force === undefined ? !classTokens.has(token) : !!force;
                    if (next) {{
                      classTokens.add(token);
                    }} else {{
                      classTokens.delete(token);
                    }}
                    return next;
                  }},
                }},
                setAttribute(name, value) {{
                  const text = String(value);
                  this.attributes[name] = text;
                  if (name === 'class') {{
                    text.split(/\\s+/).filter(Boolean).forEach((token) => classTokens.add(token));
                  }}
                  if (name.startsWith('data-')) {{
                    const key = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                    this.dataset[key] = text;
                  }}
                }},
                getAttribute(name) {{
                  return this.attributes[name] ?? null;
                }},
                querySelector() {{
                  return null;
                }},
                querySelectorAll() {{
                  return [];
                }},
              }};
              Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
              return node;
            }}

            const steps = [
              createElement('article', {{ class: 'scrolly-step', 'data-step': '0' }}),
              createElement('article', {{ class: 'scrolly-step', 'data-step': '1' }}),
              createElement('article', {{ class: 'scrolly-step', 'data-step': '2' }}),
            ];
            steps[0].getBoundingClientRect = () => ({{ top: -500, bottom: -300 }});
            steps[1].getBoundingClientRect = () => ({{ top: 100, bottom: 200 }});
            steps[2].getBoundingClientRect = () => ({{ top: 460, bottom: 540 }});

            const heading = createElement('div', {{ class: 'section-heading' }});
            const section = createElement('section', {{ 'data-pattern': 'scrollytelling' }});
            section.querySelector = (selector) => selector === '.section-heading' ? heading : null;
            section.querySelectorAll = (selector) => selector === '.scrolly-step' ? steps : [];

            globalThis.window = {{
              innerHeight: 1000,
              __storyTextLayoutReady: true,
              matchMedia() {{
                return {{ matches: false }};
              }},
              gsap: {{
                registerPlugin() {{}},
                to() {{}},
                fromTo() {{}},
                set() {{}},
              }},
              ScrollTrigger: {{
                create(config) {{
                  scrollTriggers.push(config);
                }},
                refresh() {{}},
              }},
            }};
            window.window = window;
            globalThis.document = {{
              body: {{ dataset: {{ motionLevel: 'restrained' }} }},
              documentElement: {{ clientHeight: 1000 }},
              querySelectorAll(selector) {{
                return selector === 'section[data-pattern]' ? [section] : [];
              }},
            }};
            globalThis.Node = {{ ELEMENT_NODE: 1, TEXT_NODE: 3 }};
            window.Node = globalThis.Node;

            vm.runInThisContext(source, {{ filename: 'story-motion.js' }});
            window.initStoryMotion();

            const sectionTrigger = scrollTriggers.find((config) => config.trigger === section);
            if (!sectionTrigger || typeof sectionTrigger.onUpdate !== 'function') {{
              throw new Error(`Expected section-level scrolly trigger: ${{JSON.stringify(scrollTriggers)}}`);
            }}
            if (scrollTriggers.length !== 1) {{
              throw new Error(`Expected scrolly motion to use one section-level trigger, got ${{scrollTriggers.length}}`);
            }}

            sectionTrigger.onUpdate();

            const activeIndex = steps.findIndex((step) => step.classList.contains('is-active'));
            if (activeIndex !== 2) {{
              throw new Error(`Expected nearest viewport step 2 to be active, got ${{activeIndex}}`);
            }}
            """
        )

        proc = subprocess.run(
            ["node", "--input-type=module", "-e", script],
            cwd=REPO_DIR,
            text=True,
            capture_output=True,
        )

        self.assertEqual(proc.returncode, 0, msg=proc.stderr)

    def test_scrollytelling_restrained_keeps_shell_static(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[{"pattern": "scrollytelling"}],
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])

    def test_shared_component_preview_fallback_keeps_shell_static_and_counts_metrics(self):
        result = run_story_motion_runtime(
            body_attrs={"data-motion-level": "restrained"},
            sections=[],
            include_shared_component_preview=True,
        )

        self.assertEqual(result["revealCalls"], [])
        self.assertEqual(result["staggerCalls"], [])
        self.assertEqual(
            result["countUpCalls"],
            [
                {
                    "target": ".shared-metric-value",
                    "trigger": ".shared-metric-value",
                    "start": "top 78%",
                }
            ],
        )
        self.assertEqual(result["sharedMetricAriaLabel"], "128")
        self.assertEqual(result["sharedMetricNumberFlowState"], "idle")
        self.assertEqual(result["sharedMetricDigitCount"], 3)
