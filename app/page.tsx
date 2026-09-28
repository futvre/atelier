"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Menu, Minus, Plus, ShoppingBag, X } from "lucide-react";

type Product={id:number;name:string;category:string;price:number;tone:string;shape:string};
const products:Product[]=[
{id:1,name:"Sculpt No. 01",category:"Βάζα",price:28,tone:"#d9cec0",shape:"organic"},
{id:2,name:"Arc Candle",category:"Κηροπήγια",price:19,tone:"#c8b6a2",shape:"arc"},
{id:3,name:"Relief No. 02",category:"Wall Art",price:42,tone:"#e1d9cf",shape:"relief"},
{id:4,name:"Pebble Bowl",category:"Μπολ",price:31,tone:"#cfc0ae",shape:"bowl"},
{id:5,name:"Sculpt No. 02",category:"Βάζα",price:34,tone:"#bba792",shape:"tall"},
{id:6,name:"Twin Arc",category:"Κηροπήγια",price:24,tone:"#ddd1c2",shape:"twin"},
{id:7,name:"Relief No. 03",category:"Wall Art",price:46,tone:"#d0c5b8",shape:"waves"},
{id:8,name:"Stone Tray",category:"Μπολ",price:27,tone:"#bfae9c",shape:"tray"}
];

function Sculpture({shape,tone}:{shape:string;tone:string}){
 const s={background:tone};
 return <div className="relative h-full w-full overflow-hidden bg-[#e8e0d6]">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.65),transparent_35%),radial-gradient(circle_at_75%_75%,rgba(70,55,40,.12),transparent_42%)]"/>
  {shape==="organic"&&<div className="absolute left-[31%] top-[18%] h-[55%] w-[38%] rounded-[46%_54%_42%_58%] shadow-2xl" style={s}><div className="absolute left-[30%] top-[-5%] h-[22%] w-[40%] rounded-full bg-[#bba895]"/></div>}
  {shape==="tall"&&<div className="absolute left-[35%] top-[10%] h-[68%] w-[31%] rounded-[44%_44%_25%_25%] shadow-2xl" style={s}><div className="absolute left-[32%] top-[-3%] h-[16%] w-[36%] rounded-full bg-[#a99580]"/></div>}
  {shape==="arc"&&<div className="absolute left-[24%] top-[25%] h-[42%] w-[52%] rounded-t-[100px] border-[22px] border-b-0 shadow-xl" style={{borderColor:tone}}><div className="absolute -bottom-8 left-[-22px] h-12 w-[calc(100%+44px)] rounded-full" style={s}/></div>}
  {shape==="twin"&&<><div className="absolute left-[22%] top-[27%] h-[42%] w-[27%] rounded-t-[90px] border-[18px] border-b-0" style={{borderColor:tone}}/><div className="absolute right-[22%] top-[22%] h-[47%] w-[27%] rounded-t-[90px] border-[18px] border-b-0" style={{borderColor:tone}}/></>}
  {shape==="bowl"&&<div className="absolute left-[20%] top-[35%] h-[30%] w-[60%] rounded-[50%_50%_40%_40%] shadow-2xl" style={s}><div className="absolute left-[12%] top-[8%] h-[20%] w-[76%] rounded-full bg-[#a99580]"/></div>}
  {shape==="tray"&&<div className="absolute left-[15%] top-[39%] h-[23%] w-[70%] rounded-[40%] rotate-[-4deg] shadow-xl" style={s}><div className="absolute inset-[14%] rounded-[40%] bg-[#a99580]"/></div>}
  {(shape==="relief"||shape==="waves")&&<div className="absolute inset-[17%] rounded-[28px] shadow-2xl" style={s}><div className="absolute left-[12%] top-[30%] h-[18%] w-[72%] rotate-[-10deg] rounded-full bg-[#a99580]"/><div className="absolute left-[16%] top-[48%] h-[18%] w-[68%] rotate-[8deg] rounded-full bg-[#bca997]"/></div>}
 </div>
}

