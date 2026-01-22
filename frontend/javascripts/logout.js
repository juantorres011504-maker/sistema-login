document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('cerrarSesion');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.removeItem('token'); // Borrar token
      window.location.href = 'login.html'; // Redirigir
    });
  }
});
  