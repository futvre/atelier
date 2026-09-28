# ZOE ATELIER

Next.js + Tailwind storefront prototype for Vercel.

## Checkout
This version intentionally does NOT use Stripe.
Customers fill in the checkout form and the site creates a pre-filled order email containing:
- Customer name
- Phone
- Email
- BOX NOW locker / area
- Products and quantities
- Total
- Notes

Set the Vercel environment variable:
`NEXT_PUBLIC_ORDER_EMAIL=your@email.com`

The customer's email client opens with the order ready to send.

## Deploy
Push the repository to GitHub and import it into Vercel. Keep the framework as Next.js.
