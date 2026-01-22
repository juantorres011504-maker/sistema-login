window.onload = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = './login.html'; // Redirigir si no hay token
  }
  
  // Obtener datos del perfil
  fetch('http://localhost:3000/perfil', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('🔍 Respuesta del perfil:', data);
      
      if (data.datos) {
          document.getElementById('nombreUsuario').textContent = data.datos.nombre;
          document.getElementById('emailUsuario').textContent = data.datos.email;
          document.getElementById('rolUsuario').textContent = data.datos.rol;
      } else {
        alert('❌ No se pudo cargar el perfil');
      }
    })
    .catch(err => {
      console.error('❌ Error al obtener el perfil:', err);
  });
  
  // Obtener actividades
  fetch('http://localhost:3000/mis-actividades', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    const actividadesList = document.getElementById('actividadesList');
    actividadesList.innerHTML = '';
    data.actividades.forEach(actividad => {
      const li = document.createElement('li');
      li.textContent = `${actividad.accion}: ${actividad.descripcion}`;
      actividadesList.appendChild(li);
    });
  });
  
  // Crear nueva actividad
  document.getElementById('formActividad').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const accion = e.target.accion.value;
    const descripcion = e.target.descripcion.value;
  
    fetch('http://localhost:3000/actividades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ accion, descripcion })
    })
    .then(res => res.json())
    .then(data => {
      alert('✅ Actividad registrada');
      window.location.reload(); // Recargar el dashboard con la nueva actividad
    })
    .catch(err => alert('❌ Error al registrar actividad'));
  });
};