export default function Home(){
 const [menu,setMenu]=useState(false),[cart,setCart]=useState<number[]>([]),[category,setCategory]=useState("Όλα"),[quick,setQuick]=useState<Product|null>(null);
 const filtered=category==="Όλα"?products:products.filter(p=>p.category===category);
 const add=(id:number)=>setCart(c=>[...c,id]);
 const openCart=()=>document.getElementById("cart")?.classList.remove("hidden");
 const closeCart=()=>document.getElementById("cart")?.classList.add("hidden");
 return <main className="min-h-screen overflow-x-hidden bg-[#f5f1ea] text-[#292722]">
  <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-[#f5f1ea]/80 backdrop-blur-xl">
   <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
    <button className="md:hidden" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X size={22}/>:<Menu size={22}/>}</button>
    <a href="#" className="absolute left-1/2 -translate-x-1/2 text-[15px] tracking-[.28em]">ZOE ATELIER</a>
    <nav className="hidden gap-8 text-[11px] uppercase tracking-[.18em] md:flex"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#future">3D studio</a></nav>
    <button onClick={openCart} className="relative" aria-label="Shopping bag"><ShoppingBag size={19}/>{cart.length>0&&<span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#292722] px-1 text-[9px] text-white">{cart.length}</span>}</button>
   </div>
   {menu&&<div className="border-t border-black/10 bg-[#f5f1ea] px-6 py-6 md:hidden"><div className="grid gap-5 text-sm"><a onClick={()=>setMenu(false)} href="#shop">Shop</a><a onClick={()=>setMenu(false)} href="#story">Our story</a><a onClick={()=>setMenu(false)} href="#future">3D studio</a></div></div>}
  </header>

  <section className="relative flex min-h-[92vh] items-end overflow-hidden px-5 pb-12 pt-28 md:min-h-screen md:px-10 md:pb-16">
   <div className="absolute inset-0 bg-[#ded4c7]"/>
   <div className="absolute -right-[8%] top-[8%] h-[72vw] w-[72vw] max-h-[760px] max-w-[760px] rounded-full bg-[#c8b7a5]"/>
   <div className="absolute right-[18%] top-[18%] h-[46vw] w-[31vw] max-h-[530px] max-w-[360px] rounded-[48%_48%_35%_35%] bg-[#b9a48f] shadow-[30px_50px_80px_rgba(50,40,30,.16)] float"/>
   <div className="absolute right-[27%] top-[14%] h-[10vw] w-[13vw] max-h-[120px] max-w-[160px] rounded-full bg-[#a48f7a]"/>
   <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,30,25,.16),transparent_55%)]"/>
   <div className="relative z-10 max-w-2xl text-white">
    <p className="mb-5 text-[10px] uppercase tracking-[.45em]">Sculptural objects · Made slowly</p>
    <h1 className="text-5xl font-light leading-[.94] tracking-[-.04em] md:text-8xl">Objects with<br/><i className="font-serif">a soul.</i></h1>
    <p className="mt-7 max-w-md text-sm leading-6 text-white/85 md:text-base">Χειροποίητα γύψινα διακοσμητικά για χώρους που θέλουν να νιώθουν διαφορετικοί.</p>
    <a href="#shop" className="mt-8 inline-flex items-center gap-4 rounded-full bg-white px-6 py-3 text-xs text-[#292722] transition hover:scale-105">Ανακάλυψε τη συλλογή <ArrowRight size={15}/></a>
   </div>
   <a href="#shop" className="absolute bottom-7 right-7 z-10 hidden items-center gap-2 text-[9px] uppercase tracking-[.25em] text-white/80 md:flex">Scroll <ArrowDown size={13}/></a>
  </section>

  <div className="overflow-hidden border-b border-t border-black/10 py-4"><div className="marquee flex w-max gap-12 text-[10px] uppercase tracking-[.32em] text-[#746f66]">{Array.from({length:2}).flatMap((_,i)=>["Handmade in Greece","Small batches","Designed to last","Objects with a soul"].map((x,j)=><span key={`${i}-${j}`}>{x} ✦</span>))}</div></div>

  <section id="shop" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
   <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-[10px] uppercase tracking-[.35em] text-[#8a8177]">The collection</p><h2 className="text-4xl font-light tracking-[-.03em] md:text-6xl">Made for your space.</h2></div>
   <div className="flex gap-2 overflow-x-auto pb-1 text-xs">{["Όλα","Βάζα","Κηροπήγια","Wall Art","Μπολ"].map(c=><button key={c} onClick={()=>setCategory(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 ${category===c?"bg-[#292722] text-white":"border-black/15"}`}>{c}</button>)}</div></div>
   <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5 md:gap-y-14">{filtered.map(p=><article key={p.id} className="product-card cursor-pointer" onClick={()=>setQuick(p)}><div className="product-image relative aspect-[4/5] overflow-hidden rounded-[22px]"><Sculpture shape={p.shape} tone={p.tone}/><button onClick={e=>{e.stopPropagation();add(p.id)}} aria-label={`Add ${p.name}`} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90"><Plus size={17}/></button></div><div className="mt-3 flex items-start justify-between gap-2"><div><h3 className="text-sm">{p.name}</h3><p className="mt-1 text-xs text-[#8a8177]">{p.category}</p></div><span className="text-sm">{p.price}€</span></div></article>)}</div>
  </section>

  <section id="story" className="bg-[#e8ded2] px-5 py-24 md:px-10 md:py-36"><div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2"><div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[38px] bg-[#cbb9a6] soft-shadow"><div className="absolute left-[28%] top-[17%] h-[65%] w-[43%] rounded-[46%_46%_25%_25%] bg-[#a9917b] rotate-[-6deg] shadow-2xl"/><div className="absolute left-[41%] top-[12%] h-[13%] w-[18%] rounded-full bg-[#96806a]"/></div><div className="max-w-xl"><p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#766b60]">The atelier</p><h2 className="text-4xl font-light leading-tight tracking-[-.03em] md:text-6xl">Quiet objects.<br/><i className="font-serif">Strong presence.</i></h2><p className="mt-7 text-sm leading-7 text-[#61594f] md:text-base">Το ZOE ATELIER γεννήθηκε από την αγάπη για τις απλές φόρμες, τις φυσικές υφές και τα αντικείμενα που δεν χρειάζονται φωνή για να τραβήξουν την προσοχή.</p><p className="mt-4 text-sm leading-7 text-[#61594f] md:text-base">Κάθε κομμάτι παράγεται σε μικρές ποσότητες και έχει μικρές διαφορές που το κάνουν δικό του.</p></div></div></section>

  <section id="future" className="relative overflow-hidden bg-[#292722] px-5 py-24 text-[#f5f1ea] md:px-10 md:py-36"><div className="mx-auto max-w-7xl"><p className="mb-5 text-[10px] uppercase tracking-[.35em] text-[#b9aa99]">Coming next</p><h2 className="text-5xl font-light tracking-[-.04em] md:text-8xl">Made layer<br/><i className="font-serif">by layer.</i></h2><p className="mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">Σύντομα: 3D printed objects, custom designs και δημιουργίες που ξεκινούν από μια ιδέα και καταλήγουν στα χέρια σου.</p></div></section>

  <footer className="px-5 py-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-black/10 pt-8 md:flex-row"><div><div className="text-sm tracking-[.25em]">ZOE ATELIER</div><p className="mt-2 text-xs text-[#8a8177]">Objects with a soul.</p></div><div className="text-xs text-[#746f66]">Instagram · Contact · © 2026</div></div></footer>

  {quick&&<div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm md:items-center md:p-6" onClick={()=>setQuick(null)}><div onClick={e=>e.stopPropagation()} className="relative grid w-full max-w-4xl overflow-hidden rounded-t-[28px] bg-[#f5f1ea] md:grid-cols-2 md:rounded-[28px]"><button onClick={()=>setQuick(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80"><X size={17}/></button><div className="aspect-square md:aspect-auto"><Sculpture shape={quick.shape} tone={quick.tone}/></div><div className="flex flex-col justify-center p-7 md:p-12"><p className="text-[10px] uppercase tracking-[.3em] text-[#8a8177]">{quick.category}</p><h3 className="mt-3 text-4xl font-light">{quick.name}</h3><p className="mt-5 text-sm leading-6 text-[#746f66]">Χειροποίητο διακοσμητικό σε μικρή παραγωγή. Κάθε κομμάτι έχει τη δική του φυσική υφή.</p><div className="mt-8 flex items-center justify-between"><span className="text-xl">{quick.price}€</span><button onClick={()=>{add(quick.id);setQuick(null)}} className="rounded-full bg-[#292722] px-6 py-3 text-xs text-white">Προσθήκη στο καλάθι</button></div></div></div></div>}

  <div id="cart" className="fixed inset-0 z-[70] hidden bg-black/30" onClick={e=>{if(e.target===e.currentTarget)closeCart()}}><aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#f5f1ea] p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-light">Your bag</h3><button onClick={closeCart}><X/></button></div>{cart.length===0?<div className="flex h-[70vh] items-center justify-center text-sm text-[#8a8177]">Το καλάθι είναι άδειο.</div>:<div className="mt-8 space-y-4">{cart.map((id,i)=>{const p=products.find(x=>x.id===id)!;return <div key={`${id}-${i}`} className="flex items-center gap-4 border-b border-black/10 pb-4"><div className="h-20 w-16 overflow-hidden rounded-xl"><Sculpture shape={p.shape} tone={p.tone}/></div><div className="flex-1"><div className="text-sm">{p.name}</div><div className="text-xs text-[#8a8177]">{p.price}€</div></div><button onClick={()=>setCart(c=>c.filter((_,idx)=>idx!==i))}><Minus size={15}/></button></div>})}<button className="mt-8 w-full rounded-full bg-[#292722] py-4 text-xs text-white">Συνέχεια στο checkout</button></div>}</aside></div>
 </main>
}
