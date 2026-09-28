import { NextResponse } from "next/server";

type OrderItem = { id: number; name: string; price: number; quantity: number };
type OrderPayload = {
  customer: { name: string; phone: string; email: string; area: string; locker: string; notes?: string };
  items: OrderItem[];
};

const OWNER_EMAIL = process.env.ORDER_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY || !OWNER_EMAIL || !FROM_EMAIL) {
      return NextResponse.json({ error: "Το email service δεν έχει ρυθμιστεί ακόμη στο Vercel." }, { status: 500 });
    }
    const body = (await req.json()) as OrderPayload;
    const customer = body.customer;
    const items = body.items;
    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.email?.trim() || !customer?.area?.trim() || !customer?.locker?.trim()) {
      return NextResponse.json({ error: "Συμπλήρωσε όλα τα υποχρεωτικά πεδία." }, { status: 400 });
    }
    if (!isValidEmail(customer.email)) return NextResponse.json({ error: "Το email του πελάτη δεν είναι έγκυρο." }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Το καλάθι είναι άδειο." }, { status: 400 });

    const normalizedItems = items.map(item => ({
      id: item.id,
      name: String(item.name),
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
      price: Number(item.price)
    }));
    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `ZOE-${Date.now().toString().slice(-8)}`;
    const itemRows = normalizedItems.map(item => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)} × ${item.quantity}</td><td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;">${(item.price * item.quantity).toFixed(2)}€</td></tr>`).join("");

    const ownerHtml = `<div style="font-family:Arial,sans-serif;color:#292722;max-width:640px;margin:auto"><h2 style="font-weight:400;letter-spacing:2px">ZOE ATELIER</h2><p>Νέα παραγγελία <strong>${orderId}</strong></p><table style="width:100%;border-collapse:collapse">${itemRows}</table><p style="font-size:18px"><strong>Σύνολο προϊόντων: ${total.toFixed(2)}€</strong></p><p><strong>Αποστολή:</strong> BOX NOW</p><p><strong>Πελάτης:</strong> ${escapeHtml(customer.name)}</p><p><strong>Τηλέφωνο:</strong> ${escapeHtml(customer.phone)}</p><p><strong>Email:</strong> ${escapeHtml(customer.email)}</p><p><strong>Περιοχή:</strong> ${escapeHtml(customer.area)}</p><p><strong>Locker:</strong> ${escapeHtml(customer.locker)}</p>${customer.notes ? `<p><strong>Σημειώσεις:</strong> ${escapeHtml(customer.notes)}</p>` : ""}</div>`;
    const customerHtml = `<div style="font-family:Arial,sans-serif;color:#292722;max-width:640px;margin:auto"><h2 style="font-weight:400;letter-spacing:2px">ZOE ATELIER</h2><h3 style="font-weight:400">Λάβαμε την παραγγελία σου ✦</h3><p>Ευχαριστούμε, ${escapeHtml(customer.name)}. Η παραγγελία σου <strong>${orderId}</strong> καταχωρήθηκε.</p><table style="width:100%;border-collapse:collapse">${itemRows}</table><p style="font-size:18px"><strong>Σύνολο προϊόντων: ${total.toFixed(2)}€</strong></p><p><strong>Αποστολή:</strong> BOX NOW</p><p>Θα επικοινωνήσουμε μαζί σου για επιβεβαίωση της παραγγελίας και των μεταφορικών.</p><p style="margin-top:28px;color:#746f66">ZOE ATELIER — Objects with a soul.</p></div>`;

    async function sendEmail(to: string, subject: string, html: string) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html, reply_to: customer.email })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Email provider error");
    }

    await sendEmail(OWNER_EMAIL, `Νέα παραγγελία ${orderId} — ${customer.name}`, ownerHtml);
    await sendEmail(customer.email, `Η παραγγελία σου στο ZOE ATELIER — ${orderId}`, customerHtml);
    return NextResponse.json({ ok: true, orderId });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Δεν μπορέσαμε να στείλουμε την παραγγελία. Δοκίμασε ξανά." }, { status: 500 });
  }
}
