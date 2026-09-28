"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, Menu, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { categories, products, type Product } from "@/lib/products";

type Customer = {
  name: string;
  phone: string;
  email: string;
  area: string;
  locker: string;
  notes: string;
};

function Sculpture({ shape, tone }: { shape: string; tone: string }) {
  const s = { background: tone };
  return <div className="relative h-full w-full overflow-hidden bg-[#e8e0d6]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.65),transparent_35%),radial-gradient(circle_at_75%_75%,rgba(70,55,40,.12),transparent_42%)]"/>
    {shape === "organic" && <div className="absolute left-[31%] top-[18%] h-[55%] w-[38%] rounded-[46%_54%_42%_58%] shadow-2xl" style={s}><div className="absolute left-[30%] top-[-5%] h-[22%] w-[40%] rounded-full bg-[#bba895]"/></div>}
    {shape === "tall" && <div className="absolute left-[35%] top-[10%] h-[68%] w-[31%] rounded-[44%_44%_25%_25%] shadow-2xl" style={s}><div className="absolute left-[32%] top-[-3%] h-[16%] w-[36%] rounded-full bg-[#a99580]"/></div>}
    {shape === "arc" && <div className="absolute left-[24%] top-[25%] h-[42%] w-[52%] rounded-t-[100px] border-[22px] border-b-0 shadow-xl" style={{ borderColor: tone }}><div className="absolute -bottom-8 left-[-22px] h-12 w-[calc(100%+44px)] rounded-full" style={s}/></div>}
    {shape === "twin" && <><div className="absolute left-[22%] top-[27%] h-[42%] w-[27%] rounded-t-[90px] border-[18px] border-b-0" style={{ borderColor: tone }}/><div className="absolute right-[22%] top-[22%] h-[47%] w-[27%] rounded-t-[90px] border-[18px] border-b-0" style={{ borderColor: tone }}/></>}
    {shape === "bowl" && <div className="absolute left-[20%] top-[35%] h-[30%] w-[60%] rounded-[50%_50%_40%_40%] shadow-2xl" style={s}><div className="absolute left-[12%] top-[8%] h-[20%] w-[76%] rounded-full bg-[#a99580]"/></div>}
    {shape === "tray" && <div className="absolute left-[15%] top-[39%] h-[23%] w-[70%] rounded-[40%] rotate-[-4deg] shadow-xl" style={s}><div className="absolute inset-[14%] rounded-[40%] bg-[#a99580]"/></div>}
    {(shape === "relief" || shape === "waves") && <div className="absolute inset-[17%] rounded-[28px] shadow-2xl" style={s}><div className="absolute left-[12%] top-[30%] h-[18%] w-[72%] rotate-[-10deg] rounded-full bg-[#a99580]"/><div className="absolute left-[16%] top-[48%] h-[18%] w-[68%] rotate-[8deg] rounded-full bg-[#bca997]"/></div>}
  </div>;
}

