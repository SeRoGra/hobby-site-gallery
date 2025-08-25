# Mi Hobby — Videojuegos (Frontend + Backend)

Sitio web sencillo para presentar mi hobby (videojuegos) con **galería de imágenes** y un **formulario de comentarios** conectado a un **backend Node/Express**.

> **Estado actual del proyecto**: los comentarios se almacenan **en memoria del servidor** (arreglo local). **No hay persistencia en disco**; al reiniciar el servidor, la lista se reinicia. Esto cumple con un backend funcional para la práctica y facilita el despliegue rápido.

---

## 🚀 Ejecutar en local

### Requisitos
- Node.js **18+** (recomendado 18 o 20)
- npm

### Pasos
```bash
npm install
npm start
# Abre: http://localhost:3000
```

### Probar API (opcional)
```bash
# Obtener comentarios (ordenados del más reciente al más antiguo)
curl -s http://localhost:3000/comments

# Crear comentario
curl -s -X POST http://localhost:3000/comments   -H "Content-Type: application/json"   -d '{"text":"¡Hola mundo gamer!"}'
```

> Cambiar puerto:  
> macOS/Linux → `PORT=4000 npm start`  
> Windows PowerShell → `$env:PORT=4000; npm start`

---

## 🧩 Características
- **Frontend** estático (HTML/CSS/JS) servido por Express desde `/public`.
- **Galería** responsive con grid y recorte uniforme (`object-fit: cover`).
- **Formulario** con validación básica y enfoque visible (accesible).
- **Backend** Node/Express con endpoints:
  - `GET /comments` → devuelve la lista **ordenada DESC por fecha** (más recientes primero).
  - `POST /comments` → crea `{ text, date }` (valida que `text` no esté vacío).
- **Almacenamiento**: **en memoria** (arreglo local `comments`), **sin persistencia**.

---

## 🔌 API — Contratos

### `GET /comments` — 200 OK
```json
[
  { "text": "¡Hola!", "date": "2025-08-24T19:05:00.000Z" }
]
```

### `POST /comments` — 201 Created
**Body**
```json
{ "text": "Comentario aquí" }
```
**Respuesta**
```json
{ "text": "Comentario aquí", "date": "2025-08-24T19:05:00.000Z" }
```
**Errores**
- `400 Bad Request` si `text` está vacío.

---

## 🗂 Estructura del proyecto
```
.
├─ server.js                # Express, estáticos y API /comments (en memoria)
├─ package.json
└─ /public
   ├─ index.html
   ├─ styles.css
   ├─ script.js
   ├─ /js
      ├─ comments.js
      └─ intro-modal.js
   └─ /assets
      ├─ /images
      └─ /logos
```

---

## 🧠 Código del servidor (resumen)
```js
import express from "express";
const app = express();

// In-memory storage for comments (resets on restart)
const comments = [];

app.use(express.json());
app.use(express.static("public"));

// API: get all comments (newest first)
app.get("/comments", (_, res) => {
  const sorted = [...comments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  res.json(sorted);
});

// API: create a new comment
app.post("/comments", (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "Comentario vacío" });
  const item = { text, date: new Date().toISOString() };
  comments.push(item);
  res.status(201).json(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
```

---

## 🧪 Scripts útiles
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"        // si instalas nodemon: npm i -D nodemon
  }
}
```

- Desarrollo con recarga:
  ```bash
  npm run dev
  ```

---

## 🧭 Despliegue rápido (opcional)

### Replit
1. Importa o sube el proyecto.
2. Verifica `"start": "node server.js"` en `package.json`.
3. **Run** → abre la URL pública.
4. (Opcional) **Deployments → Autoscale** con comando `npm start`.

---

## ⚠️ Consideraciones & próximos pasos
- Los comentarios **se pierden al reiniciar el servidor** (almacenamiento en memoria).
- Posibles mejoras:
  - Persistencia en archivo (`data/comments.json`) o base de datos.
  - Eliminación/edición de comentarios (IDs, validaciones extra).
  - Tests de API con `supertest`.

---

## 👤 Autor
**Sebastian Rodríguez Granja** — [LinkedIn](https://www.linkedin.com/in/sebastian-rodriguez-granja-b96804137/)
