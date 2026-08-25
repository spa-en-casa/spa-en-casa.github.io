# Spa en Casa — landing page

Página responsive (celular + PC) lista para GitHub Pages.

## Estructura
```
index.html
css/style.css
js/script.js
images/        ← pon aquí tus fotos reales
```

## 1. Subir a GitHub Pages
1. Crea un repositorio nuevo en GitHub (ej. `spa-en-casa`).
2. Sube estos archivos manteniendo la misma estructura de carpetas.
3. Ve a **Settings → Pages** → en "Branch" elige `main` y carpeta `/root` → Save.
4. En 1–2 minutos tu web estará en `https://tuusuario.github.io/spa-en-casa/`.

## 2. Cambiar los videos de YouTube
Cada video está en `index.html` dentro de un bloque `<figure class="video-card" data-youtube-id="...">`.
Solo reemplaza `data-youtube-id="dQw4w9WgXcQ"` por el ID real de tu video
(la parte que va después de `watch?v=` en la URL de YouTube).
La miniatura y el reproductor se generan solos con JavaScript — no hay que tocar nada más.

## 3. Poner tus imágenes reales
Cada bloque marcado como `<div class="img-placeholder" data-label="images/xxx.jpg">` es un
espacio reservado. Para poner tu foto real, reemplázalo por una etiqueta `<img>`, por ejemplo:

```html
<!-- Antes -->
<div class="img-placeholder" data-label="images/hero.jpg"></div>

<!-- Después -->
<img src="images/hero.jpg" alt="Tratamiento facial" class="hero-img">
```
(agrega la clase `hero-img { width:100%; border-radius: var(--radius); }` si quieres,
o dime y te dejo el CSS ya ajustado una vez tengas las fotos finales).

## 4. Tipografía (Adobe Fonts)
Ya está conectada: `index.html` carga tu kit `https://use.typekit.net/soj6uvh.css`,
que trae **Montserrat** (texto) y **Montserrat Alternates** (títulos), en pesos de
100 a 700, normal e itálica.

En `css/style.css` (`:root`) quedó así:
```css
--font-display: 'montserrat-alternates', sans-serif;
--font-body: 'montserrat', sans-serif;
```
Si luego quieres usar otro peso en algún título o texto puntual, agrega
`font-weight` (100–700) directo en la regla CSS correspondiente — todos esos
pesos ya están disponibles gracias al kit.

## Sobre las imágenes y el peso del sitio
GitHub Pages es gratis pero tiene límites razonables: el repositorio debería
pesar idealmente menos de ~1 GB y hay un límite de ancho de banda (soft-limit,
no aplica en la práctica para una landing page normal). Para una página como
esta, lo mejor es:

- Guardar las imágenes directamente en la carpeta `images/` del repo, pero
  **comprimidas primero** (herramientas gratis: squoosh.app o tinypng.com,
  o exportarlas en `.webp`). Con fotos bien optimizadas (100–300 KB c/u)
  no hay ningún problema de peso.
- **No** se recomienda usar Google Drive como host de imágenes: los links de
  Drive no están pensados para "hotlinking" (mostrar la imagen directamente en
  una web), Google puede bloquear o limitar esas solicitudes, y el link puede
  romperse si cambian permisos del archivo.
- Si más adelante tienes MUCHAS fotos o quieres videos propios pesados
  (no de YouTube), lo ideal es un CDN gratuito como Cloudinary o Imgur, no Drive.

Los videos no cuentan para el peso del repo porque quedan en YouTube — la
página solo los embebe.
