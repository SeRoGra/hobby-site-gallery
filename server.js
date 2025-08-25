import express from "express";
const app = express();

// In-memory storage for comments (resets on restart)
const comments = [];
const MAX_CHARS = 200;

app.use(express.json());
app.use(express.static("public"));

// API: get all comments
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
  if (text.length > MAX_CHARS) {
    return res.status(400).json({ error: `Máximo ${MAX_CHARS} caracteres` });
  }
  const item = { text, date: new Date().toISOString() };
  comments.push(item);
  res.status(201).json(item);
});

// Replit provides PORT dynamically
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
