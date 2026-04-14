import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();

  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const badge = String(formData.get("badge") || "PROMOÇÃO").trim();
  const categoryId = Number(formData.get("categoryId") || 0);
  const featured = String(formData.get("featured") || "false") === "true";
  const image = formData.get("image");

  if (!name || !slug || !price || !categoryId || !(image instanceof File)) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const extension = image.name.split(".").pop() || "jpg";
  const filePath = `${Date.now()}-${slug}.${extension}`;
  const arrayBuffer = await image.arrayBuffer();

  const upload = await supabase.storage
    .from("produtos")
    .upload(filePath, arrayBuffer, {
      contentType: image.type || "image/jpeg",
      upsert: false
    });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 400 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("produtos")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: categoryId,
      name,
      slug,
      description,
      price,
      badge,
      image_url: publicUrlData.publicUrl,
      featured,
      active: true
    })
    .select("id, name, price, image_url")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}
