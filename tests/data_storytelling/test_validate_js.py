from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[2]
VALIDATE_JS = REPO_DIR / "skills" / "data-storytelling" / "scripts" / "validate_js.py"


def load_validate_js_module():
    spec = importlib.util.spec_from_file_location("validate_js_module", VALIDATE_JS)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Failed to load module from {VALIDATE_JS}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class ValidateJsTest(unittest.TestCase):
    def test_accepts_single_character_quote_literals(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <body>
    <script>
      const closers = new Set([
        '"',
        "'"
      ]);
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "quote-literals.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed)
        self.assertEqual(errors, [])

    def test_requires_vtable_for_shared_vseed_runtime_shells(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
  </head>
  <body>
    <section>
      <div class="chart-wrapper" data-chart-id="demo-chart">
        <div class="chart-container" id="chart-demo-chart"></div>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {};
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "shared-vseed-runtime.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("@visactor/vtable" in error for error in errors))

    def test_allows_shared_vseed_runtime_shell_without_chart_mounts(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
  </head>
  <body>
    <section>
      <h1>无图表故事页</h1>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {};
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "no-chart-vseed-shell.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed, errors)

    def test_requires_vtable_for_legacy_const_vseed_spec_map_shells(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
  </head>
  <body>
    <section>
      <div class="chart-wrapper" data-chart-id="legacy-chart">
        <div class="chart-container" id="chart-legacy-chart"></div>
      </div>
    </section>
    <script>
      const VSEED_SPEC_MAP = {};
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "legacy-const-vseed-runtime.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("@visactor/vtable" in error for error in errors))

    def test_rejects_unsupported_infographic_spec_map_entries(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
  </head>
  <body>
    <section>
      <div class="chart-wrapper" data-chart-id="info-chart">
        <div class="chart-container" id="chart-info-chart"></div>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "info-chart": { "renderer": "infographic", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "infographic-runtime.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("standard-chart" in error for error in errors))

    def test_rejects_html_chart_container_without_id(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
  </head>
  <body>
    <section>
      <div class="chart-wrapper" data-chart-id="demo-chart">
        <div class="chart-container"></div>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "chart-container-missing-id.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("chart-container 缺少 id" in error for error in errors), errors)

    def test_rejects_duplicate_data_chart_id_on_html_chart_container(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
  </head>
  <body>
    <section>
      <div class="chart-wrapper" data-chart-id="demo-chart">
        <div class="chart-container" id="chart-demo-chart" data-chart-id="demo-chart"></div>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      initVSeedCharts();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "chart-container-duplicate-chart-id.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(
            any("chart-container 不要重复挂 data-chart-id" in error for error in errors), errors
        )

    def test_rejects_scrolly_section_without_root_chart_id(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
  </head>
  <body>
    <section class="scrolly-section" data-pattern="scrollytelling">
      <div class="scrolly-chart">
        <div class="chart-wrapper" data-chart-id="demo-chart">
          <div class="chart-container scrolly" id="chart-demo-chart"></div>
        </div>
      </div>
      <div class="scrolly-steps">
        <article class="scrolly-step is-active" data-step="0">Start</article>
        <article class="scrolly-step" data-step="1">Next</article>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      function initStoryMotion() {}
      initVSeedCharts();
      initStoryMotion();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "scrolly-section-missing-root-chart-id.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(
            any("scrolly-section 缺少 data-chart-id" in error for error in errors), errors
        )

    def test_rejects_scrolly_chart_container_without_scrolly_modifier(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
  </head>
  <body>
    <section class="scrolly-section" data-pattern="scrollytelling" data-chart-id="demo-chart">
      <div class="scrolly-chart">
        <div class="chart-wrapper" data-chart-id="demo-chart">
          <div class="chart-container" id="chart-demo-chart"></div>
        </div>
      </div>
      <div class="scrolly-steps">
        <article class="scrolly-step is-active" data-step="0">Start</article>
        <article class="scrolly-step" data-step="1">Next</article>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      function initStoryMotion() {}
      initVSeedCharts();
      initStoryMotion();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "scrolly-section-missing-container-modifier.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(
            any("chart-container 必须追加 .scrolly" in error for error in errors), errors
        )

    def test_rejects_scrolly_section_without_scrolly_chart_column(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
  </head>
  <body>
    <section class="scrolly-section" data-pattern="scrollytelling" data-chart-id="demo-chart">
      <div class="scrolly-figure">
        <div class="chart-wrapper" data-chart-id="demo-chart">
          <div class="chart-container scrolly" id="chart-demo-chart"></div>
        </div>
      </div>
      <div class="scrolly-steps">
        <article class="scrolly-step is-active" data-step="0">Start</article>
        <article class="scrolly-step" data-step="1">Next</article>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      function initStoryMotion() {}
      initVSeedCharts();
      initStoryMotion();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "scrolly-section-missing-chart-column.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("必须包含 1 个 .scrolly-chart" in error for error in errors), errors)

    def test_rejects_scrolly_steps_not_zero_based(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js"></script>
    <script src="https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js"></script>
    <script src="https://unpkg.com/@visactor/vtable@1.26.8/dist/vtable.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="https://unpkg.com/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
  </head>
  <body>
    <section class="scrolly-section" data-pattern="scrollytelling" data-chart-id="demo-chart">
      <div class="scrolly-chart">
        <div class="chart-wrapper" data-chart-id="demo-chart">
          <div class="chart-container scrolly" id="chart-demo-chart"></div>
        </div>
      </div>
      <div class="scrolly-steps">
        <article class="scrolly-step is-active" data-step="1">Start</article>
        <article class="scrolly-step" data-step="2">Next</article>
      </div>
    </section>
    <script>
      window.VSEED_SPEC_MAP = {
        "demo-chart": { "renderer": "standard-chart", "spec": { "chartType": "bar" } }
      };
      function initVSeedCharts() {}
      function initStoryMotion() {}
      initVSeedCharts();
      initStoryMotion();
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "scrolly-section-one-based-steps.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("data-step 必须从 0 开始连续递增" in error for error in errors), errors)
        self.assertTrue(
            any('初始 active step 必须是 data-step="0"' in error for error in errors), errors
        )

    def test_reports_really_unclosed_strings(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <body>
    <script>
      const broken = 'oops;
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "broken-string.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertFalse(passed)
        self.assertTrue(any("未闭合" in error for error in errors))

    def test_ignores_non_javascript_inline_script_blocks(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <head>
    <script type="application/json">
      {"headline": "JSON data is not executable JavaScript"}
    </script>
    <script type="importmap">
      {"imports": {"demo": "/demo.js"}}
    </script>
  </head>
  <body>
    <script>
      const ok = true;
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "typed-inline-scripts.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed, errors)

    def test_ignores_quotes_inside_trailing_line_comments(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <body>
    <script>
      const value = 1; // don't flag this quote: '
      const label = "safe";
    </script>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "line-comment-quotes.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed)
        self.assertEqual(errors, [])

    def test_allows_width_rules_on_shared_layout_selectors_in_final_html(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <head>
    <style>
      .section-intro {
        max-width: 62ch;
      }
    </style>
  </head>
  <body>
    <p class="section-intro">Intro</p>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "protected-layout-override.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed)
        self.assertEqual(errors, [])

    def test_allows_max_width_on_non_protected_helper_selector(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <head>
    <style>
      .hero-image-credit {
        max-width: 24ch;
      }
    </style>
  </head>
  <body>
    <p class="hero-image-credit">Credit</p>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "custom-helper-style.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed)
        self.assertEqual(errors, [])

    def test_allows_css_tokens_with_inline_fallback_values(self):
        module = load_validate_js_module()
        html = """<!DOCTYPE html>
<html>
  <head>
    <style>
      .animate-on-scroll {
        transition-delay: calc(var(--stagger, 0) * 80ms);
      }
    </style>
  </head>
  <body>
    <div class="animate-on-scroll">Demo</div>
  </body>
</html>
"""
        with tempfile.TemporaryDirectory() as tmpdir:
            html_path = Path(tmpdir) / "token-fallback.html"
            html_path.write_text(html, encoding="utf-8")

            passed, errors = module.validate_html_scripts(html_path)

        self.assertTrue(passed)
        self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
