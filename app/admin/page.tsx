import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const categories = await getCategories();
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <AdminPanel
      categories={categories}
      initialProducts={data ?? []}
    />
  );
}
