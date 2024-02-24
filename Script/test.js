async function app() {
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

  const works = await callApiWorks();

  // ajout image + text (puis, plus tard, boucle pour afficher toutes les images et textes)
  for (let i = 0; i < works.length; i++) {
    addImageElement(works[i]);
  }

  console.log(works);
}

app();
