import { getSupabasePublic } from "./supabase";
import type { Category, Product } from "./types";

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      badge,
      image_url,
      featured,
      active,
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Product[]) ?? [];
}
