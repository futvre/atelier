# ZOE ATELIER — in-site order form

Checkout does not open the customer's email app. The customer fills the form and presses Submit.
The server sends two emails through Resend: one to the shop owner and one confirmation to the customer.
Repeated items are grouped automatically (for example, Arc Candle × 3).

## Vercel Environment Variables
- RESEND_API_KEY
- ORDER_EMAIL
- RESEND_FROM_EMAIL (must be a verified sender/domain in Resend)

Redeploy after adding/changing environment variables.
