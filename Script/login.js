function addError() {
  const errorContainer = document.getElementById("contact");
  const errorExist = errorContainer.querySelector(".hidden");
  if (errorExist) {
    errorContainer.removeChild(errorExist);
  }
  const error = document.createElement("p");
  error.classList.add("hidden");
  error.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
  errorContainer.prepend(error);
}

function removeError() {
  const errorContainer = document.getElementById("contact");
  const errorExist = errorContainer.querySelector(".hidden");
  if (errorExist) {
    errorContainer.removeChild(errorExist);
  }
}

const buttonConnexion = document.querySelector(".btn-connexion");
buttonConnexion.addEventListener("click", async function () {
  let user;
  // l'objet que je veux envoyer au Backend
  const login = {
    email: document.querySelector(".baliseEmail").value,
    password: document.querySelector(".baliseMotDePasse").value,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      body: JSON.stringify(login),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      user = await response.json();
      window.localStorage.setItem("token", user.token);
      removeError();
      document.location.href = "index.html";
    } else {
      throw new Error("c'est une erreur");
    }
  } catch (error) {
    addError();
  }
});

// buttonConnexion.addEventListener("click", function () {
//   // l'objet que je veux envoyer au Backend
//   const login = {
//     email: "sophie.bluel@test.tld",
//     password: "S0phie",
//   };
//   // J'appel une url "http://localhost:5678/api/users/login",avec la méthode POST, et avec comme Body(donnée) l'objet Login.
//   fetch("http://localhost:5678/api/users/login", {
//     method: "POST",
//     body: JSON.stringify(login),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     //Ensuite, on console.log la réponse du Backend.
//     .then(function (response) {
//       console.log(response);
//     });
// });
