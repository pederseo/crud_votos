const axios = require('axios');
const { error } = require('console');

async function PUT_host(json_body, headers) {
    const url = 'http://localhost:5001/host';
    try {
      const response = await axios.put(url, json_body, { headers });
      return response.data; // Retornamos los datos de la respuesta si es exitosa
  
    } catch (error) {
      return error.response ? error.response.status : 'Error de conexión'; // Retornamos el código de estado o mensaje de error
    }
  }

//___________________________________________________________________________________________

async function POST_join(nombre) {
    const url = 'http://localhost:5001/join';
    const json_body = {"nombre": nombre}
    try {
      const response = await axios.post(url, json_body);
      return response.data
    } catch (error) {
      return error.response ? error.response.status : 'Error de conexion';
    }
  }
  
//___________________________________________________________________________________________

async function GET_host_status(clave_admin) {
  const url = 'http://localhost:5001/host_status';
  const headers = { Authorization: clave_admin };

  try {
    const response = await axios.get(url, { headers });
    return response.data // Asegúrate de que 'jugadores' sea el nombre correcto en el JSON de respuesta
  } catch (error) {
    return error.response ? error.response.status : 'Error de conexion';
  }
}

//___________________________________________________________________________________________
async function GET_join_status(token) {
  const url = 'http://localhost:5001/join_status';
  const headers = { "Authorization": `Bearer ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return response.data
  } catch (error) {
    return error.response ? error.response.status : 'Error de conexion';
  }
}

//___________________________________________________________________________________________
async function POST_response(nombre,respuesta) {
  const url = 'http://localhost:5001/response';
  const json_body = {
    "nombre": nombre,
    "respuesta": respuesta
  }
  try {
    const response = await axios.post(url, json_body);
    return response.data
  } catch (error) {
    return error.response ? error.response.status : 'Error de conexion';
  }
}


async function GET_response_status() {
  const url = 'http://localhost:5001/response_status';
  try {
    const response = await axios.get(url);
    return response.data
  } catch (error) {
    return error.response ? error.response.status : 'Error de conexion';
  }
}


// ruta para votar


module.exports = {PUT_host, GET_host_status, POST_join, GET_join_status, POST_response, GET_response_status};