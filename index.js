import express from "express";
import { PORT } from "./config/config.js";
import router from "./routes/form.routes.js";
import cookieParser from "cookie-parser";
import { refreshCookie } from "./middleware/refreshCookie.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
app.disable("x-powered-by");
app.use(refreshCookie);
app.use(router);
app.use("/js", express.static("js"));
app.use("/styles", express.static("styles"));
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
