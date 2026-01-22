const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave-super-secreta';

const verificarToken = (req, res, next) => {
  // Leer el token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ mensaje: '❌ Token requerido' });
  }

  // Verificar token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: '❌ Token inválido o expirado' });
    }

    req.usuario = decoded;
    next();
  });
};

module.exports = verificarToken;
