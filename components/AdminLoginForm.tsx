"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Falha ao entrar.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="admin-shell">
      <div className="admin-card" style={{ maxWidth: 520 }}>
        <h1 style={{ marginTop: 0 }}>Acesso administrativo</h1>
        <p className="muted">Entre para cadastrar categorias e produtos.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Usuário</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {message ? <p style={{ color: "#c40000", marginTop: 12 }}>{message}</p> : null}
      </div>
    </div>
  );
}
