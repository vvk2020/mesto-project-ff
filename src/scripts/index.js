import initialCards from "./cards.js";
import "../pages/index.css";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек

// @todo: Функция создания карточки
const createCard = (card, handler = deleteCard) => {
  // Клонирование карточки по шаблону
  const newCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Если клон успешно создан, то его инициализация
  if (newCard) {
    // Данные карточки
    const cardImage = newCard.querySelector(".card__image");
    cardImage.src = card.link;
    cardImage.alt = card.name;
    newCard.querySelector(".card__title").textContent = card.name;
    // Обработчик удаления карточки
    const deleteButton = newCard.querySelector(".card__delete-button");
    deleteButton.addEventListener("click", () => {
      handler(newCard);
    });
  }
  return newCard;
};

// @todo: Функция удаления карточки
const deleteCard = (card) => {
  if (card) card.remove();
};

// @todo: Вывести карточки на страницу
const appendCards = (cardList, ...cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card);
    if (newCard) cardList.append(newCard);
  });
};

appendCards(cardsContainer, ...initialCards);

/***  Редактирование профиля ***/

const profileEditButton = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const profileCloseButton = document.querySelector(
  ".popup_type_edit .popup__close"
);

// Назначение обработчика открытия окна редактирования профиля по ✏️
profileEditButton.addEventListener("click", openPopup);

// Обработчик открытия модального окна по ✏️
function openPopup() {
  popupEditProfile.classList.add("popup_is-opened");
  attachPopupEvents(); // обработчики событий, которые работают, когда окно открыто
}

// Обработчик click по ❌ модального окна
function closePopup() {
  popupEditProfile.classList.remove("popup_is-opened");
  detachPopupEvents(); // удаление обработчиков событий
}

// Функция назначения обработчиков событий модального окна
function attachPopupEvents() {
  // закрыть окно по ❌
  profileCloseButton.addEventListener("click", closePopup);
  // закрыть окно по Esc
  document.addEventListener("keydown", handleEsc);
  // закрыть окно по click вне границ окна
  popupEditProfile.addEventListener("click", handleClickOutside);
}

// Функция удаления обработчиков событий модального окна
function detachPopupEvents() {
  profileCloseButton.removeEventListener("click", closePopup);
  document.removeEventListener("keydown", handleEsc);
  popupEditProfile.removeEventListener("click", handleClickOutside);
}

// Обработчик закрытия модального окна по Esc
function handleEsc(event) {
  if (event.key === "Escape") closePopup();
}

// Обработчик закрытия модального окна по click вне его границ 
function handleClickOutside(evt) {
  const isInsideClick = !!evt.target.closest(".popup__content");
  if (!isInsideClick) closePopup();
}
