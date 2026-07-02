import { useEffect, useRef, useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    url: "/assets/images/photo-01.png",
    alt: "Smiley Home Restaurant – warm boho cafe interior",
  },
  {
    url: "/assets/images/photo-04.png",
    alt: "Smiley Home Restaurant – illuminated entrance at night",
  },
  {
    url: "/assets/images/photo-07.png",
    alt: "Smiley Home Restaurant – cozy dining area",
  },
  {
    url: "/assets/images/photo-09.png",
    alt: "Smiley Home Restaurant – beautiful cafe ambiance",
  },
  {
    url: "/assets/images/photo-11.png",
    alt: "Smiley Home Restaurant – celebration setup",
  },
  {
    url: "/assets/images/photo-14.png",
    alt: "Smiley Home Restaurant – boho decor details",
  },
  {
    url: "/assets/images/photo-17.png",
    alt: "Smiley Home Restaurant – restaurant atmosphere",
  },
];

// ── MENU TYPES ──────────────────────────────────────────────────────────────

interface MenuItem {
  name: string;
  price: string;
}

interface BuffetPackage {
  price: string;
  includes: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  image: string;
  items?: MenuItem[];
  packages?: BuffetPackage[];
}

// ── MENU DATA ────────────────────────────────────────────────────────────────

