const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('mostrar');
});

// Logout desde el header
const cerrar = document.getElementById('cerrarSesionHeader');
if (cerrar) {
  cerrar.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './login.html';
  });
}

// Mostrar nombre desde JWT
const token = localStorage.getItem('token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    document.getElementById('nombreUsuarioHeader').textContent = payload.nombre;
  } catch (e) {
    console.error('Token inválido');
  }
}