# Warm Earth

**Vibe:** Warm, soft, modern, approachable

**Layout:** Clean content on warm off-white. Subtle earthy accents.

**Typography (system font stacks):**
- Display: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
- Body: same as display

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #FAF9F7;
    --surface: rgba(255, 255, 255, 0.88);
    --surface-strong: #FFFFFF;
    --text-primary: #2D2A26;
    --text-secondary: #7A746B;
    --accent: #e29e86;
    --accent-soft: rgba(226, 158, 134, 0.12);
    --border: rgba(45, 42, 38, 0.10);
    --component-radius-sm: 8px;
    --component-radius-md: 12px;
    --component-radius-lg: 16px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 88%, var(--accent-soft) 12%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 90%, var(--accent-soft) 10%);
    --component-shadow-card: 0 6px 18px rgba(45, 42, 38, 0.08);
    --component-shadow-card-hover: 0 10px 28px rgba(45, 42, 38, 0.12);
    --component-shadow-elevated: 0 18px 44px rgba(45, 42, 38, 0.16);
    --component-border: 1px solid rgba(45, 42, 38, 0.10);
    --type-heading-weight: 700;
    --type-heading-tracking: 0;
    --type-metric-weight: 700;
    --section-bar-width: 3px;
    --highlight-border-width: 4px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#E29E86", "#BCD2CA", "#EBCECF", "#6A9BCC", "#D1BCD2", "#C4A882", "#8BAFAB", "#B8937A"],
    "linearColor": ["#F1DDD6", "#E29E86"]
  }
}
```

**Page Background (copy to body rule):**
```css
body {
    background:
        radial-gradient(ellipse at 30% 0%, rgba(226, 158, 134, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 100%, rgba(188, 210, 202, 0.05) 0%, transparent 50%),
        var(--page-bg);
}
```

**Signature Elements:**
- Warm terracotta accent lines and borders
- Soft rounded cards with minimal shadow
- Earthy, muted color palette throughout
- Clean sans-serif typography with generous whitespace
