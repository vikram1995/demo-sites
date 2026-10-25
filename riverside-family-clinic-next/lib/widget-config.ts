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
  process.env.NEXT_PUBLIC_ACA_SITE ?? "pk_dd0c4437e142aee81ac9034d";

export const ACA_BASE =
  process.env.NEXT_PUBLIC_ACA_BASE ?? "https://ai-chat-assistant-uefa.onrender.com";

// Where the <script> loads the widget bundle from. Defaults to the deployed
// widget host so the demo always runs the latest published build, exactly like
// a customer embed. Override with NEXT_PUBLIC_ACA_WIDGET_SRC (e.g.
// http://localhost:5173/aca-widget.js for a local widget build).
export const ACA_WIDGET_SRC =
  process.env.NEXT_PUBLIC_ACA_WIDGET_SRC ??
  "https://ai-chat-assistant-neon-five.vercel.app/aca-widget.js";
