const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const verificarToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'juanelias01',
  database: 'iniciar_sesion'
});

// Probarconexión
db.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});


//Registro
app.post('/register', (req, res) => {
    const { nombre, email, contraseña } = req.body;
  
    const query = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, contraseña], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ mensaje: 'Correo ya registrado' });
        }
        return res.status(500).json({ mensaje: 'Error al registrar usuario', error: err });
      }

      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    });
});


//POSTLogin
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave-super-secreta';

app.post('/login', (req, res) => {
    const { email, contraseña } = req.body;
    
    const query = 'SELECT * FROM usuarios WHERE email = ? AND contraseña = ?';
    db.query(query, [email, contraseña], (err, results) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error en el servidor', error: err });
      }
      if (results.length === 0) {
        return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
      }
      const usuario = results[0];
      //Generar JWT
      const token = jwt.sign(
        {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            rol: usuario.rol
        },
        SECRET_KEY,
        { expiresIn: '2h'}
      );

      res.status(200).json({
        mensaje: '✅ Inicio de sesión exitoso',
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    });
});


//GET perfil
app.get('/perfil', verificarToken, (req, res) => {
  const idUsuario = req.usuario.id;
  console.log('🔍 ID recibido desde token:', idUsuario);

  const query = 'SELECT id_usuario, nombre, email, rol FROM usuarios WHERE id_usuario = ?';

  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: '❌ Error al obtener perfil', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    }

    console.log('🧾 Resultado desde la base de datos:', results[0]); // <-- Añade esto

    res.status(200).json({
      mensaje: '👤 Perfil del usuario autenticado',
      datos: results[0]
    });
  });
});


//GET actividdaes
app.get('/mis-actividades', verificarToken, (req, res) => {
  const idUsuario = req.usuario.id;
  const query = 'SELECT * FROM actividades WHERE usuario_id = ? ORDER BY creado DESC';

  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al obtener actividades', error: err });
    }

    res.status(200).json({
      mensaje: '📋 Actividades del usuario',
      usuario: req.usuario,
      actividades: results
    });
  });
});



//POST actividades
app.post('/actividades', verificarToken, (req, res) => {
  const idUsuario = req.usuario.id;
  const { accion, descripcion } = req.body;

  const query = 'INSERT INTO actividades (usuario_id, accion, descripcion) VALUES (?, ?, ?)';

  db.query(query, [idUsuario, accion, descripcion], (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al guardar actividad', error: err });
    }

    res.status(201).json({
      mensaje: 'Actividad registrada correctamente',
      actividad: {
        id: result.insertId,
        id_usuario: idUsuario,
        accion,
        descripcion
      }
    });
  });
});



//DELETE actividades
app.delete('/actividades/:id', verificarToken, (req, res) => {
  const idActividad = req.params.id;
  const idUsuario = req.usuario.id;

  //if si pertenece o no al usuario
  const buscar = 'SELECT * FROM actividades WHERE id_actividad = ? AND usuario_id = ?';
  db.query(buscar, [idActividad, idUsuario], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar actividad', error: err });

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Actividad no encontrada o no te pertenece' });
    }

    // Si todo bien, la eliminamos
    const eliminar = 'DELETE FROM actividades WHERE id_actividad = ?';
    db.query(eliminar, [idActividad], (err2) => {
      if (err2) return res.status(500).json({ mensaje: '❌Error al eliminar actividad', error: err2 });

      res.status(200).json({ mensaje: 'Actividad eliminada correctamente' });
    });
  });
});



//Editar usuario
app.put('/editarPerfil', verificarToken, (req, res) => {
  const idUsuario = req.usuario.id;
  const { nombre, contraseña } = req.body;

  const campos = [];
  const valores = [];

  if (nombre) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }
  if (contraseña) {
    campos.push('contraseña = ?');
    valores.push(contraseña);
  }

  if (campos.length === 0) {
    return res.status(400).json({ mensaje: '❌ No se proporcionaron datos para actualizar' });
  }

  const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
  valores.push(idUsuario);

  db.query(query, valores, (err) => {
    if (err) {
      return res.status(500).json({ mensaje: '❌ Error al actualizar perfil', error: err });
    }

    res.status(200).json({ mensaje: '✅ Perfil actualizado correctamente' });
  });
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
