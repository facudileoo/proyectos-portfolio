import mysql from "mysql2/promise";

const configuracion = {
  host: "localhost", // o la dirección IP de tu servidor MySQL
  user: "root", // tu usuario de MySQL
  port: 3306,
  password: "", // tu contraseña de MySQL
  database: "formdb", // el nombre de tu base de datos
};

// Configura la conexión a la base de datos
export const connection = await mysql.createConnection(configuracion);
