import { SECRET_KEY_TOKEN } from "../config/config.js";
import jwt from "jsonwebtoken";

export const getIndex = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.render("index", {
      username: "undefined",
      message: "acceso no autorizado",
      pagina: "rem",
    });
  }
  try {
    const hayProductos = "undefined";
    const user = jwt.verify(token, SECRET_KEY_TOKEN);
    return res.render("index", user, { hayProductos, pagina: "rem" });
  } catch (e) {
    const hayProductos = "undefined";
    return res.render("index", {
      username: "undefined",
      hayProductos,
      pagina: "rem",
    });
  }
};

export const getLogin = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.render("login", {
      username: "undefined",
      errors: "acceso no autorizado",
    });
  }
  try {
    const user = jwt.verify(token, SECRET_KEY_TOKEN);
    return res.render("login", user, { errors: null, pagina: "rem" });
  } catch (e) {
    return res.render("login", {
      errors: "Error al inicar sesion",
      pagina: "rem",
    });
  }
};

export const getRegister = (req, res) => {
  res.render("register", { errors: null, pagina: "rem" });
};

export const getLogout = (req, res) => {
  res.render("logout");
};

export const getPants = (req, res) => {
  res.render("index", {
    pagina: "pants",
    username: "undefined",
    hayProductos: "undefined",
  });
};

export const getGorras = (req, res) => {
  res.render("index", {
    pagina: "gorras",
    username: "undefined",
    hayProductos: "undefined",
  });
};
