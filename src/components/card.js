export { createCard };
import { openModal } from "./modal.js";
import { deleteCard, likeCard, unlikeCard } from "./api.js";

// Функция создания новой карточки
function createCard(card, cardTemplate, settings) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  const likeCount = cardElement.querySelector(".card__like-count");
  likeCount.textContent = card.likes.length;

  // Добавим слушатель для открытия попапа с картинкой
  cardImage.addEventListener("click", function () {
    const imagePopup = document.querySelector(".popup_type_image");
    const image = imagePopup.querySelector(".popup__image");
    const caption = imagePopup.querySelector(".popup__caption");

    image.src = card.link;
    image.alt = card.name;
    caption.textContent = card.name;

    openModal(imagePopup, settings);
  });

  // Добавим слушатель для удаления карточки
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function () {
    deleteCard(card._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  });

  // Добавим слушатель на лайк
  const likeButton = cardElement.querySelector(".card__like-button");

  likeButton.addEventListener("click", function () {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    if (!isLiked) {
      likeCard(card._id)
        .then((likedCard) => {
          likeButton.classList.add("card__like-button_is-active");
          likeCount.textContent = likedCard.likes.length;
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    } else {
      unlikeCard(card._id)
        .then((unlikedCard) => {
          likeButton.classList.remove("card__like-button_is-active");
          likeCount.textContent = unlikedCard.likes.length;
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  });

  return cardElement;
}
