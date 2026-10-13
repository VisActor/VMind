# Vintage Editorial

**Vibe:** Witty, confident, editorial, personality-driven

**Layout:** Centered content on cream. Abstract geometric shapes as accent.

**Typography (system font stacks):**
- Display: `"Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif`
- Body: `"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

**CSS Variables (complete set):**
```css
:root {
    --page-bg: #FFF1E5;
    --surface: rgba(255, 255, 255, 0.88);
    --surface-strong: #FFFFFF;
    --text-primary: #2F2F2F;
    --text-secondary: #6B6B6B;
    --accent: #9E2F50;
    --accent-soft: rgba(158, 47, 80, 0.10);
    --border: rgba(234, 223, 215, 0.6);
    --font-display: "Times New Roman", Georgia, "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
    --component-radius-sm: 0px;
    --component-radius-md: 3px;
    --component-radius-lg: 3px;
    --component-surface-neutral: var(--surface);
    --component-surface-raised: var(--surface-strong);
    --component-surface-accent: color-mix(in srgb, var(--surface) 90%, var(--accent-soft) 10%);
    --component-surface-action: color-mix(in srgb, var(--surface-strong) 92%, var(--accent-soft) 8%);
    --component-shadow-card: none;
    --component-shadow-card-hover: 0 3px 0 rgba(158, 47, 80, 0.14);
    --component-shadow-elevated: 0 10px 24px rgba(47, 47, 47, 0.12);
    --component-border: 1px solid rgba(158, 47, 80, 0.18);
    --type-heading-weight: 700;
    --type-heading-tracking: 0;
    --type-metric-weight: 700;
    --section-bar-width: 3px;
    --highlight-border-width: 3px;
}
```

**Chart Color Schema:**
```json
{
  "chartColorSchema": {
    "categorical": ["#9E2F50", "#007A70", "#4B79C2", "#E68A00", "#705F84", "#2E7D6F", "#C45833", "#6B7B8D"],
    "linearColor": ["#E4BEC9", "#9E2F50"]
  }
}
```

**Page Background (copy to body rule):**
```css
body {
    background:
        radial-gradient(ellipse at 30% 0%, rgba(158,47,80,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 100%, rgba(0,122,112,0.03) 0%, transparent 50%),
        var(--page-bg);
}
```

**Signature Elements:**
- Abstract geometric shapes (circle outline + line + dot)
- Bold bordered CTA boxes
- Witty, conversational copy style
- **No illustrations—only geometric CSS shapes**
