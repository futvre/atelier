# ZOE ATELIER — Complete storefront

This version preserves the original premium layout, including:
- Hero / Objects with a soul.
- Collections / product categories
- Product collection and filters
- Our Story
- 3D Print Studio
- Grouped cart with + / - quantities
- In-site checkout form
- BOX NOW locker field
- Automatic owner email + customer confirmation email via Resend

## Product photos
Add WebP files under:
public/products/

Expected filenames:
sculpt-01.webp
arc-candle.webp
relief-02.webp
pebble-bowl.webp
sculpt-02.webp
twin-arc.webp
relief-03.webp
stone-tray.webp
category-vases.webp
category-candles.webp
category-wall-art.webp
category-bowls.webp

If a product WebP is missing, the page shows the built-in placeholder sculpture instead.

## Vercel environment variables
RESEND_API_KEY=...
ORDER_EMAIL=your-business-email@example.com
RESEND_FROM_EMAIL=ZOE ATELIER <orders@your-verified-domain.com>

The FROM address/domain must be verified in Resend for production sending.
