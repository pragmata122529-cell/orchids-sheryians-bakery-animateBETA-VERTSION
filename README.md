# 🍰 Home Bakery - Artisan Frontend Mockup

A premium, high-performance artisan bakery frontend built with Next.js, Framer Motion, and Tailwind CSS. This project is currently configured as a **pure frontend mockup** using centralized mock data, designed to be easily integrated with a custom FastAPI backend.

## 🚀 Vision
The goal of this project is to provide a world-class user experience for a local bakery, featuring smooth animations, interactive menus, and a robust order tracking system. It follows a "Bento-grid" and "Clean-Industrial" aesthetic with a warm chocolate-caramel palette.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand (for Shopping Cart)
- **Components**: Radix UI / Shadcn UI
- **Typography**: Cormorant Garamond (Serif) & Inter (Sans)

---

## 📂 Project Structure
```text
src/
├── app/                  # Next.js App Router pages
│   ├── checkout/         # Order placement & summary
│   ├── dashboard/        # User order history
│   ├── menu/             # Searchable product catalog
│   ├── product/[id]/     # Dynamic product details
│   ├── profile/          # User account management
│   └── track/[id]/       # Real-time order tracking simulation
├── components/           # Reusable UI components
│   ├── Navbar/           # Animated global navigation
│   ├── Hero/             # Immersive home page banner
│   └── ...               # Sections: About, Specialties, Reviews, etc.
├── lib/
│   ├── mockData.ts       # Centralized source of truth for items/reviews
│   └── store.ts          # Zustand cart logic
└── hooks/                # Custom React hooks
```

---

## 🔧 Backend Integration Guide (FastAPI)

To transition this project from a mockup to a live application, you should implement the following in your FastAPI backend:

### 1. Database Schema (PostgreSQL Recommended)
- **Products**: `id (UUID)`, `name`, `description`, `price`, `image_url`, `category`.
- **Users**: `id (UUID)`, `email`, `full_name`, `avatar_url`.
- **Orders**: `id (UUID)`, `user_id`, `total_amount`, `status` (pending, preparing, in_transit, delivered), `delivery_address`, `customer_phone`, `created_at`.
- **Order Items**: `id`, `order_id`, `product_id`, `quantity`, `price`.

### 2. Suggested API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products for the Menu page |
| `GET` | `/api/products/{id}` | Fetch specific product details |
| `POST` | `/api/orders` | Create a new order (from Checkout page) |
| `GET` | `/api/orders/{id}` | Fetch order status for Tracking |
| `GET` | `/api/users/profile` | Fetch logged-in user details |
| `GET` | `/api/users/orders` | Fetch user's order history |

### 3. Pydantic Model Example
```python
from pydantic import BaseModel
from typing import List, Optional

class ProductSchema(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_url: str
    category: str

class OrderCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    items: List[dict] # {product_id: str, quantity: int}
```

---

## 🎨 Design Features
- **Fluid Navigation**: Staggered link entry animations and scroll-based progress bar.
- **Micro-interactions**: Hover-triggered scale effects, custom cursor following, and magnetic buttons.
- **Adaptive Layout**: Fully responsive from mobile devices to ultra-wide monitors.
- **Glassmorphism**: Elegant card designs with backdrop-blur and subtle borders.

---

## 📦 Deployment on Vercel
1. Fork the repository.
2. Push your changes.
3. Vercel will automatically detect the Next.js project and deploy it.
4. **Note**: No environment variables are required for the mockup version as it uses static mock data.

---

## 📝 Developer Notes
- **Supabase Removed**: All Supabase dependencies and logic have been purged to ensure a clean slate for FastAPI.
- **Mock Data**: Edit `src/lib/mockData.ts` to update the products or reviews displayed in the mockup.
- **Real-time Tracking**: The `/track` page uses a simulation loop to move the "driver" icon. In production, this should be replaced with WebSocket or Long-Polling updates from your backend.

---
*Crafted with 🍰 by Orchids*
