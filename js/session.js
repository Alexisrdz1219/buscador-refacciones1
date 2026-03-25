// session.js
(function () {
  const API = "https://buscador-refaccionesbackend.onrender.com";

  /**
   * Valida la sesión y guarda el usuario completo en localStorage
   * @returns {Promise<Object|null>} Datos del usuario o null si no hay sesión
   */
  async function validarSesion() {
    const token = localStorage.getItem("token");
    const nombreElemento = document.getElementById("nombreUsuario");

    if (!token) {
      window.location.replace("index.html");
      return null;
    }

    try {
      const response = await fetch(`${API}/me`, {
        headers: { Authorization: "Bearer " + token }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      // Guardar usuario completo en localStorage
      localStorage.setItem("usuario", JSON.stringify(data));

      // Mostrar nombre si el elemento existe
      if (nombreElemento) nombreElemento.textContent = data.nombre;

      return data;
    } catch (error) {
      // console.log("Token inválido o /me incorrecto", error);
      // Limpiar todo y redirigir al login
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.replace("index.html");
      return null;
    }
  }

  /**
   * Configura el botón de logout
   */
  function configurarLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.replace("index.html");
    });
  }

  /**
   * Recupera el usuario desde localStorage
   * @returns {Object|null} Usuario o null si no hay
   */
  function obtenerUsuario() {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return null;
    try {
      return JSON.parse(usuarioStr);
    } catch {
      return null;
    }
  }

  // Al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    validarSesion();
    configurarLogout();
  });

  // Exponer función global para otros scripts
  window.Sesion = {
    validar: validarSesion,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.replace("index.html");
    },
    obtenerUsuario
  };
})();