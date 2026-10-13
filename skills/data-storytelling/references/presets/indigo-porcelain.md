# Indigo Porcelain

**Vibe:** Cool, rigorous, research-driven, quietly technical

**Typography (system font stacks):**
- Display: `"Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif`
- Body: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #F3F6F8;
    --surface: rgba(255, 255, 255, 0.90);
    --surface-strong: #FFFFFF;
    --text-primary: #0A1F3D;
    --text-secondary: #53616F;
    --accent: #1F5E8C;
    --accent-soft: rgba(31, 94, 140, 0.10);
    --border: rgba(10, 31, 61, 0.12);
    --font-display: "Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
    --component-radius-sm: 2px;
    --component-radius-md: 4px;
    --component-radius-lg: 4px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 92%, var(--accent-soft) 8%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 94%, var(--accent-soft) 6%);
    --component-shadow-card: none;
    --component-shadow-card-hover: 0 3px 0 rgba(10, 31, 61, 0.10);
    --component-shadow-elevated: 0 10px 28px rgba(10, 31, 61, 0.14);
    --component-border: 1px solid rgba(10, 31, 61, 0.16);
    --type-heading-weight: 700;
    --type-heading-tracking: 0;
    --type-metric-weight: 750;
    --section-bar-width: 2px;
    --highlight-border-width: 2px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#1F5E8C", "#3D8C86", "#C28B44", "#6A7FB8", "#8A5F7D", "#4F7A5B", "#9A6B3F", "#68798A"],
    "linearColor": ["#BFD7EA", "#1F5E8C"]
  }
}
```

**Page Background (copy to body rule):**
```css
body {
    background:
        radial-gradient(ellipse at 22% 0%, rgba(31, 94, 140, 0.055) 0%, transparent 54%),
        radial-gradient(ellipse at 86% 100%, rgba(54, 130, 121, 0.045) 0%, transparent 52%),
        var(--page-bg);
}
```

**Signature:** Porcelain-white field, deep indigo headings, thin research-journal rules, schematic linework, restrained cobalt and teal accents
