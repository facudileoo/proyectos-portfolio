fetch("/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});
setTimeout(() => {
  window.location.href = "/";
}, 2000);
