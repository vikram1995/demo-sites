import Script from "next/script";
import { ACA_SITE, ACA_BASE, ACA_WIDGET_SRC } from "@/lib/widget-config";

/**
 * Embeds the AI Chat Assistant widget the same way a production site owner
 * would: a single async script tag with data-aca-site and data-aca-base.
 *
 * The widget's loader reads these data-* attributes and auto-mounts into an
 * isolated Shadow DOM. With no backend reachable the widget simply aborts
 * mounting (check the browser console for an `[ACA]` error).
 */
export default function AcaWidget() {
  return (
    <Script
      src={ACA_WIDGET_SRC}
      strategy="afterInteractive"
      data-aca-site={ACA_SITE}
      data-aca-base={ACA_BASE}
    />
  );
}
