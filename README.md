# BLL Fisioterapia

Landing page da BLL Fisioterapia, fisioterapia em domicílio. Site estático em Next.js (App Router) + TypeScript + Tailwind CSS v4, com GSAP + ScrollTrigger, Lenis e WebGL na foto do hero.

## Como rodar

Precisa do Node.js 22.

```bash
npm install
npm run dev
```

O site abre em http://localhost:3000.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `out/` |
| `npm run preview` | Serve a pasta `out/` (rode depois do build) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm run check` | `lint`, `typecheck` e `build`, nessa ordem |
| `npm run images` | Converte as fotos de `assets/photos/` em WebP |

## Editar os textos

Todos os textos do site ficam em [`src/data/content.ts`](src/data/content.ts): hero, tratamentos, mapa de dor, como funciona, postura, formulário, rodapé e as mensagens prontas do WhatsApp. Basta trocar o texto entre aspas e salvar.

## Editar contatos e dados da BLL

Os dados ficam em [`src/config/site.ts`](src/config/site.ts). O que está entre colchetes ainda precisa ser preenchido:

| Campo | Exemplo |
|---|---|
| `whatsapp` | `"5511912345678"` (só números: 55 + DDD + número) |
| `instagram` | `"@bllfisioterapia"` |
| `city` | `"Campinas"` |
| `neighborhoods` | `"Cambuí, Taquaral e região"` |
| `responsible.crefito` | `"123456-F"` |

Enquanto o WhatsApp estiver com o placeholder, os botões levam ao formulário e mostram um aviso em vez de abrir a conversa. Com o número preenchido, todos os botões abrem o `wa.me` com a mensagem pronta.

## Trocar a foto do hero pela do Luis

1. Coloque a foto em `assets/photos/` (JPEG, com pelo menos 1920px de largura), por exemplo `assets/photos/luis.jpg`.
2. Rode `npm run images`. Isso gera as versões WebP em `public/images/`.
3. Em `src/data/content.ts`, troque a linha do `hero.image`:

```ts
image: { src: "/images/luis", alt: "Luis Fernando atendendo um paciente em casa" },
```

A foto é enquadrada com `object-position: 60% 40%`, então o assunto deve ficar no lado direito da imagem: o texto ocupa a esquerda. A mesma foto vira a textura da foto líquida em WebGL.

Para trocar as fotos dos tratamentos, o processo é o mesmo, mudando o `image` de cada item em `treatments`.

## Publicar

Antes de publicar, defina a variável `NEXT_PUBLIC_SITE_URL` com o endereço final do site (por exemplo `https://bllfisioterapia.com.br`). Ela é usada no sitemap, no robots, na imagem de compartilhamento e nos dados estruturados.

### Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório. A Vercel reconhece o Next.js sozinha.
2. Em **Environment Variables**, adicione `NEXT_PUBLIC_SITE_URL`.
3. Clique em **Deploy**.

O `.vercelignore` deixa de fora do envio o que o build não usa: as skills (`.claude`), as fotos originais (`assets`), a especificação e a documentação. Como as fotos originais não sobem, rode `npm run images` e faça o commit de `public/images` antes do deploy sempre que trocar uma foto.

### Netlify

1. Em [app.netlify.com](https://app.netlify.com), escolha **Add new site → Import an existing project** e selecione o repositório.
2. O `netlify.toml` já define o build (`npm run build`), a pasta publicada (`out`) e o Node 22.
3. Em **Site configuration → Environment variables**, adicione `NEXT_PUBLIC_SITE_URL`.
4. Faça o deploy.

## Estrutura

```
src/
  app/             layout, página, ícone, robots, sitemap e imagem de compartilhamento (og.png)
  data/content.ts  todos os textos e os caminhos das fotos
  config/site.ts   WhatsApp, Instagram, cidade, bairros, CREFITO e URL
  components/      navbar, abertura, botão fixo, cursor, formulário e as seções
  scenes/          foto líquida do hero em WebGL
  effects/         efeitos de rolagem e de ponteiro, um por arquivo
  lib/             loop único no gsap.ticker, ambiente, rolagem, WhatsApp e loader de imagens
  styles/          globals.css com o Tailwind e os tokens da identidade visual
assets/photos/     fotos originais
public/images/     fotos em WebP, geradas por npm run images
referencia/        protótipo aprovado e especificação do projeto
```

O sistema visual (cores, tipografia, componentes e regras) está descrito em [`DESIGN.md`](DESIGN.md), e o contexto do produto em [`PRODUCT.md`](PRODUCT.md).

## Acessibilidade e movimento

- Com `prefers-reduced-motion`, o site desliga o scroll suave, as seções fixas, a foto líquida, os títulos elásticos, o cursor, o magnetismo e o skew. Os círculos viram fade e a faixa de tratamentos vira rolagem horizontal nativa.
- Sem JavaScript, todo o conteúdo continua visível: as regiões do mapa de dor aparecem em lista e os botões do WhatsApp são links normais.
- No toque ou em GPU fraca, a foto do hero fica estática.

## Antes de publicar

- Preencha os placeholders de `src/config/site.ts`.
- Depoimentos e fotos de pacientes só com autorização por escrito, e conferindo as regras de publicidade do COFFITO/CREFITO.
- As fotos atuais são do Pexels (veja `assets/photos/README.md`) e não mostram o atendimento real da BLL.
