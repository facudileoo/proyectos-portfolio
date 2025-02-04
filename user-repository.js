import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { SALT_ROUNDS } from "./config/config.js";
import { connection } from "./db/db.js";

export class UserRepository {
  static async register(data) {
    const hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const id = crypto.randomUUID();
    const user = {
      _id: id,
      email: data.email,
      password: hashPassword,
      username: data.username,
    };
    return user;
  }

  static async login(data) {
    const [user] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [data.username]
    );

    const password = user[0].password;
    const verificacionPassword = await bcrypt.compare(data.password, password);
    if (verificacionPassword) {
      return { message: "Iniciando Sesion", data };
    } else {
      return { errors: "Contraseña incorrecta" };
    }
  }
}
