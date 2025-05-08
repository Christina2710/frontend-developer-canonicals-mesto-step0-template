export { openModal, closeModal };
import { hideInputError } from './validate.js';

// Закрытие модального окна через клавишу Escape
function closeByEsc(evt) {
  const openedPopup = document.querySelector(".popup_is-opened");
  if (evt.key === "Escape") {
    closeModal(openedPopup);
  }
}

// Закрытие модального окна кликом на оверлей
function closeByOverlay(evt) {
  if (evt.target.classList.contains("popup")) {
    closeModal(evt.target);
  }
}

// Открытие модального окна
function openModal(popup, settings) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEsc);
  document.addEventListener("click", closeByOverlay);

  const inputList = Array.from(popup.querySelectorAll(settings.inputSelector));
  inputList.forEach(function(inputElement) {
    hideInputError(inputElement, popup.querySelector(settings.formSelector), settings);
  });
}

// Закрытие модального окна
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEsc);
  document.removeEventListener("click", closeByOverlay);
}
