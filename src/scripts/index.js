import initialCards from "../components/cards.js";
import { createCard } from "../components/card.js";
import { openModal, closeModal, initializeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "../components/validation.js";
import "../pages/index.css";

//! Константы
const SELECTORS = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//!  DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек
//* popup's
const profilePopup = document.querySelector(".popup.popup_type_edit"); // редактирования профиля
const newCardPopup = document.querySelector(".popup.popup_type_new-card"); // создания карточки
const cardViewPopup = document.querySelector(".popup.popup_type_image"); // просмотра карточки

//* Кнопки открытия popup
const btnEditProfile = document.querySelector(".profile__edit-button"); // редактирования профиля
const btnAddCard = document.querySelector(".profile__add-button"); // добавления новой карточки

//* Источники данных для форм popup
const nameProfile = document.querySelector(".profile__title"); // имя профиля
const descrProfile = document.querySelector(".profile__description"); // описание профиля

//* Элементы popup просмотра карточки
const imageCardViewPopup = cardViewPopup.querySelector("img.popup__image");
const captionCardViewPopup = cardViewPopup.querySelector(".popup__caption");

//* Inputs формы popup редактирования профиля
const nameProfilePopupInput = profilePopup.querySelector(
  "input.popup__input_type_name"
); // input имени профиля
const descrProfilePopupInput = profilePopup.querySelector(
  "input.popup__input_type_description"
); // input описания профиля

//! Обработчики событий

//* Обработчик отображения popup просмотра карточки
function handleShowCard(card) {
  setupCardViewPopup(card); // настройка popup
  if (cardViewPopup) openModal(cardViewPopup); // открытие popup
}

//! Назначение обработчиков событий ...

(() => {
  //* ... кнопки открытия popup редактирования профиля
  if (btnEditProfile) {
    btnEditProfile.addEventListener("click", () => {
      if (profilePopup) {
        setupEditProfilePopup(); // настройка popup
        openModal(profilePopup); // открытие popup
      }
    });
  }

  //* ... кнопки открытия popup создания карточки
  if (btnAddCard) {
    btnAddCard.addEventListener("click", () => {
      if (newCardPopup) {
        resetNewCardPopupForm(); // настройка popup (сброс формы)
        openModal(newCardPopup); // открытие popup
      }
    });
  }

  //* ... закрытия popup и его преднастройка
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    initializeModal(popup);
  });

  //* ... submit-обработчика формам popup
  setHandlerFormSubmit("edit-profile", handleEditProfileSubmit);
  setHandlerFormSubmit("new-place", handleNewCardSubmit);
})();

function setHandlerFormSubmit(formName, handler) {
  if (document.forms[formName]) {
    document.forms[formName].addEventListener("submit", handler);
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  const data = serializeForm(evt.target); // подготовка данных формы
  // Трансфер данных из формы на страницу
  if (data.get("name")) nameProfile.textContent = data.get("name");
  if (data.get("description"))
    descrProfile.textContent = data.get("description");
  closeModal(profilePopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  const data = serializeForm(evt.target); // подготовка данных формы

  if (data.get("place-name") && data.get("link")) {
    // Создание карточки
    const newCard = createCard(
      { name: data.get("place-name"), link: data.get("link") },
      { onShow: handleShowCard }
    );
    // Добавление созданной карточки в конец списка карточек
    if (newCard && cardsContainer) cardsContainer.prepend(newCard);
  }
  closeModal(newCardPopup);
}

//! Вспомогательные функции popup и его форм

//* Преднастройка popup отображения карточки
function setupCardViewPopup(card) {
  // Трансфер данных из карточки в popup
  if (card.name && card.link && imageCardViewPopup) {
    // Картинка карточки
    if (imageCardViewPopup) {
      imageCardViewPopup.src = card.link;
      imageCardViewPopup.alt = card.name;
    }
    // Название карточки
    if (captionCardViewPopup) captionCardViewPopup.textContent = card.name;
  }
}

//* Преднастройка popup редактирования профиля
function setupEditProfilePopup() {
  // Трансфер данных из страницы в popup
  if (nameProfile && nameProfilePopupInput)
    nameProfilePopupInput.value = nameProfile.textContent; // имя профиля
  if (descrProfile && descrProfilePopupInput)
    descrProfilePopupInput.value = descrProfile.textContent; // описание профиля
}

//* Сброс формы popup создания карточки
function resetNewCardPopupForm() {
  document.forms["new-place"].reset(); // сброс формы (очистка полей)
}

//* Подготовка данных формы popup
function serializeForm(form) {
  if (form) {
    const { elements } = form;
    const data = new FormData(); // данные формы для отправки на сервер
    Array.from(elements)
      .filter((item) => !!item.name)
      .forEach((element) => {
        const { name, value } = element;
        data.append(name, value);
      });
    return data;
  }
}

//! Вывод лакльно сохраненных карточек на страницу из initialCards[]
const appendCards = (cardList, cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card, { onShow: handleShowCard });
    if (newCard) cardList.append(newCard);
  });
};

appendCards(cardsContainer, initialCards);

enableValidation(SELECTORS);