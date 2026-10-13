# Pudding Neon

**Vibe:** High-contrast, vibrant, bold, modern. Inspired by [The Pudding](https://pudding.cool/). Neon accents on deep dark background, instantly eye-catching. Great for pop culture, bold opinions, or any story that needs visual punch.

**Layout:** Full dark background. Content directly on dark surface, no card containers. Sections separated by spacing and subtle dividers.

**Typography (system font stacks):**
- Display: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
- Body: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #1A1A1A;
    --surface: #2C2C2C;
    --surface-strong: #333333;
    --text-primary: #F2F2F2;
    --text-secondary: #A6A6A6;
    --accent: #F9D75A;
    --accent-soft: rgba(249, 215, 90, 0.15);
    --border: #444444;
    --component-radius-sm: 6px;
    --component-radius-md: 10px;
    --component-radius-lg: 14px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 82%, var(--accent-soft) 18%);
    --component-surface-action: linear-gradient(180deg, color-mix(in srgb, var(--surface-strong) 88%, var(--accent-soft) 12%), var(--surface));
    --component-shadow-card: 0 0 0 1px rgba(249, 215, 90, 0.08), 0 12px 30px rgba(0, 0, 0, 0.28);
    --component-shadow-card-hover: 0 0 0 1px rgba(249, 215, 90, 0.18), 0 18px 42px rgba(0, 0, 0, 0.36);
    --component-shadow-elevated: 0 0 0 1px rgba(249, 215, 90, 0.22), 0 28px 60px rgba(0, 0, 0, 0.42);
    --component-border: 1px solid rgba(249, 215, 90, 0.18);
    --type-heading-weight: 800;
    --type-heading-tracking: 0;
    --type-metric-weight: 800;
    --section-bar-width: 5px;
    --highlight-border-width: 5px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#F9D75A", "#FF6B6B", "#4ECDC4", "#A08BFF", "#FF9770", "#8EEB94", "#6A9BFF", "#E85D9A"],
    "linearColor": ["#4ECDC4", "#F9D75A"]
  }
}
```

**Page Background (copy to body rule):**
```css
body {
    background:
        radial-gradient(ellipse at 50% 0%, rgba(249, 215, 90, 0.03) 0%, transparent 60%),
        var(--page-bg);
}
```

**Signature Elements:**
- Bold, large typography with generous letter-spacing for headings
- Neon accent color (`--accent`) for key data callouts and highlights
- Subtle surface cards (`--surface`) for chart containers, with thin border
- High contrast: light text on dark background, vibrant chart colors pop naturally
