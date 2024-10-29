// importacion de modulos
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// importacion de funciones
const {PUT_host, GET_host_status, POST_join, GET_join_status, POST_response, GET_response_status} = require('./controllers/funtions')
const {HOST,PORT} = require('./config/config')

// instanciar las modulos
const app = express();
app.use(cookieParser());
//permite analizar los datos enviados en una solicitud HTTP, través de formularios HTML.
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//_____________________________________________________________________________

app.get('/', async (req, res) => {
  res.render('index')
});

//_____________________________________________________________________________

app.get('/host', async (req, res) => {
  res.render('host', {"mensaje":"Configuracion del juego"});
});

//_____________________________________________________________________________

app.get('/join', async (req, res) => {
  res.render('join');
})

//______________________________________________________________________________

app.post('/start-game', async (req, res) => {
  const { clave, palabra, jugadores, impostores, start } = req.body;
  clave_admin = clave
  const json_body = {
    "palabra_secreta": palabra,
    "cantidad_jugadores": jugadores,
    "cantidad_impostores": impostores,
    "iniciar": start
  };
  const headers = { "Authorization": clave_admin };

  const response = await PUT_host(json_body, headers);

  if (response === 'Error de conexión' || response === 404) {
    return res.render('no_service');
  }

  if (response['mensaje'] === "clave invalida") {
    return res.render('host', {"mensaje":response['mensaje']});
  }

  res.redirect('/join');
});

//_______________________________________________________________________________________

app.post('/join_game',async (req, res) => {
  const { nombre } = req.body;
  const response = await POST_join(nombre);

  // guardamos el logion del usuario
  res.cookie('auth_token', response["acces_token"], {
    httpOnly: true,
    secure: false,  // Usa 'true' si tienes HTTPS
    maxAge: 24 * 60 * 60 * 1000  // Expira en 1 día
});

  if (response === 'Error de conexion' || response === 404) {
    return res.render('no_service');
  }
  
  console.log('token guardado en la cookie')
  res.redirect('/join_jugadores')
});

//___________________________________________________________________________________

app.get('/join_jugadores', async (req, res) => {
  const clave_admin = "admin123"; 
  const lista_jugadores = await GET_host_status(clave_admin);

  const jugadores = lista_jugadores.jugadores || [];
  let cant_jugadores = Object.keys(lista_jugadores['jugadores']).length;

  if (lista_jugadores['partida']['cantidad_jugadores'] === cant_jugadores) {
    res.redirect('/perfil')
  }
  res.render('join_jugadores', {jugadores});
});
 
//_______________________________________________________________________________________

app.get('/perfil', async (req, res) => {
  const token = req.cookies.auth_token;
  const response = await GET_join_status(token);
  
  // funcion para extraer los datos del usuario
  if (response['roll'] === 'impostor') {
    res.render('perfil_impostor', {"nombre": response['nombre'], "roll": response['roll']})
  }
  // console.log({"nombre": response['nombre'], "roll": response['roll'], "clave_secreta": response['clave_secreta']})
  res.render('perfil_jugador', {"nombre": response['nombre'], "roll": response['roll'], "palabra_secreta": response['palabra_secreta']})
});

app.post('/enviar_respuesta', async (req, res) => {
  const token = req.cookies.auth_token;
  const usuario = await GET_join_status(token);
  const {respuesta} = req.body;

  const mandar_res = POST_response(usuario['nombre'],respuesta);
  console.log(mandar_res)
  res.redirect('/sala_espera');
});

//_______________________________________________________________________________________

app.get('/sala_espera', async (req, res) => {
  const clave_admin = "admin123"; 
  const lista_jugadores = await GET_host_status(clave_admin);
  let cant_respuestas = Object.keys(lista_jugadores['respuestas']).length;
  if (cant_respuestas === lista_jugadores['partida']['cantidad_jugadores']) {
    // res.redirect('/votacion');
    res.redirect('/votaciones');
  }

  res.render('sala_espera');
});

//_______________________________________________________________________________________


app.get('/votaciones', async (req, res) => {
  const response = await GET_response_status();

  res.render('votaciones', {"jugadores":response.jugadores});
})

//_______________________________________________________________________________________

app.post('/votar', (req, res) => {
  const { jugador } = req.body;

  // Lógica para incrementar el voto del jugador
  if (jugadores[jugador]) {
    jugadores[jugador].votos += 1;
  }

  // Devuelve la lista de jugadores actualizada
  res.json({ jugadores });
});


//_________________________________________________________________________________________

// Correr servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});


