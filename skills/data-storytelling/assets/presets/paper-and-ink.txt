# Paper & Ink

**Vibe:** Editorial, literary, thoughtful

**Typography (system font stacks):**
- Display: `"Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif`
- Body: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #faf9f7;
    --surface: rgba(255, 253, 250, 0.88);
    --surface-strong: #fffdf9;
    --text-primary: #1a1a1a;
    --text-secondary: #5e564c;
    --accent: #C41E3A;
    --accent-soft: rgba(196, 30, 58, 0.08);
    --border: rgba(26, 26, 26, 0.1);
    --font-display: "Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
    --component-radius-sm: 0px;
    --component-radius-md: 2px;
    --component-radius-lg: 2px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 94%, var(--accent-soft) 6%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 96%, var(--accent-soft) 4%);
    --component-shadow-card: none;
    --component-shadow-card-hover: none;
    --component-shadow-elevated: none;
    --component-border: 1px solid rgba(26, 26, 26, 0.16);
    --type-heading-weight: 700;
    --type-heading-tracking: 0;
    --type-metric-weight: 700;
    --section-bar-width: 2px;
    --highlight-border-width: 2px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#C41E3A", "#4E8AF8", "#50C878", "#E68A00", "#8B6194", "#2E6B5A", "#D4763A", "#4A6FA5"],
    "linearColor": ["#F6C2CB", "#C41E3A"]
  }
}
```

**Signature:** Drop caps, pull quotes, elegant horizontal rules
