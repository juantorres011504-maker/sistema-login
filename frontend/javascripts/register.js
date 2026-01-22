document.getElementById('formRegister').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = e.target.nombre.value;
  const email = e.target.email.value;
  const contraseña = e.target.contraseña.value;
  
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, contraseña })
  })
  .then(async res => {
    const data = await res.json();
  
    if (res.ok) {
      alert('✅ ' + data.mensaje);
      window.location.href = 'login.html';
    } else {
      alert('❌ ' + data.mensaje); // ← Aquí se mostrará "Correo ya registrado"
    }
  })
  .catch(err => {
    console.error('Error al registrar usuario:', err);
    alert('❌ Ocurrió un error al registrar');
  });
});
