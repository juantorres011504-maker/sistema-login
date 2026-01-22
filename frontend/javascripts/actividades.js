window.onload = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html'; // Redirige si no hay token
  }
  
  const actividadesList = document.getElementById('actividadesList');
  
  // Función para cargar las actividades
  function cargarActividades() {
    fetch('http://localhost:3000/mis-actividades', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data => {
      actividadesList.innerHTML = '';
      data.actividades.forEach(actividad => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>ID:</strong> ${actividad.id_actividad} | <strong>${actividad.accion}</strong>: ${actividad.descripcion}<br><small>📅 ${new Date(actividad.creado).toLocaleString()}</small>`;
  
        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.style.marginLeft = '10px';
        btnEliminar.onclick = function() {
          if (confirm(`¿Eliminar la actividad con ID ${actividad.id_actividad}?`)) {
            fetch(`http://localhost:3000/actividades/${actividad.id_actividad}`, {
              method: 'DELETE',
              headers: {
                Authorization: 'Bearer ' + token
              }
            })
            .then(res => res.json())
            .then(result => {
              alert(result.mensaje);
              li.remove(); // Quita el elemento de la lista
            })
            .catch(err => {
              console.error('❌ Error al eliminar', err);
              alert('❌ No se pudo eliminar la actividad');
            });
          }
        };
  
        li.appendChild(btnEliminar);
        actividadesList.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error al obtener actividades', err);
      alert('❌ Hubo un error al obtener las actividades');
    });
  }
  
  // Cargar al iniciar
  cargarActividades();
  
  // Registrar nueva actividad
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
      cargarActividades(); // Recargar actividades sin recargar la página
      e.target.reset();    // Limpiar el formulario
    })
    .catch(err => alert('❌ Error al registrar actividad'));
  });
};
  
  