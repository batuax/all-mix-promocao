"use client";

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

type CartItem = {
  name: string;
  price: number;
  qty: number;
};

export default function Storefront({
  categories,
  products,
  whatsappNumber
}: {
  categories: Category[];
  products: Product[];
  whatsappNumber: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => product.category?.slug === selectedCategory);
  }, [products, selectedCategory]);

  function addToCart(name: string, price: number) {
    setCart((current) => {
      const existing = current.find((item) => item.name === name);
      if (existing) {
        return current.map((item) =>
          item.name === name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { name, price, qty: 1 }];
    });
  }

  function changeQty(name: string, diff: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.name === name ? { ...item, qty: item.qty + diff } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function finishOnWhatsApp() {
    if (!cart.length) return;

    let message = "Olá, quero aproveitar a *Promoção da All Mix*:%0A";
    cart.forEach((item) => {
      message += `- ${item.name} | ${item.qty}x = ${formatBRL(item.price * item.qty)}%0A`;
    });
    message += `%0ATotal: ${formatBRL(total)}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(decodeURIComponent(message))}`, "_blank");
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-box">
            <span className="hero-badge">🔥 Promoções da semana</span>

            <div className="hero-grid">
              <div>
                <h1>All Mix Informática com visual profissional e catálogo organizado.</h1>
                <p>
                  PCs gamer, PCs de escritório, monitores, nobreaks, DVR, câmera IP
                  e muito mais. O catálogo agora usa banco de dados, painel admin e
                  categorias funcionando de verdade.
                </p>
              </div>

              <div className="hero-side">
                <div className="stat">
                  <strong>{products.length} produtos</strong>
                  <span className="muted">Catálogo conectado ao banco.</span>
                </div>
                <div className="stat">
                  <strong>{categories.length} categorias</strong>
                  <span className="muted">Filtros rápidos e organizados.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="container">
          <div className="filter-bar">
            <button
              className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.slug ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="container main-grid">
        <section>
          <div className="section-title">
            <div>
              <h2>Produtos em destaque</h2>
              <p>Escolha uma categoria ou adicione ao carrinho.</p>
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="cards">
              {filteredProducts.map((product) => (
                <article key={product.id} className="card">
                  <div className="card-top">
                    <span className="badge">{product.badge || "PROMOÇÃO"}</span>
                    <img src={product.image_url} alt={product.name} />
                  </div>

                  <div className="card-body">
                    <h3>{product.name}</h3>
                    <p>{product.description || "Produto sem descrição."}</p>
                    <div className="price">{formatBRL(Number(product.price))}</div>

                    <div className="card-actions">
                      <button
                        className="add-btn"
                        onClick={() => addToCart(product.name, Number(product.price))}
                      >
                        Adicionar
                      </button>
                      <button
                        className="secondary-btn"
                        onClick={() => setSelectedCategory(product.category?.slug || "all")}
                      >
                        Ver categoria
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Nenhum produto encontrado nessa categoria.
            </div>
          )}
        </section>

        <aside className="cart">
          <h3>🛒 Seu pedido</h3>
          <p>Monte o pedido e finalize no WhatsApp.</p>

          <div className="cart-list">
            {cart.length ? (
              cart.map((item) => (
                <div key={item.name} className="cart-item">
                  <strong>{item.name}</strong>
                  <div className="cart-row">
                    <span>{formatBRL(item.price * item.qty)}</span>
                    <div className="qty-controls">
                      <button onClick={() => changeQty(item.name, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.name, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Seu carrinho está vazio.</div>
            )}
          </div>

          <div className="cart-total">
            <div className="cart-row">
              <span>Total</span>
              <strong>{formatBRL(total)}</strong>
            </div>
            <button className="whatsapp-btn" onClick={finishOnWhatsApp}>
              Finalizar no WhatsApp
            </button>
          </div>
        </aside>
      </main>

      <footer className="footer">
        © 2026 All Mix Informática • Catálogo profissional
      </footer>
    </>
  );
}
