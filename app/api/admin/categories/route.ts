import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const slug = slugify(String(body.slug || name));

  if (!name || !slug) {
    return NextResponse.json({ error: "Nome e slug são obrigatórios." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: maxCategory } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSort = (maxCategory?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      sort_order: nextSort
    })
    .select("id, name, slug, sort_order")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ category: data });
}
