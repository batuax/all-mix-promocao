import Storefront from "@/components/Storefront";
import { getCategories, getProducts } from "@/lib/data";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5521974932682";

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div className="logo-wrap">
            <span className="logo">All Mix Informática</span>
            <span className="logo-sub">Catálogo profissional com painel e banco de dados</span>
          </div>

          <a className="secondary-btn" href="/admin/login">
            Área administrativa
          </a>
        </div>
      </header>

      <Storefront
        categories={categories}
        products={products}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
