# Story Plan
## Story Meta
- **Style Preset**: Swiss Modern
- **presentation_mode**: editorial
## Chapter Outline
### Ch1
- **Pattern**: chart-narrative
- **Evidence**:
  - refs: [`trend`]
- **Charts**:
  - `trend-chart`
    - role: primary
    - dataRef: `trend`
    - renderer: standard-chart
    - chartType: line
    - dimensions:
      - id: month
        encoding: xAxis
        alias: 月份
    - measures:
      - id: rate
        encoding: yAxis
        alias: 比率
        numformat: 转成百分比，保留一位小数
    - annotationList:
      - type: point
        target:
          month: Jun
          measureId: rate
        text: 转折点

## Assets
### Story Visual Identity
theme_subject: synthetic retention observations
visual_language: restrained editorial
recurring_motifs: none
avoid: decorative noise
### Asset Registry
