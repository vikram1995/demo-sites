# Demo Sites

A collection of static demo websites used to showcase and test the AI Chat
Assistant widget. Each demo lives in its own subfolder so it can be hosted
independently (e.g. as a separate Vercel project pointed at that subdirectory).

## Sites

| Folder | Description |
| --- | --- |
| [`riverside-family-clinic`](./riverside-family-clinic) | Fictional healthcare clinic demo. |

## Adding a new demo

1. Create a new subfolder (e.g. `my-new-demo/`).
2. Add the static site files inside it.
3. On Vercel, create a new project from this repo and set the **Root Directory**
   to that subfolder.

## Hosting on Vercel

Each subfolder is a plain static site (no build step). When creating the Vercel
project, set the project's **Root Directory** to the demo's subfolder and use
the default static output — no build command needed.
