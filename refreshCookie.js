import jwt from "jsonwebtoken";
import { SECRET_KEY_TOKEN } from "../config/config.js";

export const refreshCookie = (req, res, next) => {
  const COOKIE_MAX_AGE = 1000 * 60 * 60;
  const token = req.cookies.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY_TOKEN);

      const timeleft = decoded.exp * 1000 - Date.now();

      if (timeleft < 60 * 1000) {
        const token = jwt.sign(
          { username: decoded.username, password: decoded.password },
          SECRET_KEY_TOKEN,
          { expiresIn: "1h" }
        );
        return res
          .cookie("access_token", token, {
            httpOnly: true, // La cookie solo se puede acceder desde el servidor
            secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
            sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
            maxAge: COOKIE_MAX_AGE, //La cookie solo tiene un tiempo de validez de 1 hora
            path: "/", // La cookie solo se puede acceder en la ruta principal
          })
          .json({ username: decoded.username });
      }
    } catch (e) {}
  }
  next();
};
