# Quick Start

ChurchTools Calendar runs as a WordPress plugin and as a HubSpot CMS module. Both use the same calendar from `src/`.

## WordPress

1. **Get the plugin zip**: download `churchtools-calendar-wordpress-<version>.zip` from the latest `wordpress-v*` GitHub Release, or build it:
   ```bash
   npm install
   npm run build:wordpress
   ```
   This writes `release/churchtools-calendar-wordpress-<version>.zip`.

2. **Install in WordPress**:
   Go to Plugins → Add New → Upload Plugin, upload the zip and activate **ChurchTools Calendar**.

3. **Configure settings**:
   - Go to Settings → ChurchTools Calendar
   - Enter your ChurchTools API base URL (e.g., `https://your-church.church.tools/api`)
   - Save settings

4. **Use the shortcode**:
   Add this to any page or post:
   ```
   [churchtools_calendar id="1"]
   ```
   Replace `1` with your ChurchTools calendar ID.

## HubSpot CMS

1. **Get the module**: download `churchtools-calendar-hubspot-<version>.zip` from the latest `hubspot-v*` GitHub Release, or use `platforms/hubspot/churchtools-calendar.module` from git (the built files are committed).

2. **Upload it** to your HubSpot theme:
   ```bash
   hs upload platforms/hubspot/churchtools-calendar.module <your-theme>/modules/churchtools-calendar.module
   ```

3. **Add the ChurchTools-kalenteri module** to a page and fill in the ChurchTools address and calendar ID.

## Development

### Development with HTML file:
```bash
npm run dev
```

Then open your browser to `http://localhost:5173` (or the URL shown in terminal).

The development HTML file (`index.html`) provides:
- Live settings configuration
- Hot module replacement
- Development tips and console commands
- No WordPress or HubSpot required for testing

### Watch mode (with hot reload):
```bash
npm run dev
```

### Production build:
```bash
npm run build
```

### After making changes:
Rebuild the platform you are testing:
```bash
npm run build:wordpress
npm run build:hubspot
```
For HubSpot, commit the updated `module.js` / `module.css`.

## Files Generated

After building, you'll find in `dist/`:
- `churchtools-calendar.iife.js` - Main JavaScript bundle
- `churchtools-calendar.css` - Compiled styles

The platform builds package these into `release/`. See "Building" and "Releasing" in the README.

## Troubleshooting

### Build errors
```bash
# Clean and reinstall
rm -rf node_modules
npm install
npm run build
```

### Calendar not showing
1. Check browser console for errors
2. Verify the ChurchTools URL (WordPress plugin settings or the HubSpot module field)
3. Confirm calendar ID is correct
4. On WordPress, check that the shortcode is properly formatted

### Styling issues
Edit `src/styles/calendar.scss` and rebuild.

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom hooks
├── services/       # API service
├── styles/         # SCSS styles
├── types/          # TypeScript types
├── utils/          # Utility functions
├── App.tsx         # Main component
└── main.tsx        # Entry point
```

Platform files are in `platforms/wordpress/` and `platforms/hubspot/`. See "Project Structure" in the README for the full layout.

## Next Steps

1. Test the calendar on your site
2. Theme it with the `--ct-*` CSS custom properties (see "Styling" in the README)
3. Adjust date formats in `src/utils/date.utils.ts`
4. Add more features as needed
