import { Router } from "express";
import {
  postRegister,
  postLogin,
  postLogout,
} from "../controllers/postRoutsControlls.js";
import {
  getIndex,
  getLogin,
  getRegister,
  getLogout,
  getPants,
  getGorras,
} from "../controllers/getControlls.js";

const router = Router();

router.get("/", getIndex);

router.get("/pants", getPants);

router.get("/gorras", getGorras);

router.get("/login", getLogin);

router.get("/register", getRegister);

router.get("/logout", getLogout);

router.post("/login", postLogin);

router.post("/register", postRegister);

router.post("/logout", postLogout);

export default router;
