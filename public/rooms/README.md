# Drop your room photos here

## Naming convention

Use lowercase, hyphen-separated:

```
duo-1.jpg
duo-2.jpg
duo-3.jpg
amorcito-1.jpg
amorcito-2.jpg
...
```

## Recommended specs

- **Format**: `.jpg` or `.webp`
- **Size**: 1200 x 800 px (3:2) or 1200 x 900 px (4:3)
- **File size**: < 300 KB each (compress at tinypng.com or squoosh.app)
- **Per room**: 2–4 photos minimum

## Per-room checklist

- [ ] Duo — 1, 2, 3
- [ ] Amorcito — 1, 2, 3
- [ ] La Amistad — 1, 2, 3
- [ ] La Rossa — 1, 2, 3
- [ ] El Corazon — 1, 2, 3

## Tips for shoot

- Shoot horizontal (landscape)
- Natural daylight if possible
- Include the table + seating setup (show how it feels)
- Avoid people in frame
- Wipe surfaces first

## After upload

Update the `ROOMS` array in `src/pages/LandingPage.jsx` (around line 13).
Replace `https://images.unsplash.com/...` with `/rooms/duo-1.jpg`, etc.