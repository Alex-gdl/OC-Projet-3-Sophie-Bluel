const elements = {
    deleteModal: "#deleteModal",
    openGalleryModalBtn: "#ChangesEdition",
    closeGallery: "#xclose",
    addPhotoModal: "#addPhotoModal",
    photoAdd: "#photoAdd",
    arrowLeftModal: ".arrowLeftModal",
    closeModalBox: "#closeModalBox",
    uploadImageInput: "#imageUpload",
    preview: "#preview",
    previewInfo: "#previewInfo",
    submitChanges: "#submitChanges",
    previewModal: ".addPhotoGallery",
    formPhoto: "#formPhoto",
    modalBox: "#modalbox",
    alert: "#alert",
};

const getElem = (selector) => document.querySelector(selector);

const setModalDisplay = (modal, displayValue) => {
    getElem(modal).style.display = displayValue;
};

const openGalleryModal = () => {
    setModalDisplay(elements.deleteModal, "flex");
    setModalDisplay(elements.modalBox, "block");
    addProjectModalBox();
};

const openAddProjectModalBox = () => {
    setModalDisplay(elements.addPhotoModal, "flex");
    setModalDisplay(elements.modalBox, "block");
};

const closeGalleryModal = () => {
    setModalDisplay(elements.deleteModal, "none");
    setModalDisplay(elements.modalBox, "none");
};

const closeAddProjectModalBox = () => {
    setModalDisplay(elements.addPhotoModal, "none");
    setModalDisplay(elements.modalBox, "none");
};

const openGalleryAndAddProjectModal = () => {
    closeGalleryModal();
    openAddProjectModalBox();
};

const handleArrowLeftClick = () => {
    closeAddProjectModalBox();
    openGalleryModal();
    addProjectModalBox();
};

const handleWindowClick = (event) => {
    if (event.target === getElem(elements.modalBox)) {
        closeAddProjectModalBox();
        closeGalleryModal();
    }
};

const baseURL = 'http://localhost:5678/api/works/';

const deleteWork = (id) => {
    console.log(`${baseURL}${id}`)
    fetch(`${baseURL}${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Authorization': recoverIdToken(),
            'Content-Type': 'application/json',
        },
        params: { 'id': id },
    })
        .then(() => {
            parentDiv.remove();
            displayAlert("Succès");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const sendWorkData = async (data) => {
    console.log(data)
    try {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: { 'Authorization': recoverIdToken() },
            body: data,
        });

        const responseData = await response.json();
        console.log(responseData);
        displayAlert("Succès");
    } catch (error) {
        console.error("Erreur :", error);
    }
};

const displayAlert = (message) => {
    getElem(elements.alert).innerHTML = message;
    getElem(elements.alert).style.display = "block";
    setTimeout(() => { getElem(elements.alert).style.display = "none"; }, 5000);
};

const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!getElem(elements.formPhoto).checkValidity()) {
        alert("Erreur");
        return;
    }

    const title = getElem(`${elements.formPhoto} #infoCategoryModal`).value;
    const category = getElem(`${elements.formPhoto} #chooseCategoryModal`).value;
    const file = getElem(elements.uploadImageInput).files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    sendWorkData(formData);
};

const uploadImage = () => {
    const { files } = getElem(elements.uploadImageInput);

    if (files && files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        getElem(elements.previewInfo).style.display = "none";
        getElem(elements.submitChanges).style.backgroundColor = "#1D6154";
        getElem(elements.preview).style.display = "block";
        getElem(elements.previewModal).style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(files[0]);
        getElem(elements.preview).appendChild(image);
    }
};

// Event Listeners
getElem(elements.openGalleryModalBtn)?.addEventListener("click", openGalleryModal);
getElem(elements.photoAdd)?.addEventListener("click", openGalleryAndAddProjectModal);
getElem(elements.closeGallery)?.addEventListener("click", closeGalleryModal);
getElem(elements.closeModalBox)?.addEventListener("click", closeAddProjectModalBox);
getElem(elements.arrowLeftModal)?.addEventListener("click", handleArrowLeftClick);
window.onclick = handleWindowClick;
getElem(elements.uploadImageInput)?.addEventListener("change", uploadImage);
getElem(elements.formPhoto)?.addEventListener("submit", handleFormSubmit);