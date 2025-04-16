// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

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
const profileFormElement = profilePopup.querySelector(".popup__form");
const nameInput = profileFormElement.querySelector(".popup__input_type_name");
const jobInput = profileFormElement.querySelector(
  ".popup__input_type_description"
);

// Поля ввода формы новой карточки
const cardFormElement = cardPopup.querySelector(".popup__form");
const cardNameInput = cardFormElement.querySelector(
  ".popup__input_type_card-name"
);
const urlInput = cardFormElement.querySelector(".popup__input_type_url");

// Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

// Добавляем анимацию для попапов
profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

// Функция создания новой карточки
function createCard(nameValue, linkValue) {
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

// Отображение карточек из массива initialCards
initialCards.forEach(function (item) {
  const nameValue = item["name"];
  const linkValue = item["link"];
  const cardElement = createCard(nameValue, linkValue);
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

// Открытие модального окна
function openModal(popup) {
  popup.classList.add("popup_is-opened");
}

// Закрытие модального окна
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
}

// Открытие попапа создания карточки
addCardButton.addEventListener("click", function () {
  cardNameInput.value = "";
  urlInput.value = "";
  openModal(cardPopup);
});

// Открытие попапа редактирования профиля и подстановка значений
editProfileButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
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
  const cardElement = createCard(nameValue, linkValue);
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
    openModal(imagePopup);
  }
});
