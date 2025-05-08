import '../pages/index.css';

import { enableValidation, toggleButtonState } from './components/validate.js';
import { openModal, closeModal} from './components/modal.js';
import { createCard } from './components/card.js';
import { initialCards } from './components/cards.js';

// Получаем список, куда будем добавлять карточки
const placesList = document.querySelector(".places__list");

// Модальные окна (попапы)
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

// Кнопки редактирования профиля и добавления карточки
const addCardButton = document.querySelector(".profile__add-button");
const editProfileButton = document.querySelector(".profile__edit-button");

// Элементы профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Поля ввода формы профиля
const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.querySelector(".popup__input_type_name");
const jobInput = profileFormElement.querySelector(
  ".popup__input_type_description"
);

// Элементы формы редактирования профиля
const formListProfileEdit = Array.from(
  profileFormElement.querySelectorAll("input[type=text]")
);
// Кнопка отправки формы редактирования профиля
const buttonProfileEdit = profileFormElement.querySelector(".button");

// Поля ввода формы новой карточки
const cardFormElement = document.forms["new-place"];
const cardNameInput = cardFormElement.querySelector(
  ".popup__input_type_card-name"
);
const urlInput = cardFormElement.querySelector(".popup__input_type_url");

// Элементы формы добавления нового места
const formListNewPlace = Array.from(
  cardFormElement.querySelectorAll("input[type=text]")
);

// Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

// Формы
const forms = Array.from(document.forms);

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

// Добавляем анимацию для попапов
profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

// Отображение карточек из массива initialCards
initialCards.forEach(function (item) {
  const nameValue = item["name"];
  const linkValue = item["link"];
  const cardElement = createCard(nameValue, linkValue, cardTemplate);
  placesList.prepend(cardElement);
});

// Обработка удаления карточки и лайка
placesList.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("card__delete-button")) {
    evt.target.closest(".places__item").remove();
  }
  if (evt.target.classList.contains("card__like-button")) {
    evt.target.classList.toggle("card__like-button_is-active");
  }
});

// Открытие попапа создания карточки
addCardButton.addEventListener("click", function () {
  cardNameInput.value = "";
  urlInput.value = "";
  openModal(cardPopup, validationSettings);
});

// Открытие попапа редактирования профиля и подстановка значений
editProfileButton.addEventListener("click", function () {
  // Когда мы подставляем значения в поля через input.value,
  // событие input не срабатывает.
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  // Обновляем состояние кнопки с учётом новых значений
  toggleButtonState(formListProfileEdit, buttonProfileEdit, validationSettings);

  openModal(profilePopup, validationSettings);
});

// Закрытие попапов по кнопке крестика
document.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("popup__close")) {
    closeModal(evt.target.closest(".popup"));
  }
});

// Обработка отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  //отменяет стандартное поведение формы, т.е. перезагрузку страницы после отправки.
  evt.preventDefault();
  const name = nameInput.value;
  const job = jobInput.value;
  profileTitle.textContent = name;
  profileDescription.textContent = job;
  closeModal(evt.target.closest(".popup"));
}

// Обработка отправки формы новой карточки
function handleCardFormSubmit(evt) {
  //отменяет стандартное поведение формы, т.е. перезагрузку страницы после отправки.
  evt.preventDefault();
  const nameValue = cardNameInput.value;
  const linkValue = urlInput.value;
  const cardElement = createCard(nameValue, linkValue, cardTemplate);
  placesList.prepend(cardElement);
  closeModal(evt.target.closest(".popup"));
}

// Навешиваем обработчики на формы
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleCardFormSubmit);

// Открытие изображения в попапе
document.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("card__image")) {
    const image = imagePopup.querySelector(".popup__image");
    image.src = evt.target.src;
    image.alt = evt.target.alt;

    const caption = imagePopup.querySelector(".popup__caption");
    caption.textContent = evt.target.alt;
    openModal(imagePopup, validationSettings);
  }
});

// Включаем валидацию с настройками
enableValidation(validationSettings);
