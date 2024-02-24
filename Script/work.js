async function app() {
  const token = window.localStorage.getItem("token");
  function addImageElement(work) {
    //console.log(work);
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

  function addCategorie(categorie) {
    const divContainer = document.querySelector(".categories");
    const categorieElement = document.createElement("div");
    categorieElement.classList.add("btn-categorie", `btn-${categorie.id}`);
    categorieElement.innerText = categorie.name;
    divContainer.appendChild(categorieElement);
    //
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
          addImageElement(worksFilter[i]);
        }

        console.log(worksFilter);
      });
  }

  // appel de l'api WORKS
  async function callApiWorks() {
    // return works
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const works = await response.json();

    return works;
  }

  // appel de l'api Categories
  async function callApiCategories() {
    const response = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const categories = await response.json();
    return categories;
  }

  const works = await callApiWorks();

  // ajout image + text (puis, plus tard, boucle pour afficher toutes les images et textes)
  for (let i = 0; i < works.length; i++) {
    addImageElement(works[i]);
  }

  const categories = await callApiCategories();
  addCategorie({ name: "Tous", id: 0 });
  for (let i = 0; i < categories.length; i++) addCategorie(categories[i]);

  // Modale 1
  async function deleteImageModale() {
    for (let i = 0; i < works.length; i++) {
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

      const trashSelected = document.querySelector(`.trash-${i}`);
      trashSelected.addEventListener("click", async function (e) {
        e.preventDefault();
        const response = await fetch(
          `http://localhost:5678/api/works/${works[i].id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
    }
  }
  deleteImageModale();

  const log = document.querySelector(".log");
  if (token) {
    log.innerHTML = "logout";
    log.addEventListener("click", function () {
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
app();