function ProductVisual({ product, className = "" }: { product: Product; className?: string }) {
  return <div className={`relative overflow-hidden ${className}`}>
    <img
      src={product.image}
      alt={product.name}
      className="absolute inset-0 h-full w-full object-cover"
      onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.removeAttribute("hidden"); }}
    />
    <div className="absolute inset-0" hidden><Sculpture shape={product.shape} tone={product.tone}/></div>
  </div>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [category, setCategory] = useState("Όλα");
  const [quick, setQuick] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sentOrder, setSentOrder] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", email: "", area: "", locker: "", notes: "" });

  const groupedCart = useMemo(() => {
    const map = new Map<number, { product: Product; quantity: number }>();
    for (const id of cart) {
      const product = products.find((p) => p.id === id);
      if (!product) continue;
      const current = map.get(id);
      map.set(id, { product, quantity: (current?.quantity ?? 0) + 1 });
    }
    return Array.from(map.values());
  }, [cart]);

  const filtered = category === "Όλα" ? products : products.filter((p) => p.category === category);
  const total = groupedCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = cart.length;

  const updateQty = (id: number, delta: number) => setCart((current) => {
    const next = [...current];
    if (delta > 0) { next.push(id); return next; }
    const index = next.lastIndexOf(id);
    if (index >= 0) next.splice(index, 1);
    return next;
  });

  const openCheckout = () => { setError(""); setCheckoutOpen(true); };
  const closeCheckout = () => { if (!sending) setCheckoutOpen(false); };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!groupedCart.length) { setError("Το καλάθι είναι άδειο."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: groupedCart.map(({ product, quantity }) => ({ id: product.id, quantity }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Κάτι πήγε στραβά.");
      setCart([]);
      setCheckoutOpen(false);
      setSentOrder(data.orderId);
      setCustomer({ name: "", phone: "", email: "", area: "", locker: "", notes: "" });
      document.getElementById("cart")?.classList.add("hidden");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Δεν μπορέσαμε να στείλουμε την παραγγελία.");
    } finally {
      setSending(false);
    }
  };

  return <main className="min-h-screen overflow-x-hidden bg-[#f5f1ea] text-[#292722]">
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-[#f5f1ea]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X size={22}/> : <Menu size={22}/>}</button>
        <a href="#" className="absolute left-1/2 -translate-x-1/2 text-[15px] tracking-[.28em]">ZOE ATELIER</a>
        <nav className="hidden gap-8 text-[11px] uppercase tracking-[.18em] md:flex"><a href="#shop">Shop</a><a href="#categories">Collections</a><a href="#story">Our story</a><a href="#future">3D studio</a></nav>
        <button onClick={() => document.getElementById("cart")?.classList.remove("hidden")} className="relative" aria-label="Shopping bag"><ShoppingBag size={19}/>{itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#292722] px-1 text-[9px] text-white">{itemCount}</span>}</button>
      </div>
      {menu && <div className="border-t border-black/10 bg-[#f5f1ea] px-6 py-6 md:hidden"><div className="grid gap-5 text-sm"><a onClick={() => setMenu(false)} href="#shop">Shop</a><a onClick={() => setMenu(false)} href="#categories">Collections</a><a onClick={() => setMenu(false)} href="#story">Our story</a><a onClick={() => setMenu(false)} href="#future">3D studio</a></div></div>}
    </header>

    <section className="relative flex min-h-[92vh] items-end overflow-hidden px-5 pb-12 pt-28 md:min-h-screen md:px-10 md:pb-16">
      <div className="absolute inset-0 bg-[#ded4c7]"/><div className="absolute -right-[8%] top-[8%] h-[72vw] w-[72vw] max-h-[760px] max-w-[760px] rounded-full bg-[#c8b7a5]"/>
      <div className="absolute right-[18%] top-[18%] h-[46vw] w-[31vw] max-h-[530px] max-w-[360px] rounded-[48%_48%_35%_35%] bg-[#b9a48f] shadow-[30px_50px_80px_rgba(50,40,30,.16)] float"/>
      <div className="absolute right-[27%] top-[14%] h-[10vw] w-[13vw] max-h-[120px] max-w-[160px] rounded-full bg-[#a48f7a]"/>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,30,25,.16),transparent_55%)]"/>
      <div className="relative z-10 max-w-2xl text-white"><p className="mb-5 text-[10px] uppercase tracking-[.45em]">Sculptural objects · Made slowly</p><h1 className="text-5xl font-light leading-[.94] tracking-[-.04em] md:text-8xl">Objects with<br/><i className="font-serif">a soul.</i></h1><p className="mt-7 max-w-md text-sm leading-6 text-white/85 md:text-base">Χειροποίητα γύψινα διακοσμητικά για χώρους που θέλουν να νιώθουν διαφορετικοί.</p><a href="#shop" className="mt-8 inline-flex items-center gap-4 rounded-full bg-white px-6 py-3 text-xs text-[#292722] transition hover:scale-105">Ανακάλυψε τη συλλογή <ArrowRight size={15}/></a></div>
      <a href="#shop" className="absolute bottom-7 right-7 z-10 hidden items-center gap-2 text-[9px] uppercase tracking-[.25em] text-white/80 md:flex">Scroll <ArrowDown size={13}/></a>
    </section>

    <div className="overflow-hidden border-b border-t border-black/10 py-4"><div className="marquee flex w-max gap-12 text-[10px] uppercase tracking-[.32em] text-[#746f66]">{Array.from({length:2}).flatMap((_,i)=>["Handmade in Greece","Small batches","Designed to last","Objects with a soul"].map((x,j)=><span key={`${i}-${j}`}>{x} ✦</span>))}</div></div>

    <section id="categories" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mb-10"><p className="mb-3 text-[10px] uppercase tracking-[.35em] text-[#8a8177]">Collections</p><h2 className="text-4xl font-light tracking-[-.03em] md:text-6xl">Find your piece.</h2></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {categories.map((cat) => <button key={cat.name} onClick={() => { setCategory(cat.name); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"}); }} className="group text-left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#e6ddd3]"><img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" onError={(e)=>{e.currentTarget.style.display="none"}}/><div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.5),transparent_35%)]"/><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-4 text-white"><div className="text-lg font-light">{cat.name}</div><div className="text-[10px] uppercase tracking-[.18em] text-white/75">{cat.subtitle}</div></div></div>
        </button>)}
      </div>
    </section>

    <section id="shop" className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-[10px] uppercase tracking-[.35em] text-[#8a8177]">The collection</p><h2 className="text-4xl font-light tracking-[-.03em] md:text-6xl">Made for your space.</h2></div><div className="flex gap-2 overflow-x-auto pb-1 text-xs">{["Όλα","Βάζα","Κηροπήγια","Wall Art","Μπολ"].map(c=><button key={c} onClick={()=>setCategory(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 ${category===c?"bg-[#292722] text-white":"border-black/15"}`}>{c}</button>)}</div></div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5 md:gap-y-14">{filtered.map(p=><article key={p.id} className="product-card cursor-pointer" onClick={()=>setQuick(p)}><div className="product-image relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#e8e0d6]"><ProductVisual product={p} className="absolute inset-0"/><button onClick={e=>{e.stopPropagation();updateQty(p.id,1)}} aria-label={`Add ${p.name}`} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90"><Plus size={17}/></button></div><div className="mt-3 flex items-start justify-between gap-2"><div><h3 className="text-sm">{p.name}</h3><p className="mt-1 text-xs text-[#8a8177]">{p.category}</p></div><span className="text-sm">{p.price}€</span></div></article>)}</div>
    </section>

    <section id="story" className="bg-[#e8ded2] px-5 py-24 md:px-10 md:py-36"><div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2"><div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[38px] bg-[#cbb9a6] soft-shadow"><div className="absolute left-[28%] top-[17%] h-[65%] w-[43%] rounded-[46%_46%_25%_25%] bg-[#a9917b] rotate-[-6deg] shadow-2xl"/><div className="absolute left-[41%] top-[12%] h-[13%] w-[18%] rounded-full bg-[#96806a]"/></div><div className="max-w-xl"><p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#766b60]">The atelier</p><h2 className="text-4xl font-light leading-tight tracking-[-.03em] md:text-6xl">Quiet objects.<br/><i className="font-serif">Strong presence.</i></h2><p className="mt-7 text-sm leading-7 text-[#61594f] md:text-base">Το ZOE ATELIER γεννήθηκε από την αγάπη για τις απλές φόρμες, τις φυσικές υφές και τα αντικείμενα που δεν χρειάζονται φωνή για να τραβήξουν την προσοχή.</p><p className="mt-4 text-sm leading-7 text-[#61594f] md:text-base">Κάθε κομμάτι παράγεται σε μικρές ποσότητες και έχει μικρές διαφορές που το κάνουν δικό του.</p></div></div></section>

    <section id="future" className="relative overflow-hidden bg-[#292722] px-5 py-24 text-[#f5f1ea] md:px-10 md:py-36"><div className="mx-auto max-w-7xl"><p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#b9aa99]">Coming next</p><h2 className="text-5xl font-light tracking-[-.04em] md:text-8xl">Made layer<br/><i className="font-serif">by layer.</i></h2><p className="mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">Σύντομα: 3D printed objects, custom designs και δημιουργίες που ξεκινούν από μια ιδέα και καταλήγουν στα χέρια σου.</p></div></section>

    <footer className="px-5 py-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-black/10 pt-8 md:flex-row"><div><div className="text-sm tracking-[.25em]">ZOE ATELIER</div><p className="mt-2 text-xs text-[#8a8177]">Objects with a soul.</p></div><div className="text-xs text-[#746f66]">Instagram · Contact · © 2026</div></div></footer>

    {quick&&<div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm md:items-center md:p-6" onClick={()=>setQuick(null)}><div onClick={e=>e.stopPropagation()} className="relative grid w-full max-w-4xl overflow-hidden rounded-t-[28px] bg-[#f5f1ea] md:grid-cols-2 md:rounded-[28px]"><button onClick={()=>setQuick(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80"><X size={17}/></button><div className="aspect-square bg-[#e8e0d6]"><ProductVisual product={quick} className="h-full w-full"/></div><div className="flex flex-col justify-center p-7 md:p-12"><p className="text-[10px] uppercase tracking-[.3em] text-[#8a8177]">{quick.category}</p><h3 className="mt-3 text-4xl font-light">{quick.name}</h3><p className="mt-5 text-sm leading-6 text-[#746f66]">{quick.description}</p><div className="mt-8 flex items-center justify-between"><span className="text-xl">{quick.price}€</span><button onClick={()=>{updateQty(quick.id,1);setQuick(null)}} className="rounded-full bg-[#292722] px-6 py-3 text-xs text-white">Προσθήκη στο καλάθι</button></div></div></div></div>}

    {sentOrder&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-[28px] bg-[#f5f1ea] p-8 text-center shadow-2xl"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#292722] text-white"><Check size={22}/></div><p className="mt-6 text-[10px] uppercase tracking-[.3em] text-[#8a8177]">Order received</p><h3 className="mt-3 text-3xl font-light">Ευχαριστούμε.</h3><p className="mt-4 text-sm leading-6 text-[#746f66]">Η παραγγελία σου <strong>{sentOrder}</strong> καταχωρήθηκε. Σου στείλαμε επιβεβαίωση στο email που δήλωσες.</p><button onClick={()=>setSentOrder(null)} className="mt-7 rounded-full bg-[#292722] px-7 py-3 text-xs text-white">Επιστροφή στο κατάστημα</button></div></div>}

    <div id="cart" className="fixed inset-0 z-[70] hidden bg-black/30" onClick={e=>{if(e.target===e.currentTarget)e.currentTarget.classList.add("hidden")}}><aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-[#f5f1ea] p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-light">Your bag</h3><button onClick={()=>document.getElementById("cart")?.classList.add("hidden")}><X/></button></div>{groupedCart.length===0?<div className="flex h-[60vh] items-center justify-center text-sm text-[#8a8177]">Το καλάθι είναι άδειο.</div>:<><div className="mt-8 space-y-4">{groupedCart.map(({product,quantity})=><div key={product.id} className="flex items-center gap-4 border-b border-black/10 pb-4"><div className="h-20 w-16 overflow-hidden rounded-xl bg-[#e8e0d6]"><ProductVisual product={product} className="h-full w-full"/></div><div className="flex-1"><div className="text-sm">{product.name}</div><div className="mt-1 text-xs text-[#8a8177]">{product.price}€ · x {quantity}</div></div><div className="flex items-center gap-2"><button onClick={()=>updateQty(product.id,-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"><Minus size={14}/></button><span className="w-5 text-center text-sm">{quantity}</span><button onClick={()=>updateQty(product.id,1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"><Plus size={14}/></button></div></div>)}</div><div className="mt-8 rounded-2xl bg-white/70 p-5"><div className="flex items-center justify-between text-sm"><span>Προϊόντα</span><strong>{total.toFixed(2)}€</strong></div><div className="mt-2 flex items-center justify-between text-sm"><span>Αποστολή</span><span>BOX NOW</span></div></div><button onClick={openCheckout} className="mt-5 w-full rounded-full bg-[#292722] py-4 text-xs text-white">Ολοκλήρωση παραγγελίας</button></>}</aside></div>

    {checkoutOpen&&<div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm md:items-center md:p-6" onClick={e=>{if(e.target===e.currentTarget)closeCheckout()}}><div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-[#f5f1ea] md:rounded-[28px]"><button onClick={closeCheckout} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80"><X size={17}/></button><div className="grid md:grid-cols-[1.05fr_.95fr]"><div className="p-7 md:p-10"><p className="text-[10px] uppercase tracking-[.3em] text-[#8a8177]">Checkout</p><h3 className="mt-3 text-4xl font-light">Η παραγγελία σου.</h3><p className="mt-3 text-sm leading-6 text-[#746f66]">Συμπλήρωσε τα στοιχεία σου και πάτησε αποστολή. Όλα γίνονται μέσα στο site.</p><form onSubmit={submitOrder} className="mt-8 space-y-4"><div><label className="mb-2 block text-xs">Ονοματεπώνυμο *</label><input className="input-field" required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></div><div className="grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-xs">Τηλέφωνο *</label><input className="input-field" type="tel" required value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></div><div><label className="mb-2 block text-xs">Email *</label><input className="input-field" type="email" required value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></div></div><div><label className="mb-2 block text-xs">Περιοχή / Πόλη *</label><input className="input-field" required value={customer.area} onChange={e=>setCustomer({...customer,area:e.target.value})}/></div><div><label className="mb-2 block text-xs">BOX NOW Locker *</label><input className="input-field" required value={customer.locker} onChange={e=>setCustomer({...customer,locker:e.target.value})} placeholder="Όνομα ή κωδικός locker"/><p className="mt-2 text-xs leading-5 text-[#8a8177]">Ο πελάτης βρίσκει το locker του στο BOX NOW και γράφει εδώ το όνομα ή τον κωδικό.</p></div><div><label className="mb-2 block text-xs">Σημειώσεις</label><textarea className="input-field min-h-28 resize-y" value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}/></div>{error&&<div className="rounded-2xl bg-[#ead8d2] px-4 py-3 text-sm text-[#6e3325]">{error}</div>}<button disabled={sending} type="submit" className="w-full rounded-full bg-[#292722] py-4 text-xs text-white disabled:opacity-50">{sending?"Αποστολή...":"Αποστολή παραγγελίας"}</button><p className="text-center text-[11px] leading-5 text-[#8a8177]">Θα λάβεις email επιβεβαίωσης και εμείς θα λάβουμε την παραγγελία.</p></form></div><div className="bg-[#e8ded2] p-7 md:p-10"><p className="text-[10px] uppercase tracking-[.3em] text-[#766b60]">Order summary</p><div className="mt-6 space-y-4">{groupedCart.map(({product,quantity})=><div key={product.id} className="flex items-center justify-between gap-4 border-b border-black/10 pb-4"><div><div className="text-sm">{product.name} × {quantity}</div><div className="mt-1 text-xs text-[#746f66]">{product.category}</div></div><div className="text-sm">{(product.price*quantity).toFixed(2)}€</div></div>)}</div><div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5"><span className="text-sm">Σύνολο προϊόντων</span><strong className="text-lg">{total.toFixed(2)}€</strong></div><div className="mt-2 flex items-center justify-between text-sm"><span>Αποστολή</span><span>BOX NOW</span></div></div></div></div>}
  </main>;
}
