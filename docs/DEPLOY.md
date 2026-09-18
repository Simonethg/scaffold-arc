# Deploy playground → simonethg.com

**Estado:** aún **sin** deploy a producción. Falta confirmación explícita de la usuaria + elección de path/hosting.

**Powered by [AcademiaQA.com](https://academiaqa.com)**

---

## Acuerdo

1. No publicar hasta que ella diga algo inequívoco (“de acuerdo” / “deployá” / “está listo”).
2. Al confirmar: publicar `packages/nextjs` bajo su web **www.simonethg.com** (o path/subdominio acordado) y dejar el link live en el README raíz → **For everyone**.
3. Mantener el crédito AcademiaQA en el README (siempre en inglés).

Regla Cursor: `.cursor/rules/simonethg-deploy-gate.mdc` (`alwaysApply`).

---

## Qué hay hoy (investigación, sin cambios)

| Hallazgo | Detalle |
|---|---|
| Host | **Hostinger** (`platform: hostinger`, `panel: hpanel`, LiteSpeed) |
| CMS | **WordPress** (headers `x-redirect-by: WordPress`, `wp-json`, PHP 8.2) |
| Sitio en hPanel | `simonethg.com` — `website_type: wordpress`, user `u316464165`, root `…/domains/simonethg.com/public_html` |
| www vs apex | `https://www.simonethg.com` → **301** a `https://simonethg.com/` (apex canónico) |
| Subdominios Hostinger | **Ninguno** listado bajo este sitio |
| Path de prueba | `https://simonethg.com/scaffold-arc` → **404** (no existe aún) |
| Carpeta local del sitio | No hay repo WordPress de simonethg en `/Users/macbook/projects/`; solo branding en `personal/08-branding/simonethg` |
| Vercel (MCP de este workspace) | Sin teams/proyectos vinculados; **no** hay `.vercel` en este monorepo |
| App a publicar | Next.js 15 en `packages/nextjs` (`next build` / `next start`) |

---

## Opciones reales para el primer deploy

### A) Path bajo el mismo dominio (p. ej. `/scaffold-arc` o `/playground`)

- Pros: un solo dominio, link tipo `https://www.simonethg.com/scaffold-arc` (o apex tras redirect).
- Contras: WordPress ocupa `public_html`; hay que **no** pisar WP. Suele exigir subcarpeta + rewrite, o export **estático** de Next si el hosting no corre Node en path.
- Hostinger tiene APIs de deploy Node/JS, pero el sitio actual es **wordpress**, no `nodejs` — mezclar path + WP requiere plan y cuidado.

### B) Subdominio nuevo (p. ej. `playground.simonethg.com` o `arc.simonethg.com`)

- Pros: aísla Next del WordPress; Hostinger permite crear subdominio con su propio root.
- Contras: hay que crear el subdominio (hoy **cero** subdominios); puede implicar DNS/SSL en hPanel. **No hacer DNS** hasta que ella lo pida.

### C) Vercel (u otro) + CNAME al subdominio

- Pros: natural para Next.js App Router.
- Contras: hace falta proyecto Vercel + DNS; hoy **no** hay proyecto enlazado aquí. Solo con confirmación + DNS explícito.

### D) Reemplazar el WordPress en la raíz

- **Descartado por defecto.** El sitio personal vive en WP; no sobrescribir `public_html` sin pedido explícito.

---

## Qué falta preguntarle antes del primer deploy

1. **URL deseada:** path (`/scaffold-arc`, `/playground`, …) **vs** subdominio (`playground.simonethg.com`, …)?
2. ¿Prefiere link en README con **www** o **apex** (`simonethg.com`), sabiendo que www redirige al apex hoy?
3. ¿OK crear subdominio en Hostinger, o solo carpeta bajo el WP existente?
4. ¿Hosting del playground: Hostinger Node, estático en carpeta, o Vercel + DNS?
5. Confirmación verbal de go-live (“está listo” / “deployá”).

Hasta entonces: solo localhost + screenshots; sin DNS y sin publish.
