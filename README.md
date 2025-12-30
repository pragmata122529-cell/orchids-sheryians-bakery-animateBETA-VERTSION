# Home Bakery Frontend

This project is a high-end, animated frontend for an artisan bakery. It is built with Next.js, Tailwind CSS, and Framer Motion.

## Future FastAPI Integration Requirements

The backend has been removed to allow for a custom FastAPI integration. Below are the data requirements and API endpoints needed by the frontend.

### 1. Products API
**Endpoint:** `GET /api/products`
**Response Format:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "image_url": "string",
    "category": "string"
  }
]
```
*Current mock data is located in `src/lib/mockData.ts`.*

### 2. Reviews API
**Endpoint:** `GET /api/reviews`
**Response Format:**
```json
[
  {
    "id": "string",
    "rating": number (1-5),
    "comment": "string",
    "user_name": "string",
    "created_at": "ISO string"
  }
]
```

### 3. Authentication (Future)
The frontend currently uses a mock user. When integrating FastAPI:
- Implement JWT-based authentication.
- Endpoints needed: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`.

## Features
- **Animated Navbar:** Interactive navigation with scroll-based progress bar and staggered link entrance.
- **Menu Page (`/menu`):** Full product catalog with search and category filtering.
- **3D Product Cards:** Interactive hover effects using Framer Motion.
- **Cart System:** Persistent cart management using Zustand.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.

## How it works
1. **Mock Data:** Components like `ProductGrid` and `Reviews` fetch data from `src/lib/mockData.ts` using a simulated `useEffect`.
2. **Search Logic:** The `/menu` page passes a `searchQuery` prop to `ProductGrid`, which filters the mock products in real-time.
3. **Animations:** Framer Motion is used for entry animations, scroll transforms, and interactive hover states.
