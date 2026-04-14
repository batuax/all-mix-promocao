import { NextResponse } from "next/server";
import { createSessionValue, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurada." },
      { status: 500 }
    );
  }

  if (username !== validUser || password !== validPassword) {
    return NextResponse.json({ error: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createSessionValue(username),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
