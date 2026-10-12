# ListView Feature - Usage Guide

## Overview

The ListView feature displays ChurchTools calendar events in a chronological list format, perfect for upcoming events displays, TV screens, and information boards.

The list view is available in the WordPress plugin. The HubSpot module shows the calendar view only.

## Basic Usage

### WordPress Shortcode

```
[churchtools_calendar id="1" view="list"]
```

## Query Parameters

Customize the ListView by adding URL parameters to the page:

### 1. Days to Display
Control how many days ahead to show events:
```
?days=7     # Show 7 days (default)
?days=14    # Show 2 weeks
?days=30    # Show 1 month
?days=3     # Show 3 days
```
**Range:** 1-365 days

### 2. Text Scale
Adjust text size for different display scenarios:
```
?scale=1.0  # Normal size (default)
?scale=1.5  # 50% larger
?scale=2.0  # Double size (great for TV displays)
?scale=2.5  # 2.5x size
?scale=0.8  # Smaller text
```
**Range:** 0.5-5.0

### 3. Disable Features
Hide specific elements using comma-separated values:
```
?disable=description          # Hide descriptions, events not expandable
?disable=location             # Hide address/location
?disable=link                 # Hide external links
?disable=description,location # Hide multiple features
```

**Available disable options:**
- `description` - Hides event descriptions and disables expand/collapse
- `location` - Hides address/location information
- `link` - Hides external links
- `today` - Hides today's events (shows only future days)

## Use Case Examples

### Example 1: Church TV Display
Large text, minimal interaction, 5 days ahead:
```
yoursite.com/events/?scale=2.5&days=5&disable=description,location,link
```

### Example 2: Info Kiosk
Medium text, interactive, 7 days:
```
yoursite.com/events/?scale=1.5&days=7
```

### Example 3: Website Events Page
Normal text, full features, 14 days:
```
yoursite.com/events/?days=14
```

### Example 4: Lobby Display
Large text, hide descriptions only:
```
yoursite.com/events/?scale=2&days=7&disable=description
```

### Example 5: Weekly Overview
Minimal info, just times and titles:
```
yoursite.com/events/?days=7&disable=description,location,link
```

## Features

### Always Displayed:
- ✅ Date headers (grouped by day)
- ✅ Event time (or "All Day" indicator)
- ✅ Event title (with calendar color)
- ✅ Event count badge per day

### Conditionally Displayed:
- 📝 Event descriptions (expandable, unless disabled)
- 📍 Location/address (unless disabled)
- 🔗 External links (unless disabled)
- 🖼️ **Images are NOT shown in ListView** (by design)

## Styling

The ListView maintains the same Scandinavian minimal design:
- Lime green accent color (#b4d336)
- Clean typography
- Responsive layout
- Matches calendar view styles

## Comparison: Calendar View vs List View

| Feature | Calendar View | List View |
|---------|--------------|-----------|
| Layout | Monthly grid | Chronological list |
| Time Range | One month | Configurable days |
| Event Images | ✅ Shown | ❌ Hidden |
| Navigation | Month buttons | None (auto range) |
| Best For | Overview, specific dates | Upcoming events, displays |
| Text Scaling | Fixed | Configurable |
| Interactivity | Full | Configurable |

## Technical Notes

- Query parameters are read from the URL when the page loads
- Changing parameters requires page reload
- All parameters are optional with sensible defaults
- Invalid values fall back to defaults
- ListView uses the same API endpoints as calendar view
- Events are automatically sorted chronologically
- Only days with events are shown
