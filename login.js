const $ = (el) => document.getElementById(el);

const form = $("form");
const resultForm = $("result");

const updateErrors = (divErrId, msgError) => {
  const divErr = $(`${divErrId}-error`);
  if (msgError) {
    divErr.textContent = msgError;
  } else {
    divErr.textContent = "";
  }
};

$("password").addEventListener("input", (e) => {
  updateErrors("password", "");
});
$("username").addEventListener("input", (e) => {
  updateErrors("username", "");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    password: formData.get("password"),
    username: formData.get("username"),
  };
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  console.log(result);
  if (result.message === "Iniciando Sesion") {
    resultForm.textContent = "Iniciando Sesion";
    setTimeout(() => {
      location.href = "/";
    }, 2000);
    return;
  } else if (result.errors === "Contraseña incorrecta") {
    updateErrors("password", "Contraseña incorrecta");
    return;
  } else if (result.errors === "El usuario no existe") {
    updateErrors("username", "El usuario no existe");
    return;
  } else {
    resultForm.textContent = "Error al iniciar sesion";
    return;
  }
});
