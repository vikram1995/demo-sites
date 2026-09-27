/*
 * Demo harness glue for embedding the AI chat assistant widget.
 *
 * In production a site owner drops a single async <script> tag with
 * data-aca-site and data-aca-base. Here we do the same thing, but we let
 * the values be overridden at runtime (stored in localStorage) via the
 * "Configure widget" button, so you can point the demo at whatever site
 * key + backend URL your local stack is running without editing files.
 */
(function () {
  "use strict";

  // Provisioned locally for the Riverside Family Clinic demo site.
  // Hard-coded so the widget always mounts against this site key regardless of
  // any value previously stored via the "Configure widget" button.
  var DEFAULT_SITE = "pk_2d4fffda3ca3c54f679dd0da";
  var DEFAULT_BASE = "http://localhost:8787";
  var WIDGET_SRC = "widget/aca-widget.js";

  function getConfig() {
    // Always use the hard-coded values; ignore localStorage overrides.
    return {
      site: DEFAULT_SITE,
      base: DEFAULT_BASE,
    };
  }

  function reflectConfigLabels(cfg) {
    var siteLabel = document.getElementById("cfgSiteLabel");
    var baseLabel = document.getElementById("cfgBaseLabel");
    if (siteLabel) siteLabel.textContent = cfg.site;
    if (baseLabel) baseLabel.textContent = cfg.base;
  }

  function mountWidget(cfg) {
    // Inject the production-style embed snippet. The widget's loader reads
    // these data-* attributes and auto-mounts into an isolated Shadow DOM.
    var s = document.createElement("script");
    s.async = true;
    s.src = WIDGET_SRC;
    s.setAttribute("data-aca-site", cfg.site);
    s.setAttribute("data-aca-base", cfg.base);
    s.addEventListener("error", function () {
      console.error(
        "[demo] Failed to load the widget bundle at " +
          WIDGET_SRC +
          ". Make sure demo-website/widget/aca-widget.js exists."
      );
    });
    document.body.appendChild(s);
  }

  function wireConfigButton() {
    var btn = document.getElementById("cfgBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cfg = getConfig();
      var site = window.prompt(
        "Assistant site public key (data-aca-site).\n\n" +
          "Create a site in the dashboard/owner API to get a real pk_… key.",
        cfg.site
      );
      if (site === null) return; // cancelled
      var base = window.prompt(
        "Backend base URL (data-aca-base).\n\n" +
          "Your running backend, e.g. http://localhost:8787",
        cfg.base
      );
      if (base === null) return;

      localStorage.setItem("aca_site", site.trim() || DEFAULT_SITE);
      localStorage.setItem("aca_base", base.trim() || DEFAULT_BASE);
      // Reload so the widget re-mounts with the new config.
      window.location.reload();
    });
  }

  function boot() {
    var cfg = getConfig();
    reflectConfigLabels(cfg);
    wireConfigButton();
    mountWidget(cfg);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
