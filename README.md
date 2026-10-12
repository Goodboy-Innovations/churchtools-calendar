# ChurchTools Calendar

Displays ChurchTools calendar events with a responsive interface built with React, TypeScript and Vite. One shared calendar is released for two platforms:

| Platform | Folder | Release |
|---|---|---|
| WordPress plugin | `platforms/wordpress/` | `churchtools-calendar-wordpress-<version>.zip` |
| HubSpot CMS module | `platforms/hubspot/` | `churchtools-calendar-hubspot-<version>.zip`, and the module folder in git |

Each platform has its own version in `versions.json` and is released separately. Releases are on the [GitHub Releases](https://github.com/Goodboy-Innovations/churchtools-calendar/releases) page.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with mobile-first approach
- **Date Handling**: date-fns
- **Platforms**: WordPress (PHP), HubSpot CMS (HubL module)

## WordPress

### Requirements

- WordPress 5.0+
- ChurchTools account with API access

### Installation

1. **Download** `churchtools-calendar-wordpress-<version>.zip` from the latest `wordpress-v*` release.
2. **Upload** it in WordPress: Plugins → Add New → Upload Plugin, then activate **ChurchTools Calendar**.
3. **Configure the plugin**:
   - Go to Settings → ChurchTools Calendar
   - Enter your ChurchTools API base URL (e.g., `https://your-church.church.tools/api`)
   - Click "Save Settings"

To build the zip yourself, run `npm install` and `npm run build:wordpress`. The zip is written to `release/`.

## WordPress Usage

### Shortcode

Display the calendar on any page or post using the shortcode:

```
[churchtools_calendar id="1"]
```

Replace `"1"` with your ChurchTools calendar ID.

### List View

Display upcoming events in a chronological list format:

```
[churchtools_calendar id="1" view="list"]
```

#### List View Query Parameters

Customize the list view using URL query parameters:

- **`?days=7`** - Number of days to show (default: 7, range: 1-365)
  - Example: `?days=14` shows events for the next 2 weeks

- **`?scale=1.5`** - Scale text size (default: 1.0, range: 0.5-5.0)
  - Example: `?scale=2` doubles the text size (great for TV displays)

- **`?disable=description,location,link,today`** - Disable features (comma-separated)
  - `description` - Hides descriptions and makes events non-expandable
  - `location` - Hides location/address information
  - `link` - Hides external links
  - `today` - Hides today's events (shows only future days)

#### List View Examples

```
# Basic list view (7 days, all features enabled)
yoursite.com/events/

# Large text for TV display
yoursite.com/events/?scale=2&days=5&disable=description,location,link

# Info board with minimal details
yoursite.com/events/?scale=1.5&disable=description,location

# Two weeks with all details
yoursite.com/events/?days=14
```

### Language

The UI is available in Finnish (`fi`, default) and English (`en`):

```
[churchtools_calendar id="1" lang="en"]
```

Without `lang`, the page language (`<html lang="...">`) is used.

### Multiple Calendars

You can display multiple calendars on the same site by using different calendar IDs:

```
[churchtools_calendar id="1"]
[churchtools_calendar id="2"]
```

## HubSpot CMS

The same calendar runs on HubSpot as a custom module in `platforms/hubspot/churchtools-calendar.module`. The module shows the calendar view only.

1. Get the module. Either:
   - download `churchtools-calendar-hubspot-<version>.zip` from the latest `hubspot-v*` release, or
   - use `platforms/hubspot/churchtools-calendar.module` straight from git. The built `module.js` (the calendar bundle) and `module.css` (its styles) are committed, and their first line shows the module version.
2. Upload the module to your HubSpot theme with the [HubSpot CLI](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli):
   ```bash
   hs upload platforms/hubspot/churchtools-calendar.module <your-theme>/modules/churchtools-calendar.module
   ```
   Or create a module in Design Manager and paste in `module.html`, `module.css`, `module.js` and the fields from `fields.json`.
3. Add the **ChurchTools-kalenteri** module to a page and fill in:
   - **ChurchTools-osoite**: your instance, e.g. `https://your-church.church.tools`
   - **Kalenterin ID**: a public calendar
   - **Kieli**: automatic (page language), Finnish or English
   - **CSS-luokka** (optional): an extra class on the calendar container, for scoping a site theme (see [Styling](#styling))

The calendar is fetched in the visitor's browser, so the ChurchTools API must allow requests from the site's domain (CORS) and the calendar must be visible to anonymous users.

## Development

### Development Mode

Run the development server with hot module replacement:

```bash
npm run dev
```

### Building

`npm run build` builds the shared calendar bundle into `dist/`. The platform scripts build it and then package one platform into `release/`:

| Command | Output |
|---|---|
| `npm run build:wordpress` | `release/churchtools-calendar-wordpress-<version>.zip` |
| `npm run build:hubspot` | `release/churchtools-calendar-hubspot-<version>.zip`, and updates the committed `module.js` / `module.css` |
| `npm run build:all` | Both |

After changing `src/` or the HubSpot module, run `npm run build:hubspot` and commit the module files. CI fails if they are out of date.

### Releasing

Release each platform on its own:

```bash
npm run release:wordpress -- patch
npm run release:hubspot -- minor
```

The argument is `patch`, `minor`, `major` or an exact version like `2.0.0`. The script needs a clean working tree. It bumps the version in `versions.json` (and the WordPress plugin header), builds the platform, commits, and tags `wordpress-v<version>` or `hubspot-v<version>`. Push the tag to publish:

```bash
git push origin HEAD wordpress-v1.2.0
```

The `Release` workflow then builds the zip and publishes it as a GitHub Release.

### Project Structure

```
churchtools-calendar/
├── src/                          # Shared calendar (React + TypeScript)
│   ├── components/
│   ├── hooks/
│   ├── services/api.service.ts   # ChurchTools API
│   ├── styles/calendar.scss
│   ├── i18n.ts                   # FI / EN texts
│   └── main.tsx                  # window.ChurchToolsCalendar.init()
├── platforms/
│   ├── wordpress/
│   │   ├── churchtools-calendar.php  # Main plugin file, shortcode
│   │   └── admin/settings.php        # Admin settings page
│   └── hubspot/
│       └── churchtools-calendar.module/  # HubSpot module (module.js / module.css generated)
├── scripts/
│   ├── package.mjs               # Package a platform from dist/
│   ├── release.mjs               # Bump version, build, commit, tag
│   └── platforms/                # One file per platform
├── .github/workflows/            # CI and Release
├── versions.json                 # Release version of each platform
├── dist/                         # Shared bundle (generated)
└── release/                      # Release zips (generated)
```

To add a platform, add a folder under `platforms/`, a script in `scripts/platforms/` and register it in `scripts/platforms/index.mjs`. Every platform loads the same bundle and calls `window.ChurchToolsCalendar.init(containerId, baseUrl, calendarId, view, language)`.


## Configuration

### API Requirements

On both platforms the calendar requires:
- ChurchTools instance with API access
- Valid calendar ID, visible to anonymous users
- Accessible `/api/calendars/{calendarId}/appointments` endpoint
- CORS on the ChurchTools side that allows requests from the site's domain, since events are fetched in the visitor's browser

### Calendar Grid Features

- **Month Navigation**: Previous/Next month buttons
- **Weekday Headers**: MA, TI, KE, TO, PE, LA, SU (Finnish)
- **Date Selection**: Click any date to view events
- **Event Indicators**: Small dots on dates with events
- **Responsive Layout**: 2-column on desktop, stacked on mobile

### Event Display

Events show:
- Time or "All Day" indicator
- Event title (bold, in the ChurchTools calendar's color)
- Expandable details on click
- Description
- Location (if available)
- Event image (if available)

## Customization

### Styling

Colors and fonts are CSS custom properties, so a site can theme the calendar without rebuilding:

```css
.churchtools-calendar {
    --ct-font: "Your Font", sans-serif;
    --ct-text: #2c3e50;
    --ct-text-muted: #5d6465;
    --ct-heading: var(--ct-text);
    --ct-accent: #b4d336;
    --ct-today: var(--ct-accent);
    --ct-selected-bg: var(--ct-accent);
    --ct-selected-text: #ffffff;
    --ct-indicator: var(--ct-text-muted);
    --ct-border: #e9ecef;
    --ct-bg-hover: #f8f9fa;
}
```

Put a site's theme in the site's own stylesheet, not in this repo. To keep it from affecting other calendars, or to win over the module's own styles, scope it to a class and enter that class in the HubSpot module's **CSS-luokka** field (on WordPress, wrap the shortcode in an element with the class):

```css
.ct-theme-my-site .churchtools-calendar {
    --ct-font: "Site Font", sans-serif;
    --ct-accent: #2563eb;
}
```

Spacing, sizing and breakpoints are in `src/styles/calendar.scss`.

### Date Format

UI texts and date locales live in `src/i18n.ts`. To add a language, add an entry with its texts and a `date-fns/locale` locale.

## Troubleshooting

### Calendar not displaying

1. WordPress: check that the plugin is activated and the API base URL is set in Settings → ChurchTools Calendar. HubSpot: check the module's **ChurchTools-osoite** and **Kalenterin ID** fields
2. Check browser console for errors
3. Ensure the calendar ID exists in ChurchTools

### API errors

1. Verify ChurchTools URL is correct
2. Check calendar ID is valid
3. Ensure API endpoint is accessible
4. Check for CORS issues
