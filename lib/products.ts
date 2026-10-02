export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tone: string;
  shape: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Sculpt No. 01",
    category: "Βάζα",
    price: 28,
    image: "/products/sculpt-01.webp",
    tone: "#d9cec0",
    shape: "organic",
    description: "Σμιλεμένο γύψινο βάζο με οργανική φόρμα και ήρεμη, φυσική υφή."
  },
  {
    id: 2,
    name: "Arc Candle",
    category: "Κηροπήγια",
    price: 19,
    image: "/products/arc.webp",
    tone: "#c8b6a2",
    shape: "arc",
    description: "Μίνιμαλ κηροπήγιο με καθαρή καμπύλη και διακριτική γλυπτική παρουσία."
  },
  {
    id: 3,
    name: "Relief No. 02",
    category: "Κηροπήγια",
    price: 42,
    image: "/products/hollow arc.webp",
    tone: "#e1d9cf",
    shape: "relief",
    description: "Επιτοίχιο relief για χώρους που θέλουν υφή και αρχιτεκτονική απλότητα."
  },
  {
    id: 4,
    name: "Pebble Bowl",
    category: "Μπολ",
    price: 31,
    image: "/products/rings.webp",
    tone: "#cfc0ae",
    shape: "bowl",
    description: "Γλυπτικό μπολ εμπνευσμένο από λείες, φυσικές πέτρες."
  },
  {
    id: 5,
    name: "Sculpt No. 02",
    category: "Βάζα",
    price: 34,
    image: "/products/candles.jpeg",
    tone: "#bba792",
    shape: "tall",
    description: "Ψηλό, ήσυχο statement vase για κονσόλες, ράφια και γωνίες."
  },
  {
    id: 6,
    name: "Twin Arc",
    category: "Κηροπήγια",
    price: 24,
    image: "/products/3vases.webp",
    tone: "#ddd1c2",
    shape: "twin",
    description: "Ζευγάρι καμπύλων κηροπηγίων με γλυπτική συμμετρία."
  },
  {
    id: 7,
    name: "Relief No. 03",
    category: "Wall Art",
    price: 46,
    image: "/products/heartvase.webp",
    tone: "#d0c5b8",
    shape: "waves",
    description: "Ανάγλυφη σύνθεση με κυματιστές φόρμες και απαλή υφή."
  },
  {
    id: 8,
    name: "Stone Tray",
    category: "Μπολ",
    price: 27,
    image: "/products/ripplevase.jpg",
    tone: "#bfae9c",
    shape: "tray",
    description: "Minimal δίσκος για κλειδιά, κεριά, κοσμήματα και μικρά αντικείμενα."
  }
];

export const categories = [
  { name: "Βάζα", image: "/products/category-vases.jfif", subtitle: "Γλυπτικές φόρμες" },
  { name: "Κηροπήγια", image: "/products/category-candles.jfif", subtitle: "Φως & Σκιά" },
  { name: "Διακοσμητικά", image: "/products/category-wall-art.jfif", subtitle: "Υφή & Βάθος" },
  { name: "Μπολ", image: "/products/category-bowls.jfif", subtitle: "Ήρεμη χρηστικότητα" }
];
