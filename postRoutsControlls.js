import { SECRET_KEY_TOKEN } from "../config/config.js";
import { schemaRegister } from "../schemas/schemas-form.js";
import { connection } from "../db/db.js";
import { UserRepository } from "../user-repository.js";
import jwt from "jsonwebtoken";

export const postLogin = async (req, res) => {
  const data = req.body;
  const existenciaUsuario = await connection.query(
    "SELECT * FROM users WHERE username = ?",
    [data.username]
  );
  if (existenciaUsuario.length === 0) {
    return res.json({ errors: "El usuario no existe" });
  }
  try {
    const user = await UserRepository.login(data);
    if (user.errors === "Contraseña incorrecta") {
      return res.json({ errors: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { user: user._id, username: data.username },
      SECRET_KEY_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    return res
      .cookie("access_token", token, {
        httpOnly: true, // La cookie solo se puede acceder desde el servidor
        secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
        sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
        //maxAge: 1000 * 60 * 60,  La cookie solo tiene un tiempo de validez de 1 hora
        path: "/", // La cookie solo se puede acceder en la ruta principal
      })
      .json({
        username: user.username,
        message: "Iniciando Sesion",
        token: token,
      });
  } catch (e) {
    return res.json({ errors: "Error al iniciar Sesion" });
  }
};

export const postRegister = async (req, res) => {
  const data = req.body;
  const { error, value } = schemaRegister.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.json({ errors });
  }
  const [existenciaUsuario] = await connection.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [data.email, data.username]
  );
  if (existenciaUsuario.length > 0) {
    return res.json({ errors: "El usuario ya existe" });
  }

  if (data.password !== data.checkPassword) {
    return res.json({ errors: "Las contraseñas no coinciden" });
  }

  const caracterInvalido = /[\W_]/;
  if (caracterInvalido.test(data.password)) {
    return res.json({ errors: "Caracter invalido", camp: "password" });
  }
  if (caracterInvalido.test(data.username)) {
    return res.json({ errors: "Caracter invalido", camp: "username" });
  }
  const user = await UserRepository.register(data);

  await connection.query(
    "INSERT INTO users (id,email,password,username) VALUES (?,?,?,?)",
    [user._id, user.email, user.password, user.username]
  );
  const token = jwt.sign(
    { user: user._id, username: data.username },
    SECRET_KEY_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  return res
    .cookie("access_token", token, {
      httpOnly: true, // La cookie solo se puede acceder desde el servidor
      secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
      sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
      maxAge: 1000 * 60 * 60, // La cookie solo tiene un tiempo de validez de 1 hora
      path: "/", // La cookie solo se puede acceder en la ruta principal
    })
    .json({
      username: user.username,
      message: "Registrando",
      token: token,
    });
};

export const postLogout = (req, res) => {
  return res
    .clearCookie("access_token")
    .redirect("/")
    .json({ message: "Sesion cerrada", username: "undefined" });
};
