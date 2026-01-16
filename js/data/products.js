// Static product data
// TODO: Replace this static data with Django API call
// fetch("http://127.0.0.1:8000/api/products/")

const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Elegant Silk Saree",
    description: "Beautiful handwoven silk saree with intricate designs. Perfect for weddings and special occasions.",
    price: 12999,
    stock: 15,
    category: "Sarees",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
  },
  {
    id: 2,
    name: "Designer Lehenga Set",
    description: "Stunning designer lehenga with matching blouse and dupatta. Available in multiple colors.",
    price: 24999,
    stock: 8,
    category: "Lehengas",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
  },
  {
    id: 3,
    name: "Cotton Kurti",
    description: "Comfortable and stylish cotton kurti perfect for daily wear. Available in various prints.",
    price: 1299,
    stock: 25,
    category: "Kurtis",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400"
  },
  {
    id: 4,
    name: "Anarkali Suit",
    description: "Elegant anarkali suit with beautiful embroidery work. Perfect for parties and festivals.",
    price: 3499,
    stock: 12,
    category: "Suits",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
  },
  {
    id: 5,
    name: "Designer Palazzo Set",
    description: "Modern and trendy palazzo set with printed top. Comfortable and fashionable.",
    price: 1999,
    stock: 20,
    category: "Suits",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
  },
  {
    id: 6,
    name: "Bridal Lehenga",
    description: "Exquisite bridal lehenga with heavy embroidery and zari work. A perfect choice for your special day.",
    price: 49999,
    stock: 3,
    category: "Lehengas",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400"
  },
  {
    id: 7,
    name: "Printed Saree",
    description: "Beautiful printed saree with modern designs. Lightweight and easy to drape.",
    price: 2999,
    stock: 18,
    category: "Sarees",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
  },
  {
    id: 8,
    name: "Embroidered Kurti",
    description: "Stylish embroidered kurti with mirror work. Perfect for casual and semi-formal occasions.",
    price: 1799,
    stock: 22,
    category: "Kurtis",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
  },
  {
    id: 9,
    name: "Party Wear Gown",
    description: "Elegant party wear gown with sequin work. Stand out at any party or event.",
    price: 4499,
    stock: 10,
    category: "Gowns",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400"
  },
  {
    id: 10,
    name: "Casual Tunic",
    description: "Comfortable casual tunic perfect for everyday wear. Available in multiple colors and sizes.",
    price: 999,
    stock: 30,
    category: "Kurtis",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
  },
  {
    id: 11,
    name: "Wedding Saree",
    description: "Traditional wedding saree with heavy zari and embroidery. A timeless piece for your wardrobe.",
    price: 19999,
    stock: 5,
    category: "Sarees",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
  },
  {
    id: 12,
    name: "Designer Gown",
    description: "Stunning designer gown with intricate detailing. Perfect for formal events and parties.",
    price: 5999,
    stock: 7,
    category: "Gowns",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400"
  }
];

// Initialize products in localStorage if not present
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(PRODUCTS_DATA));
}

