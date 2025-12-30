# 🥐 Artisan Bakery - Premium Frontend Experience

A high-end, immersive e-commerce frontend for an artisan bakery, meticulously crafted with **Next.js 15**, **Tailwind CSS**, and **Framer Motion**. This project focuses on high-performance animations, premium aesthetics, and a clean architecture ready for **FastAPI** integration.

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🗺️ Project Map & Features

### 1. Home Page (`/`)
The landing experience designed to convert visitors through visual storytelling.
- **Hero Section:** High-impact entrance with animated typography and primary CTA.
- **Specialties Section:** Showcases top-tier products with 3D-effect hover cards.
- **About Section:** Brand narrative with staggered image reveals.
- **Marquee Tickers:** Dynamic text scrolls for "Fresh Daily" and "Same Day Delivery".
- **Reviews:** Social proof carousel with animated entry.

### 2. Menu & Exploration (`/menu`)
The central hub for product discovery.
- **Real-time Search:** Instantly filters products as the user types.
- **Category Filtering:** Quick-toggle filters for Cakes, Pastries, Cookies, etc.
- **Animated Grid:** Products use `AnimatePresence` for smooth layout transitions when filtering.

### 3. Product Details (`/product/[id]`)
In-depth view for individual items.
- **Image Gallery:** Premium presentation of bakery items.
- **Interactive Cart:** Add-to-cart functionality with immediate feedback.
- **Specifications:** Details on ingredients and dietary info.

### 4. Shopping & Checkout (`/checkout`)
The conversion funnel.
- **Cart Sidebar:** Accessible from any page via the Animated Navbar.
- **Progressive Checkout:** Clean, distraction-free flow for order details.
- **State Management:** Powered by `Zustand` for persistent, performant cart data.

### 5. User Management & Tracking (Mocked)
- **Dashboard (`/dashboard`):** Visual summary of recent orders and account activity.
- **Profile (`/profile`):** User settings and contact information.
- **Order Tracking (`/track/[id]`):** Real-time status UI for pending deliveries.

---

## 🎨 Design System & Animations

### High-End Aesthetics
- **Typography:** Uses `Cormorant Garamond` for an elegant, artisanal feel and `Geist` for modern readability.
- **Color Palette:** Deep chocolates, warm caramels, and soft creams defined in `tailwind.config.ts`.
- **Visual Edits:** Enabled for real-time UI tweaking.

### Motion Principles
- **Navbar:** Staggered link animations on load and a scroll-linked progress bar.
- **Cursor Follower:** Custom SVG-based interaction that follows the user's movement.
- **Preloader:** Sophisticated loading sequence to ensure assets are ready.
- **Scroll Reveals:** Intersection Observer-based triggers for smooth content entry.

---

## 🛠️ FastAPI Integration Guide

The project currently uses **Mock Data** (`src/lib/mockData.ts`) to simulate a backend. To integrate FastAPI, follow these requirements:

### Data Models (Pydantic)
```python
class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_url: str
    category: str

class Review(BaseModel):
    id: str
    rating: int
    comment: str
    user_name: str
    created_at: datetime
```

### Required API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all bakery items |
| `GET` | `/api/products/{id}` | Single product details |
| `GET` | `/api/reviews` | Fetch customer testimonials |
| `POST` | `/api/orders` | Submit new checkout data |
| `GET` | `/api/orders/{id}` | Track order status |
| `POST` | `/api/auth/login` | JWT Authentication |

### Environment Setup
Replace the mock logic in `src/lib/hooks/` with `fetch` or `axios` calls pointing to your FastAPI URL.

---

## 🏗️ Architecture Details

- **Components:** Modular, reusable UI elements in `src/components/`.
- **Hooks:** Custom logic for cart management and data fetching in `src/hooks/`.
- **Lib:** Centralized utilities, mock data, and store definitions in `src/lib/`.
- **Global Styles:** Tailwind configurations and custom CSS variables in `src/app/globals.css`.

---

*Handcrafted with ❤️ for the finest bakeries.*
