async function refresh() {
  const res = await fetch("/comments");
  const data = await res.json();
  const ul = document.getElementById("clist");
  ul.innerHTML = data.map(c => `<li><span>${escapeHtml(c.text)}</span><small>${new Date(c.date).toLocaleString()}</small></li>`).join("");
}

const MAX = 200;

function setCounter(n = 0) {
  const el = document.getElementById("climit");
  if (el) el.textContent = `${n}/${MAX}`;
}

document.getElementById("cinput").addEventListener("input", (e) => {
  setCounter(e.target.value.length);
});

document.getElementById("cform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("cinput");
  const text = input.value.trim();
  if (!text) return;

  if (text.length > MAX) {
    alert(`Máximo ${MAX} caracteres`);
    return;
  }

  const resp = await fetch("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    alert(err.error || "No se pudo guardar el comentario");
    return;
  }

  input.value = "";
  setCounter(0);
  refresh();
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]));
}

refresh();
