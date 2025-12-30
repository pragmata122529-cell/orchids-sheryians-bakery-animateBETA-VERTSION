export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Dark Chocolate Truffle Cake",
    description: "Rich Belgian chocolate layers with ganache filling and a velvet finish.",
    price: 45,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    category: "Cakes"
  },
  {
    id: "2",
    name: "Red Velvet Cupcakes",
    description: "Classic crimson cake with silky cream cheese frosting and white chocolate curls.",
    price: 18,
    image_url: "https://images.unsplash.com/photo-1614707267537-b85af00c4b81?q=80&w=1000&auto=format&fit=crop",
    category: "Cupcakes"
  },
  {
    id: "3",
    name: "Artisan Macarons Box",
    description: "Assorted French macarons including lavender, pistachio, and salted caramel.",
    price: 24,
    image_url: "https://images.unsplash.com/photo-1569864358642-9d1619702604?q=80&w=1000&auto=format&fit=crop",
    category: "Pastries"
  },
  {
    id: "4",
    name: "Glazed Blueberry Donuts",
    description: "Hand-dipped donuts with fresh blueberry glaze and lemon zest.",
    price: 12,
    image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    category: "Donuts"
  },
  {
    id: "5",
    name: "Classic Butter Croissants",
    description: "Traditional French pastries with 100% butter and 24 layers of flaky goodness.",
    price: 15,
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    category: "Pastries"
  },
  {
    id: "6",
    name: "Double Choc Chip Cookies",
    description: "Chunky cookies with dark and milk chocolate chunks, topped with sea salt.",
    price: 10,
    image_url: "https://images.unsplash.com/photo-1499636136210-6560b0df532a?q=80&w=1000&auto=format&fit=crop",
    category: "Cookies"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 5,
    comment: "Absolutely divine! The chocolate cake melted in my mouth. Best bakery experience ever!",
    user_name: "Sarah Mitchell",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    rating: 5,
    comment: "Best bakery I've ever tried. The croissants are perfection - crispy outside, soft inside!",
    user_name: "Michael Rodriguez",
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    rating: 5,
    comment: "The truffle box was an amazing gift. My mom loved it! Will definitely order again.",
    user_name: "Emma Watson",
    created_at: new Date().toISOString()
  }
];
