# Contributing

Thanks for helping! Bug reports, fixes, translations and new platforms are all welcome. For bigger changes, open an issue first so we can agree on the approach.

## Setup

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

`npm run dev` opens a test page (`index.html`) where you can enter a ChurchTools address and calendar ID and see the calendar with hot reload. No WordPress or HubSpot needed.

## How the repo is organised

One calendar, built once, packaged for each platform:

```
churchtools-calendar/
├── src/                          # The calendar (React + TypeScript), shared by all platforms
│   ├── components/
│   ├── hooks/
│   ├── services/api.service.ts   # ChurchTools API
│   ├── styles/calendar.scss      # Core styles, colors as --ct-* variables
│   ├── i18n.ts                   # UI texts (fi, en)
│   └── main.tsx                  # window.ChurchToolsCalendar.init()
├── platforms/
│   ├── wordpress/
│   │   ├── churchtools-calendar.php  # Plugin file, shortcode
│   │   └── admin/settings.php        # Settings page
│   └── hubspot/
│       ├── churchtools-calendar.module/  # HubSpot module (module.js / module.css are generated)
│       └── theme.css                     # Default HubSpot theme, bundled into module.css
├── scripts/
│   ├── package.mjs               # Package a platform from dist/
│   ├── release.mjs               # Bump version, build, commit, tag
│   └── platforms/                # One file per platform
├── docs/GUIDE.md                 # User guide
├── versions.json                 # Release version of each platform
├── dist/                         # Shared bundle (generated)
└── release/                      # Release zips (generated)
```

Every platform loads the same bundle and calls:

```js
window.ChurchToolsCalendar.init(containerId, baseUrl, calendarId, view, language)
```

The calendar fetches `/api/calendars/{calendarId}/appointments` from ChurchTools in the visitor's browser.

## Building

| Command | Output |
|---|---|
| `npm run build` | Shared bundle in `dist/` |
| `npm run build:wordpress` | `release/churchtools-calendar-wordpress-<version>.zip` |
| `npm run build:hubspot` | `release/churchtools-calendar-hubspot-<version>.zip`, and updates the committed `module.js` / `module.css` |
| `npm run build:all` | Both |

**If you change `src/`, `platforms/hubspot/` or the build scripts, run `npm run build:hubspot` and commit the updated `module.js` / `module.css`.** They are committed so the module can be used straight from git. CI fails if they are out of date.

## Common changes

- **Add a language:** add an entry to `src/i18n.ts` with the texts and a `date-fns/locale` locale, then add it to the `language` choices in `platforms/hubspot/churchtools-calendar.module/fields.json`.
- **Styles:** colors and fonts are `--ct-*` variables in `src/styles/calendar.scss`. Keep new colors as variables so sites can override them.
- **Add a platform:** add a folder under `platforms/`, a script in `scripts/platforms/` (see the comment in `scripts/platforms/index.mjs`) and a version in `versions.json`.
- **Docs:** user-facing changes go in `docs/GUIDE.md`, written for church staff, not developers.

## Pull requests

- Keep each PR to one topic.
- Run `npm run build:all` before pushing. It must pass, and CI runs it too.
- Describe what you changed and how you tested it (e.g. in the dev page, on a WordPress or HubSpot site).
- Don't bump versions or create tags. Maintainers do that when releasing.

## Releasing (maintainers)

Each platform is released on its own:

```bash
npm run release:wordpress -- patch
npm run release:hubspot -- minor
```

The argument is `patch`, `minor`, `major` or an exact version like `2.0.0`. The script needs a clean working tree. It bumps `versions.json` (and the WordPress plugin header), builds, commits and tags `wordpress-v<version>` or `hubspot-v<version>`. Push the tag:

```bash
git push origin HEAD wordpress-v1.2.0
```

The Release workflow builds the zip and publishes a GitHub Release.
