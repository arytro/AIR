// Mock data for Air clothing brand

export const mockProducts = [
  // Pantalones
  {
    id: 1,
    name: "Pantalón Air Classic",
    category: "pantalon",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=600&fit=crop&crop=center",
    description: "Pantalón clásico de corte perfecto, hecho con materiales premium para máxima comodidad.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 2,
    name: "Pantalón Air Sport",
    category: "pantalon",
    price: 94.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center",
    description: "Pantalón deportivo con tecnología de transpirabilidad avanzada.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 3,
    name: "Pantalón Air Elegante",
    category: "pantalon",
    price: 124.99,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop&crop=center",
    description: "Pantalón de vestir elegante para ocasiones especiales.",
    sizes: ["S", "M", "L", "XL"],
    inStock: false
  },

  // Suéteres
  {
    id: 4,
    name: "Suéter Air Comfort",
    category: "sueter",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=600&fit=crop&crop=center",
    description: "Suéter ultra suave que te hará sentir como flotando en el aire.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 5,
    name: "Suéter Air Premium",
    category: "sueter",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
    description: "Suéter premium con lana merino de la más alta calidad.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 6,
    name: "Suéter Air Casual",
    category: "sueter",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=600&fit=crop&crop=center",
    description: "Suéter casual perfecto para el día a día.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },

  // Medias
  {
    id: 7,
    name: "Medias Air Essential Pack",
    category: "medias",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=600&fit=crop&crop=center",
    description: "Pack de 5 medias esenciales con tecnología antibacterial.",
    sizes: ["S", "M", "L"],
    inStock: true
  },
  {
    id: 8,
    name: "Medias Air Sport",
    category: "medias",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=600&fit=crop&crop=center",
    description: "Medias deportivas con soporte adicional y ventilación.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 9,
    name: "Medias Air Luxury",
    category: "medias",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop&crop=center",
    description: "Medias de lujo con fibras naturales premium.",
    sizes: ["S", "M", "L"],
    inStock: false
  }
];

export const mockCategories = [
  { id: 'pantalon', name: 'Pantalones', count: 3 },
  { id: 'sueter', name: 'Suéteres', count: 3 },
  { id: 'medias', name: 'Medias', count: 3 }
];

export const brandSlogan = "Siéntete libre, siéntete en el aire con Air";
export const brandMission = "En Air creemos que la ropa debe hacerte sentir libre y cómodo, como si flotaras en el aire. Cada prenda está diseñada para darte esa sensación única de libertad y elegancia.";