const menuCategories: MenuCategory[] = [
  {
    id: "welcome-drinks",
    name: "Welcome Drinks",
    emoji: "🍹",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    items: [
      { name: "Mint Mojito", price: "₹150" },
      { name: "Watermelon Mojito", price: "₹160" },
      { name: "Iced Tea", price: "₹170" },
      { name: "Kiwi Mojito", price: "₹180" },
      { name: "Kala Khatta", price: "₹190" },
      { name: "Green Apple Mojito", price: "₹200" },
      { name: "Spicy Guava", price: "₹200" },
      { name: "Traditional", price: "₹250" },
      { name: "One More Time", price: "₹250" },
    ],
  },
  {
    id: "cold-drink",
    name: "Cold Drink",
    emoji: "🥤",
    image:
      "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800&q=80",
    items: [
      { name: "Coke", price: "₹60" },
      { name: "Thums Up", price: "₹60" },
      { name: "Sprite", price: "₹60" },
      { name: "Mazza", price: "₹60" },
      { name: "Butter's Milk", price: "Ask price" },
      { name: "Nimbu Pani", price: "₹60" },
      { name: "Lassi", price: "₹100" },
      { name: "Mineral Water", price: "₹20" },
    ],
  },
  {
    id: "tea-coffee",
    name: "Tea/Coffee",
    emoji: "☕",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    items: [
      { name: "Tea", price: "₹50" },
      { name: "Black Tea", price: "₹60" },
      { name: "Lemon Tea", price: "₹70" },
      { name: "Hot Coffee", price: "₹100" },
      { name: "Black Coffee Hot", price: "₹120" },
      { name: "Black Cold Coffee", price: "₹150" },
      { name: "Cold Coffee with Ice Cream", price: "₹250" },
    ],
  },
  {
    id: "shakes",
    name: "Shakes",
    emoji: "🥤",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80",
    items: [
      { name: "KitKat Shake", price: "₹200" },
      { name: "Chocolate Shake", price: "₹200" },
      { name: "Oreo Shake", price: "₹200" },
      { name: "Banana Shake", price: "₹200" },
      { name: "Cold Pina Colada", price: "₹200" },
      { name: "Strawberry Colada", price: "₹200" },
      { name: "Peanut Punch", price: "₹200" },
      { name: "Nina Punch", price: "₹200" },
      { name: "Cold Coffee", price: "₹200" },
      { name: "Cold Coffee with Ice Cream", price: "₹300" },
    ],
  },
  {
    id: "starters",
    name: "Starters",
    emoji: "🍽️",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    items: [
      { name: "Pav Bhaji", price: "₹150" },
      { name: "Garlic Bread", price: "₹200" },
      { name: "Noodles", price: "₹200" },
      { name: "Hakka Noodles", price: "₹200" },
      { name: "Schezwan Noodles", price: "₹200" },
      { name: "Kolhapuri Noodles", price: "₹200" },
      { name: "Chowmein", price: "₹200" },
      { name: "Manchurian Dry", price: "₹200" },
      { name: "Manchurian Semi Gravy", price: "₹200" },
      { name: "Manchurian Gravy", price: "₹200" },
      { name: "Veg Maggi", price: "₹200" },
      { name: "Chinese Bhel", price: "₹250" },
      { name: "American Chopsuey", price: "₹250" },
      { name: "Paneer Chilli Dry", price: "₹300" },
      { name: "Paneer Chilli Gravy", price: "₹300" },
      { name: "Veg Crispy", price: "₹300" },
      { name: "Veg Crispy Corn", price: "₹300" },
      { name: "Veg Lollipop", price: "₹300" },
      { name: "Paneer 65", price: "₹350" },
      { name: "Paneer Tikka Dry", price: "₹350" },
      { name: "Hara Garlic Tikka", price: "₹350" },
    ],
  },
  {
    id: "sandwich-fries",
    name: "Sandwich/Fries",
    emoji: "🥪",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
    items: [
      { name: "Vegetable Cheese Sandwich", price: "₹200" },
      { name: "Cheese Sandwich", price: "₹250" },
      { name: "Double Cheese Sandwich", price: "₹300" },
      { name: "French Fries", price: "₹170" },
      { name: "Peri Peri Fries", price: "₹200" },
    ],
  },
  {
    id: "pizza",
    name: "Pizza",
    emoji: "🍕",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    items: [
      { name: "Margherita Pizza (Large)", price: "₹300" },
      { name: "Corn Cheese Pizza (Large)", price: "₹300" },
      { name: "Exotic Vegetable Pizza (Large)", price: "₹350" },
      { name: "Spicy Tandoori Pizza (Large)", price: "₹350" },
      { name: "Mexican Pizza (Large)", price: "₹350" },
      { name: "Italian Pizza (Large)", price: "₹350" },
      { name: "Paneer Tikka Pizza (Large)", price: "₹380" },
    ],
  },
  {
    id: "pasta",
    name: "Pasta",
    emoji: "🍝",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    items: [
      { name: "Red Pasta", price: "₹300" },
      { name: "White Sauce Pasta", price: "₹350" },
      { name: "Pink Sauce Pasta", price: "₹350" },
      { name: "Basil Pesto Pasta", price: "₹350" },
    ],
  },
  {
    id: "sizzlers",
    name: "Sizzlers",
    emoji: "🔥",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    items: [
      { name: "Indian Sizzler", price: "₹550" },
      { name: "China Town", price: "₹550" },
      { name: "Mexican Sizzler", price: "₹600" },
    ],
  },
  {
    id: "pakode",
    name: "Pakode",
    emoji: "🧅",
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    items: [
      { name: "Veg Pakode", price: "₹200" },
      { name: "Corn Pakode", price: "₹250" },
      { name: "Paneer Pakode", price: "₹300" },
    ],
  },
  {
    id: "chaat",
    name: "Chaat",
    emoji: "🌿",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    items: [
      { name: "Vegetable Chat", price: "₹300" },
      { name: "Vegetable Peanut Chat", price: "₹350" },
      { name: "Vegetable Paneer Chat", price: "₹400" },
      { name: "Vegetable Paneer Peanut Chat", price: "₹450" },
    ],
  },
  {
    id: "paneer-main",
    name: "Paneer Main Course",
    emoji: "🧀",
    image: "/assets/images/photo-19.png",
    items: [
      { name: "Palak Paneer", price: "₹250" },
      { name: "Matar Paneer", price: "₹250" },
      { name: "Shahi Paneer", price: "₹250" },
      { name: "Kadai Paneer", price: "₹250" },
      { name: "Paneer Masala", price: "₹250" },
      { name: "Paneer Chatpata", price: "₹250" },
      { name: "Paneer Handi", price: "₹250" },
      { name: "Paneer Butter Masala", price: "₹290" },
      { name: "Paneer Lazeez", price: "₹300" },
      { name: "Paneer Tufani", price: "₹300" },
      { name: "Paneer Angara", price: "₹300" },
      { name: "Paneer Tikka Masala", price: "₹350" },
      { name: "Paneer Afghani Masala", price: "₹370" },
      { name: "Paneer Kali Mirch", price: "₹370" },
      { name: "Paneer Bhurji", price: "₹400" },
      { name: "Kaju Paneer", price: "₹350" },
      { name: "Kaju Curry", price: "₹400" },
      { name: "Kaju Cheese Curry", price: "₹450" },
    ],
  },
  {
    id: "veg-main",
    name: "Veg Main Course",
    emoji: "🥘",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    items: [
      { name: "Aloo Matar Gobhi", price: "₹200" },
      { name: "Mix Veg", price: "₹200" },
      { name: "Aloo Methi", price: "₹200" },
      { name: "Jeera Aloo", price: "₹200" },
      { name: "Palak Garlic", price: "₹200" },
      { name: "Palak Corn", price: "₹200" },
      { name: "Aloo Palak", price: "₹200" },
      { name: "Matar Masala", price: "₹200" },
      { name: "Veg Hyderabadi", price: "₹250" },
      { name: "Chana Masala", price: "₹250" },
      { name: "Veg Kolhapuri", price: "₹250" },
      { name: "Veg Angara", price: "₹250" },
      { name: "Veg Kadai", price: "₹300" },
      { name: "Veg Handi", price: "₹300" },
      { name: "Veg Makhanwala", price: "₹320" },
      { name: "Veg Kofta", price: "₹350" },
      { name: "Malai Kofta (Sweet)", price: "₹350" },
      { name: "Methi Mutter Malai", price: "₹350" },
    ],
  },
  {
    id: "breads",
    name: "Breads",
    emoji: "🍞",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    items: [
      { name: "Plain Tandoori Roti", price: "₹20" },
      { name: "Butter Tandoori Roti", price: "₹30" },
      { name: "Lachha Paratha", price: "₹60" },
      { name: "Kulcha", price: "₹60" },
      { name: "Plain Naan", price: "₹80" },
      { name: "Butter Naan", price: "₹90" },
      { name: "Garlic Naan", price: "₹100" },
      { name: "Cheese Naan", price: "₹130" },
      { name: "Cheese Garlic Naan", price: "₹150" },
      { name: "Cheese Chilli Naan", price: "₹150" },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    emoji: "🍚",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    items: [
      { name: "Plain Rice", price: "₹150" },
      { name: "Jeera Rice", price: "₹200" },
      { name: "Veg Pulao", price: "₹250" },
      { name: "Matar Pulao", price: "₹250" },
      { name: "Veg Biryani", price: "₹300" },
      { name: "Veg Hyderabadi Biryani", price: "₹350" },
      { name: "Veg Fry Rice", price: "₹350" },
      { name: "Schezwan Fry Rice", price: "₹400" },
      { name: "Singapore Fry Rice", price: "₹400" },
      { name: "Manchurian Fry Rice", price: "₹400" },
      { name: "Butter Khichdi", price: "₹300" },
      { name: "Kashmiri Pulao", price: "₹400" },
    ],
  },
  {
    id: "dal",
    name: "Dal",
    emoji: "💧",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    items: [
      { name: "Dal Fry", price: "₹200" },
      { name: "Dal Tadka", price: "₹200" },
      { name: "Dal Fry Butter", price: "₹200" },
      { name: "Dal Green Chilli", price: "₹200" },
      { name: "Dal Palak", price: "₹200" },
    ],
  },
  {
    id: "papad",
    name: "Papad",
    emoji: "🫓",
    image:
      "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80",
    items: [
      { name: "Roasted Papad", price: "₹30" },
      { name: "Fry Papad", price: "₹40" },
      { name: "Masala Papad", price: "₹60" },
      { name: "Roasted Masala Papad", price: "₹60" },
      { name: "Cheese Masala Papad", price: "₹140" },
    ],
  },
  {
    id: "raita",
    name: "Raita",
    emoji: "🥛",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    items: [
      { name: "Vegetable Raita", price: "₹250" },
      { name: "Boondi Raita", price: "₹250" },
      { name: "Pineapple Raita (Sweet)", price: "₹300" },
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    emoji: "🍨",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    items: [
      { name: "Vanilla Ice Cream", price: "₹100" },
      { name: "Strawberry Ice Cream", price: "₹100" },
      { name: "Chocolate Ice Cream", price: "₹100" },
      { name: "Butterscotch Ice Cream", price: "₹100" },
      { name: "Vanilla Ice Cream with Gulab Jamun", price: "₹200" },
      { name: "Hot Pot Sundae", price: "₹250" },
      { name: "Ice Cream Fry", price: "₹300" },
      { name: "Brownie with Ice Cream", price: "₹300" },
    ],
  },
  {
    id: "special-buffet",
    name: "Special Buffet",
    emoji: "🎊",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    packages: [
      {
        price: "₹450",
        includes: [
          "Welcome Drinks",
          "2 Types Starters",
          "Paneer Sabzi",
          "Half Gravy Sabzi / Veg Sabzi",
          "Tandoori Roti / Naan / Lachha Paratha",
          "Boondi / Veg Raita",
          "Dal Tadka",
          "Jeera Rice",
          "Roasted Papad",
          "Green Salad",
          "Sweet (2 Types)",
        ],
      },
      {
        price: "₹400",
        includes: [
          "Welcome Drinks",
          "2 Types Starters",
          "Paneer Sabzi",
          "Half Gravy Sabzi / Veg Sabzi",
          "Tandoori Roti / Naan / Lachha Paratha",
          "Boondi / Veg Raita",
          "Dal Tadka",
          "Jeera Rice",
          "Roasted Papad",
          "Green Salad",
          "Sweet (1 Type)",
        ],
      },
    ],
  },
  {
    id: "regular-buffet",
    name: "Regular Buffet",
    emoji: "🍱",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    packages: [
      {
        price: "₹300",
        includes: [
          "5 Starters (Unlimited)",
          "Main Course (Unlimited)",
          "Paneer Sabji",
          "Half Gravy Sabji",
          "Dal Tadka",
          "Tandoori Roti",
          "Naan",
          "Lachha Paratha",
          "Jeera Rice",
          "Boondi / Veg Raita",
          "Roasted Papad",
          "Green Salad",
          "Sweet (1 Type)",
        ],
      },
    ],
  },
  {
    id: "party-buffet",
    name: "Party Buffet",
    emoji: "🎉",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    packages: [
      {
        price: "₹300",
        includes: [
          "Paneer Sabji",
          "Half Gravy Sabji",
          "Dal Tadka",
          "Tandoori Roti",
          "Naan",
          "Lachha Paratha",
          "Jeera Rice",
          "Boondi / Veg Raita",
          "Roasted Papad",
          "Green Salad",
          "Sweet (1 Type)",
        ],
      },
      {
        price: "₹350",
        includes: [
          "Welcome Drinks",
          "Starters (1 Type)",
          "Paneer Sabji",
          "Half Gravy Sabji",
          "Veg Sabji",
          "Tandoori Roti",
          "Naan",
          "Lachha Paratha",
          "Dal Tadka",
          "Jeera Rice",
          "Boondi / Veg Raita",
          "Roasted Papad",
          "Green Salad",
          "Sweet (1 Type)",
        ],
      },
    ],
  },
];

const galleryImages = [
  { url: "/assets/images/photo-01.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-02.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-03.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-04.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-05.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-06.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-07.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-08.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-09.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-10.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-11.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-12.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-13.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-14.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-15.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-16.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-17.png", alt: "Smiley Home Restaurant" },
  { url: "/assets/images/photo-18.png", alt: "Smiley Home Restaurant" },
  {
    url: "/assets/images/photo-19.png",
    alt: "Smiley Home Restaurant – Paneer Tikka",
  },
  {
    url: "/assets/images/photo-20.png",
    alt: "Smiley Home Restaurant – Green Salad",
  },
  {
    url: "/assets/images/photo-21.png",
    alt: "Smiley Home Restaurant – Tomato Salad",
  },
  {
    url: "/assets/images/photo-22.png",
    alt: "Smiley Home Restaurant – Welcome Drinks",
  },
  {
    url: "/assets/images/photo-23.png",
    alt: "Smiley Home Restaurant – Starters",
  },
  {
    url: "/assets/images/photo-24.png",
    alt: "Smiley Home Restaurant – Open Air Dining",
  },
];

const branches = [
  {
    name: "Second Home Mandsaur",
    subtitle: "Mandsaur",
    owner: "Er. Rakesh Mali",
    manager: "Govind Gurjar",
    address:
      "SECOND HOME KITCHEN & RESTAURENT, Behind Girls College, Near Teliya Talab, Bhatrewas, Mandsaur, Madhya Pradesh 458001",
    hours: "Mon-Sun: 11:00 AM – 11:00 PM",
    phone: "9575798248",
    tags: [
      "Rajasthani Cuisine",
      "Dal Baati Churma",
      "Rajasthani Thali",
      "Rooftop Dining",
      "Celebration Setup",
      "Authentic Flavours",
    ],
    mapSrc:
      "https://www.google.com/maps?q=24.0776175,75.0565854&z=17&output=embed",
  },
  {
    name: "Second Home Neemuch",
    subtitle: "Neemuch",
    owner: "Er. Rakesh Mali",
    manager: "Govind Gurjar",
    address:
      "Neemuch City Rd, near Sundram Cinema, near by Sanwaliya Seth ji Temple, Neemuch, Madhya Pradesh 458441",
    hours: "Mon-Sun: 11:00 AM – 11:00 PM",
    phone: "7225898248",
    tags: [
      "Rajasthani Cuisine",
      "Dal Baati Churma",
      "Rajasthani Thali",
      "Dine In",
      "Takeaway",
      "Authentic Flavours",
    ],
    mapSrc: "https://maps.google.com/maps?cid=5850058051823097327&output=embed",
  },
];

const reviews = [
  {
    name: "Riya Sharma",
    text: "The Paneer Tikka Masala here is absolutely divine! Every visit feels like a warm hug.",
    initials: "RS",
  },
  {
    name: "Amit Patel",
    text: "Best homestyle food in the city. The dal makhani is perfection.",
    initials: "AP",
  },
  {
    name: "Priya Nair",
    text: "Incredible hospitality and amazing food. Our family's favourite restaurant!",
    initials: "PN",
  },
  {
    name: "Rahul Kumar",
    text: "The decoration events they cater are stunning. Highly recommend!",
    initials: "RK",
  },
];

const navLinks = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Dining Experience", id: "dining" },
  { label: "Menu", id: "menu" },
  { label: "Offers", id: "offers" },
  { label: "Gallery", id: "gallery" },
  { label: "Branches", id: "branches" },
  { label: "Decoration", id: "decoration" },
  { label: "Social", id: "social" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function StarRating() {
  return (
    <div className="flex gap-0.5 text-yellow-400 text-lg" aria-label="5 stars">
      {["s1", "s2", "s3", "s4", "s5"].map((k) => (
        <span key={k}>★</span>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-muted-foreground max-w-xl mx-auto text-base">
          {subtitle}
        </p>
      )}
      <div
        className="mt-4 mx-auto w-16 h-1 rounded-full"
        style={{ backgroundColor: "#1B4332" }}
      />
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPhotosIframe, setShowPhotosIframe] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance hero carousel
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, []);

  function goToSlide(idx: number) {
    if (slideTimer.current) clearInterval(slideTimer.current);
    setSlideIndex(idx);
    slideTimer.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
  }

  function prevSlide() {
    goToSlide((slideIndex - 1 + heroSlides.length) % heroSlides.length);
  }
  function nextSlide() {
    goToSlide((slideIndex + 1) % heroSlides.length);
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, email, message } = contactForm;
    const waUrl = `https://wa.me/919981716485?text=Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AMessage: ${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setFormSent(true);
    setContactForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── STICKY NAVBAR ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-navbar shadow-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            className="font-display text-lg font-bold text-white cursor-pointer bg-transparent border-0 p-0 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            onClick={() => scrollToSection("home")}
            data-ocid="nav.logo"
          >
            <img
              src="/assets/logo.png"
              alt="Smiley Home Restaurant Logo"
              className="h-16 w-16 object-cover rounded-full mr-2 border-2 border-white shadow-lg"
            />
            Smiley Home Restaurant
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 font-body text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                data-ocid={`nav.${link.id}`}
                className="text-white/90 hover:text-white transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden text-white p-2 focus-visible:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.hamburger"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Menu</title>
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-navbar border-t border-white/10 px-4 pb-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  scrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                data-ocid={`nav.mobile.${link.id}`}
                className="block w-full text-left text-white/90 hover:text-white py-2 font-body text-sm transition-smooth"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ── HERO CAROUSEL ─────────────────────────────────────────── */}
        <section
          id="home"
          className="relative h-[90vh] min-h-[500px] overflow-hidden"
        >
          {heroSlides.map((slide, i) => (
            <img
              key={slide.url}
              src={slide.url}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === slideIndex ? "opacity-100" : "opacity-0"}`}
              aria-hidden={i !== slideIndex}
            />
          ))}
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-body text-sm font-semibold px-4 py-1.5 rounded-full border border-white/40 mb-4 drop-shadow">
              🌿 First Boho Café in Mandsaur
            </span>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
              Smiley Home Restaurant
            </h1>
            <p className="font-body text-base sm:text-lg text-white/90 mb-2 drop-shadow font-medium tracking-wide">
              100% Pure Vegetarian · Mandsaur, MP
            </p>
            <p className="font-body text-sm sm:text-base text-white/80 mb-8 max-w-lg drop-shadow italic">
              The first Boho Café in Mandsaur — cozy, authentic, and
              unforgettable
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                data-ocid="hero.primary_button"
                onClick={() => scrollToSection("menu")}
                className="inline-block text-white font-display font-semibold text-base px-8 py-3 rounded-full shadow-green-lg hover:scale-105 transition-smooth border-2 border-white/70"
                style={{ backgroundColor: "#1B4332" }}
              >
                View Our Menu
              </button>
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919981716485"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="hero.whatsapp_button"
                className="inline-flex items-center gap-2 font-display font-semibold text-base px-8 py-3 rounded-full transition-smooth hover:scale-105 border-2 border-white/30"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                {/* WhatsApp SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <title>WhatsApp</title>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Carousel arrows */}
          <button
            type="button"
            onClick={prevSlide}
            data-ocid="hero.prev_button"
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-11 h-11 flex items-center justify-center transition-smooth"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextSlide}
            data-ocid="hero.next_button"
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-11 h-11 flex items-center justify-center transition-smooth"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.url}
                type="button"
                onClick={() => goToSlide(i)}
                data-ocid={`hero.dot.${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-smooth ${i === slideIndex ? "bg-white scale-110" : "bg-white/50"}`}
              />
            ))}
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section id="about" className="bg-background py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="About Us" />
              <p
                className="font-display text-xl font-semibold text-foreground mb-1"
                style={{ color: "#1B4332" }}
              >
                Our Story
              </p>
              <p className="font-body text-muted-foreground text-sm font-medium mb-4 italic">
                A Café Born from Passion
              </p>
              <p className="font-body text-foreground/80 leading-relaxed text-base mb-6">
                Welcome to Smiley Home Restaurant – the first Boho Cafe in
                Mandsaur. We created this cafe to bring a cozy bohemian vibe
                where people can relax, celebrate, and enjoy delicious food. Our
                cafe is perfect for birthdays, anniversaries, surprise
                celebrations, and romantic dinners. Every corner of our space is
                designed to create memorable experiences.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  {
                    icon: "🎂",
                    label: "Celebrations",
                    sub: "Birthdays & Anniversaries",
                  },
                  { icon: "🌿", label: "100% Veg", sub: "Pure Vegetarian" },
                  {
                    icon: "✨",
                    label: "Boho Ambiance",
                    sub: "Unique Atmosphere",
                  },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center text-center bg-card rounded-xl p-4 border border-border shadow-card"
                  >
                    <span className="text-2xl mb-1">{badge.icon}</span>
                    <p className="font-display text-sm font-bold text-foreground">
                      {badge.label}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {badge.sub}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollToSection("menu")}
                data-ocid="about.menu_button"
                className="inline-block text-white font-display font-semibold px-7 py-3 rounded-full shadow-green hover:shadow-green-lg transition-smooth hover:scale-105"
                style={{ backgroundColor: "#1B4332" }}
              >
                Explore Our Menu
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-green-lg">
              <img
                src="/assets/images/photo-04.png"
                alt="Smiley Home Restaurant – illuminated entrance at night"
                className="w-full h-72 lg:h-96 object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── DINING EXPERIENCE ─────────────────────────────────────── */}
        <section id="dining" className="bg-muted/40 py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="Dining Experience"
              subtitle="Discover the perfect setting for every occasion"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 card-3d-wrapper">
              {[
                {
                  photo: "/assets/images/photo-11.png",
                  title: "Open Air Rooftop Dining",
                  desc: "Enjoy your meal under the open sky at our rooftop restaurant. Fresh air, beautiful ambiance, and delicious food — perfect for relaxed evenings with family and friends.",
                  tags: ["Open Air", "Rooftop", "Evening Dining"],
                },
                {
                  photo: "/assets/images/photo-03.png",
                  title: "Indoor Theme Dining",
                  desc: "Immerse yourself in our beautifully themed indoor spaces. Boho-inspired décor, soft lighting, and a cozy atmosphere that makes every meal feel special.",
                  tags: ["Boho Décor", "AC Seating", "Theme Lighting"],
                },
                {
                  photo: "/assets/images/photo-14.png",
                  title: "Private Celebration Dining",
                  desc: "Make your special moments unforgettable with our private dining setups. Perfect for birthdays, anniversaries, and surprise parties with personalized decoration.",
                  tags: ["Birthday", "Anniversary", "Private Setup"],
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  data-ocid={`dining.item.${i + 1}`}
                  className="card-3d bg-card rounded-xl overflow-hidden shadow-card border border-border group"
                  style={{ transformOrigin: "center bottom" }}
                >
                  {/* Card photo */}
                  <div className="h-52 overflow-hidden">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                  </div>
                  {/* Card body */}
                  <div className="p-6">
                    <h3
                      className="font-display text-lg font-bold mb-2"
                      style={{ color: "#1B4332" }}
                    >
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block text-xs font-semibold font-body text-white px-3 py-1 rounded-full"
                          style={{ backgroundColor: "#1B4332" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENU ──────────────────────────────────────────────────── */}
        <section
          id="menu"
          className="py-20 px-4 sm:px-6"
          style={{ backgroundColor: "oklch(0.94 0.04 295)" }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section heading */}
            <div className="text-center mb-10">
              <h2
                className="font-display text-3xl sm:text-4xl font-bold mb-3"
                style={{ color: "#4C1D95" }}
              >
                Our Menu
              </h2>
              <p
                className="font-body text-base max-w-xl mx-auto"
                style={{ color: "#6D28D9" }}
              >
                Fresh, pure vegetarian food made with love
              </p>
              <div
                className="mt-4 mx-auto w-16 h-1 rounded-full"
                style={{ backgroundColor: "#F59E0B" }}
              />
            </div>

            {/* Category tabs — horizontal scrollable */}
            <div
              className="flex flex-nowrap overflow-x-auto gap-3 pb-3 mb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              data-ocid="menu.category_tabs"
            >
              {menuCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveMenuCategory(i)}
                  data-ocid={`menu.tab.${i + 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={
                    activeMenuCategory === i
                      ? {
                          backgroundColor: "#F59E0B",
                          color: "#fff",
                          boxShadow: "0 2px 10px rgba(245,158,11,0.4)",
                        }
                      : {
                          backgroundColor: "#fff",
                          color: "#374151",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }
                  }
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* WhatsApp Order Button */}
            <div className="flex justify-center mb-8">
              <a
                href="https://wa.me/919981716485"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="menu.whatsapp_order_button"
                className="inline-flex items-center gap-3 font-display font-semibold text-base px-8 py-3.5 rounded-full transition-smooth hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: "#25D366",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <title>WhatsApp</title>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                📱 Order Now on WhatsApp
              </a>
            </div>

            {/* Active category content */}
            {menuCategories.map((cat, i) => (
              <div
                key={cat.id}
                style={{ display: activeMenuCategory === i ? "block" : "none" }}
              >
                {/* Category banner image */}
                <div
                  className="rounded-xl overflow-hidden mb-8 shadow-card"
                  style={{ height: "280px" }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Category title */}
                <h3
                  className="font-display text-2xl font-bold mb-6 text-center"
                  style={{ color: "#4C1D95" }}
                >
                  {cat.emoji} {cat.name}
                </h3>

                {/* Regular menu items grid */}
                {cat.items && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 card-3d-wrapper">
                    {cat.items.map((item, j) => (
                      <div
                        key={`${cat.id}-${item.name}-${j}`}
                        data-ocid={`menu.item.${j + 1}`}
                        className="card-3d bg-card rounded-xl p-4 shadow-card border border-border flex flex-col justify-between"
                        style={{ borderColor: "rgba(109,40,217,0.15)" }}
                      >
                        <p className="font-display text-sm font-semibold text-foreground mb-2 leading-snug">
                          {item.name}
                        </p>
                        <span
                          className="font-display font-bold text-base"
                          style={{
                            color:
                              item.price === "Ask price"
                                ? "#F59E0B"
                                : "#1B4332",
                          }}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Buffet packages */}
                {cat.packages && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 card-3d-wrapper">
                    {cat.packages.map((pkg, k) => (
                      <div
                        key={`${cat.id}-pkg-${k}`}
                        data-ocid={`menu.buffet.${k + 1}`}
                        className="card-3d rounded-2xl p-6 shadow-card border-2 flex flex-col"
                        style={{
                          background:
                            "linear-gradient(135deg, #fff 0%, #faf5ff 100%)",
                          borderColor: "#C4B5FD",
                        }}
                      >
                        {/* Price badge */}
                        <div className="text-center mb-5">
                          <span
                            className="inline-flex items-baseline gap-1 font-display font-bold text-4xl"
                            style={{ color: "#4C1D95" }}
                          >
                            {pkg.price}
                          </span>
                          <p
                            className="font-body text-sm mt-1"
                            style={{ color: "#6D28D9" }}
                          >
                            per person
                          </p>
                        </div>
                        {/* Divider */}
                        <div
                          className="w-12 h-0.5 mx-auto mb-5 rounded-full"
                          style={{ backgroundColor: "#F59E0B" }}
                        />
                        {/* Includes list */}
                        <ul className="space-y-2 flex-1">
                          {pkg.includes.map((inc) => (
                            <li
                              key={inc}
                              className="flex items-start gap-2 font-body text-sm"
                              style={{ color: "#374151" }}
                            >
                              <span
                                style={{
                                  color: "#F59E0B",
                                  flexShrink: 0,
                                  marginTop: "1px",
                                }}
                              >
                                ✦
                              </span>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── SPECIAL OFFERS ────────────────────────────────────────── */}
        <section id="offers" className="bg-muted/40 py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="Special Offers"
              subtitle="Exclusive deals just for our valued customers in Mandsaur"
            />
            <div className="grid sm:grid-cols-3 gap-6 card-3d-wrapper mb-8">
              {/* Card 1 — Party Orders */}
              <div
                data-ocid="offers.item.1"
                className="card-3d rounded-xl p-6 border-2 shadow-card"
                style={{ backgroundColor: "#EEF2FF", borderColor: "#6366F133" }}
              >
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4"
                  style={{ backgroundColor: "#4F46E5" }}
                >
                  Catering
                </span>
                <div className="text-4xl mb-3">🍕</div>
                <h3
                  className="font-display text-xl font-bold mb-2"
                  style={{ color: "#1B4332" }}
                >
                  Party Orders
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Customized party platters and bulk catering for all events in
                  Mandsaur.
                </p>
              </div>

              {/* Card 2 — Free Unlimited Food */}
              <div
                data-ocid="offers.item.2"
                className="card-3d rounded-xl p-6 border-2 shadow-card"
                style={{ backgroundColor: "#D1FAE5", borderColor: "#1B433233" }}
              >
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4"
                  style={{ backgroundColor: "#1B4332" }}
                >
                  Best Deal
                </span>
                <div className="text-4xl mb-3">🍽️</div>
                <h3
                  className="font-display text-xl font-bold mb-1"
                  style={{ color: "#1B4332" }}
                >
                  Free Unlimited Food
                </h3>
                <p
                  className="font-body text-sm font-semibold mb-2"
                  style={{ color: "#059669" }}
                >
                  Only ₹299 per person
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Eat as much as you want — unlimited food for just ₹299 only! A
                  full meal experience at the most affordable price in Mandsaur.
                </p>
              </div>

              {/* Card 3 — Everyday New Offers */}
              <div
                data-ocid="offers.item.3"
                className="card-3d rounded-xl p-6 border-2 shadow-card"
                style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B33" }}
              >
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4"
                  style={{ backgroundColor: "#D97706" }}
                >
                  Daily Surprise
                </span>
                <div className="text-4xl mb-3">🎉</div>
                <h3
                  className="font-display text-xl font-bold mb-1"
                  style={{ color: "#1B4332" }}
                >
                  Everyday New Offers
                </h3>
                <p
                  className="font-body text-sm font-semibold mb-2"
                  style={{ color: "#D97706" }}
                >
                  Fresh deals every day!
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  We bring new offers and discounts every single day. Visit us
                  or call to know today's special deal. Don't miss out!
                </p>
              </div>
            </div>

            {/* Full-width CTA button */}
            <div className="flex justify-center">
              <a
                href="tel:+919981716485"
                data-ocid="offers.cta_button"
                className="w-full max-w-2xl flex items-center justify-center gap-3 font-display font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg transition-smooth hover:scale-[1.02]"
                style={{
                  backgroundColor: "#F59E0B",
                  color: "#1C1917",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.45)",
                }}
              >
                📞 Call to Know Today's Offer: +91 99817 16485
              </a>
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────────── */}
        <section id="gallery" className="bg-background py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="Our Gallery"
              subtitle="A glimpse into our world of food and ambiance"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 card-3d-wrapper">
              {galleryImages.map((img, i) => (
                <div
                  key={img.url}
                  data-ocid={`gallery.item.${i + 1}`}
                  className="card-3d card-3d-light rounded-xl overflow-hidden shadow-card aspect-square group"
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
              ))}
            </div>

            {/* Instagram CTA button */}
            <div className="mt-10 flex justify-center">
              <a
                href="https://www.instagram.com/smiley_home_mandsaur"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="gallery.instagram_button"
                className="inline-flex items-center gap-3 font-display font-semibold text-base px-8 py-4 rounded-full transition-smooth hover:scale-105 shadow-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #833ab4 0%, #e1306c 40%, #fd1d1d 70%, #fcaf45 100%)",
                  boxShadow: "0 4px 20px rgba(225,48,108,0.4)",
                }}
              >
                <span className="text-xl">📸</span>
                <span>See Our Instagram Posts &amp; Photos</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <title>Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── BRANCHES ──────────────────────────────────────────────── */}
        <section id="branches" className="bg-muted/40 py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              title="Our Branches"
              subtitle="Find us at a location near you"
            />
            <div className="grid sm:grid-cols-2 gap-8">
              {branches.map((branch, i) => (
                <div
                  key={branch.name}
                  data-ocid={`branches.item.${i + 1}`}
                  className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Card body */}
                  <div className="p-6 space-y-4">
                    {/* Logo */}
                    <div className="flex justify-center">
                      <img
                        src="/assets/second-home-logo.png"
                        className="w-48 h-auto mx-auto object-contain"
                        alt="Second Home Logo"
                      />
                    </div>
                    {/* Title & subtitle */}
                    <div className="text-center">
                      <h3
                        className="font-display text-2xl font-bold"
                        style={{ color: "#1B4332" }}
                      >
                        {branch.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {branch.subtitle}
                      </p>
                    </div>
                    {/* Owner & Manager */}
                    <div className="space-y-1 font-body text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold uppercase tracking-wide text-xs"
                          style={{ color: "#D97706" }}
                        >
                          Owner
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "#1B4332" }}
                        >
                          {branch.owner}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold uppercase tracking-wide text-xs"
                          style={{ color: "#0D9488" }}
                        >
                          Manager
                        </span>
                        <span className="font-semibold text-foreground">
                          {branch.manager}
                        </span>
                      </div>
                    </div>
                    {/* Address & Hours */}
                    <div className="space-y-2 font-body text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5">📍</span>
                        <span>{branch.address}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5">🕐</span>
                        <span>{branch.hours}</span>
                      </p>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {branch.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-3 py-1 rounded-full border"
                          style={{
                            borderColor: "#1B4332",
                            color: "#1B4332",
                            backgroundColor: "#F0FDF4",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <a
                        href={`tel:${branch.phone}`}
                        data-ocid={`branches.call_button.${i + 1}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#0F766E" }}
                      >
                        📞 Call
                      </a>
                      <a
                        href={`https://wa.me/91${branch.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`branches.whatsapp_button.${i + 1}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#16A34A" }}
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                  {/* Embedded Map */}
                  <iframe
                    src={branch.mapSrc}
                    className="w-full h-56 border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map – ${branch.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DECORATIONS ───────────────────────────────────────────── */}
        <section id="decoration" className="bg-background py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section header with gradient accent */}
            <div className="text-center mb-12">
              <span
                className="inline-flex items-center gap-2 font-body text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
                style={{ backgroundColor: "#D1FAE5", color: "#1B4332" }}
              >
                🎨 Premium Decoration Service
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold mb-3"
                style={{ color: "#1B4332" }}
              >
                Our Decorations
              </h2>
              <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
                Stunning decoration setups for every special occasion —
                birthdays, anniversaries, and celebrations
              </p>
              <div
                className="mt-4 mx-auto w-16 h-1 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1B4332, #F59E0B)",
                }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-10 card-3d-wrapper">
              {/* Photos card */}
              <div
                data-ocid="decoration.photos.card"
                className="card-3d rounded-2xl overflow-hidden shadow-green-lg border border-border"
                style={{
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                }}
              >
                <div
                  className="px-8 pt-8 pb-6 text-center"
                  style={{ borderBottom: "1px solid rgba(27,67,50,0.12)" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-card"
                    style={{ backgroundColor: "#1B4332" }}
                  >
                    📸
                  </div>
                  <h3
                    className="font-display text-xl font-bold mb-2"
                    style={{ color: "#1B4332" }}
                  >
                    Decoration Photos
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                    Browse our stunning collection of table decorations, floral
                    arrangements, and themed setups for all occasions
                  </p>
                  {/* Highlighted WhatsApp announcement */}
                  <div className="bg-yellow-400 border-2 border-yellow-600 rounded-xl p-4 mb-4 text-center shadow-md">
                    <p className="text-gray-900 font-black text-base md:text-lg leading-snug">
                      📸 PLEASE TAKE SCREENSHOT AND SEND US ON OUR WHATSAPP
                      NUMBER
                    </p>
                    <p className="text-gray-900 font-bold text-base mt-1">
                      WhatsApp:{" "}
                      <a
                        href="https://wa.me/919981716485"
                        className="underline font-black"
                        style={{ color: "#1B4332" }}
                      >
                        +91 9981716485
                      </a>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhotosIframe(!showPhotosIframe)}
                    data-ocid="decoration.view_photos_button"
                    className="inline-flex items-center gap-2 text-white font-display font-semibold px-7 py-3 rounded-full shadow-green hover:shadow-green-lg transition-smooth hover:scale-105"
                    style={{ backgroundColor: "#1B4332" }}
                  >
                    {showPhotosIframe ? (
                      <>
                        <span>🙈</span> Hide Photos
                      </>
                    ) : (
                      <>
                        <span>🖼️</span> View Photos
                      </>
                    )}
                  </button>
                </div>
                {/* Feature tags */}
                <div className="px-8 py-4 flex flex-wrap gap-2 justify-center">
                  {[
                    "Birthdays",
                    "Anniversaries",
                    "Surprise Parties",
                    "Romantic Dinners",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold font-body px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(27,67,50,0.1)",
                        color: "#1B4332",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Videos card */}
              <div
                data-ocid="decoration.videos.card"
                className="card-3d rounded-2xl overflow-hidden shadow-green-lg border border-border"
                style={{
                  background:
                    "linear-gradient(135deg, #fef9c3 0%, #fef08a 40%, #fff7ed 100%)",
                }}
              >
                <div
                  className="px-8 pt-8 pb-6 text-center"
                  style={{ borderBottom: "1px solid rgba(245,158,11,0.2)" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-card"
                    style={{ backgroundColor: "#D97706" }}
                  >
                    🎬
                  </div>
                  <h3
                    className="font-display text-xl font-bold mb-2"
                    style={{ color: "#92400E" }}
                  >
                    Setup Videos
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                    Watch behind-the-scenes decoration setup videos and get
                    inspired for your next celebration
                  </p>
                  {/* Highlighted setup number announcement */}
                  <div className="bg-orange-400 border-2 border-orange-600 rounded-xl p-4 mb-4 text-center shadow-md">
                    <p className="text-gray-900 font-black text-base md:text-lg leading-snug">
                      🎬 Please tell us the setup number provided by us in the
                      video and book the setup by contacting us on our WhatsApp
                      number
                    </p>
                    <p className="text-gray-900 font-bold text-base mt-1">
                      WhatsApp:{" "}
                      <a
                        href="https://wa.me/919981716485"
                        className="underline font-black"
                        style={{ color: "#1B4332" }}
                      >
                        +91 9981716485
                      </a>
                    </p>
                  </div>
                  <a
                    href="https://drive.google.com/drive/folders/1UJ007ro6ZVE97LKLf4heyxv9Ym1f0uJ2"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="decoration.watch_videos_button"
                    className="inline-flex items-center gap-2 text-white font-display font-semibold px-7 py-3 rounded-full transition-smooth hover:scale-105 shadow-lg"
                    style={{
                      backgroundColor: "#D97706",
                      boxShadow: "0 4px 14px rgba(217,119,6,0.4)",
                    }}
                  >
                    <span>▶️</span> Watch Videos
                  </a>
                </div>
                {/* Feature tags */}
                <div className="px-8 py-4 flex flex-wrap gap-2 justify-center">
                  {[
                    "Step-by-step",
                    "Theme Ideas",
                    "Floral Designs",
                    "DIY Tips",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold font-body px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(217,119,6,0.12)",
                        color: "#92400E",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded iframe (toggled) */}
            {showPhotosIframe && (
              <div
                className="rounded-2xl overflow-hidden shadow-green-lg border-2"
                style={{ borderColor: "rgba(27,67,50,0.2)" }}
              >
                <div
                  className="px-6 py-4 flex items-center gap-3"
                  style={{ backgroundColor: "#1B4332" }}
                >
                  <span className="text-white text-lg">📸</span>
                  <h4 className="font-display text-base font-semibold text-white">
                    Decoration Photo Gallery
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPhotosIframe(false)}
                    data-ocid="decoration.close_photos_button"
                    className="ml-auto text-white/70 hover:text-white transition-smooth text-sm font-body"
                    aria-label="Close photo gallery"
                  >
                    ✕ Close
                  </button>
                </div>
                <iframe
                  src="https://drive.google.com/file/d/1G_naD_VoU62lkXOehQqaBhdbjCM4zRXB/preview"
                  width="100%"
                  height="500"
                  allow="autoplay"
                  className="block border-0"
                  title="Decoration Photos"
                />
              </div>
            )}
          </div>
        </section>

        {/* ── SOCIAL ────────────────────────────────────────────────── */}
        <section id="social" className="bg-muted/40 py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              title="Follow Us"
              subtitle="Stay connected and never miss an update"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 card-3d-wrapper">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Smiley-Home-Restaurant/61582027702462/?ref=PROFILE_EDIT_xav_ig_profile_page_web#"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="social.item.1"
                className="card-3d rounded-xl p-6 text-center border shadow-card no-underline block"
                style={{
                  backgroundColor: "#EBF5FB",
                  borderColor: "#1877F233",
                  textDecoration: "none",
                }}
              >
                <div className="text-4xl mb-3">📘</div>
                <h4
                  className="font-display text-base font-bold mb-1"
                  style={{ color: "#1877F2" }}
                >
                  Facebook
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  @SmileyHomeRestaurant
                </p>
                <span
                  className="inline-block mt-3 text-xs font-semibold font-body px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#1877F2", color: "#fff" }}
                >
                  Follow Us
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/smiley_home_mandsaur?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="social.item.2"
                className="card-3d rounded-xl p-6 text-center border shadow-card block"
                style={{
                  backgroundColor: "#FDF2F8",
                  borderColor: "#E1306C33",
                  textDecoration: "none",
                }}
              >
                <div className="text-4xl mb-3">📸</div>
                <h4
                  className="font-display text-base font-bold mb-1"
                  style={{ color: "#E1306C" }}
                >
                  Instagram
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  @smiley_home_mandsaur
                </p>
                <span
                  className="inline-block mt-3 text-xs font-semibold font-body px-3 py-1 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4, #e1306c, #fd1d1d, #fcaf45)",
                    color: "#fff",
                  }}
                >
                  Follow Us
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919981716485"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="social.item.3"
                className="card-3d rounded-xl p-6 text-center border shadow-card block"
                style={{
                  backgroundColor: "#F0FFF4",
                  borderColor: "#25D36633",
                  textDecoration: "none",
                }}
              >
                <div className="text-4xl mb-3">💬</div>
                <h4
                  className="font-display text-base font-bold mb-1"
                  style={{ color: "#25D366" }}
                >
                  WhatsApp
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  +91 99817 16485
                </p>
                <span
                  className="inline-block mt-3 text-xs font-semibold font-body px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  Chat with Us
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ───────────────────────────────────────────────── */}
        <section id="reviews" className="bg-background py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="Customer Reviews"
              subtitle="What our guests say about us"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 card-3d-wrapper">
              {reviews.map((r, i) => (
                <div
                  key={r.name}
                  data-ocid={`reviews.item.${i + 1}`}
                  className="card-3d bg-card rounded-xl p-6 shadow-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-display shrink-0"
                      style={{ backgroundColor: "#1B4332" }}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {r.name}
                      </p>
                      <StarRating />
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* See More Reviews button */}
            <div className="mt-10 flex justify-center">
              <a
                href="https://www.google.com/search?client=tablet-android-lenovo-rvo3&hs=YdtU&sca_esv=4e439cc8ed654093&sxsrf=ANbL-n4GBY6ZYs4rDSjmPVz-Gfx6PiMnmw:1774114552521&q=smiley+home+restaurant+mandsaur+reviews&uds=ALYpb_kZaRqzyF4xJu95rhlPO-1eyzOGRSjCD7EdlLlCTQS70WCrj_Q3K236aio7tG2xseeMoGUCJIuH3f8NA1IpicuV9aC6_NASiHa2zfKY9nMgOhylJMyWG9ymKmpsgHE7Gp44oo-caoJS4pm3tlfVmGULRUVqxdoEHw9RL-ZW-gh9n1qlRlbQrggFunhpLssE0CkgBAtCFkFVxbW6g08WsNlz676YGy7ipIB-80nHazC2gNWqaGtbObGCbvmb5ziIR2y3XkK_DTbcvd2SHv247vDcq9LL1I6M_0HCTqMf00mvsCqGLTC8h03Swnp6UwDm0PS1HErKidsFTmb9VBB1qU4U6DoBIxj8eeHaCs71BJDXDpZxIs7aYASiKND2-QSbZHF34psmJfX7KsdqTOsIK8zGSo7FJFQhNGobGQ1rn52R9RTpARcY2KRn5U4jO5Imj8RKmgy6wmF1kETxJH7n4c0JIPJRNQ&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOVB8HVXsOwRn9x0sNsJfP2YwYrTY_WHi8f9fMxpYm41YsXWOG48bKFS_i_tEZPm_FmB25i1Pj241GE6mEQbKa-aU7WJP_UOiwI9lmgI8Q6AAJfocsw%3D%3D&sa=X&sqi=2&ved=2ahUKEwj9msbdw7GTAxWMs1YBHUZZBjgQk8gLegQIJRAB&ictx=1&stq=1&cs=0&lei=-Na-af2-H4zn2roPxrKZwAM#ebo=2"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="reviews.see_more_button"
                className="inline-flex items-center gap-2 font-display font-semibold text-base px-8 py-4 rounded-full transition-smooth hover:scale-105 shadow-lg text-white"
                style={{
                  backgroundColor: "#1B4332",
                  boxShadow: "0 4px 16px rgba(27,67,50,0.35)",
                }}
              >
                ⭐ See Our More Reviews
              </a>
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <section id="contact" className="bg-muted/40 py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              title="Contact Us"
              subtitle="We'd love to hear from you"
            />
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact info */}
              <div className="space-y-5">
                {[
                  {
                    icon: "📍",
                    label: "Address",
                    value: "32MW+XQ3, Mandsaur, Madhya Pradesh 458001",
                  },
                  { icon: "📞", label: "Phone", value: "+91 9981716485" },
                  {
                    icon: "📧",
                    label: "Email",
                    value: "smileyhomerestaurant@gmail.com",
                  },
                  {
                    icon: "🕐",
                    label: "Hours",
                    value: "Mon-Sun: 1:00 PM – 11:00 PM",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border shadow-card"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                      {item.label === "Email" ? (
                        <a
                          href={`mailto:${item.value}`}
                          className="font-body text-sm text-muted-foreground hover:underline"
                          style={{ color: "#1B4332" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <form
                onSubmit={handleContactSubmit}
                className="bg-card rounded-xl p-8 border border-border shadow-card space-y-5"
              >
                {formSent ? (
                  <div
                    data-ocid="contact.success_state"
                    className="text-center py-8"
                  >
                    <div className="text-5xl mb-3">✅</div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="font-body text-muted-foreground">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSent(false)}
                      className="mt-4 text-sm underline"
                      style={{ color: "#1B4332" }}
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        className="block font-body text-sm font-medium text-foreground mb-1.5"
                        htmlFor="contact-name"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        data-ocid="contact.name.input"
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-body text-sm font-medium text-foreground mb-1.5"
                        htmlFor="contact-email"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        data-ocid="contact.email.input"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-body text-sm font-medium text-foreground mb-1.5"
                        htmlFor="contact-message"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        data-ocid="contact.message.textarea"
                        placeholder="Write your message here..."
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      data-ocid="contact.submit_button"
                      className="w-full text-white font-display font-semibold py-3 rounded-full shadow-green hover:shadow-green-lg transition-smooth hover:scale-[1.02]"
                      style={{ backgroundColor: "#1B4332" }}
                    >
                      Send Message
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Google Map Embed */}
            <div
              className="w-full rounded-2xl overflow-hidden shadow-lg mt-8 max-w-4xl mx-auto"
              style={{ height: "400px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.5!2d75.0469144!3d24.0848856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39642b29a50c86c9%3A0xeb3032c02ecab05!2sSmiley+Home+Restaurant!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Smiley Home Restaurant Location"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── WHATSAPP FLOATING BUTTON ──────────────────────────────── */}
      <a
        href="https://wa.me/919981716485"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="site.whatsapp_fab"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="whatsapp-fab"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          border: "3px solid #fff",
          boxShadow:
            "0 4px 20px rgba(37,211,102,0.5), 0 2px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          animation: "waPulse 2.5s ease-in-out infinite",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="30"
          height="30"
          aria-hidden="true"
        >
          <title>WhatsApp</title>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-footer py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                🍽️ Smiley Home Restaurant
              </h3>
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Serving authentic homestyle cuisine since 2010. Made with love,
                served with a smile.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    data-ocid={`footer.nav.${link.id}`}
                    className="text-left font-body text-sm text-white/70 hover:text-white transition-smooth"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                Contact
              </h4>
              <div className="space-y-1.5 font-body text-sm text-white/70">
                <p>📞 +91 9981716485</p>
                <p>📧 smileyhomerestaurant@gmail.com</p>
                <p>📍 32MW+XQ3, Mandsaur, MP 458001</p>
                <p>🕐 Mon-Sun: 1:00 PM – 11:00 PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="font-body text-sm text-white/60">
              © {new Date().getFullYear()} Smiley Home Restaurant. All Rights
              Reserved. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-smooth"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
