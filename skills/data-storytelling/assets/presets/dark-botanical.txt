# Dark Botanical

**Vibe:** Elegant, sophisticated, artistic, premium

**Layout:** Centered content on dark. Abstract soft shapes in corner.

**Typography (system font stacks):**
- Display: `"Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif`
- Body: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #121820;
    --surface: rgba(30, 37, 45, 0.88);
    --surface-strong: #1e252d;
    --text-primary: #DEDCCA;
    --text-secondary: #9E9C8D;
    --accent: #F0A868;
    --accent-soft: rgba(240, 168, 104, 0.12);
    --border: rgba(222, 220, 202, 0.1);
    --font-display: "Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
    --component-radius-sm: 6px;
    --component-radius-md: 10px;
    --component-radius-lg: 14px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 86%, var(--accent-soft) 14%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 90%, var(--accent-soft) 10%);
    --component-shadow-card: none;
    --component-shadow-card-hover: 0 10px 30px rgba(0, 0, 0, 0.28);
    --component-shadow-elevated: 0 18px 44px rgba(0, 0, 0, 0.34);
    --component-border: 1px solid rgba(222, 220, 202, 0.16);
    --type-heading-weight: 600;
    --type-heading-tracking: 0;
    --type-metric-weight: 700;
    --section-bar-width: 2px;
    --highlight-border-width: 3px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#F0A868", "#7BAA9A", "#D97C7C", "#8FB3C7", "#B9A888", "#9A8FBC", "#82A370", "#E8C46A"],
    "linearColor": ["#7BAA9A", "#F0A868"]
  }
}
```

**Page Background (copy to body rule):**
```css
body {
    background:
        radial-gradient(ellipse at 20% 0%, rgba(240,168,104,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(123,170,154,0.05) 0%, transparent 50%),
        var(--page-bg);
}
```

**Signature Elements:**
- Abstract soft gradient circles (blurred, overlapping)
- Warm color accents (amber, teal, rose)
- Thin vertical accent lines
- Italic signature typography
- **No illustrations—only abstract CSS shapes**
