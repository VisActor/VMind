# Swiss Modern

**Vibe:** Clean, precise, Bauhaus-inspired

**Typography (system font stacks):** `"Helvetica Neue", Helvetica, "Inter", Arial, "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #ffffff;
    --surface: rgba(245, 245, 245, 0.88);
    --surface-strong: #f5f5f5;
    --text-primary: #121212;
    --text-secondary: #666666;
    --accent: #D64D4D;
    --accent-soft: rgba(214, 77, 77, 0.08);
    --border: rgba(0, 0, 0, 0.12);
    --font-display: "Helvetica Neue", Helvetica, "Inter", Arial, "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    --component-radius-sm: 0px;
    --component-radius-md: 2px;
    --component-radius-lg: 4px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 88%, var(--accent-soft) 12%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 92%, var(--accent-soft) 8%);
    --component-shadow-card: none;
    --component-shadow-card-hover: 0 2px 0 rgba(0, 0, 0, 0.12);
    --component-shadow-elevated: 0 8px 0 rgba(0, 0, 0, 0.10);
    --component-border: 1px solid rgba(0, 0, 0, 0.16);
    --type-heading-weight: 700;
    --type-heading-tracking: 0;
    --type-metric-weight: 800;
    --section-bar-width: 4px;
    --highlight-border-width: 3px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#D64D4D", "#4A78A8", "#F28E2B", "#59A14F", "#B6992D", "#AF7AA1", "#8C8C8C", "#FF6B4A"],
    "linearColor": ["#F3C8C8", "#D64D4D"]
  }
}
```

**Signature:** Visible grid, asymmetric layouts, geometric shapes
