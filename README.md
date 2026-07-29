# 101 Mobility Ramp Quote Calculator

Upload these four files to the root of your GitHub repository:

- `index.html`
- `style.css`
- `script.js`
- `101-mobility-logo.svg`

## GitHub Pages

In the repository, go to:

**Settings -> Pages -> Deploy from a branch -> main -> /(root)**

## Default admin PIN

`1010`

Change the PIN in the calculator's Admin Settings.

## Admin Settings

Tap the gear icon, or tap the title five times. Settings are stored only in that particular browser/device.

## PDF behavior

The PDF includes:

- Customer information
- Mobility Consultant
- Ramp measurements
- Selected quote option
- Itemized pricing
- 50% deposit amount (editable in Admin Settings)
- Remaining balance
- Customer approval wording
- Signature, printed-name, date and Mobility Consultant lines

The PDF library loads from a CDN, so an internet connection is required when generating a PDF.


## Version 3 update

- Customer information, Mobility Consultant, quote number, and notes are optional.
- The PDF shows New, Used, and Rental options together.
- Each option has a checkbox so the customer can mark the preferred choice.
- The option selected in the calculator is pre-marked on the PDF.
- Ramp measurements are still needed because they generate the prices.


## Version 4

- Uses the actual 101 Mobility logo in the application and generated PDF.
- Removes the Quote Number field.
- Generates a compact one-page PDF.
- Shows New, Used, and Rental pricing side-by-side.
- Shows the 50% deposit amount for every option.
- Adds an optional digital signature pad for finger, stylus, mouse, or trackpad.
- Includes optional printed name and approval date fields.


## Version 4.1 PDF reliability fix

- Embeds the 101 Mobility logo directly in the script.
- Removes the separate logo-loading request during PDF generation.
- Displays a visible error if the browser cannot generate the PDF.


## Version 4.2

- Restores one green deposit box for only the option selected in the calculator.
- Places the official logo on a white background so the full navy-and-green logo is visible.
- Restores the full ramp configuration wording:
  - 5 x 5 Platforms
  - 5 x 4 Platforms
  - 4 x 4 Platforms


## Version 5
- Adds Aluminum Threshold, Rubber Threshold, and Suitcase Ramp product selectors.
- Supports multiple models and quantities in each category.
- Adds purchase and rental prices from the 2026 pricing workbook.
- Rubber threshold ramps remain purchase-only and are included at 50% in the rental quote deposit, with the remaining 50% shown as balance.
- Selected products appear in the PDF.


## Version 5.1

- Corrects the rental PDF breakdown so aluminum threshold and suitcase ramps are not displayed twice.
- The first-three-months modular-ramp line now excludes accessory rentals.
- Aluminum threshold and suitcase ramps appear only under Additional Products at their rental rates.
- Rubber threshold ramps remain purchase items on rental quotes.
