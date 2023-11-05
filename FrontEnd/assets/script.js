// Fetch and display works
async function WorksLocalHost() {
    try {
        const worksUrl = 'http://localhost:5678/api/works';
        const response = await fetch(worksUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('worksedit', JSON.stringify(data));
        createDocumentWorks(data);
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

// Fetch and display categories
async function CategoriesLocalHost() {
    try {
        const catUrl = 'http://localhost:5678/api/categories';
        const response = await fetch(catUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const fragment = document.createDocumentFragment();
        data.forEach((category) => {
            const link = document.createElement('a');
            link.textContent = category.name;
            link.onclick = () => {
                filterCategories(category.id);
                link.classList.remove('active');
            };
            link.classList.add('categoriesList');
            link.setAttribute('tabindex', '0');
            fragment.appendChild(link);
        });
        const categories = document.getElementById('categories');
        categories.innerHTML = ''; // Clear existing content
        categories.appendChild(fragment);
        localStorage.setItem('recCategories', JSON.stringify(data));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Update the gallery with works
function createDocumentWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing content
    const fragment = document.createDocumentFragment();

    works.forEach((work) => {
        const figure = document.createElement('figure');
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';

        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        div.appendChild(img);
        div.appendChild(caption);
        figure.appendChild(div);
        fragment.appendChild(figure);
    });

    gallery.appendChild(fragment);
}

// Show all projects under the TOUS filters in the gallery
function DisplayWorks() {
    const works = JSON.parse(localStorage.getItem('worksedit'));
    createDocumentWorks(works);
}

// Call the functions when needed
CategoriesLocalHost();
WorksLocalHost();
