const deleteModal = document.querySelector("#deleteModal");
const openGalleryModalBtn = document.querySelector("#ChangesEdition");
const closeGallery = document.querySelector("#xclose");
const addPhotoModal = document.querySelector("#addPhotoModal");
const photoAdd = document.querySelector("#photoAdd");
const arrowLeftModal = document.querySelector(".arrowLeftModal");
const closeModalBox = document.querySelector("#closeModalBox");
const uploadImageInput = document.querySelector("#imageUpload");
const preview = document.querySelector("#preview");
const previewInfo = document.querySelector("#previewInfo");
const submitChanges = document.querySelector("#submitChanges");
const previewModal = document.querySelector(".addPhotoGallery");
const formPhoto = document.querySelector("#formPhoto");
const modalBox = document.querySelector("#modalbox");

function openGalleryModal() {
    setModalDisplay(deleteModal, "flex");
    setModalDisplay(modalBox, "block");
    addProjectModalBox();
}

function openaddProjectModalBox() {
    setModalDisplay(addPhotoModal, "flex");
    setModalDisplay(modalBox, "block");
}

function closeGalleryModal() {
    setModalDisplay(deleteModal, "none");
    setModalDisplay(modalBox, "none");
}

function closeaddProjectModalBox() {
    setModalDisplay(addPhotoModal, "none");
    setModalDisplay(modalBox, "none");
}

function setModalDisplay(modal, displayValue) {
    modal.style.display = displayValue;
}

if (openGalleryModalBtn) openGalleryModalBtn.addEventListener("click", openGalleryModal);
if (photoAdd) photoAdd.addEventListener("click", () => {
    closeGalleryModal();
    openaddProjectModalBox();
});

closeGallery.addEventListener("click", closeGalleryModal);
closeModalBox.addEventListener("click", closeaddProjectModalBox);

arrowLeftModal.addEventListener("click", () => {
    closeaddProjectModalBox();
    openGalleryModal();
    addProjectModalBox();
});

window.onclick = function (event) {
    if (event.target == modalBox) {
        closeaddProjectModalBox();
        closeGalleryModal();
    }
}

function deleteWork(event, id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Authorization': recoverIdToken(),
            'Content-Type': 'application/json',
        },
        params: {
            'id': id
        },
    })
    .then(() => {
        const parentDiv = event.parentNode;
        parentDiv.remove();
        displayAlert("Votre photo a été supprimé avec succès");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function sendWorkData(data) {
    const postWorkUrl = 'http://localhost:5678/api/works/';

    try {
        const response = await fetch(postWorkUrl, {
            method: "POST",
            headers: {
                'Authorization': recoverIdToken()
            },
            body: data,
        });

        const responseData = await response.json();
        console.log(responseData);
        displayAlert("Succès");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function displayAlert(message) {
    const alert = document.getElementById('alert');
    alert.innerHTML = message;
    alert.style.display = "block";
    setTimeout(() => { alert.style.display = "none"; }, 5000);
}

uploadImageInput.addEventListener("change", uploadImage);
formPhoto.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    if (!formPhoto.checkValidity()) {
        alert("Erreur");
        return;
    }

    const title = formPhoto.querySelector("#infoCategoryModal").value;
    const category = formPhoto.querySelector("#chooseCategoryModal").value;
    const file = uploadImageInput.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("filters", filters);
    formData.append("image", file);

    sendWorkData(formData);
}

function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        previewInfo.style.display = "none";
        submitChanges.style.backgroundColor = "#1D6154";
        preview.style.display = "block";
        previewModal.style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(uploadImageInput.files[0]);
        preview.appendChild(image);
    }
}