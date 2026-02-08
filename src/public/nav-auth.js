function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

function logout(){
  sessionStorage.removeItem("token");
  location.href = "./index.html";
}

(function initNavAuth(){
  const token = sessionStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;
  const role = payload?.role;

  // show/hide guest links
  document.querySelectorAll(".nav-guest").forEach(el => {
    el.style.display = token ? "none" : "";
  });

  // show/hide user links
  document.querySelectorAll(".nav-user").forEach(el => {
    el.style.display = token ? "" : "none";
  });

  // show/hide admin links
  document.querySelectorAll(".nav-admin").forEach(el => {
    el.style.display = (token && role === "ADMIN") ? "" : "none";
  });

  // logout button
  const btn = document.querySelector(".nav-logout");
  if (btn) {
    btn.style.display = token ? "inline-block" : "none";
    btn.onclick = logout;
  }
})();
