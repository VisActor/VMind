/* VSeed + VChart rendering helpers for data-storytelling HTML output.
 * This file should be inlined into the final HTML to keep it single-file.
 */

; (function () {
  const SCROLLY_CACHE = {}
  const SCROLLY_RENDER_SEQUENCE = {}
  const INFOGRAPHIC_RENDERER = 'infographic'
  let hasRegisteredThemes = false
  let hasRegisteredChartModule = false
  const DEFAULT_THEME = 'paper-and-ink'
  const LIGHT_ANNOTATION_THEME_TOKENS = Object.freeze({
    annotationAreaColor: '#BCC1CB',
    annotationAreaColorOpacity: 0.12,
    annotationLineColor: '#21252CB8',
    annotationLineStyle: 'dashed',
    annotationTextColor: '#fff',
    annotationTextBackgroundColor: '#5f6267',
    annotationTextBackgroundOpacity: 1,
    annotationTextBackgroundBorderRadius: 3,
    annotationTextBackgroundPadding: 3,
    annotationTextBackgroundBorderColor: '#5f6267',
  })
  const DARK_ANNOTATION_THEME_TOKENS = Object.freeze({
    annotationAreaColor: '#4B4F54',
    annotationAreaColorOpacity: 0.26,
    annotationLineColor: '#888C93',
    annotationLineStyle: 'dashed',
    annotationTextColor: '#fff',
    annotationTextBackgroundColor: '#555960',
    annotationTextBackgroundOpacity: 1,
    annotationTextBackgroundBorderRadius: 3,
    annotationTextBackgroundPadding: 3,
    annotationTextBackgroundBorderColor: '#555960',
  })
  // Fallback for legacy/previews. Normal builds should inject
  // window.STORY_CHART_THEME_TOKENS from preset docs via build head helpers.
  const BUILTIN_BUSINESS_THEME_TOKENS = {
    'dark-botanical': {
      baseTheme: 'dark',
      colorScheme: [
        '#F0A868',
        '#7BAA9A',
        '#D97C7C',
        '#8FB3C7',
        '#B9A888',
        '#9A8FBC',
        '#82A370',
        '#E8C46A',
      ],
      linearColorScheme: ['#7BAA9A', '#F0A868'],
      textPrimary: '#DEDCCA',
      textSecondary: '#A9A796',
      borderColor: 'rgba(222, 220, 202, 0.16)',
      surfaceColor: '#1E252D',
      tooltipBackgroundColor: 'rgba(30, 37, 45, 0.95)',
      axisGridColor: '#3A4047',
      axisLineColor: '#3A4047',
      tableHeaderBackgroundColor: '#1E252D',
      tableSelectedBorderColor: '#F0A868',
      ...DARK_ANNOTATION_THEME_TOKENS,
    },
    'indigo-porcelain': {
      baseTheme: 'light',
      colorScheme: [
        '#1F5E8C',
        '#3D8C86',
        '#C28B44',
        '#6A7FB8',
        '#8A5F7D',
        '#4F7A5B',
        '#9A6B3F',
        '#68798A',
      ],
      linearColorScheme: ['#BFD7EA', '#1F5E8C'],
      textPrimary: '#0A1F3D',
      textSecondary: '#53616F',
      borderColor: 'rgba(10, 31, 61, 0.12)',
      surfaceColor: '#FFFFFF',
      tooltipBackgroundColor: 'rgba(255, 255, 255, 0.96)',
      tableHeaderBackgroundColor: '#E8EEF3',
      tableSelectedBorderColor: '#1F5E8C',
      ...LIGHT_ANNOTATION_THEME_TOKENS,
    },
    'paper-and-ink': {
      baseTheme: 'light',
      colorScheme: [
        '#C41E3A',
        '#4E8AF8',
        '#50C878',
        '#E68A00',
        '#8B6194',
        '#2E6B5A',
        '#D4763A',
        '#4A6FA5',
      ],
      linearColorScheme: ['#F6C2CB', '#C41E3A'],
      textPrimary: '#1A1A1A',
      textSecondary: '#5E564C',
      borderColor: 'rgba(26, 26, 26, 0.10)',
      surfaceColor: '#FFFDF9',
      tooltipBackgroundColor: 'rgba(255, 253, 250, 0.95)',
      tableHeaderBackgroundColor: '#F4F0EB',
      tableSelectedBorderColor: '#C41E3A',
      ...LIGHT_ANNOTATION_THEME_TOKENS,
    },
    'pudding-neon': {
      baseTheme: 'dark',
      colorScheme: [
        '#F9D75A',
        '#FF6B6B',
        '#4ECDC4',
        '#A08BFF',
        '#FF9770',
        '#8EEB94',
        '#6A9BFF',
        '#E85D9A',
      ],
      linearColorScheme: ['#4ECDC4', '#F9D75A'],
      textPrimary: '#F2F2F2',
      textSecondary: '#B8B8B8',
      borderColor: '#444444',
      surfaceColor: '#2C2C2C',
      tooltipBackgroundColor: 'rgba(44, 44, 44, 0.95)',
      axisGridColor: '#444444',
      axisLineColor: '#444444',
      tableHeaderBackgroundColor: '#2C2C2C',
      tableSelectedBorderColor: '#F9D75A',
      ...DARK_ANNOTATION_THEME_TOKENS,
    },
    'swiss-modern': {
      baseTheme: 'light',
      colorScheme: [
        '#D64D4D',
        '#4A78A8',
        '#F28E2B',
        '#59A14F',
        '#B6992D',
        '#AF7AA1',
        '#8C8C8C',
        '#FF6B4A',
      ],
      linearColorScheme: ['#F3C8C8', '#D64D4D'],
      textPrimary: '#121212',
      textSecondary: '#666666',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      surfaceColor: '#F5F5F5',
      tooltipBackgroundColor: 'rgba(245, 245, 245, 0.95)',
      tableHeaderBackgroundColor: '#F5F5F5',
      tableSelectedBorderColor: '#D64D4D',
      ...LIGHT_ANNOTATION_THEME_TOKENS,
    },
    'vintage-editorial': {
      baseTheme: 'light',
      colorScheme: [
        '#9E2F50',
        '#007A70',
        '#4B79C2',
        '#E68A00',
        '#705F84',
        '#2E7D6F',
        '#C45833',
        '#6B7B8D',
      ],
      linearColorScheme: ['#E4BEC9', '#9E2F50'],
      textPrimary: '#2F2F2F',
      textSecondary: '#6B6B6B',
      borderColor: 'rgba(234, 223, 215, 0.60)',
      surfaceColor: '#FFFFFF',
      tooltipBackgroundColor: 'rgba(255, 255, 255, 0.95)',
      tableHeaderBackgroundColor: '#F8EEE5',
      tableSelectedBorderColor: '#9E2F50',
      ...LIGHT_ANNOTATION_THEME_TOKENS,
    },
    'warm-earth': {
      baseTheme: 'light',
      colorScheme: [
        '#E29E86',
        '#BCD2CA',
        '#EBCECF',
        '#6A9BCC',
        '#D1BCD2',
        '#C4A882',
        '#8BAFAB',
        '#B8937A',
      ],
      linearColorScheme: ['#F1DDD6', '#E29E86'],
      textPrimary: '#2D2A26',
      textSecondary: '#7A746B',
      borderColor: 'rgba(45, 42, 38, 0.10)',
      surfaceColor: '#FFFFFF',
      tooltipBackgroundColor: 'rgba(255, 255, 255, 0.95)',
      tableHeaderBackgroundColor: '#F4F1EC',
      tableSelectedBorderColor: '#E29E86',
      ...LIGHT_ANNOTATION_THEME_TOKENS,
    },
  }
  const DEFAULT_ANNOTATION_POINT_RUNTIME_HINT = Object.freeze({
    horizontal: 'left',
    vertical: 'up',
    showStartSymbol: false,
    density: 'normal',
  })
  const DEFAULT_ANNOTATION_POINT_OFFSET_MAGNITUDES = Object.freeze({
    sparse: Object.freeze({ x: 34, y: 18 }),
    normal: Object.freeze({ x: 30, y: 20 }),
    dense: Object.freeze({ x: 24, y: 24 }),
  })
  const ANNOTATION_MARK_POINT_ANIMATION = Object.freeze({
    type: 'moveIn',
    duration: 800,
    easing: 'cubicOut',
  })
  const ANNOTATION_MARK_LINE_ANIMATION = Object.freeze({
    type: 'clipIn',
    duration: 800,
    easing: 'cubicOut',
  })
  const ANNOTATION_DIFFERENCE_MARK_LINE_ANIMATION = Object.freeze({
    type: 'fadeIn',
    duration: 800,
    easing: 'cubicOut',
  })
  const ANNOTATION_MARK_AREA_ANIMATION = Object.freeze({
    type: 'fadeIn',
    duration: 800,
    easing: 'cubicOut',
  })
  const BAR_SHAPE_DEFAULTS = Object.freeze({
    barMaxWidth: 72,
    barGapInGroup: '10%',
    stackCornerRadius: 4,
  })
  const PARALLEL_BAR_SHAPE_DEFAULTS = Object.freeze({
    barMaxWidth: 72,
    barGapInGroup: '10%',
    stackCornerRadius: 6,
  })
  const HISTOGRAM_SHAPE_DEFAULTS = Object.freeze({
    barMaxWidth: 72,
    barGapInGroup: '10%',
    binValueType: 'count',
    binCountType: 'count',
    binCount: 10,
    binStep: 10,
    kdeRegressionLine: Object.freeze({ enable: false }),
    ecdfRegressionLine: Object.freeze({ enable: false }),
  })
  const BOXPLOT_SHAPE_DEFAULTS = Object.freeze({
    whiskersType: 'IQR',
    whiskers: 1.5,
    whiskerMin: 0.05,
    whiskerMax: 0.95,
    boxMaxWidth: 72,
    barGapInGroup: '10%',
    outlierStyle: Object.freeze({
      pointSize: 10,
      pointBorderWidth: 1.4,
    }),
    boxPlotStyle: Object.freeze({
      boxCornerRadius: 2,
    }),
  })
  const BAR_ANNOTATION_POINT_OFFSET_MAGNITUDES = Object.freeze({
    sparse: Object.freeze({ x: 40, y: 14 }),
    normal: Object.freeze({ x: 36, y: 16 }),
    dense: Object.freeze({ x: 30, y: 20 }),
  })
  const LIGHT_ANNOTATION_BACKGROUND = '#FFFFFF'
  const DARK_ANNOTATION_BACKGROUND = '#202226'

  /**
   * Render-only metadata attached beside a spec_map entry.
   * annotationPoint order is expected to match the generated markPoint order.
   *
   * @typedef {'left' | 'right'} AnnotationHorizontalHint
   * @typedef {'up' | 'down'} AnnotationVerticalHint
   * @typedef {'sparse' | 'normal' | 'dense'} AnnotationDensityHint
   * @typedef {{
   *   horizontal?: AnnotationHorizontalHint,
   *   vertical?: AnnotationVerticalHint,
   *   showStartSymbol?: boolean,
   *   density?: AnnotationDensityHint,
   *   colorId?: string
   * }} AnnotationPointRuntimeHint
   */

  function resolveBusinessThemeTokens() {
    const runtimeTokens = window.STORY_CHART_THEME_TOKENS
    if (
      !runtimeTokens ||
      typeof runtimeTokens !== 'object' ||
      Array.isArray(runtimeTokens)
    ) {
      return BUILTIN_BUSINESS_THEME_TOKENS
    }
    return {
      ...BUILTIN_BUSINESS_THEME_TOKENS,
      ...runtimeTokens,
    }
  }

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value)
  }

  function mergeThemeDefaults(target, defaults) {
    if (!isPlainObject(target) || !isPlainObject(defaults)) {
      return target
    }
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (isPlainObject(defaultValue)) {
        if (!isPlainObject(target[key])) {
          target[key] = {}
        }
        mergeThemeDefaults(target[key], defaultValue)
        return
      }
      target[key] = defaultValue
    })
    return target
  }

  function getThemeChartConfig(themeConfig, chartType) {
    if (!isPlainObject(themeConfig.config)) {
      themeConfig.config = {}
    }
    if (!isPlainObject(themeConfig.config[chartType])) {
      themeConfig.config[chartType] = {}
    }
    return themeConfig.config[chartType]
  }

  function applyMagiShapeDefaults(themeConfig) {
    if (!isPlainObject(themeConfig)) {
      return themeConfig
    }
    ;['bar', 'column', 'barPercent', 'columnPercent'].forEach((chartType) => {
      mergeThemeDefaults(
        getThemeChartConfig(themeConfig, chartType),
        BAR_SHAPE_DEFAULTS,
      )
    })
    ;['barParallel', 'columnParallel', 'dualAxis'].forEach((chartType) => {
      mergeThemeDefaults(
        getThemeChartConfig(themeConfig, chartType),
        PARALLEL_BAR_SHAPE_DEFAULTS,
      )
    })
    mergeThemeDefaults(
      getThemeChartConfig(themeConfig, 'histogram'),
      HISTOGRAM_SHAPE_DEFAULTS,
    )
    mergeThemeDefaults(
      getThemeChartConfig(themeConfig, 'boxPlot'),
      BOXPLOT_SHAPE_DEFAULTS,
    )
    return themeConfig
  }

  function registerBusinessThemes(themeTokensMap) {
    const canRegisterCustomThemes =
      typeof window.VSeed.createTokenThemeConfig === 'function' &&
      typeof window.VSeed.registerCustomTheme === 'function'
    if (canRegisterCustomThemes) {
      Object.entries(themeTokensMap).forEach(([themeName, themeTokens]) => {
        const themeConfig = window.VSeed.createTokenThemeConfig(themeTokens)
        window.VSeed.registerCustomTheme(
          themeName,
          applyMagiShapeDefaults(themeConfig),
        )
      })
      return
    }
    if (typeof window.VSeed.registerTokenThemes !== 'function') {
      throw new Error(
        'VSeed theme registration is not available. Check VSeed runtime.',
      )
    }
    window.VSeed.registerTokenThemes(themeTokensMap)
  }

  function ensureThemesRegistered() {
    if (hasRegisteredThemes) {
      return
    }
    if (!window.VSeed || typeof window.VSeed.registerAll !== 'function') {
      throw new Error(
        'VSeed.registerAll is not available. Check VSeed runtime.',
      )
    }
    window.VSeed.registerAll()
    registerBusinessThemes(resolveBusinessThemeTokens())
    hasRegisteredThemes = true
  }

  function resolveTheme(entry, vseedSpec) {
    const candidateTheme =
      (vseedSpec && vseedSpec.theme) || (entry && entry.theme)
    if (!candidateTheme) {
      return DEFAULT_THEME
    }
    return Object.prototype.hasOwnProperty.call(
      resolveBusinessThemeTokens(),
      candidateTheme,
    )
      ? candidateTheme
      : DEFAULT_THEME
  }

  function getDeps() {
    if (!window.VSeed || !window.VChart || !window.VTable) {
      throw new Error(
        'VSeed, VChart, or VTable is not loaded. Check CDN order.',
      )
    }
    ensureThemesRegistered()

    const {
      Builder,
      isPivotChart,
      isVChart,
      isTable,
      isPivotTable,
      ColorIdEncoding,
    } = window.VSeed
    const { VChart } = window.VChart
    const { ListTable, PivotTable, PivotChart, register } = window.VTable

    if (
      !hasRegisteredChartModule &&
      register &&
      typeof register.chartModule === 'function'
    ) {
      register.chartModule('vchart', VChart)
      hasRegisteredChartModule = true
    }

    return {
      Builder,
      VChart,
      ListTable,
      PivotTable,
      PivotChart,
      isPivotChart,
      isVChart,
      isTable,
      isPivotTable,
      ColorIdEncoding,
    }
  }

  function isInfographicEntry(entry) {
    return entry && entry.renderer === INFOGRAPHIC_RENDERER
  }

  function extractEntrySpec(entry) {
    if (!entry || typeof entry !== 'object') {
      return entry
    }
    return entry.spec || entry
  }

  function resolveVSeedInput(entry, vseedSpec) {
    if (!vseedSpec || typeof vseedSpec !== 'object') {
      return vseedSpec
    }
    return {
      ...vseedSpec,
      theme: resolveTheme(entry, vseedSpec),
    }
  }

  function getThemeTokens(themeName) {
    const themeTokens = resolveBusinessThemeTokens()
    return themeTokens[themeName] || themeTokens[DEFAULT_THEME]
  }

  function hasAnnotationPoint(vseedInput) {
    const annotationPoint = vseedInput && vseedInput.annotationPoint
    if (Array.isArray(annotationPoint)) {
      return annotationPoint.length > 0
    }
    return !!annotationPoint && typeof annotationPoint === 'object'
  }

  function hasAnnotationArea(vseedInput) {
    const annotationArea = vseedInput && vseedInput.annotationArea
    if (Array.isArray(annotationArea)) {
      return annotationArea.length > 0
    }
    return !!annotationArea && typeof annotationArea === 'object'
  }

  function hasConfiguredAnnotation(value) {
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return !!value && typeof value === 'object'
  }

  function hasAnnotationLine(vseedInput) {
    if (
      hasConfiguredAnnotation(
        vseedInput && vseedInput.annotationHorizontalLine,
      ) ||
      hasConfiguredAnnotation(vseedInput && vseedInput.annotationVerticalLine)
    ) {
      return true
    }
    return hasConfiguredAnnotation(
      vseedInput && vseedInput.annotationDifferenceLine,
    )
  }

  function resolveMarkLineAnimation(marker) {
    if (marker && marker.type === 'type-step') {
      return ANNOTATION_DIFFERENCE_MARK_LINE_ANIMATION
    }
    return ANNOTATION_MARK_LINE_ANIMATION
  }

  function resolveAnnotationPointRuntimeHint(runtimeHints, index) {
    const rawHint = Array.isArray(runtimeHints) ? runtimeHints[index] : null
    if (!rawHint || typeof rawHint !== 'object') {
      return DEFAULT_ANNOTATION_POINT_RUNTIME_HINT
    }
    return {
      ...DEFAULT_ANNOTATION_POINT_RUNTIME_HINT,
      ...rawHint,
    }
  }

  function getAnnotationOffsetMagnitude(chartType, density) {
    const magnitudes = ['bar', 'barparallel'].includes(chartType)
      ? BAR_ANNOTATION_POINT_OFFSET_MAGNITUDES
      : DEFAULT_ANNOTATION_POINT_OFFSET_MAGNITUDES
    return magnitudes[density] || magnitudes.normal
  }

  function shouldPatchAnnotationPointMarkPoints(chartType, runtimeHints) {
    if (
      ['line', 'area', 'dualaxis', 'columnparallel', 'barparallel'].includes(
        chartType,
      )
    ) {
      return true
    }
    if (!['column', 'bar'].includes(chartType)) {
      return false
    }
    return Array.isArray(runtimeHints) && runtimeHints.length > 0
  }

  function parseHexColor(color) {
    if (typeof color !== 'string') {
      return null
    }
    const value = color.trim()
    const shortHexMatch = /^#([0-9a-f]{3})$/i.exec(value)
    if (shortHexMatch) {
      const [r, g, b] = shortHexMatch[1].split('')
      return {
        r: Number.parseInt(r + r, 16),
        g: Number.parseInt(g + g, 16),
        b: Number.parseInt(b + b, 16),
      }
    }
    const hexMatch = /^#([0-9a-f]{6})$/i.exec(value)
    if (hexMatch) {
      return {
        r: Number.parseInt(hexMatch[1].slice(0, 2), 16),
        g: Number.parseInt(hexMatch[1].slice(2, 4), 16),
        b: Number.parseInt(hexMatch[1].slice(4, 6), 16),
      }
    }
    const rgbMatch =
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[0-9.]+\s*)?\)$/i.exec(
        value,
      )
    if (rgbMatch) {
      return {
        r: Number.parseInt(rgbMatch[1], 10),
        g: Number.parseInt(rgbMatch[2], 10),
        b: Number.parseInt(rgbMatch[3], 10),
      }
    }
    return null
  }

  function formatHexColor(channels) {
    const toHex = (value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    return `#${toHex(channels.r)}${toHex(channels.g)}${toHex(channels.b)}`
  }

  function formatRgbaColor(channels, alpha) {
    const normalizedAlpha = Math.max(0, Math.min(1, alpha))
    return `rgba(${channels.r}, ${channels.g}, ${channels.b}, ${normalizedAlpha.toFixed(2)})`
  }

  function compositeColor(overlayColor, alpha, backgroundColor) {
    const overlayChannels = parseHexColor(overlayColor)
    const backgroundChannels = parseHexColor(backgroundColor)
    if (!overlayChannels || !backgroundChannels) {
      return overlayColor
    }
    return formatHexColor({
      r: overlayChannels.r * alpha + backgroundChannels.r * (1 - alpha),
      g: overlayChannels.g * alpha + backgroundChannels.g * (1 - alpha),
      b: overlayChannels.b * alpha + backgroundChannels.b * (1 - alpha),
    })
  }

  function resolveAnnotationSeriesColor(
    runtimeHint,
    colorValueMap,
    themeTokens,
  ) {
    const colorId =
      runtimeHint && typeof runtimeHint.colorId === 'string'
        ? runtimeHint.colorId.trim()
        : ''
    if (
      colorId &&
      colorValueMap &&
      typeof colorValueMap[colorId] === 'string' &&
      colorValueMap[colorId].trim()
    ) {
      return colorValueMap[colorId].trim()
    }
    return themeTokens.colorScheme && themeTokens.colorScheme[0]
      ? themeTokens.colorScheme[0]
      : themeTokens.textPrimary
  }

  function resolveAnnotationLabelBackgroundStyle(seriesColor, themeTokens, dx) {
    const colorChannels = parseHexColor(seriesColor)
    if (!colorChannels) {
      return {
        visible: true,
        padding: 4,
        style: {
          dx,
          lineWidth: 1,
          stroke: seriesColor,
          fill: seriesColor,
          cornerRadius: 2,
        },
      }
    }
    const isDarkTheme = themeTokens.baseTheme === 'dark'
    const strokeAlpha = isDarkTheme ? 0.62 : 0.32
    const fillAlpha = isDarkTheme ? 0.24 : 0.14
    const backgroundColor = isDarkTheme
      ? DARK_ANNOTATION_BACKGROUND
      : LIGHT_ANNOTATION_BACKGROUND
    return {
      visible: true,
      padding: 4,
      style: {
        dx,
        lineWidth: 1,
        stroke: formatRgbaColor(colorChannels, strokeAlpha),
        fill: compositeColor(seriesColor, fillAlpha, backgroundColor),
        cornerRadius: 2,
      },
    }
  }

  function patchAnnotationPointMarkPoints(
    vseedInput,
    spec,
    themeTokens,
    runtimeHints,
    colorValueMap,
  ) {
    const chartType = String(
      (vseedInput && vseedInput.chartType) || (spec && spec.chartType) || '',
    ).toLowerCase()
    if (
      !shouldPatchAnnotationPointMarkPoints(chartType, runtimeHints) ||
      !hasAnnotationPoint(vseedInput) ||
      !Array.isArray(spec && spec.markPoint)
    ) {
      return spec
    }

    spec.markPoint = spec.markPoint.map((markPointItem, index) => {
      if (!markPointItem || typeof markPointItem !== 'object') {
        return markPointItem
      }

      const runtimeHint = resolveAnnotationPointRuntimeHint(runtimeHints, index)
      const offsetMagnitude = getAnnotationOffsetMagnitude(
        chartType,
        runtimeHint.density,
      )
      const offsetX =
        runtimeHint.horizontal === 'right'
          ? offsetMagnitude.x
          : -offsetMagnitude.x
      const offsetY =
        runtimeHint.vertical === 'down' ? offsetMagnitude.y : -offsetMagnitude.y
      const textAlign = runtimeHint.horizontal === 'right' ? 'left' : 'right'
      const textBaseline = 'middle'
      const textDx = runtimeHint.horizontal === 'right' ? -6 : 6
      const seriesColor = resolveAnnotationSeriesColor(
        runtimeHint,
        colorValueMap,
        themeTokens,
      )
      const labelBackground = resolveAnnotationLabelBackgroundStyle(
        seriesColor,
        themeTokens,
        textDx,
      )
      const itemContent =
        markPointItem.itemContent &&
          typeof markPointItem.itemContent === 'object'
          ? markPointItem.itemContent
          : {}
      const itemContentStyle =
        itemContent.style && typeof itemContent.style === 'object'
          ? itemContent.style
          : {}
      const itemContentText =
        itemContent.text && typeof itemContent.text === 'object'
          ? itemContent.text
          : {}
      const itemLine =
        markPointItem.itemLine && typeof markPointItem.itemLine === 'object'
          ? markPointItem.itemLine
          : {}
      const startSymbol =
        itemLine.startSymbol && typeof itemLine.startSymbol === 'object'
          ? itemLine.startSymbol
          : {}
      const startSymbolStyle =
        startSymbol.style && typeof startSymbol.style === 'object'
          ? startSymbol.style
          : {}
      const line =
        itemLine.line && typeof itemLine.line === 'object' ? itemLine.line : {}
      const lineStyle =
        line.style && typeof line.style === 'object' ? line.style : {}

      return {
        ...markPointItem,
        itemContent: {
          ...itemContent,
          offsetY,
          offsetX,
          style: {
            ...itemContentStyle,
            dx: textDx,
            dy: 0,
            textBaseline,
            textAlign,
            fill: seriesColor,
            stroke: undefined,
          },
          text: {
            ...itemContentText,
            labelBackground,
          },
        },
        itemLine: {
          ...itemLine,
          visible: true,
          type: 'type-do',
          startSymbol: {
            ...startSymbol,
            visible: runtimeHint.showStartSymbol,
            size: 10,
            style: {
              ...startSymbolStyle,
              fill: seriesColor,
              stroke: themeTokens.surfaceColor,
              lineWidth: 2,
            },
          },
          line: {
            ...line,
            style: {
              ...lineStyle,
              stroke: seriesColor,
            },
          },
        },
      }
    })

    return spec
  }

  function applyDefaultMarkerAnimation(marker, animationConfig) {
    if (!marker || typeof marker !== 'object') {
      return marker
    }
    const nextMarker = { ...marker }
    if (nextMarker.animation == null) {
      nextMarker.animation = { ...animationConfig }
    }
    delete nextMarker.animationAppear
    delete nextMarker.animationEnter
    return nextMarker
  }

  function patchAnnotationMarkerAnimations(vseedInput, spec) {
    if (!spec || typeof spec !== 'object') {
      return spec
    }

    if (hasAnnotationPoint(vseedInput) && Array.isArray(spec.markPoint)) {
      spec.markPoint = spec.markPoint.map((item) =>
        applyDefaultMarkerAnimation(item, ANNOTATION_MARK_POINT_ANIMATION),
      )
    }

    if (hasAnnotationLine(vseedInput) && Array.isArray(spec.markLine)) {
      spec.markLine = spec.markLine.map((item) =>
        applyDefaultMarkerAnimation(item, resolveMarkLineAnimation(item)),
      )
    }

    if (hasAnnotationArea(vseedInput) && Array.isArray(spec.markArea)) {
      spec.markArea = spec.markArea.map((item) =>
        applyDefaultMarkerAnimation(item, ANNOTATION_MARK_AREA_ANIMATION),
      )
    }

    return spec
  }

  function defaultMissingMarkerArrays(spec) {
    if (!spec || typeof spec !== 'object') {
      return spec
    }
    for (const key of ['markPoint', 'markLine', 'markArea']) {
      if (spec[key] == null) {
        spec[key] = []
      }
    }
    return spec
  }

  function emitAfterBuildSpec(chartId, spec, vseedInput, stepIndex) {
    if (typeof window.__VSEED_AFTER_BUILD_SPEC__ !== 'function') {
      return
    }
    try {
      window.__VSEED_AFTER_BUILD_SPEC__({
        chartId,
        spec,
        vseedInput,
        stepIndex: typeof stepIndex === 'number' ? stepIndex : null,
      })
    } catch (error) {
      console.error('[vseed-render] __VSEED_AFTER_BUILD_SPEC__ hook failed', {
        chartId,
        stepIndex: typeof stepIndex === 'number' ? stepIndex : null,
        error,
      })
    }
  }

  function pointStyleDisablesPoints(pointStyle) {
    const styleRules = Array.isArray(pointStyle) ? pointStyle : [pointStyle]
    return styleRules.some(
      (style) =>
        style &&
        typeof style === 'object' &&
        (style.pointVisible === false || style.visible === false),
    )
  }

  function mergeHiddenPoint(point) {
    return {
      ...(point && typeof point === 'object' && !Array.isArray(point)
        ? point
        : {}),
      visible: false,
    }
  }

  function hideVChartSpecPoints(spec) {
    if (spec?.type === 'common' && Array.isArray(spec.series)) {
      spec.series = spec.series.map((series) => ({
        ...series,
        point: mergeHiddenPoint(series && series.point),
      }))
      return
    }

    spec.point = mergeHiddenPoint(spec.point)
  }

  async function buildSpec(vseedInput, runtimeHints, kind) {
    const { Builder } = getDeps()
    const builder = Builder.from(vseedInput)
    await builder.prepare()
    const spec = builder.build()
    const colorValueMap =
      typeof builder.getColorValueMap === 'function'
        ? builder.getColorValueMap()
        : undefined
    patchAnnotationPointMarkPoints(
      vseedInput,
      spec,
      getThemeTokens(vseedInput && vseedInput.theme),
      runtimeHints,
      colorValueMap,
    )
    const res = patchAnnotationMarkerAnimations(vseedInput, spec)
    if (kind === 'vchart') {
      res.animation = true
      if (pointStyleDisablesPoints(vseedInput?.pointStyle)) {
        hideVChartSpecPoints(res)
      }
    }
    return res
  }

  function detectRendererKind(source, deps) {
    if (deps.isPivotChart(source)) return 'pivotChart'
    if (deps.isVChart(source)) return 'vchart'
    if (deps.isTable(source)) return 'listTable'
    if (deps.isPivotTable(source)) return 'pivotTable'
    throw new Error(
      `Unsupported VSeed renderer type: ${JSON.stringify(source)}`,
    )
  }

  function createRendererInstance(kind, container, spec, deps) {
    if (kind === 'vchart') {
      const chart = new deps.VChart(spec, { dom: container })
      chart.renderSync()
      return chart
    }
    if (kind === 'pivotChart') return new deps.PivotChart(container, spec)
    if (kind === 'listTable') return new deps.ListTable(container, spec)
    if (kind === 'pivotTable') return new deps.PivotTable(container, spec)
    throw new Error(`Unknown renderer kind: ${kind}`)
  }

  function attachPivotLegendHandlers(instance, deps) {
    instance.on('legend_item_click', (args) => {
      instance.updateFilterRules([
        {
          filterKey: deps.ColorIdEncoding,
          filteredValues: args.value,
        },
      ])
    })

    instance.on('legend_change', (args) => {
      const maxValue = args.value[1]
      const minValue = args.value[0]
      instance.updateFilterRules([
        {
          filterFunc: (record) => {
            const value = record[record[deps.ColorIdEncoding]]
            return value >= minValue && value <= maxValue
          },
        },
      ])
    })
  }

  function releaseRendererInstance(instance) {
    if (instance && typeof instance.release === 'function') {
      instance.release()
    }
  }

  function mountRenderer(kind, container, spec, deps) {
    const instance = createRendererInstance(kind, container, spec, deps)
    if (kind === 'pivotChart') {
      attachPivotLegendHandlers(instance, deps)
    }
    return instance
  }

  async function renderVSeedChart(containerId, chartId) {
    const entry = window.VSEED_SPEC_MAP && window.VSEED_SPEC_MAP[chartId]
    if (isInfographicEntry(entry)) {
      throw new Error('This Skill supports standard-chart only; regenerate the chart using references/vseed-generation.md.')
    }
    const vseedSpec =
      entry && entry.spec
        ? entry.spec
        : entry && entry.steps
          ? entry.steps[0]
          : entry
    if (!vseedSpec) return null
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(
        `Chart container not found for chartId="${chartId}" and containerId="${containerId}"`,
      )
    }
    const deps = getDeps()
    const vseedInput = resolveVSeedInput(entry, vseedSpec)
    const runtimeHints =
      entry && Array.isArray(entry.annotationPointRuntimeHints)
        ? entry.annotationPointRuntimeHints
        : undefined
    const kind = detectRendererKind(vseedInput, deps)
    const spec = await buildSpec(vseedInput, runtimeHints, kind)
    emitAfterBuildSpec(chartId, spec, vseedInput, null)
    return mountRenderer(kind, container, spec, deps)
  }

  async function renderVSeedScrolly(containerId, chartId, stepIndex) {
    const entry = window.VSEED_SPEC_MAP && window.VSEED_SPEC_MAP[chartId]
    if (isInfographicEntry(entry)) {
      throw new Error(
        `Infographic renderer does not support scrollytelling: ${chartId}`,
      )
    }
    if (!entry || !entry.steps || !entry.steps[stepIndex]) return
    const renderSequence = (SCROLLY_RENDER_SEQUENCE[chartId] || 0) + 1
    SCROLLY_RENDER_SEQUENCE[chartId] = renderSequence
    const deps = getDeps()
    const vseedInput = resolveVSeedInput(entry, entry.steps[stepIndex])
    const runtimeHints =
      entry &&
        Array.isArray(entry.stepAnnotationPointRuntimeHints) &&
        Array.isArray(entry.stepAnnotationPointRuntimeHints[stepIndex])
        ? entry.stepAnnotationPointRuntimeHints[stepIndex]
        : undefined
    const kind = detectRendererKind(vseedInput, deps)
    let spec
    try {
      spec = await buildSpec(vseedInput, runtimeHints, kind)
    } catch (error) {
      if (SCROLLY_RENDER_SEQUENCE[chartId] !== renderSequence) return null
      throw error
    }
    if (SCROLLY_RENDER_SEQUENCE[chartId] !== renderSequence) return null
    if (kind === 'vchart') {
      defaultMissingMarkerArrays(spec)
    }
    emitAfterBuildSpec(chartId, spec, vseedInput, stepIndex)
    const container = document.getElementById(containerId)
    const cached = SCROLLY_CACHE[chartId]

    if (!cached) {
      SCROLLY_CACHE[chartId] = {
        kind,
        instance: mountRenderer(kind, container, spec, deps),
      }
      return
    }

    if (cached.kind === 'vchart' && kind === 'vchart') {
      cached.instance.updateSpec(spec)
      return
    }

    releaseRendererInstance(cached.instance)
    SCROLLY_CACHE[chartId] = {
      kind,
      instance: mountRenderer(kind, container, spec, deps),
    }
  }

  function getChartContainerId(container, chartId) {
    if (!container) {
      return ''
    }
    if (container.id) {
      return container.id
    }
    const safeChartId =
      String(chartId || 'chart')
        .trim()
        .replace(/[^A-Za-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'chart'
    container.id = `chart-${safeChartId}`
    return container.id
  }

  function getScrollyViewportHeight() {
    if (typeof window !== 'undefined' && Number.isFinite(window.innerHeight)) {
      return window.innerHeight
    }
    if (
      typeof document !== 'undefined' &&
      document.documentElement &&
      Number.isFinite(document.documentElement.clientHeight)
    ) {
      return document.documentElement.clientHeight
    }
    return 0
  }

  function resolveViewportStepIndex(steps, fallbackIndex) {
    const viewportHeight = getScrollyViewportHeight()
    if (!viewportHeight) return fallbackIndex
    const anchor = viewportHeight * 0.5
    let bestIndex = null
    let bestScore = Infinity

    steps.forEach((step, index) => {
      if (!step || typeof step.getBoundingClientRect !== 'function') return
      const rect = step.getBoundingClientRect()
      const top = Number(rect && rect.top)
      const bottom = Number(rect && rect.bottom)
      if (!Number.isFinite(top) || !Number.isFinite(bottom)) return
      const midpoint = (top + bottom) / 2
      const visible = bottom >= 0 && top <= viewportHeight
      const score = Math.abs(midpoint - anchor) + (visible ? 0 : viewportHeight)
      if (score < bestScore) {
        bestScore = score
        bestIndex = index
      }
    })

    return bestIndex === null ? fallbackIndex : bestIndex
  }

  function bindScrollySteps(section) {
    const chartId = section.dataset.chartId
    const chartContainer = section.querySelector('.chart-container')
    const steps = Array.from(section.querySelectorAll('.scrolly-step'))
    if (!chartId || !chartContainer || steps.length === 0) return
    const chartContainerId = getChartContainerId(chartContainer, chartId)
    let activeStepIndex = null
    const renderStep = (stepIndex) => {
      if (activeStepIndex === stepIndex) return null
      activeStepIndex = stepIndex
      return renderVSeedScrolly(chartContainerId, chartId, stepIndex).catch(
        (error) => {
          activeStepIndex = null
          throw error
        },
      )
    }
    const renderViewportStep = (fallbackStepIndex) =>
      renderStep(resolveViewportStepIndex(steps, fallbackStepIndex))
    const scrollTrigger =
      (typeof window !== 'undefined' && window.ScrollTrigger) ||
      (typeof globalThis !== 'undefined' ? globalThis.ScrollTrigger : null)
    if (!scrollTrigger || typeof scrollTrigger.create !== 'function') {
      renderStep(0)
      return
    }
    scrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => renderViewportStep(0),
      onEnterBack: () => renderViewportStep(steps.length - 1),
      onUpdate: () =>
        renderViewportStep(activeStepIndex === null ? 0 : activeStepIndex),
    })
  }

  function initVSeedCharts() {
    const renderedCharts = new Set()
    document.querySelectorAll('[data-chart-id]').forEach((el) => {
      const chartId = el.dataset.chartId
      const ancestorWithSameChart =
        el.parentElement && el.parentElement.closest('[data-chart-id]')
      if (
        ancestorWithSameChart &&
        ancestorWithSameChart.dataset.chartId === chartId
      ) {
        return
      }
      if (!chartId || renderedCharts.has(chartId)) {
        return
      }
      if (el.classList.contains('scrolly-section')) {
        bindScrollySteps(el)
        renderedCharts.add(chartId)
        return
      }
      if (el.classList.contains('scroll-scene')) {
        renderedCharts.add(chartId)
        return
      }
      const entry = window.VSEED_SPEC_MAP && window.VSEED_SPEC_MAP[chartId]
      const mappedContainerId = entry && entry.containerId
      const mappedContainer = mappedContainerId
        ? document.getElementById(mappedContainerId)
        : null
      const localContainer = el.querySelector('.chart-container')
      const container = mappedContainer || localContainer
      if (container) {
        const chartContainerId = getChartContainerId(container, chartId)
        renderVSeedChart(chartContainerId, chartId)
        renderedCharts.add(chartId)
      }
    })
  }

  // register.chartModule('vchart', VChart)
  window.renderVSeedChart = renderVSeedChart
  window.renderVSeedScrolly = renderVSeedScrolly
  window.initVSeedCharts = initVSeedCharts
})()
