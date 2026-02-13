function showLoader() {
  document.getElementById("content").innerHTML = `
    <div style="text-align:center; margin-top:100px;">
      <div class="loader"></div>
    </div>
  `;
}

const style = document.createElement("style");
style.innerHTML = `
.loader {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

function setActive(el) {
  document.querySelectorAll(".nav-btn")
    .forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}