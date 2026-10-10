(function () {
  const TRANSITION_MS = 1080;
  const EASE_LOCK_MS = 900;
  const SCROLL_STEP_LOCK_MS = 920;
  const PROGRESSIVE_STEP_LOCK_MS = 860;
  const DEFAULT_POLARITY = 'light';
  const REVEAL_SELECTOR = '.reveal';
  const AUTO_REVEAL_SELECTOR = [
    '.deck-kicker',
    '.headline',
    '.slide-heading',
    '.transition-title',
    '.big-number',
    '.reading-caption',
    '.takeaway',
    '.cue',
    '.intro',
    '.lead-meta',
    '.source-note',
    '.stat-stage',
    '.stat-delta-compare',
    '.stat-delta-note',
    '.stat-ticker',
    '.quote-block',
    '.attribution',
    '.chart-frame',
    '.primary-image',
    '.visual-artifact',
    '.evidence-grid',
    '.metric-tiles',
    '.quote-pair',
    '.process-steps',
    '.timeline-nodes',
    '.action-items',
    '.difference-callout',
    '.closing-cue'
  ].join(',');
  const MOTION_RECIPES = {
    CASCADE: 'cascade',
    HERO: 'hero-ritual',
    QUOTE: 'quote-focus',
    DIRECTIONAL: 'directional',
    LIST: 'list-cascade',
    PROGRESSIVE: 'progressive-board',
    EVIDENCE: 'evidence-cascade',
    SCROLL: 'scroll-scene'
  };
  const MOTION_TIMING = {
    [MOTION_RECIPES.CASCADE]: { revealStart: 120, revealStep: 96, itemStart: 210, itemStep: 86 },
    [MOTION_RECIPES.HERO]: { revealStart: 240, revealStep: 190, itemStart: 340, itemStep: 160 },
    [MOTION_RECIPES.QUOTE]: { revealStart: 260, revealStep: 150, itemStart: 620, itemStep: 560 },
    [MOTION_RECIPES.DIRECTIONAL]: { revealStart: 220, revealStep: 156, itemStart: 420, itemStep: 220 },
    [MOTION_RECIPES.LIST]: { revealStart: 190, revealStep: 128, itemStart: 400, itemStep: 168 },
    [MOTION_RECIPES.PROGRESSIVE]: { revealStart: 150, revealStep: 118, itemStart: 400, itemStep: 210 },
    [MOTION_RECIPES.EVIDENCE]: { revealStart: 140, revealStep: 104, itemStart: 280, itemStep: 140 },
    [MOTION_RECIPES.SCROLL]: { revealStart: 170, revealStep: 136, itemStart: 280, itemStep: 144 }
  };
  const MOTION_ITEM_SELECTOR = [
    '.metric-tile',
    '.action-item',
    '.process-step',
    '.timeline-node',
    '.comparison-panel',
    '.quote-card',
    '.evidence-grid figure',
    '.reading-list li'
  ].join(',');
  const PROGRESSIVE_SLIDE_TYPES = new Set();
  const AMBIENT_BACKGROUND_SLIDE_TYPES = new Set(['cover', 'transition']);
  const PROGRESSIVE_ITEM_SELECTOR = [
    '.action-item',
    '.process-step',
    '.timeline-node'
  ].join(',');
  const HERO_STAT_NUMBER_SELECTOR = [
    '.deck-slide[data-slide-type="hero-stat"] .big-number',
    '.deck-slide[data-slide-type="hero-stat"] .stat-ticker-digit'
  ].join(',');

  const VS = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';

  const FS_DARK = `
precision highp float;
uniform vec2 u_resolution;uniform float u_time;uniform vec2 u_mouse;
vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 p=uv*2.0-1.0;p.x*=u_resolution.x/u_resolution.y;
  vec2 m=u_mouse*2.0-1.0;m.x*=u_resolution.x/u_resolution.y;
  float md=length(p-m);
  float mr=sin(md*15.0-u_time*4.0)*exp(-md*3.0);p+=mr*0.08;
  vec2 p0=p;
  for(float i=1.0;i<4.0;i++){
    p.x+=0.1/i*sin(i*3.0*p.y+u_time*0.4)+0.05;
    p.y+=0.1/i*cos(i*2.0*p.x+u_time*0.3)-0.05;
  }
  float r=length(p);float ang=atan(p.y,p.x);
  vec3 col=palette(r*1.5+p0.x*0.5+u_time*0.1,vec3(0.12,0.12,0.13),vec3(0.03,0.04,0.05),vec3(1.0),vec3(0.1,0.2,0.4));
  float disp=sin(r*25.0-u_time*1.5+ang*2.0)*0.5+0.5;
  col+=vec3(disp*0.015,disp*0.01,disp*0.02);
  float hi=pow(sin(p.x*4.0+p.y*3.0+u_time)*0.5+0.5,8.0);
  col+=hi*0.08;
  gl_FragColor=vec4(mix(vec3(0.05,0.05,0.06),col,0.85),1.0);
}`;

  const FS_LIGHT = `
precision highp float;
uniform vec2 u_resolution;uniform float u_time;uniform vec2 u_mouse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  mat2 m=mat2(0.80,0.60,-0.60,0.80);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p*2.02;a*=0.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 p=uv;p.x*=u_resolution.x/u_resolution.y;
  vec2 m=u_mouse;m.x*=u_resolution.x/u_resolution.y;
  vec2 md=p-m;float dl=length(md);
  p+=normalize(md+vec2(0.0001))*exp(-dl*5.0)*0.03;
  vec2 q=vec2(fbm(p*1.8+u_time*0.07),fbm(p*1.8+vec2(5.2,1.3)+u_time*0.06));
  vec2 r=vec2(fbm(p*2.0+q*1.3+vec2(1.7,9.2)+u_time*0.05),fbm(p*2.0+q*1.3+vec2(8.3,2.8)+u_time*0.04));
  float f=fbm(p*2.2+r*1.5);
  vec3 col=mix(vec3(0.74,0.78,0.82),vec3(0.985,0.965,0.91),f);
  float ph=r.x*2.2+u_time*0.35;
  col+=vec3(0.78,0.62,0.92)*sin(ph)*0.095;
  col+=vec3(0.55,0.72,0.95)*sin(ph*0.8+2.0)*0.075;
  float contour=sin((p.x+r.y)*15.0+u_time*0.9)*0.5+0.5;
  col+=vec3(0.20,0.12,0.02)*contour*0.028;
  col+=smoothstep(0.48,0.92,f)*0.09;
  gl_FragColor=vec4(col,1.0);
}`;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isInteractiveEvent(event) {
    const target = event.target;
    return target && target.closest && target.closest('button, a, input, select, textarea, [contenteditable="true"]');
  }

  function setBackgroundPolarity(shell, polarity) {
    const next = polarity === 'dark' ? 'dark' : DEFAULT_POLARITY;
    shell.dataset.bgPolarity = next;
    document.body.dataset.deckThemePolarity = next;
  }

  function getInitialDeckPolarity(shell) {
    return window.STORY_DECK_THEME_POLARITY
      || document.body.dataset.deckThemePolarity
      || shell.dataset.bgPolarity
      || DEFAULT_POLARITY;
  }

  function isAmbientBackgroundEnabled() {
    return window.STORY_DECK_ENABLE_AMBIENT_BACKGROUND !== false;
  }

  function shouldShowAmbientBackground(slide) {
    if (!isAmbientBackgroundEnabled() || !slide || !slide.dataset) return false;
    return AMBIENT_BACKGROUND_SLIDE_TYPES.has(slide.dataset.slideType || '');
  }

  function setAmbientBackground(shell, slide) {
    shell.dataset.deckAmbient = shouldShowAmbientBackground(slide) ? 'on' : 'off';
  }

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
    }
    return shader;
  }

  function bootGL(canvas, fragmentSource, mouse) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
    if (!gl) return null;

    const program = gl.createProgram();
    gl.attachShader(program, loadShader(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(program, loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const pointer = gl.getUniformLocation(program, 'u_mouse');

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    return function draw(seconds) {
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, seconds);
      gl.uniform2f(pointer, mouse.x, 1 - mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
  }

  function initDeckBackground(shell, reducedMotion) {
    const darkCanvas = shell.querySelector('[data-deck-bg-dark]');
    const lightCanvas = shell.querySelector('[data-deck-bg-light]');
    if (!darkCanvas || !lightCanvas || reducedMotion) return;

    const mouse = { x: 0.5, y: 0.5 };
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = event.clientY / window.innerHeight;
    }, { passive: true });

    try {
      const drawDark = bootGL(darkCanvas, FS_DARK, mouse);
      const drawLight = bootGL(lightCanvas, FS_LIGHT, mouse);
      if (!drawDark || !drawLight) return;

      shell.classList.add('has-webgl-bg');
      const start = performance.now();
      function loop(now) {
        const seconds = (now - start) / 1000;
        drawDark(seconds);
        drawLight(seconds);
        window.requestAnimationFrame(loop);
      }
      window.requestAnimationFrame(loop);
    } catch (error) {
      console.warn('[story-deck] WebGL background disabled', error);
    }
  }

  function applyTheme(shell, themeName) {
    const themes = window.STORY_DECK_THEMES || {};
    const theme = themes[themeName];
    if (!theme || !theme.vars) return;

    Object.entries(theme.vars).forEach(([name, value]) => {
      document.documentElement.style.setProperty(name, value);
    });
    document.body.dataset.deckTheme = themeName;
    shell.dataset.deckTheme = themeName;
    setBackgroundPolarity(shell, theme.polarity);

    document.querySelectorAll('[data-deck-theme]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.deckTheme === themeName ? 'true' : 'false');
    });
  }

  function initThemeSwitcher(shell) {
    const buttons = Array.from(document.querySelectorAll('[data-deck-theme]'));
    if (!buttons.length || !window.STORY_DECK_THEMES) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => applyTheme(shell, button.dataset.deckTheme));
    });

    const initialTheme = shell.dataset.deckTheme || document.body.dataset.deckTheme || buttons[0].dataset.deckTheme;
    applyTheme(shell, initialTheme);
  }

  function initStoryDeck() {
    const shell = document.querySelector('[data-deck-shell]');
    const track = document.querySelector('[data-deck-track]');
    const slides = Array.from(document.querySelectorAll('.deck-slide'));
    const progress = document.querySelector('[data-deck-progress]');
    const dotsRoot = document.querySelector('[data-deck-dots]');

    if (!shell || !track || slides.length === 0) return;

    const deckAxis = shell.dataset.deckAxis === 'vertical' ? 'vertical' : 'horizontal';
    let index = 0;
    let wheelLocked = false;
    let wheelAcc = 0;
    let wheelTimeout = null;
    let touchStartX = null;
    let touchStartY = null;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setBackgroundPolarity(shell, getInitialDeckPolarity(shell));
    setAmbientBackground(shell, null);

    function update(nextIndex, direction = 0) {
      const previousIndex = index;
      index = clamp(nextIndex, 0, slides.length - 1);
      const resolvedDirection = direction || Math.sign(index - previousIndex);
      shell.style.setProperty('--deck-index', String(index));
      shell.style.setProperty('--deck-progress', slides.length <= 1 ? '1' : String(index / (slides.length - 1)));

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (!isActive) resetHeroStatNumberFlow(slide);
      });

      const activeSlide = slides[index];
      setAmbientBackground(shell, activeSlide);
      prepareScrollSceneForEntry(activeSlide, resolvedDirection);
      prepareProgressiveSceneForEntry(activeSlide, resolvedDirection);
      activateHeroStatNumberFlow(activeSlide, reducedMotion);
      window.requestAnimationFrame(() => fitMetricGroups(activeSlide));
      const slidePolarity = activeSlide.dataset.bgPolarity || document.body.dataset.deckThemePolarity || DEFAULT_POLARITY;
      setBackgroundPolarity(shell, slidePolarity);

      if (progress) {
        progress.style.width = `${slides.length <= 1 ? 100 : (index / (slides.length - 1)) * 100}%`;
      }
      if (dotsRoot) {
        Array.from(dotsRoot.querySelectorAll('button')).forEach((dot, dotIndex) => {
          dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
        });
      }
    }

    function go(delta) {
      update(index + delta, delta);
    }

    function getWheelDelta(event) {
      if (deckAxis === 'vertical') return event.deltaY;
      return Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    }

    function buildDots() {
      if (!dotsRoot) return;
      dotsRoot.innerHTML = '';
      slides.forEach((_, slideIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'deck-dot';
        dot.setAttribute('aria-label', `Go to slide ${slideIndex + 1}`);
        dot.addEventListener('click', () => update(slideIndex, Math.sign(slideIndex - index)));
        dotsRoot.appendChild(dot);
      });
    }

    function getScrollScene(slide) {
      return slide && slide.dataset && slide.dataset.slideType === 'scroll-scene' ? slide : null;
    }

    function getProgressiveScene(slide) {
      if (!slide || !slide.dataset || !PROGRESSIVE_SLIDE_TYPES.has(slide.dataset.slideType || '')) return null;
      return slide.querySelector(PROGRESSIVE_ITEM_SELECTOR) ? slide : null;
    }

    function getProgressiveItems(scene) {
      return Array.from(scene.querySelectorAll(PROGRESSIVE_ITEM_SELECTOR));
    }

    function getProgressivePhaseCount(scene) {
      return getProgressiveItems(scene).length;
    }

    function getProgressivePhaseIndex(scene) {
      const parsed = Number.parseInt(scene.dataset.progressivePhase || '0', 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function getScrollStepCopies(scene) {
      return Array.from(scene.querySelectorAll('.scroll-step-copy[data-scroll-step]'));
    }

    function getScrollStepCount(scene) {
      return getScrollStepCopies(scene).length;
    }

    function getScrollStepIndex(scene) {
      const parsed = Number.parseInt(scene.dataset.scrollStep || '0', 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function syncScrollSceneStepState(scene, stepIndex) {
      scene.dataset.scrollStep = String(stepIndex);
      getScrollStepCopies(scene).forEach((copy) => {
        copy.classList.toggle('is-active', Number(copy.dataset.scrollStep) === stepIndex);
      });
    }

    function renderScrollSceneChart(scene, stepIndex) {
      const chartId = scene.dataset.chartId;
      const chartContainer = scene.querySelector('.chart-container');
      if (!chartId || !chartContainer || !chartContainer.id || typeof window.renderVSeedScrolly !== 'function') return;
      Promise.resolve(window.renderVSeedScrolly(chartContainer.id, chartId, stepIndex)).catch((error) => {
        console.warn('[story-deck] scroll scene chart step failed', error);
      });
    }

    function resolveSlideMotionRecipe(slide) {
      const slideType = slide.dataset.slideType || '';
      const layout = slide.dataset.layout || '';

      if (slideType === 'scroll-scene') return MOTION_RECIPES.SCROLL;
      if (['cover', 'hero-stat', 'hero-image', 'transition', 'closing'].includes(slideType)) return MOTION_RECIPES.HERO;
      if (slideType === 'quote' || slideType === 'quote-pair' || layout === 'quote-focus') return MOTION_RECIPES.QUOTE;
      if (layout === 'split-argument' || slideType === 'comparison' || slideType === 'text-image') return MOTION_RECIPES.DIRECTIONAL;
      if (slideType === 'action' || slideType === 'timeline') return MOTION_RECIPES.LIST;
      if (slideType === 'process-flow') return MOTION_RECIPES.LIST;
      if (['chart-read', 'metric-board', 'metric-reading', 'image-grid'].includes(slideType)) return MOTION_RECIPES.EVIDENCE;
      return MOTION_RECIPES.CASCADE;
    }

    function getMotionTiming(recipe) {
      return MOTION_TIMING[recipe] || MOTION_TIMING[MOTION_RECIPES.CASCADE];
    }

    function setStyleValue(element, propertyName, value) {
      if (!element || !element.style) return;
      if (typeof element.style.setProperty === 'function') {
        element.style.setProperty(propertyName, value);
        return;
      }
      element.style[propertyName] = value;
    }

    function parsePx(value, fallback) {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function getDirectMetricUnit(tile) {
      if (!tile || !tile.children) return null;
      return Array.from(tile.children).find((child) =>
        child && child.classList && child.classList.contains('unit')
      ) || null;
    }

    function isCompactMetricUnit(unit) {
      const text = unit && unit.textContent ? unit.textContent.trim() : '';
      return Boolean(text) && text.length <= 4 && !/\s/.test(text);
    }

    function syncMetricUnitMode(group) {
      Array.from(group.querySelectorAll('.metric-tile')).forEach((tile) => {
        const unit = getDirectMetricUnit(tile);
        if (isCompactMetricUnit(unit)) {
          tile.setAttribute('data-inline-unit', 'true');
        } else {
          tile.removeAttribute('data-inline-unit');
        }
      });
    }

    function getOuterInlineWidth(element) {
      if (!element || !window.getComputedStyle) return 0;
      const style = window.getComputedStyle(element);
      return element.scrollWidth
        + parsePx(style.marginLeft, 0)
        + parsePx(style.marginRight, 0);
    }

    function getMetricTileContentWidth(tile, fallback) {
      if (!tile || !window.getComputedStyle) return fallback;
      const style = window.getComputedStyle(tile);
      const width = tile.clientWidth
        - parsePx(style.paddingLeft, 0)
        - parsePx(style.paddingRight, 0);
      return width > 0 ? width : fallback;
    }

    function measureMetricValueLine(value) {
      const tile = value.closest && value.closest('.metric-tile');
      const availableWidth = getMetricTileContentWidth(tile, value.clientWidth);
      let fixedWidth = 0;
      if (tile && tile.getAttribute('data-inline-unit') === 'true') {
        fixedWidth = getOuterInlineWidth(getDirectMetricUnit(tile));
      }
      const valueWidth = value.scrollWidth;
      return {
        availableWidth,
        fixedWidth,
        requiredWidth: valueWidth + fixedWidth,
        valueWidth
      };
    }

    function fitMetricGroup(group) {
      if (!group || !group.style || !group.querySelectorAll || !window.getComputedStyle) return;
      syncMetricUnitMode(group);
      const values = Array.from(group.querySelectorAll('.metric-tile .metric-value'));
      if (!values.length) return;

      group.style.removeProperty('--deck-fitted-metric-value-size');

      let defaultSize = 0;
      let minSize = 0;
      let fittedSize = Infinity;
      let shouldFit = false;

      values.forEach((value) => {
        const measure = measureMetricValueLine(value);
        const availableWidth = measure.availableWidth;
        if (!availableWidth) return;

        const style = window.getComputedStyle(value);
        const valueDefaultSize = parsePx(style.fontSize, 56);
        const valueMinSize = parsePx(style.getPropertyValue('--deck-metric-tile-value-size-min'), 38);
        defaultSize = defaultSize ? Math.min(defaultSize, valueDefaultSize) : valueDefaultSize;
        minSize = Math.max(minSize, valueMinSize);

        if (valueDefaultSize && measure.requiredWidth > availableWidth + 1) {
          const availableValueWidth = Math.max(1, availableWidth - measure.fixedWidth);
          shouldFit = true;
          fittedSize = Math.min(
            fittedSize,
            Math.floor(valueDefaultSize * (availableValueWidth / measure.valueWidth) * 0.98)
          );
        }
      });

      if (!shouldFit || !Number.isFinite(fittedSize)) return;

      fittedSize = clamp(fittedSize, minSize || 38, defaultSize || 56);
      setStyleValue(group, '--deck-fitted-metric-value-size', `${fittedSize}px`);

      while (
        fittedSize > (minSize || 38)
        && values.some((value) => {
          const measure = measureMetricValueLine(value);
          return measure.availableWidth && measure.requiredWidth > measure.availableWidth + 1;
        })
      ) {
        fittedSize -= 1;
        setStyleValue(group, '--deck-fitted-metric-value-size', `${fittedSize}px`);
      }
    }

    function fitMetricGroups(root = document) {
      if (!root || !root.querySelectorAll) return;
      Array.from(root.querySelectorAll('.metric-tiles')).forEach(fitMetricGroup);
    }

    function initMetricValueFitting() {
      window.fitStoryDeckMetricValues = fitMetricGroups;
      fitMetricGroups(document);

      if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const group = entry.target.closest && entry.target.closest('.metric-tiles');
            fitMetricGroup(group || entry.target);
          });
        });
        Array.from(document.querySelectorAll('.metric-tile')).forEach((tile) => observer.observe(tile));
        return;
      }

      window.addEventListener('resize', () => {
        window.requestAnimationFrame(() => fitMetricGroups(document));
      });
    }

    function createNumberFlowDigit(char, digitIndex, charIndex) {
      const targetDigit = Number(char);
      const digit = document.createElement('span');
      digit.className = 'deck-number-digit';
      digit.setAttribute('aria-hidden', 'true');
      digit.dataset.digit = char;

      const reel = document.createElement('span');
      reel.className = 'deck-number-digit-reel';
      setStyleValue(reel, '--deck-number-digit-from', '0');
      setStyleValue(reel, '--deck-number-digit-to', String(targetDigit + 10));
      setStyleValue(reel, '--deck-number-digit-delay', `${Math.min(charIndex * 0.04, 0.22)}s`);
      setStyleValue(reel, '--deck-number-digit-duration', `${0.92 + Math.min(digitIndex * 0.045, 0.24)}s`);

      for (let cycle = 0; cycle < 2; cycle += 1) {
        for (let value = 0; value <= 9; value += 1) {
          const glyph = document.createElement('span');
          glyph.className = 'deck-number-digit-glyph';
          glyph.textContent = String(value);
          reel.appendChild(glyph);
        }
      }

      digit.appendChild(reel);
      return digit;
    }

    function createNumberFlowStaticChar(char, charIndex) {
      const node = document.createElement('span');
      node.className = 'deck-number-static-char';
      node.setAttribute('aria-hidden', 'true');
      setStyleValue(node, '--deck-number-static-delay', `${Math.min(charIndex * 0.028, 0.16)}s`);
      node.textContent = char;
      return node;
    }

    function prepareNumberFlowElement(element) {
      if (!element || element.dataset.numberFlowReady === 'true') return;
      const text = (element.textContent || '').trim();
      if (!/\d/.test(text)) return;

      element.dataset.numberFlowReady = 'true';
      element.dataset.numberFlow = 'true';
      element.dataset.numberFlowState = 'idle';
      if (element.classList.contains('stat-ticker-digit') && element.closest('.stat-ticker[aria-label]')) {
        element.setAttribute('aria-hidden', 'true');
      } else {
        element.setAttribute('aria-label', text);
      }
      element.textContent = '';

      let digitIndex = 0;
      Array.from(text).forEach((char, charIndex) => {
        if (/\d/.test(char)) {
          element.appendChild(createNumberFlowDigit(char, digitIndex, charIndex));
          digitIndex += 1;
          return;
        }
        element.appendChild(createNumberFlowStaticChar(char, charIndex));
      });
    }

    function initHeroStatNumberFlow(slides, reducedMotion) {
      if (reducedMotion) return;
      slides.forEach((slide) => {
        Array.from(slide.querySelectorAll(HERO_STAT_NUMBER_SELECTOR)).forEach((element, order) => {
          if (element.classList.contains('stat-ticker-digit')) {
            setStyleValue(element, '--deck-number-flow-delay', `${Math.min(order * 0.055, 0.32)}s`);
          }
          prepareNumberFlowElement(element);
        });
      });
    }

    function resetHeroStatNumberFlow(slide) {
      if (!slide) return;
      Array.from(slide.querySelectorAll('[data-number-flow="true"]')).forEach((element) => {
        element.dataset.numberFlowState = 'idle';
      });
    }

    function activateHeroStatNumberFlow(slide, reducedMotion) {
      if (!slide || reducedMotion) return;
      Array.from(slide.querySelectorAll('[data-number-flow="true"]')).forEach((element) => {
        element.dataset.numberFlowState = 'idle';
        Array.from(element.querySelectorAll('.deck-number-digit-reel')).forEach((reel) => {
          reel.style.animation = 'none';
          void reel.offsetWidth;
          reel.style.animation = '';
        });
        element.dataset.numberFlowState = 'active';
      });
    }

    function getRevealElements(slide) {
      const selector = `${REVEAL_SELECTOR},${AUTO_REVEAL_SELECTOR}`;
      const seen = new Set();
      return Array.from(slide.querySelectorAll(selector)).filter((element) => {
        if (seen.has(element)) return false;
        const parentReveal = element.parentElement && element.parentElement.closest(selector);
        if (parentReveal && slide.contains(parentReveal)) return false;
        seen.add(element);
        element.classList.add('reveal');
        return true;
      });
    }

    function initSlideMotion() {
      slides.forEach((slide) => {
        const recipe = resolveSlideMotionRecipe(slide);
        const timing = getMotionTiming(recipe);
        Object.values(MOTION_RECIPES).forEach((name) => {
          slide.classList.remove(`motion-${name}`);
        });
        slide.classList.add(`motion-${recipe}`);

        getRevealElements(slide).forEach((element, order) => {
          element.style.setProperty('--reveal-order', String(order));
          element.style.setProperty('--reveal-delay', `${timing.revealStart + order * timing.revealStep}ms`);
        });
        Array.from(slide.querySelectorAll(MOTION_ITEM_SELECTOR)).forEach((element, order) => {
          element.style.setProperty('--item-order', String(order));
          element.style.setProperty('--item-delay', `${timing.itemStart + order * timing.itemStep}ms`);
        });
      });
    }

    function setProgressivePhase(scene, nextPhase, options = {}) {
      const items = getProgressiveItems(scene);
      const count = items.length;
      if (count === 0) return false;
      const clamped = clamp(nextPhase, 0, count - 1);
      const current = getProgressivePhaseIndex(scene);
      if (!options.force && current === clamped) return true;

      scene.dataset.progressivePhase = String(clamped);
      scene.classList.toggle('has-progressive-phase', count > 1);
      items.forEach((item, itemIndex) => {
        const isCurrent = itemIndex === clamped;
        item.classList.toggle('is-current', isCurrent);
        item.classList.toggle('is-complete', itemIndex < clamped);
        item.classList.toggle('is-pending', itemIndex > clamped);
        item.setAttribute('aria-current', isCurrent ? 'step' : 'false');
      });
      return true;
    }

    function scheduleProgressiveReady(scene) {
      if (scene._progressiveReadyTimer) {
        window.clearTimeout(scene._progressiveReadyTimer);
      }
      scene.classList.remove('progressive-ready');
      scene._progressiveReadyTimer = window.setTimeout(() => {
        scene.classList.add('progressive-ready');
      }, reducedMotion ? 0 : 960);
    }

    function setScrollSceneStep(scene, nextStep, options = {}) {
      const count = getScrollStepCount(scene);
      if (count === 0) return false;
      const clamped = clamp(nextStep, 0, count - 1);
      const current = getScrollStepIndex(scene);
      if (!options.force && current === clamped) return true;

      syncScrollSceneStepState(scene, clamped);
      if (options.render !== false) {
        renderScrollSceneChart(scene, clamped);
      }
      return true;
    }

    function prepareScrollSceneForEntry(slide, direction) {
      const scene = getScrollScene(slide);
      if (!scene) return;
      const count = getScrollStepCount(scene);
      if (count === 0) return;
      const initialStep = direction < 0 ? count - 1 : 0;
      setScrollSceneStep(scene, initialStep, { force: true });
    }

    function stepActiveScrollScene(delta) {
      const scene = getScrollScene(slides[index]);
      if (!scene) return false;
      const count = getScrollStepCount(scene);
      if (count === 0) return false;
      const current = getScrollStepIndex(scene);
      const next = current + delta;
      if (next < 0 || next >= count) return false;
      setScrollSceneStep(scene, next);
      return true;
    }

    function prepareProgressiveSceneForEntry(slide, direction) {
      const scene = getProgressiveScene(slide);
      if (!scene) return;
      const count = getProgressivePhaseCount(scene);
      if (count === 0) return;
      const initialPhase = direction < 0 ? count - 1 : 0;
      setProgressivePhase(scene, initialPhase, { force: true });
      scheduleProgressiveReady(scene);
    }

    function stepActiveProgressiveScene(delta) {
      const scene = getProgressiveScene(slides[index]);
      if (!scene) return false;
      const count = getProgressivePhaseCount(scene);
      if (count <= 1) return false;
      const current = getProgressivePhaseIndex(scene);
      const next = current + delta;
      if (next < 0 || next >= count) return false;
      scene.classList.add('progressive-ready');
      setProgressivePhase(scene, next);
      return true;
    }

    function navigate(delta) {
      if (stepActiveScrollScene(delta)) return;
      if (stepActiveProgressiveScene(delta)) return;
      go(delta);
    }

    function initScrollScenes() {
      slides.forEach((slide) => {
        const scene = getScrollScene(slide);
        if (!scene) return;
        setScrollSceneStep(scene, 0, { force: true, render: false });
      });
    }

    function initProgressiveScenes() {
      slides.forEach((slide) => {
        const scene = getProgressiveScene(slide);
        if (!scene) return;
        setProgressivePhase(scene, 0, { force: true });
        scene.classList.remove('progressive-ready');
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || isInteractiveEvent(event)) return;
      if (['ArrowRight', 'PageDown', ' ', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        navigate(1);
      } else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        navigate(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        update(0, -1);
      } else if (event.key === 'End') {
        event.preventDefault();
        update(slides.length - 1, 1);
      }
    });

    document.addEventListener('wheel', (event) => {
      if (wheelLocked) return;
      wheelAcc += getWheelDelta(event);
      if (Math.abs(wheelAcc) > 55) {
        wheelLocked = true;
        const direction = wheelAcc > 0 ? 1 : -1;
        const handledByScrollScene = stepActiveScrollScene(direction);
        const handledByProgressiveScene = !handledByScrollScene && stepActiveProgressiveScene(direction);
        if (!handledByScrollScene && !handledByProgressiveScene) {
          go(direction);
        }
        wheelAcc = 0;
        window.setTimeout(() => {
          wheelLocked = false;
        }, reducedMotion ? 140 : (handledByScrollScene ? SCROLL_STEP_LOCK_MS : handledByProgressiveScene ? PROGRESSIVE_STEP_LOCK_MS : EASE_LOCK_MS));
      }
      window.clearTimeout(wheelTimeout);
      wheelTimeout = window.setTimeout(() => {
        wheelAcc = 0;
      }, 150);
    }, { passive: true });

    document.addEventListener('touchstart', (event) => {
      touchStartX = event.touches && event.touches.length ? event.touches[0].clientX : null;
      touchStartY = event.touches && event.touches.length ? event.touches[0].clientY : null;
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
      if (touchStartX == null || touchStartY == null || !event.changedTouches || event.changedTouches.length === 0) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (deckAxis === 'vertical' && Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
        navigate(deltaY < 0 ? 1 : -1);
      } else if (deckAxis === 'horizontal' && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        navigate(deltaX < 0 ? 1 : -1);
      }
    }, { passive: true });

    buildDots();
    initHeroStatNumberFlow(slides, reducedMotion);
    initSlideMotion();
    initThemeSwitcher(shell);
    initDeckBackground(shell, reducedMotion);
    initScrollScenes();
    initProgressiveScenes();
    initMetricValueFitting();
    shell.style.setProperty('--deck-transition-ms', `${TRANSITION_MS}ms`);
    update(0, 1);
  }

  window.initStoryDeck = initStoryDeck;
})();
