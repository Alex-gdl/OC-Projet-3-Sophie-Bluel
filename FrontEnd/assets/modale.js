// Variables
const modalChanges = document.querySelector('.modalChanges');
const modalPopupWorks = document.querySelector('#popupModal');
const messageModal = document.getElementById('messageModal');
const addImgWorks = document.querySelector('#addImg');
const uploadImage = document.querySelector('#imagetype');
const addFormWorks = document.querySelector('#formPhoto');
const PreviewWorks = document.querySelector('.AddPhotoGallery');
const submitChanges = document.querySelector('#submitChanges');
const deletePhotoWorks = document.querySelector('#deletePhoto');
const editmodeModal = document.querySelector('#editionProject');
const closePopUpModal = document.querySelector('#close');
const AddPhotoWorks = document.querySelector('#AddPhoto');
const openPhotoAdd = document.querySelector('#photoAdd');
const WorkModalBtn = document.querySelector('#xadd');
const returnArrowBtn = document.querySelector('.arrow');

// Function to add projects to the modal
function addWorkModal() {
    const works = JSON.parse(localStorage.getItem('worksedit'));

    const fragment = new DocumentFragment();
    
    works.forEach((work) => {
        const div = document.createElement('div');
        div.id = 'gallery_edit_img';

        const img = new Image();
        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';
        div.appendChild(img);

        const i = document.createElement('i');
        i.className = 'fa fa-trash';
        i.setAttribute('data-id', work.id);
        i.addEventListener('click', () => deleteWork(work.id));
        div.appendChild(i);

        const p = document.createElement('p');
        p.textContent = 'éditer';
        p.setAttribute('data-id', work.id);
        div.appendChild(p);

        fragment.appendChild(div);
    });

    modalChanges.innerHTML = '';
    modalChanges.appendChild(fragment);
}

// Function to open the modal gallery and delete or add projects
function openmodalChanges() {
    deletePhotoWorks.style.display = 'flex';
    modalPopupWorks.style.display = 'block';
    addWorkModal();
}

function openPhotoAddModal() {
    AddPhotoWorks.style.display = 'flex';
    modalPopupWorks.style.display = 'block';
}

function closeModal() {
    deletePhotoWorks.style.display = 'none';
    AddPhotoWorks.style.display = 'none';
    modalPopupWorks.style.display = 'none';
}

// Event listeners
if (editmodeModal) editmodeModal.addEventListener('click', openmodalChanges);
if (openPhotoAdd) openPhotoAdd.addEventListener('click', () => {
    closeModal();
    openPhotoAddModal();
});

closePopUpModal.addEventListener('click', closeModal);
WorkModalBtn.addEventListener('click', closeModal);

returnArrowBtn.addEventListener('click', () => {
    closeModal();
    openmodalChanges();
    addWorkModal();
});

modalPopupWorks.addEventListener('click', closeModal);

submitChanges.addEventListener('click', handleFormSubmit);

// Function to delete a work
function deleteWork(id) {
    fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': getAuthorization(),
            'Content-Type': 'application/json',
        },
    })
    .then(() => {
        const messageModal = document.getElementById('messageModal');
        messageModal.innerHTML = 'Votre photo a été supprimée avec succès';
        messageModal.style.display = 'block';
        setTimeout(() => { messageModal.style.display = 'none'; }, 5000);
        closeModal();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to send work data
async function sendWorkData(data) {
    const postWorkUrl = 'http://localhost:5678/api/works';

    try {
        const response = await fetch(postWorkUrl, {
            method: 'POST',
            headers: {
                'Authorization': getAuthorization(),
            },
            body: data,
        });
        
        const responseData = await response.json();
        console.log(responseData);

        messageModal.innerHTML = 'Votre photo a été ajoutée avec succès';
        messageModal.style.display = 'block';
        setTimeout(() => { messageModal.style.display = 'none'; }, 5000);
        closeModal();
    } catch (error) {
        console.error('Erreur :', error);
    }
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    if (!addFormWorks.checkValidity()) {
        messageModal('Champs obligatoires.');
        return;
    }

    const title = addFormWorks.querySelector('#categories-text').value;
    const categories = addFormWorks.querySelector('#chooseCat').value;
    const file = addImgWorks.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('categories', categories);
    formData.append('image', file);

    sendWorkData(formData);
}

// Function to show image preview
function showImagePreview() {
    if (addImgWorks.files && addImgWorks.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = addImgWorks.files[0].name;

        reader.onload = (event) => {
            image.src = event.target.result;
            image.alt = fileName.split('.')[0];
        };

        uploadImage.style.display = 'none';
        submitChanges.style.backgroundColor = '#1D6154';
        previewUpload.style.display = 'block';
        PreviewWorks.style.backgroundColor = '#FFFFFF';
        reader.readAsDataURL(addImgWorks.files[0]);
        previewUpload.appendChild(image);
    }
}

addImgWorks.addEventListener('change', showImagePreview);
