// Config for the embedded AI Chat Assistant widget.
//
// In production a site owner drops a single async <script> tag with
// data-aca-site and data-aca-base. Here we expose the same two values and
// let them be overridden via environment variables at build/run time:
//
//   NEXT_PUBLIC_ACA_SITE  — the site's public key (pk_...)
//   NEXT_PUBLIC_ACA_BASE  — the backend base URL
//
// Defaults match the values provisioned locally for the Riverside demo.
export const ACA_SITE =
  process.env.NEXT_PUBLIC_ACA_SITE ?? "pk_2d4fffda3ca3c54f679dd0da";

export const ACA_BASE =
  process.env.NEXT_PUBLIC_ACA_BASE ?? "http://localhost:8787";

// Served from /public/widget/aca-widget.js
export const ACA_WIDGET_SRC = "/widget/aca-widget.js";
