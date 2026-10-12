# Quick Start Guide

## Installation

1. **Build the plugin zip**:
   ```bash
   npm install
   npm run build:wordpress
   ```
   This writes `release/churchtools-calendar-wordpress-<version>.zip`. Or download the zip from the latest `wordpress-v*` GitHub Release.

2. **Install in WordPress**:
   Go to Plugins → Add New → Upload Plugin and upload the zip.

3. **Activate the plugin**:
   - Go to WordPress Admin → Plugins
   - Find "ChurchTools Calendar"
   - Click "Activate"

4. **Configure settings**:
   - Go to Settings → ChurchTools Calendar
   - Enter your ChurchTools API base URL (e.g., `https://your-church.church.tools/api`)
   - Save settings

5. **Use the shortcode**:
   Add this to any page or post:
   ```
   [churchtools_calendar id="1"]
   ```
   Replace `1` with your ChurchTools calendar ID.

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
- No WordPress required for testing

### Watch mode (with hot reload):
```bash
npm run dev
```

### Production build:
```bash
npm run build
```

### After making changes:
Rebuild and reinstall the zip before testing in WordPress:
```bash
npm run build:wordpress
```

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
2. Verify API URL in plugin settings
3. Confirm calendar ID is correct
4. Check that shortcode is properly formatted

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

## Next Steps

1. Test the calendar on your WordPress site
2. Customize colors in `src/styles/calendar.scss`
3. Adjust date formats in `src/utils/date.utils.ts`
4. Add more features as needed
