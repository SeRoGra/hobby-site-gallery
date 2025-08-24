async function refresh() {
  const res = await fetch("/comments");
  const data = await res.json();
  const ul = document.getElementById("clist");
  ul.innerHTML = data.map(c => `<li><span>${escapeHtml(c.text)}</span><small>${new Date(c.date).toLocaleString()}</small></li>`).join("");
}

document.getElementById("cform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("cinput");
  const text = input.value.trim();
  if (!text) return;
  await fetch("/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  input.value = "";
  refresh();
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]));
}

refresh();
