# Riverside Family Clinic — Next.js

The Riverside Family Clinic demo site, converted from the plain HTML/CSS version
to a **Next.js 14 App Router** app (TypeScript). It's a fictional clinic site
used to showcase the embedded **AI Chat Assistant** widget.

## Structure

```
riverside-family-clinic-next/
  app/
    layout.tsx          Root layout: header, footer, widget, metadata, favicon
    globals.css         Site styles (unchanged from the static site)
    page.tsx            Home (hero, services, doctors, hours, FAQ, contact)
    departments/        Clinical departments
    doctors/            Find a Doctor
      page.tsx          Server shell (hero + CTA + metadata)
      DoctorDirectory.tsx  Client component: specialty filter + provider cards
    services/           Services & Pricing
    locations/          Locations, hours & insurance
  components/
    Header.tsx          Sticky nav; highlights the active route
    Footer.tsx          Site footer
    AcaWidget.tsx       Loads the assistant widget via next/script
  lib/
    widget-config.ts    Site key + backend URL (env-overridable)
  public/
    widget/aca-widget.js  The built assistant widget bundle
```

## How the embed works

`components/AcaWidget.tsx` renders the production-style embed — a single async
script with `data-aca-site` and `data-aca-base`. The widget's loader reads those
attributes and mounts into an isolated Shadow DOM.

Override the defaults with environment variables (e.g. in `.env.local`):

```
NEXT_PUBLIC_ACA_SITE=pk_xxxxxxxxxxxx
NEXT_PUBLIC_ACA_BASE=http://localhost:8787
```

Defaults match the values provisioned locally for this demo
(`pk_2d4fffda3ca3c54f679dd0da`, `http://localhost:8787`).

> The widget only renders when the assistant backend is reachable; with no
> backend it aborts mounting (look for an `[ACA]` error in the browser console).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

This is a fictional business. Phone numbers, addresses, and emails are
placeholders.
