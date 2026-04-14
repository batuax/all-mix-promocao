"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/lib/types";

type ProductRecord = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

export default function AdminPanel({
  categories,
  initialProducts
}: {
  categories: Category[];
  initialProducts: ProductRecord[];
}) {
  const [currentCategories, setCurrentCategories] = useState(categories);
  const [products, setProducts] = useState(initialProducts);

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [badge, setBadge] = useState("PROMOÇÃO");
  const [categoryId, setCategoryId] = useState(String(categories[0]?.id ?? ""));
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [productMessage, setProductMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const sortedCategories = useMemo(
    () => [...currentCategories].sort((a, b) => a.sort_order - b.sort_order),
    [currentCategories]
  );

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    setCategoryMessage("");

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: categoryName,
        slug: categorySlug
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setCategoryMessage(data.error || "Erro ao criar categoria.");
      return;
    }

    setCurrentCategories((current) => [...current, data.category]);
    setCategoryId(String(data.category.id));
    setCategoryName("");
    setCategorySlug("");
    setCategoryMessage("Categoria criada com sucesso.");
  }

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    setProductMessage("");

    if (!image) {
      setProductMessage("Selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("badge", badge);
    formData.append("categoryId", categoryId);
    formData.append("featured", String(featured));
    formData.append("image", image);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      setProductMessage(data.error || "Erro ao criar produto.");
      return;
    }

    setProducts((current) => [data.product, ...current]);
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setBadge("PROMOÇÃO");
    setFeatured(false);
    setImage(null);
    setPreviewUrl("");
    setProductMessage("Produto criado com sucesso.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <div className="section-title">
          <div>
            <h2>Painel All Mix</h2>
            <p>Cadastre categorias e produtos com banco real.</p>
          </div>

          <div className="toolbar">
            <a className="secondary-btn" href="/" target="_blank">
              Ver site
            </a>
            <button className="secondary-btn" onClick={logout}>
              Sair
            </button>
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Nova categoria</h3>
            <form onSubmit={createCategory}>
              <div className="field">
                <label>Nome</label>
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Ex.: DVR"
                />
              </div>

              <div className="field">
                <label>Slug</label>
                <input
                  value={categorySlug}
                  onChange={(event) => setCategorySlug(event.target.value)}
                  placeholder="Ex.: dvr"
                />
              </div>

              <button className="primary-btn" type="submit">
                Criar categoria
              </button>
            </form>

            {categoryMessage ? <p className="muted">{categoryMessage}</p> : null}

            <h3>Categorias</h3>
            <div className="info-list">
              {sortedCategories.map((category) => (
                <div key={category.id} className="info-item">
                  <strong>{category.name}</strong>
                  <div className="muted">slug: {category.slug}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Novo produto</h3>

            <form onSubmit={createProduct}>
              <div className="field">
                <label>Nome</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome do produto"
                />
              </div>

              <div className="field">
                <label>Slug</label>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="slug-do-produto"
                />
              </div>

              <div className="field">
                <label>Descrição</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Descrição"
                />
              </div>

              <div className="field">
                <label>Preço</label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="1499.90"
                />
              </div>

              <div className="field">
                <label>Etiqueta</label>
                <input
                  value={badge}
                  onChange={(event) => setBadge(event.target.value)}
                  placeholder="PROMOÇÃO"
                />
              </div>

              <div className="field">
                <label>Categoria</label>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    style={{ width: "auto", marginRight: 8 }}
                  />
                  Produto em destaque
                </label>
              </div>

              <div className="field">
                <label>Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImage(file);
                    setPreviewUrl(file ? URL.createObjectURL(file) : "");
                  }}
                />
                {previewUrl ? <img className="preview" src={previewUrl} alt="Prévia" /> : null}
              </div>

              <button className="primary-btn" type="submit">
                Cadastrar produto
              </button>
            </form>

            {productMessage ? <p className="muted">{productMessage}</p> : null}

            <h3>Últimos produtos</h3>
            <div className="info-list">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="info-item">
                  <strong>{product.name}</strong>
                  <div className="muted">R$ {Number(product.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
