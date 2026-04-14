# All Mix Store Pro

Projeto profissional da sua loja:
- visual mais limpo e sem vídeo
- categorias funcionando
- painel admin
- banco de dados real
- upload de imagens
- pronto para Vercel + GitHub + Supabase

## 1) Instalação local

```bash
npm install
npm run dev
```

## 2) Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## 3) Banco de dados

No Supabase:
1. Crie um projeto
2. Rode o SQL do arquivo `supabase/schema.sql`
3. Crie um bucket chamado `produtos`
4. Deixe o bucket público para servir as imagens

## 4) Deploy no GitHub e Vercel

1. Suba os arquivos no GitHub
2. Importe o repositório na Vercel
3. Adicione as mesmas variáveis de ambiente do `.env.local`
4. Faça o deploy

## 5) Painel admin

Acesse:
- `/admin/login`

Depois de logar:
- crie categorias
- adicione produtos
- faça upload da imagem
- os produtos aparecem na home automaticamente
