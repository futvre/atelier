"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

import { categories, products, type Product } from "@/lib/products";

type Customer = {
  name: string;
  phone: string;
  email: string;
  area: string;
  locker: string;
  notes: string;
};

function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#e8e0d6] ${className}`}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    </div>
  );
}

function CategoryImage({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8e0d6]">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Όλα");
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    area: "",
    locker: "",
    notes: "",
  });

  const filteredProducts =
    selectedCategory === "Όλα"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const groupedCart = useMemo(() => {
    const map = new Map<number, { product: Product; quantity: number }>();

    for (const id of cart) {
      const product = products.find((item) => item.id === id);
      if (!product) continue;

      const existing = map.get(product.id);
      map.set(product.id, {
        product,
        quantity: (existing?.quantity ?? 0) + 1,
      });
    }

    return [...map.values()];
  }, [cart]);

  const total = groupedCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.length;

  function addToCart(id: number) {
    setCart((current) => [...current, id]);
  }

  function updateQty(id: number, delta: number) {
    setCart((current) => {
      const next = [...current];

      if (delta > 0) {
        next.push(id);
        return next;
      }

      const index = next.lastIndexOf(id);
      if (index !== -1) next.splice(index, 1);

      return next;
    });
  }

  function openCart() {
    document.getElementById("cart")?.classList.remove("hidden");
  }

  function closeCart() {
    document.getElementById("cart")?.classList.add("hidden");
  }

  function openCheckout() {
    setError("");
    setCheckoutOpen(true);
  }

  function closeCheckout() {
    if (!sending) setCheckoutOpen(false);
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (groupedCart.length === 0) {
      setError("Το καλάθι είναι άδειο.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: groupedCart.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Δεν μπορέσαμε να στείλουμε την παραγγελία.");
      }

      setCart([]);
      setCheckoutOpen(false);
      closeCart();
      setSuccessOrder(data.orderId);
      setCustomer({
        name: "",
        phone: "",
        email: "",
        area: "",
        locker: "",
        notes: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Δεν μπορέσαμε να στείλουμε την παραγγελία."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1ea] text-[#292722]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-[#f5f1ea]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a
            href="#"
            className="absolute left-1/2 -translate-x-1/2 text-[15px] tracking-[.28em]"
          >
            ZOE ATELIER
          </a>

          <nav className="hidden gap-8 text-[11px] uppercase tracking-[.18em] md:flex">
            <a href="#shop" className="transition hover:opacity-50">Έργα</a>
            <a href="#collections" className="transition hover:opacity-50">Κατηγορίες</a>
            <a href="#story" className="transition hover:opacity-50">Η Φιλοσοφία</a>
            <a href="#future" className="transition hover:opacity-50">3D Εργαστήριο</a>
          </nav>

          <button onClick={openCart} className="relative" aria-label="Shopping bag">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#292722] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/10 bg-[#f5f1ea] px-6 py-6 md:hidden">
            <div className="grid gap-5 text-sm">
              <a onClick={() => setMenuOpen(false)} href="#shop">Shop</a>
              <a onClick={() => setMenuOpen(false)} href="#collections">Collections</a>
              <a onClick={() => setMenuOpen(false)} href="#story">Our story</a>
              <a onClick={() => setMenuOpen(false)} href="#future">3D studio</a>
            </div>
          </div>
        )}
      </header>

      <section className="relative flex min-h-[92vh] items-end overflow-hidden px-5 pb-12 pt-28 md:min-h-screen md:px-10 md:pb-16">
        <Image
          src="/products/hero.png"
          alt="ZOE ATELIER"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 max-w-2xl text-white">
          <p className="mb-5 text-[10px] uppercase tracking-[.45em]">
            Sculptural objects · Made slowly
          </p>
          <h1 className="text-5xl font-light leading-[.94] tracking-[-.04em] md:text-8xl">
            Objects with
            <br />
            <i className="font-serif">a soul.</i>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-6 text-white/85 md:text-base">
            Χειροποίητα γύψινα διακοσμητικά για χώρους που θέλουν να νιώθουν διαφορετικοί.
          </p>
          <a
            href="#shop"
            className="mt-8 inline-flex items-center gap-4 rounded-full bg-white px-6 py-3 text-xs text-[#292722] transition hover:scale-105"
          >
            Ανακάλυψε τη συλλογή
            <ArrowRight size={15} />
          </a>
        </div>

        <a
          href="#shop"
          className="absolute bottom-7 right-7 z-10 hidden items-center gap-2 text-[9px] uppercase tracking-[.25em] text-white/80 md:flex"
        >
          Scroll <ArrowDown size={13} />
        </a>
      </section>

      <div className="overflow-hidden border-b border-t border-black/10 py-4">
        <div className="marquee flex w-max gap-12 text-[10px] uppercase tracking-[.32em] text-[#746f66]">
          {Array.from({ length: 2 }).flatMap((_, i) =>
            [
              "Handmade in Greece",
              "Small batches",
              "Designed to last",
              "Objects with a soul",
            ].map((text, j) => <span key={`${i}-${j}`}>{text} ✦</span>)
          )}
        </div>
      </div>

      <section id="collections" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10">
          <p className="mb-3 text-[10px] uppercase tracking-[.35em] text-[#8a8177]">ΚΑΤΗΓΟΡΙΕΣ</p>
          <h2 className="text-4xl font-light tracking-[-.03em] md:text-6xl">Δώστε μορφή στον χώρο σας.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setSelectedCategory(item.name);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative aspect-[16/10] overflow-hidden rounded-[28px] text-left"
            >
              <CategoryImage image={item.image} name={item.name} />
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-light md:text-4xl">{item.name}</p>
                    <p className="mt-1 text-xs tracking-[.12em] text-white/75">{item.subtitle}</p>
                  </div>
                  <ArrowRight size={20} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[.35em] text-[#8a8177]">ΤΑ ΕΡΓΑ ΜΑΣ</p>
            <h2 className="text-4xl font-light tracking-[-.03em] md:text-6xl">Σχεδιασμένα για τον χώρο σας.</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {[
              "Όλα",
              ...categories.map((item) => item.name),
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 transition ${
                  selectedCategory === item
                    ? "bg-[#292722] text-white"
                    : "border-black/15 hover:bg-black/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5 md:gap-y-14">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group cursor-pointer"
              onClick={() => setQuickProduct(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#e8e0d6]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart(product.id);
                  }}
                  aria-label={`Add ${product.name}`}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105"
                >
                  <Plus size={17} />
                </button>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm">{product.name}</h3>
                  <p className="mt-1 text-xs text-[#8a8177]">{product.category}</p>
                </div>
                <span className="text-sm">{product.price}€</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="story" className="bg-[#e8ded2] px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[38px] bg-[#cbb9a6] soft-shadow">
            <Image
              src="/products/story.png"
              alt="ZOE ATELIER story"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#766b60]">The atelier</p>
            <h2 className="text-4xl font-light leading-tight tracking-[-.03em] md:text-6xl">
              Quiet objects.
              <br />
              <i className="font-serif">Strong presence.</i>
            </h2>
            <p className="mt-7 text-sm leading-7 text-[#61594f] md:text-base">
              Το ZOE ATELIER γεννήθηκε από την αγάπη για τις απλές φόρμες, τις φυσικές υφές και τα αντικείμενα που δεν χρειάζονται φωνή για να τραβήξουν την προσοχή.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#61594f] md:text-base">
              Κάθε κομμάτι παράγεται σε μικρές ποσότητες και έχει μικρές διαφορές που το κάνουν δικό του.
            </p>
            <a href="#shop" className="mt-8 inline-flex items-center gap-3 border-b border-black/40 pb-2 text-xs uppercase tracking-[.18em]">
              Δες τη συλλογή <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <section id="future" className="relative overflow-hidden bg-[#292722] px-5 py-24 text-[#f5f1ea] md:px-10 md:py-36">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#756452] opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#b9aa99]">Coming next</p>
          <h2 className="text-5xl font-light tracking-[-.04em] md:text-8xl">
            Made layer
            <br />
            <i className="font-serif">by layer.</i>
          </h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Σύντομα: 3D printed objects, custom designs και δημιουργίες που ξεκινούν από μια ιδέα και καταλήγουν στα χέρια σου.
          </p>
        </div>
      </section>

      <footer className="px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-black/10 pt-8 md:flex-row">
          <div>
            <div className="text-sm tracking-[.25em]">ZOE ATELIER</div>
            <p className="mt-2 text-xs text-[#8a8177]">Objects with a soul.</p>
          </div>
          <div className="text-xs text-[#746f66]">Instagram · Contact · © 2026</div>
        </div>
      </footer>

      {quickProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm md:items-center md:p-6"
          onClick={() => setQuickProduct(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative grid w-full max-w-4xl overflow-hidden rounded-t-[28px] bg-[#f5f1ea] md:grid-cols-2 md:rounded-[28px]"
          >
            <button
              onClick={() => setQuickProduct(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85"
              aria-label="Close product"
            >
              <X size={17} />
            </button>

            <div className="relative aspect-square bg-[#e8e0d6]">
              <Image
                src={quickProduct.image}
                alt={quickProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-7 md:p-12">
              <p className="text-[10px] uppercase tracking-[.3em] text-[#8a8177]">
                {quickProduct.category}
              </p>
              <h3 className="mt-3 text-4xl font-light">{quickProduct.name}</h3>
              <p className="mt-5 text-sm leading-6 text-[#746f66]">
                {quickProduct.description}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4">
                <span className="text-xl">{quickProduct.price}€</span>
                <button
                  onClick={() => {
                    addToCart(quickProduct.id);
                    setQuickProduct(null);
                  }}
                  className="rounded-full bg-[#292722] px-6 py-3 text-xs text-white"
                >
                  Προσθήκη στο καλάθι
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-[#f5f1ea] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#292722] text-white">
              <Check size={22} />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[.3em] text-[#8a8177]">Order received</p>
            <h3 className="mt-3 text-3xl font-light">Ευχαριστούμε.</h3>
            <p className="mt-4 text-sm leading-6 text-[#746f66]">
              Η παραγγελία σου <strong>{successOrder}</strong> καταχωρήθηκε.
              <br />
              Σου στείλαμε επιβεβαίωση στο email που δήλωσες.
            </p>
            <button
              onClick={() => setSuccessOrder(null)}
              className="mt-7 rounded-full bg-[#292722] px-7 py-3 text-xs text-white"
            >
              Επιστροφή στο κατάστημα
            </button>
          </div>
        </div>
      )}

      <div
        id="cart"
        className="fixed inset-0 z-[70] hidden bg-black/30"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeCart();
        }}
      >
        <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-[#f5f1ea] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-light">Καλάθι</h3>
            <button onClick={closeCart} aria-label="Close cart"><X /></button>
          </div>

          {groupedCart.length === 0 ? (
            <div className="flex h-[60vh] items-center justify-center text-sm text-[#8a8177]">
              Το καλάθι είναι άδειο.
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4">
                {groupedCart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-4 border-b border-black/10 pb-4">
                    <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-[#e8e0d6]">
                      <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm">{product.name}</div>
                      <div className="mt-1 text-xs text-[#8a8177]">
                        {product.price}€ · × {quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white/70 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span>Προϊόντα</span>
                  <strong>{total.toFixed(2)}€</strong>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Αποστολή</span>
                  <span className="text-[#746f66]">BOX NOW</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#8a8177]">
                  Τα μεταφορικά επιβεβαιώνονται μαζί με την παραγγελία.
                </p>
              </div>

              <button
                onClick={openCheckout}
                className="mt-5 w-full rounded-full bg-[#292722] py-4 text-xs text-white transition hover:opacity-90"
              >
                Ολοκλήρωση παραγγελίας
              </button>
            </>
          )}
        </aside>
      </div>

      {checkoutOpen && (
        <div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm md:items-center md:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeCheckout();
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-[#f5f1ea] md:rounded-[28px]">
            <button
              onClick={closeCheckout}
              disabled={sending}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85"
              aria-label="Close checkout"
            >
              <X size={17} />
            </button>

            <div className="grid md:grid-cols-[1.05fr_.95fr]">
              <div className="p-7 md:p-10">
                <p className="text-[10px] uppercase tracking-[.3em] text-[#8a8177]">Checkout</p>
                <h3 className="mt-3 text-4xl font-light">Η παραγγελία σου.</h3>
                <p className="mt-3 text-sm leading-6 text-[#746f66]">
                  Συμπλήρωσε τα στοιχεία σου και πάτησε αποστολή.
                </p>

                <form onSubmit={submitOrder} className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs">Ονοματεπώνυμο *</label>
                    <input
                      className="input-field"
                      required
                      value={customer.name}
                      onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                      placeholder="π.χ. Μαρία Παπαδοπούλου"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs">Τηλέφωνο *</label>
                      <input
                        className="input-field"
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                        placeholder="69..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs">Email *</label>
                      <input
                        className="input-field"
                        type="email"
                        required
                        value={customer.email}
                        onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs">Περιοχή / Πόλη *</label>
                    <input
                      className="input-field"
                      required
                      value={customer.area}
                      onChange={(event) => setCustomer({ ...customer, area: event.target.value })}
                      placeholder="π.χ. Θεσσαλονίκη"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs">BOX NOW Locker *</label>
                    <input
                      className="input-field"
                      required
                      value={customer.locker}
                      onChange={(event) => setCustomer({ ...customer, locker: event.target.value })}
                      placeholder="Όνομα ή κωδικός locker"
                    />
                    <p className="mt-2 text-xs leading-5 text-[#8a8177]">
                      Γράψε το όνομα ή τον κωδικό του BOX NOW locker που επέλεξες.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs">Σημειώσεις</label>
                    <textarea
                      className="input-field min-h-28 resize-y"
                      value={customer.notes}
                      onChange={(event) => setCustomer({ ...customer, notes: event.target.value })}
                      placeholder="Κάτι που θέλεις να μας πεις..."
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl bg-[#ead8d2] px-4 py-3 text-sm text-[#6e3325]">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={sending}
                    type="submit"
                    className="w-full rounded-full bg-[#292722] py-4 text-xs text-white disabled:opacity-50"
                  >
                    {sending ? "Αποστολή..." : "Αποστολή παραγγελίας"}
                  </button>

                  <p className="text-center text-[11px] leading-5 text-[#8a8177]">
                    Θα λάβεις email επιβεβαίωσης και εμείς θα λάβουμε την παραγγελία.
                  </p>
                </form>
              </div>

              <div className="bg-[#e8ded2] p-7 md:p-10">
                <p className="text-[10px] uppercase tracking-[.3em] text-[#766b60]">Order summary</p>

                <div className="mt-6 space-y-4">
                  {groupedCart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                      <div>
                        <div className="text-sm">{product.name} × {quantity}</div>
                        <div className="mt-1 text-xs text-[#746f66]">{product.category}</div>
                      </div>
                      <div className="text-sm">{(product.price * quantity).toFixed(2)}€</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="text-sm">Σύνολο προϊόντων</span>
                  <strong className="text-lg">{total.toFixed(2)}€</strong>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Αποστολή</span>
                  <span>BOX NOW</span>
                </div>

                <div className="mt-6 rounded-2xl bg-white/50 p-4 text-xs leading-5 text-[#6e675f]">
                  Η παραγγελία αποστέλλεται χωρίς online πληρωμή. Θα επικοινωνήσουμε μαζί σου για την ολοκλήρωση.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
