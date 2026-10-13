# Divina Jô — Marmitaria Artesanal

Landing page de página única para a marmitaria artesanal **Divina Jô** (São Paulo, SP).
Site institucional com cardápio semanal, encomendas e contato — sem dependências npm.

## Stack

- **Frontend:** HTML + CSS próprio (prefixo `dj-`), Bootstrap 3, jQuery 1.10.2
- **Backend:** PHP mínimo (apenas `include` e `echo date("Y")`), servido por um servidor
  Node.js zero-dependências (`server.js`) que resolve includes via regex
- **Formulários:** envio via WhatsApp (`wa.me/55xxxxxxxxx`) tratado em `js/main.js`,
  com fallback de action direto para o WhatsApp (sem backend de e-mail)
- **Deploy:** Docker (`node:20-alpine`) — compatível com Dokploy

## Estrutura

```
├── index.php          # Página única (hero, cardápio, marmitas, destaques, encomendas, contato)
├── header.php         # <head> + navbar (incluído via <?php include ?>)
├── footer.php         # Footer + botão flutuante de WhatsApp + scripts
├── server.js          # Servidor HTTP Node (estático + pseudo-processamento PHP)
├── Dockerfile         # Imagem node:20-alpine
├── docker-compose.yml # Sube a app em 8080 → 3001
├── css/               # Estilos (main.css é o principal; o resto vem do template)
├── js/                # main.js (navegação, navbar, formulários → WhatsApp)
├── fonts/             # Font Awesome + picto icons
└── images/            # Fotos dos pratos, ícones e marmita.svg
```

> `contact.php` e `reserve.php` são **obsoletos** (vestigais do template original).
> Os formulários são tratados no client-side.

## Como rodar

### Local (Node.js 18+)

```bash
node server.js
# → http://localhost:3001/
```

Variáveis de ambiente opcionais:

| Variável    | Padrão      | Descrição                              |
| ----------- | ----------- | -------------------------------------- |
| `PORT`      | `3001`      | Porta do servidor                      |
| `BASE_PATH` | `/divinajo` | Prefixo de URL (útil em reverse proxy) |

Com `BASE_PATH` vazio (`BASE_PATH= node server.js`), o site roda na raiz.

### Docker

```bash
docker compose up --build
# → http://localhost:8080/divinajo
```

### Produção (Dokploy / reverse proxy)

- A imagem expõe a porta **3001** e já lê `BASE_PATH`
- Exemplo de proxy (Caddy/nginx): encaminhe `divinajo.example.com` → `app:3001`
  com `BASE_PATH` vazio, ou mantenha `BASE_PATH=/divinajo` em subpasta
- O servidor injeta `<base href="${BASE_PATH}/">` nas páginas `.php` para
  os assets relativos sempre resolverem

## Observações

- **Segurança:** o `server.js` valida que o caminho pedido fica dentro do
  diretório do projeto (bloqueia path traversal com `403`)
- **Imagens:** fotos otimizadas (re-encodadas em JPEG q82, máx. 1920px)
- **WhatsApp:** para trocar o número, atualize `wa.me/55xxxxxxxxx` em
  `index.php`, `footer.php` e `js/main.js`

## Licença

GPL-3.0 (herdada).
