export { createCard };

// Функция создания новой карточки
function createCard(nameValue, linkValue, cardTemplate) {
    const cardElement = cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);
  
    const cardImage = cardElement.querySelector(".card__image");
    const cardTitle = cardElement.querySelector(".card__title");
  
    cardImage.src = linkValue;
    cardImage.alt = nameValue;
    cardTitle.textContent = nameValue;
  
    // Добавим слушатель для открытия попапа с картинкой
    // cardImage.addEventListener("click", function () {
    //   const image = imagePopup.querySelector(".popup__image");
    //   const caption = imagePopup.querySelector(".popup__caption");
  
    //   image.src = linkValue;
    //   image.alt = nameValue;
    //   caption.textContent = nameValue;
  
    //   openModal(imagePopup);
    // });
  
    // Добавим слушатель для удаления карточки
    // const deleteButton = cardElement.querySelector(".card__delete-button");
    // deleteButton.addEventListener("click", function () {
    //   cardElement.remove();
    // });
  
    // Добавим слушатель на лайк
    // const likeButton = cardElement.querySelector(".card__like-button");
    // likeButton.addEventListener("click", function () {
    //   likeButton.classList.toggle("card__like-button_is-active");
    // });
  
    return cardElement;
  }