export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  badge: string | null;
  image_url: string;
  featured: boolean;
  active: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
};
