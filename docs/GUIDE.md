# User Guide

This guide shows how to put your ChurchTools calendar on your church website. No coding is needed. It takes about 15 minutes.

1. [Prepare ChurchTools](#1-prepare-churchtools) (both platforms)
2. Install on your website: [WordPress](#2a-wordpress) or [HubSpot](#2b-hubspot)
3. [Change the look](#3-change-the-look) (optional)

If something doesn't work, see [Troubleshooting](#troubleshooting).

---

## 1. Prepare ChurchTools

You need a ChurchTools administrator for these steps.

### Make the calendar public

The calendar is shown to website visitors who are not logged in to ChurchTools, so it must be public. In ChurchTools, open **Calendar**, edit the calendar you want to show and make it public.

Only public calendars can be shown. Private appointments stay private.

### Find the calendar ID

Every ChurchTools calendar has a number, its ID. To find it, log in to ChurchTools and open this address in the same browser (use your own ChurchTools address):

```
https://your-church.church.tools/api/calendars
```

The page lists your calendars. Find your calendar's `"name"` and the `"id"` number right before it. Write the number down.

### Allow your website to read the calendar

The calendar is loaded in the visitor's browser, directly from ChurchTools. ChurchTools only allows this for websites you list.

1. In ChurchTools, go to **System settings → Integrations → Cross-Origin Resource Sharing**.
2. Add your website's address to **Access Control Allow Origins**:
   - Start with `https://`.
   - **No slash at the end**: `https://www.example.org`, not `https://www.example.org/`.
   - No page path: `https://www.example.org`, not `https://www.example.org/events`.
   - `example.org` and `www.example.org` are different addresses. Add both if your site works with both.
3. Save.

On HubSpot, also add the addresses HubSpot uses for editing and previewing pages. See [HubSpot addresses](#hubspot-addresses-for-churchtools).

---

## 2a. WordPress

### Install

1. Download `churchtools-calendar-wordpress-<version>.zip` from the latest [WordPress release](https://github.com/Goodboy-Innovations/churchtools-calendar/releases). Don't unzip it.
2. In WordPress, go to **Plugins → Add New → Upload Plugin**, choose the zip and click **Install Now**.
3. Click **Activate**.
4. Go to **Settings → ChurchTools Calendar**, enter your ChurchTools address (for example `https://your-church.church.tools`) and click **Save Settings**.

### Add the calendar to a page

Add this shortcode to any page or post. Replace `1` with your calendar ID:

```
[churchtools_calendar id="1"]
```

Shortcode options:

| Option | What it does | Example |
|---|---|---|
| `id` | Calendar ID (required) | `id="3"` |
| `view` | `calendar` (month grid, default) or `list` (upcoming events) | `view="list"` |
| `lang` | `fi` or `en`. Without it, the page language is used | `lang="en"` |

To show several calendars, add one shortcode for each.

### List view for screens and info boards

`view="list"` shows upcoming events as a list. You can adjust it by adding options to the **page address** (not the shortcode):

| Address option | What it does | Default |
|---|---|---|
| `?days=14` | How many days ahead to show (1–365) | 7 |
| `?scale=2` | Text size, e.g. `2` = double size for a TV (0.5–5) | 1 |
| `?disable=description,location,link,today` | Hide descriptions, addresses, links or today's events. Pick any, separated by commas | nothing hidden |

Examples:

```
https://www.example.org/events/?days=14
https://www.example.org/events/?scale=2.5&days=5&disable=description,location,link
```

The list view shows no event images.

### Update

Download the new zip and upload it the same way. WordPress asks whether to replace the current version: choose **Replace current with uploaded**. Your settings are kept.

---

## 2b. HubSpot

HubSpot does not accept modules as a zip upload, so the module is uploaded with HubSpot's free command-line tool. You do this once, and again for each update.

### Install

1. Install [Node.js](https://nodejs.org) (the LTS version) if you don't have it.
2. Download `churchtools-calendar-hubspot-<version>.zip` from the latest [HubSpot release](https://github.com/Goodboy-Innovations/churchtools-calendar/releases) and unzip it. You get a folder called `churchtools-calendar.module`.
3. Open a terminal (on Windows: PowerShell) in the folder that contains `churchtools-calendar.module`.
4. Install the HubSpot CLI:
   ```bash
   npm install -g @hubspot/cli
   ```
5. Connect it to your HubSpot account. It opens HubSpot, where you create a personal access key and paste it into the terminal:
   ```bash
   hs account auth
   ```
6. Upload the module:
   ```bash
   hs cms upload churchtools-calendar.module churchtools/churchtools-calendar.module
   ```

The module is now in **Design Manager** under `churchtools`.

### Add the calendar to a page

1. Edit a page and add the module **ChurchTools-kalenteri**.
2. Fill in the module settings:

   | Setting | What to enter |
   |---|---|
   | **ChurchTools-osoite** | Your ChurchTools address, e.g. `https://your-church.church.tools` |
   | **Kalenterin ID** | Your calendar ID |
   | **Kieli** | Language: *Automaattinen* (page language), *Suomi* or *English* |
   | **CSS-luokka** | Optional. See [Change the look](#3-change-the-look) |
   | **Oma CSS** | Optional. See [Change the look](#3-change-the-look) |

3. Publish the page.

The HubSpot module shows the month calendar. The list view is only available on WordPress.

### HubSpot addresses for ChurchTools

Add these to the ChurchTools CORS list ([see above](#allow-your-website-to-read-the-calendar)) so the calendar also loads in the HubSpot editor and in previews. Replace `12345678` with your HubSpot account number (shown by `hs account auth`, or in HubSpot under your account name) and use your own region (`eu1` or `na1`):

```
https://app-eu1.hubspot.com
https://12345678.hs-sites-eu1.com
https://12345678.hubspotpreview-eu1.com
```

Then add your own website address too, for example `https://www.example.org`.

### Update

Download and unzip the new release and run the same `hs cms upload` command again. Pages using the module are updated automatically.

---

## 3. Change the look

The calendar uses your website's font automatically. The colors can be changed.

**WordPress:** add CSS in **Appearance → Customize → Additional CSS**.
**HubSpot:** write CSS in the module's **Oma CSS** field. It shows an example you can copy.

Copy this and change the colors you want. You can delete the lines you don't need:

```css
.churchtools-calendar-container .churchtools-calendar {
  --ct-text: #003F5F;         /* text */
  --ct-heading: #003F5F;      /* headings and arrow buttons */
  --ct-accent: #0090A9;       /* highlights and links */
  --ct-today: #0090A9;        /* today */
  --ct-selected-bg: #003F5F;  /* selected day */
  --ct-indicator: #0090A9;    /* event dot under a day */
  --ct-border: #DFDBD2;       /* borders */
}
```

The color of each event title comes from the calendar's color in ChurchTools. Change it there.

**Different looks for different calendars (HubSpot):** write a class name in **CSS-luokka**, for example `youth`, and start the CSS with that class:

```css
.youth .churchtools-calendar {
  --ct-accent: #e67e22;
}
```

---

## Troubleshooting

**"Please configure the ChurchTools API base URL" (WordPress) or "Lisää ChurchTools-osoite" (HubSpot)**
The ChurchTools address is missing. Enter it in the plugin settings or the module settings.

**The calendar stays empty or shows an error**
1. Check the ChurchTools address: it starts with `https://` and is the address you use to log in.
2. Check the calendar ID ([how to find it](#find-the-calendar-id)).
3. Check that the calendar is [public](#make-the-calendar-public).
4. Check the [CORS list](#allow-your-website-to-read-the-calendar): the exact website address, with `https://`, without a slash at the end. On HubSpot, also the [HubSpot addresses](#hubspot-addresses-for-churchtools).

To see the exact error: right-click the page, choose **Inspect** and open the **Console** tab. A message mentioning *CORS* or *Access-Control-Allow-Origin* means the website address is missing from the ChurchTools CORS list.

**The calendar works on the live site but not in the HubSpot editor (or the other way around)**
The editor, the preview and the live site have different addresses. All of them must be in the CORS list.

**The calendar is in the wrong language**
Set the language explicitly: `lang="en"` in the WordPress shortcode, or **Kieli** in the HubSpot module. The calendar is available in Finnish and English. On pages in other languages it uses Finnish.

**HubSpot upload fails**
Make sure the terminal is in the folder that contains `churchtools-calendar.module`, and that `hs account auth` was completed. Older guides use `hs upload`; current versions of the CLI use `hs cms upload`.

Still stuck? [Open an issue](https://github.com/Goodboy-Innovations/churchtools-calendar/issues) and describe what you see.
