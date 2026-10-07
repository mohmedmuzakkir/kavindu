# Senavirathne Ayurweda Treatment Center — Static Website

A responsive, one-page premium Ayurveda website built from the supplied approved visual reference and official logo.

## Open locally

1. Extract the ZIP.
2. Open `index.html` in any modern browser.
3. No build step and no framework are required.

## Main files

- `index.html` — all page sections and content
- `css/style.css` — complete responsive brand/design system
- `js/main.js` — slider, menu, scroll reveals, lightbox, validation and configurable WhatsApp handoff
- `assets/logo/senavirathne-logo.png` — official supplied logo (unaltered)
- `assets/images/` — optimized local visual assets derived from the supplied approved design reference

## Configure WhatsApp

Open `js/main.js` and replace:

```js
const WHATSAPP_NUMBER = '';
```

with the official business number in international digits-only format, for example:

```js
const WHATSAPP_NUMBER = '9477XXXXXXX';
```

Do not use a sample number in production.

## Replace contact placeholders

Search `index.html` for text inside square brackets, for example:

- `[Add official address here]`
- `[Add official phone number]`
- `[Add official WhatsApp number]`
- `[Add official opening hours]`

Replace them with verified business details.

## Booking form

The form currently performs client-side validation only. If `WHATSAPP_NUMBER` is configured, a valid form can open a pre-filled WhatsApp message. For a true appointment system, connect the form to your preferred backend or booking service.

## Accessibility / performance included

- Semantic HTML
- Keyboard focus states
- Accessible hero controls
- Swipe on mobile
- Reduced-motion support
- Lazy loading below the fold
- Responsive desktop/tablet/mobile layouts
- Mobile safe-area-aware floating appointment actions
- No external framework or runtime dependency

## Medical wording note

The copy is written as wellness-focused language and avoids guaranteed cure claims. Review all treatment descriptions with the business/qualified practitioner before publication.
