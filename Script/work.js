async function app() {
  /**
   * Permet d'ajouter un Work
   * @param {*} work
   */
  function addWork(work) {
    // work doit avoir les keys imageUrl et title
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const imageTitle = document.createElement("figcaption");
    imageTitle.innerText = work.title;
    figure.appendChild(imageElement);
    figure.appendChild(imageTitle);
    const imageContainer = document.querySelector(".gallery");
    imageContainer.appendChild(figure);
  }
  /**
   * Permet d'ajouter tout les Works
   */
  function addWorks(works) {
    for (let i = 0; i < works.length; i++) {
      addWork(works[i]);
    }
  }
  /**
   * Recupère les Works depuis l'API
   * @returns works
   */
  async function getWorks() {
    // return works
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const works = await response.json();
    return works;
  }
  /**
   * Permet d'ajouter une Catégorie
   * @param {*} categorie
   */
  function addCategorie(categorie) {
    const divContainer = document.querySelector(".categories");
    const categorieElement = document.createElement("div");
    categorieElement.classList.add("btn-categorie", `btn-${categorie.id}`);
    categorieElement.innerText = categorie.name;
    divContainer.appendChild(categorieElement);

    document
      .querySelector(`.btn-${categorie.id}`)
      .addEventListener("click", function () {
        let worksFilter;
        if (categorie.id === 0) {
          worksFilter = works;
        } else {
          worksFilter = works.filter(function (work) {
            return work.categoryId === categorie.id;
          });
        }
        document.querySelector(".gallery").replaceChildren();
        for (let i = 0; i < worksFilter.length; i++) {
          addWork(worksFilter[i]);
        }

        console.log(worksFilter);
      });
  }
  /**
   * Permet d'ajouter toutes les Catégories
   */
  function addCategories(categories) {
    addCategorie({ name: "Tous", id: 0 });
    for (let i = 0; i < categories.length; i++) addCategorie(categories[i]);
  }
  /**
   * Recupère les catégories depuis l'API
   * @returns Catégories
   */
  async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const categories = await response.json();
    return categories;
  }

  /**
   * Supprime le work dont l'id est passé en parametre
   * @param {*} id du work a supprimer
   */
  async function deleteWork(id) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   *  //supprime l'image de la modale
   */
  async function deleteWorkFromModale() {
    // --> Récuperer les works depuis l'API
    // --> Enlever tous les works de la modale
    // --> ajouter les nouveaux works à la modale
    const newWorks = await getWorks();
    const newWorksContainer = document.querySelector(".modale-img");
    newWorksContainer.innerHTML = "";
    for (let i = 0; i < newWorks.length; i++) {
      const divImage = document.createElement("div");
      divImage.classList.add("img-wrapper");
      const image = document.createElement("img");
      image.src = newWorks[i].imageUrl;
      image.classList.add("img-wrapper");
      const trash = document.createElement("span");
      trash.innerText = "delete";
      trash.classList.add("material-symbols-outlined", `trash-${i}`);
      divImage.appendChild(image);
      divImage.appendChild(trash);
      newWorksContainer.appendChild(divImage);
      const trashSelected = document.querySelector(`.trash-${i}`);
      trashSelected.addEventListener("click", async function () {
        await deleteWork(newWorks[i].id);
        deleteWorkFromModale();
      });
    }
  }

  /**
   * Ajout les works à la modale
   */
  async function addWorksToModale() {
    for (let i = 0; i < works.length; i++) {
      //ajoute les Works à la modale
      const containerImage = document.querySelector(".modale-img");
      const divImage = document.createElement("div");
      divImage.classList.add("img-wrapper");
      const image = document.createElement("img");
      image.src = works[i].imageUrl;
      image.classList.add("img-wrapper");
      const trash = document.createElement("span");
      trash.innerText = "delete";
      trash.classList.add("material-symbols-outlined", `trash-${i}`);
      divImage.appendChild(image);
      divImage.appendChild(trash);
      containerImage.appendChild(divImage);

      // ajoute le comportement de suppression

      const trashSelected = document.querySelector(`.trash-${i}`);
      trashSelected.addEventListener("click", async function () {
        await deleteWork(works[i].id);
        deleteWorkFromModale();
      });
    }
  }

  // Récupère le token depuis le LocalStorage
  const token = window.localStorage.getItem("token");

  /**
   * Permet de définir le comportement du boutn Login/logout
   */
  function setLogInOut(token) {
    const log = document.querySelector(".log");
    const iconeModif = document.querySelector(
      ".icone_modifier > .material-symbols-outlined"
    );
    const linkModifier = document.querySelector(".icone_modifier > a");
    const filtreCategories = document.querySelector(".categories");
    const openModale = document.querySelector(".modale");
    const body = document.querySelector("body");
    const closeModale = document.querySelector(
      ".modale-wrapper > .material-symbols-outlined "
    );
    if (token) {
      iconeModif.style.display = "block";
      linkModifier.style.display = "block";
      filtreCategories.style.display = "none";
      linkModifier.addEventListener("click", function () {
        openModale.style.display = "block";
        body.style.opacity = "0.5";
      });
      closeModale.addEventListener("click", function () {
        openModale.style.display = "none";
        body.style.opacity = "1";
      });

      log.innerHTML = "logout";
      log.addEventListener("click", function () {
        iconeModif.style.display = "none";
        linkModifier.style.display = "none";
        filtreCategories.style.display = "flex";
        body.style.opacity = "1";

        window.localStorage.removeItem("token");
        log.innerHTML = "login";
        log.addEventListener("click", function () {
          document.location.href = "login.html";
        });
      });
    } else {
      log.innerHTML = "login";
      log.addEventListener("click", function () {
        document.location.href = "login.html";
      });
    }
  }

  // Comportement du boutton Login/Logout
  setLogInOut(token);

  // Récupère les Works depuis l'API et les affiche
  const works = await getWorks();
  addWorks(works);

  // Récupère les Catégories depuis l'API et les affiche
  const categories = await getCategories();
  addCategories(categories);

  addWorksToModale();
}

app();
