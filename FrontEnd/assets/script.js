const editionMode = document.querySelector(".edition-mode");
const ChangesEdition = document.querySelectorAll(".projectChangesEdition");
const logout = document.querySelector('[href="./login.html"]');
const filters = document.querySelectorAll("#filters");
const logo = document.querySelector("#logo");
const menuNav = document.querySelector("#menuNav");

if (isUserConnected()) {
    editionMode.style.display = "flex";
    logo.style.paddingTop = menuNav.style.paddingTop = "30px";
    logo.style.fontSize = "23px";

    filters.forEach(filter => filter.style.display = "none");
    ChangesEdition.forEach(editBtn => editBtn.style.display = "flex");

    logout.textContent = "logout";
    logout.setAttribute("href", "#");

    logout.addEventListener("click", event => {
        event.preventDefault();
        localStorage.removeItem("userId");
        localStorage.removeItem("auth");
        window.location.reload();
    });
}

function recoverIdToken() {
    const authData = JSON.parse(localStorage.getItem('auth'));
    return authData ? 'Bearer ' + authData.token : null;
  }
  
  function isUserConnected() {
    return !!recoverIdToken();
  }

returnCategories();
recoverProject();

async function returnCategories() {
    const urlCategories = 'http://localhost:5678/api/categories';
    try {
        const response = await fetch(urlCategories);
        const data = await response.json();

        const fragment = document.createDocumentFragment();
        let categoriesData = data;

        localStorage.setItem('categoriesData', JSON.stringify(data));
        categoriesData.forEach((category) => {
            const clickLink = document.createElement('a');
            clickLink.textContent = category.name;
            clickLink.onclick = function () {
                findByCategory(category.id);
                clickLink.classList.remove('allWorks');
            };
            clickLink.classList.add("filterOption");
            clickLink.setAttribute("tabindex", "0");
            fragment.appendChild(clickLink);
        });

        const filtersCategory = document.getElementById('filters');
        filtersCategory.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function findByCategory(id) {
    const works = JSON.parse(localStorage.getItem('worksedit'));
    const worksList = works.filter((work) => work.categoryId == id);
    console.log(worksList);
    createDocumentProject(worksList);
}

function DisplayWorks() {
    const works = JSON.parse(localStorage.getItem('worksedit'));
    createDocumentProject(works);
}

function recoverProject() {
    const urlWorks = 'http://localhost:5678/api/works/';

    fetch(urlWorks)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const fragment = document.createDocumentFragment();
            let works = data;
            localStorage.setItem('worksedit', JSON.stringify(data));
            createDocumentProject(works);
        })
}

function createDocumentProject(works) {
    const fragment = document.createDocumentFragment();
    const gallery = document.getElementsByClassName('gallery')[0];

    gallery.innerHTML = ''; 
    works.forEach((work) => {
        const figure = document.createElement('figure');
        const div = document.createElement('div');
        const img = document.createElement('img');

        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';

        const caption = document.createElement('figcaption')
        caption.textContent = work.title;
        fragment.appendChild(figure);
        figure.appendChild(div);
        div.appendChild(img);
        div.appendChild(caption);
    })
    gallery.appendChild(fragment);
}

function addProjectModalBox() {
    const fragment = document.createDocumentFragment();
    const galeriePhoto = document.getElementsByClassName('galeriePhoto')[0];
    galeriePhoto.innerHTML='';

    const works = JSON.parse(localStorage.getItem('worksedit'));

    works.forEach((work) => {
    const div = document.createElement('div');
    div.id = "gallery_edit_img";

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.crossOrigin = 'anonymous';
    div.appendChild(img);

    const trashGallery = document.createElement('i');
    trashGallery.setAttribute("class", "fa fa-trash");
    trashGallery.setAttribute("data-id", work.id);
    trashGallery.addEventListener("click",  (event) => { 
        console.log(event.target)
        let workId = event.target.dataset.id
        deleteWork(workId)
    })
    div.appendChild(trashGallery);

    fragment.appendChild(div);
    });
  
    galeriePhoto.appendChild(fragment);
   
}

