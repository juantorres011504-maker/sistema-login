document.getElementById('formLogin').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = e.target.email.value;
  const contraseña = e.target.contraseña.value;
  
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, contraseña: contraseña })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      // Guardar token
      localStorage.setItem('token', data.token);
      alert('✅ Bienvenido, ' + data.usuario.nombre);
      window.location.href = 'dashboard.html';
    } else {
      alert('❌ Error: ' + data.mensaje);
    }
  });
});
  