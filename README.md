# ChurchTools WordPress Calendar Plugin

A modern WordPress plugin for displaying ChurchTools calendar events with a beautiful, responsive interface built with React, TypeScript, and Vite.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with mobile-first approach
- **Date Handling**: date-fns
- **Backend**: WordPress PHP

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- WordPress 5.0+
- ChurchTools account with API access

### Setup

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Activate the plugin** in WordPress admin panel:
   - Go to Plugins → Installed Plugins
   - Find "ChurchTools Calendar"
   - Click "Activate"

5. **Configure the plugin**:
   - Go to Settings → ChurchTools Calendar
   - Enter your ChurchTools API base URL (e.g., `https://your-church.church.tools/api`)
   - Click "Save Settings"

## Usage

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

The same calendar runs on HubSpot as a custom module in `hubspot/churchtools-calendar.module`. The module shows the calendar view only.

1. The built module files `module.js` (the calendar bundle) and `module.css` (styles + themes from `hubspot/themes/`) are committed, so the module folder can be used straight from git. After changing the source or a theme, rebuild and commit them:
   ```bash
   npm run build:hubspot
   ```
2. Upload the module to your HubSpot theme with the [HubSpot CLI](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli):
   ```bash
   hs upload hubspot/churchtools-calendar.module <your-theme>/modules/churchtools-calendar.module
   ```
   Or create a module in Design Manager and paste in `module.html`, `module.css`, `module.js` and the fields from `fields.json`.
3. Add the **ChurchTools-kalenteri** module to a page and fill in:
   - **ChurchTools-osoite**: your instance, e.g. `https://your-church.church.tools`
   - **Kalenterin ID**: a public calendar
   - **Kieli**: automatic (page language), Finnish or English
   - **Lahden vapaaseurakunnan tyyli**: applies `hubspot/themes/lahden-vapaaseurakunta.css`

The calendar is fetched in the visitor's browser, so the ChurchTools API must allow requests from the site's domain (CORS) and the calendar must be visible to anonymous users.

## Development

### Development Mode

Run the development server with hot module replacement:

```bash
npm run dev
```

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Project Structure

```
churchtools-wp-calendar/
├── src/
│   ├── components/          # React components
│   │   ├── CalendarGrid.tsx
│   │   ├── EventList.tsx
│   │   ├── EventItem.tsx
│   │   └── MonthNavigation.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useCalendarState.ts
│   │   ├── useEvents.ts
│   │   └── useResponsive.ts
│   ├── services/            # API services
│   │   └── api.service.ts
│   ├── types/               # TypeScript definitions
│   │   ├── api.types.ts
│   │   └── calendar.types.ts
│   ├── utils/               # Utility functions
│   │   └── date.utils.ts
│   ├── styles/              # SCSS styles
│   │   └── calendar.scss
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── admin/
│   └── settings.php         # WordPress admin settings
├── dist/                    # Compiled assets (generated)
├── churchtools-calendar.php # Main plugin file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Configuration

### API Requirements

The plugin requires:
- ChurchTools instance with API access
- Valid calendar ID
- Accessible `/api/calendars/{calendarId}/appointments` endpoint

### Calendar Grid Features

- **Month Navigation**: Previous/Next month buttons
- **Weekday Headers**: MA, TI, KE, TO, PE, LA, SU (Finnish)
- **Date Selection**: Click any date to view events
- **Event Indicators**: Small dots on dates with events
- **Responsive Layout**: 2-column on desktop, stacked on mobile

### Event Display

Events show:
- Time or "All Day" indicator
- Event title (bold, lime green)
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

See `hubspot/themes/lahden-vapaaseurakunta.css` for a full theme. Spacing, sizing and breakpoints are in `src/styles/calendar.scss`.

### Date Format

UI texts and date locales live in `src/i18n.ts`. To add a language, add an entry with its texts and a `date-fns/locale` locale.

## Troubleshooting

### Calendar not displaying

1. Check that the plugin is activated
2. Verify the API base URL in settings
3. Check browser console for errors
4. Ensure the calendar ID exists in ChurchTools

### API errors

1. Verify ChurchTools URL is correct
2. Check calendar ID is valid
3. Ensure API endpoint is accessible
4. Check for CORS issues
