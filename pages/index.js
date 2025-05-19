import "../pages/index.css";

import {
  enableValidation,
  toggleButtonState,
} from "../scripts/components/validate.js";
import { openModal, closeModal } from "../scripts/components/modal.js";
import { createCard } from "../scripts/components/card.js";
import {
  getCards,
  getUserInfo,
  updateUserInfo,
  addCard,
  updateAvatar,
} from "../scripts/utils/api.js";

import { renderLoading } from "../scripts/utils/utils.js";
import { validationSettings } from "../scripts/utils/constants.js";

// ЭЛЕМЕНТЫ ПРОФИЛЯ
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const avatarProfile = document.querySelector(".profile__image");

// КНОПКИ УПРАВЛЕНИЯ
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

// МОДАЛЬНЫЕ ОКНА (ПОПАПЫ)
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const avatarPopup = document.querySelector(".popup_type_update-avatar");

// ШАБЛОН КАРТОЧКИ
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

// ФОРМА: РЕДАКТИРОВАНИЕ ПРОФИЛЯ
const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.querySelector(".popup__input_type_name");
const jobInput = profileFormElement.querySelector(
  ".popup__input_type_description"
);
const profileSaveButton = profileFormElement.querySelector(".button");
const profileInputs = Array.from(
  profileFormElement.querySelectorAll("input[type=text]")
);

// ФОРМА: ОБНОВЛЕНИЕ АВАТАРА
const avatarFormElement = document.forms["new-avatar"];
const linkAvatarInput = avatarFormElement.querySelector(
  ".popup__input_type_url"
);
const avatarSaveButton = avatarFormElement.querySelector(".button");
const avatarInputs = Array.from(
  avatarFormElement.querySelectorAll("input[type=text]")
);

// ФОРМА: ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ
const cardFormElement = document.forms["new-place"];
const cardNameInput = cardFormElement.querySelector(
  ".popup__input_type_card-name"
);
const cardImageInput = cardFormElement.querySelector(".popup__input_type_url");
const cardSaveButton = cardFormElement.querySelector(".button");

// Добавляем анимацию для попапов
profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

// Закрытие попапов по кнопке крестика
document.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("popup__close")) {
    closeModal(evt.target.closest(".popup"));
  }
});

// Открытие попапа создания карточки
addCardButton.addEventListener("click", function () {
  cardNameInput.value = "";
  cardImageInput.value = "";
  openModal(cardPopup, validationSettings);
});

// Открытие попапа обновления аватара пользователя
avatarProfile.addEventListener("click", function () {
  const backgroundImage =
    getComputedStyle(avatarProfile).getPropertyValue("background-image");
  linkAvatarInput.value = backgroundImage.slice(5, -2);
  // Обновляем состояние кнопки с учётом новых значений
  toggleButtonState(avatarInputs, avatarSaveButton, validationSettings);

  openModal(avatarPopup, validationSettings);
});

// Открытие попапа редактирования профиля и подстановка значений
editProfileButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  // Обновляем состояние кнопки с учётом новых значений
  toggleButtonState(profileInputs, profileSaveButton, validationSettings);

  openModal(profilePopup, validationSettings);
});

// Обработка отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  //отменяет стандартное поведение формы, т.е. перезагрузку страницы после отправки.
  evt.preventDefault();
  const name = nameInput.value;
  const job = jobInput.value;

  renderLoading(true, profileSaveButton);

  updateUserInfo(name, job)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => renderLoading(false, profileSaveButton));
}

// Обработка отправки формы новой карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = cardNameInput.value;
  const linkValue = cardImageInput.value;
  renderLoading(true, cardSaveButton);

  addCard(nameValue, linkValue)
    .then((newCard) => {
      const cardElement = createCard(newCard, cardTemplate, validationSettings);
      const deleteButton = cardElement.querySelector(".card__delete-button");
      deleteButton.classList.add("card__delete-button_is-active");
      placesList.prepend(cardElement);
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => renderLoading(false, cardSaveButton));
}

// Обработка отправки формы обновления аватара пользователя
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarSaveButton);

  const linkValue = linkAvatarInput.value;

  updateAvatar(linkValue)
    .then((userData) => {
      avatarProfile.style.backgroundImage = `url("${userData.avatar}")`;
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => renderLoading(false, avatarSaveButton));
}

// Навешиваем обработчики на формы
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleCardFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

// Включаем валидацию с настройками
enableValidation(validationSettings);

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    // Идентификатор текущего пользователя
    const currentUserId = userData._id;

    // Обновляем информацию о пользователе в интерфейсе
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarProfile.style.backgroundImage = `url("${userData.avatar}")`;

    // Отображение карточек, полученных с сервера
    cards.forEach((card) => {
      const cardElement = createCard(card, cardTemplate, validationSettings);

      const deleteButton = cardElement.querySelector(".card__delete-button");
      const likeButton = cardElement.querySelector(".card__like-button");

      // Показываем кнопку удаления только для своих карточек
      if (currentUserId === card.owner._id) {
        deleteButton.classList.add("card__delete-button_is-active");
      }

      // Отмечаем лайк, если пользователь уже ставил
      if (card.likes.some((like) => like._id === currentUserId)) {
        likeButton.classList.add("card__like-button_is-active");
      }

      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  });
