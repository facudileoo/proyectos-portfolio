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

$("email").addEventListener("input", () => {
  updateErrors("email", "");
});
$("password").addEventListener("input", () => {
  updateErrors("password", "");
});
$("checkPassword").addEventListener("input", () => {
  updateErrors("checkPassword", "");
});
$("username").addEventListener("input", () => {
  updateErrors("username", "");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    checkPassword: formData.get("checkPassword"),
    username: formData.get("username"),
  };

  const res = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.message === "Registrando") {
    resultForm.textContent = "Registrando";
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  } else if (result.errors === "El usuario ya existe") {
    updateErrors("email", "El usuario ya existe");
  } else if (result.errors === "Caracter invalido") {
    updateErrors(result.camp, "Caracter invalido");
  } else if (result.errors === "Las contraseñas no coinciden") {
    updateErrors("checkPassword", "Las contraseñas no coinciden");
  } else {
    const errors = result.errors || {};
    Object.keys(errors).forEach((key) => {
      updateErrors(key, errors[key]);
      return;
    });
  }
});
