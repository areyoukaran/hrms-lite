const BASE_URL = "https://hrms-lite-backend-6j83.onrender.com";

async function apiGet(path) {
  const res = await fetch(BASE_URL + path);
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiPut(path, data) {
  const res = await fetch(BASE_URL + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDelete(path) {
  await fetch(BASE_URL + path, { method: "DELETE" });
}
