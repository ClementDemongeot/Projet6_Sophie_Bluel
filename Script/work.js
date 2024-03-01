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
   *  Refresh les works
   */
  async function refresh() {
    // --> Récuperer les works depuis l'API
    // --> Enlever tous les works de la modale
    // --> ajouter les nouveaux works à la modale
    const newWorks = await getWorks();
    const newWorksContainer = document.querySelector(".modale-img");
    newWorksContainer.replaceChildren();
    addWorksToModale(newWorks);
    const worksContainer = document.querySelector(".gallery");
    worksContainer.replaceChildren();
    addWorks(newWorks);
  }

  function closeModale() {
    const modale = document.querySelector(".modale");
    const modale2 = document.querySelector(".modale2");
    const modaleBackdrop = document.querySelector(".modale-backdrop");
    const imgPreview = document.getElementById("preview");

    imgPreview.src = "";
    modale.style.display = "none";
    modale2.style.display = "none";
    modaleBackdrop.style.display = "none";
  }

  /**
   * Modale
   */
  async function openModale() {
    const linkModifier = document.querySelector(".icone_modifier");
    const modale = document.querySelector(".modale");
    const modale2 = document.querySelector(".modale2");
    const closeModale1 = document.querySelector(".close-modale-1 ");
    const closeModale2 = document.querySelector(".close-modale-2 ");
    const btnAddPhoto = document.querySelector(".button-add-modale1");
    const arrowBack = document.querySelector(".arrow-back ");
    const label = document.querySelector(".button-add-photo");
    const modaleBackdrop = document.querySelector(".modale-backdrop");
    const formats = document.querySelector(".formats");
    const imgPreview = document.getElementById("preview");
    const error = document.querySelector(".message-error");
    const title = document.querySelector("#title");

    linkModifier.addEventListener("click", function () {
      modale.style.display = "block";
      modaleBackdrop.style.display = "block";
    });

    btnAddPhoto.addEventListener("click", function () {
      modale2.style.display = "block";
      label.style.display = "flex";
      formats.style.display = "block";
      modale.style.display = "none";
    });

    closeModale1.addEventListener("click", function () {
      closeModale();
      error.style.display = "none";
    });

    closeModale2.addEventListener("click", function () {
      closeModale();
      error.style.display = "none";
      title.value = "";
    });

    arrowBack.addEventListener("click", function () {
      modale.style.display = "block";
      modale2.style.display = "none";
      imgPreview.src = "";
      error.style.display = "none";
      title.value = "";
    });

    modaleBackdrop.addEventListener("click", function () {
      closeModale();
      error.style.display = "none";
      title.value = "";
    });
  }

  /**
   * Ajout les works à la modale
   */
  async function addWorksToModale(param) {
    const containerImage = document.querySelector(".modale-img");
    for (let i = 0; i < param.length; i++) {
      //ajoute les Works à la modale

      const divImage = document.createElement("div");
      divImage.classList.add("img-wrapper");
      const image = document.createElement("img");
      image.src = param[i].imageUrl;
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
        await deleteWork(param[i].id);
        refresh();
      });
    }
  }

  /**
   * Permet de définir le comportement du boutn select
   */
  function setSelect() {
    const selectBtn = document.querySelector("select");
    for (let i = 0; i < categories.length; i++) {
      const option = document.createElement("option");
      option.innerText = categories[i].name;
      option.value = categories[i].id;
      selectBtn.appendChild(option);
    }
  }

  function previewImage() {
    document
      .getElementById("fileInput")
      .addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (file.type !== "image/png" && file.type !== "image/jpeg") {
          alert("Please select a PNG or JPEG image.");
          return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById("preview").src = e.target.result;
        };

        document.querySelector(".button-add-photo").style.display = "none";
        document.querySelector(".formats").style.display = "none";
        reader.readAsDataURL(file);
      });
  }

  async function postWorks() {
    const formData = new FormData();
    const title = document.querySelector("#title");
    const categorieId = document.querySelector("select");
    const image = document.querySelector("#fileInput");
    formData.append("title", title.value);
    formData.append("category", categorieId.value);
    formData.append("image", image.files[0]);

    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }
  function sendWorks() {
    const valider = document.querySelector(".buttonModale2");
    const image = document.querySelector("#fileInput");
    const title = document.querySelector("#title");
    const error = document.querySelector(".message-error");

    valider.addEventListener("click", async function () {
      if (title.value === "" || !image.files[0]) {
        console.log("error");
        error.style.display = "block";
        title.addEventListener("click", function () {
          error.style.display = "none";
        });
        image.addEventListener("click", function () {
          error.style.display = "none";
        });
      } else {
        await postWorks();
        refresh();
        closeModale();
        title.value = "";
        error.style.display = "none";
      }
    });
  }

  /**
   * Permet de définir le comportement du boutn Login/logout
   */
  function setLogInOut() {
    const log = document.querySelector(".log");
    const linkModifier = document.querySelector(".icone_modifier");
    const filtreCategories = document.querySelector(".categories");

    if (token) {
      openModale();
      linkModifier.style.display = "flex";
      filtreCategories.style.display = "none";
      log.innerHTML = "logout";
      log.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        linkModifier.style.display = "none";
        filtreCategories.style.display = "flex";
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

  // Récupère le token depuis le LocalStorage
  const token = window.localStorage.getItem("token");
  // Comportement du boutton Login/Logout
  setLogInOut(token);

  // Récupère les Works depuis l'API et les affiche
  const works = await getWorks();
  addWorks(works);

  // Récupère les Catégories depuis l'API et les affiche
  const categories = await getCategories();
  addCategories(categories);

  setSelect();

  addWorksToModale(works);
  previewImage();
  sendWorks();
}

app();
