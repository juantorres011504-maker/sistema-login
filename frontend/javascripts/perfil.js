window.onload = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html'; // Redirige si no hay token
  }
  
  fetch('http://localhost:3000/perfil', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.datos) {
      document.getElementById('nombreUsuario').textContent = data.datos.nombre;
      document.getElementById('emailUsuario').textContent = data.datos.email;
      document.getElementById('rolUsuario').textContent = data.datos.rol;
    } else {
      alert('❌ No se pudo cargar el perfil');
    }
  })
  .catch(err => {
    console.error('Error al obtener perfil', err);
    alert('❌ Hubo un error al obtener los datos del perfil');
  });
};

document.getElementById('formEditarPerfil').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = e.target.nombre.value;
  const contraseña = e.target.contraseña.value;
  
  fetch('http://localhost:3000/editarPerfil', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ nombre, contraseña })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.mensaje);
    window.location.reload();
  })
  .catch(err => alert('❌ Error al actualizar perfil'));
});
