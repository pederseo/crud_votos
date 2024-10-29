const jwt = require('jsonwebtoken');

// Middleware de autenticación para verificar el token
function decodeJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, 'clave_secreta'); // Decodifica usando tu clave secreta
    req.jugador = decoded; // Almacena los datos decodificados en `req.jugador`
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}