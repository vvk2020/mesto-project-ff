import initialCards from "../components/cards.js";
import { createCard, deleteCard } from "../components/card.js";
import { Popup, ProfilePopup, CardPopup } from "../components/modal.js";
import "../pages/index.css";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек

// @todo: Вывести карточки на страницу
const appendCards = (cardList, ...cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card);
    if (newCard) cardList.append(newCard);
  });
};

appendCards(cardsContainer, ...initialCards);

// Cоздание popup *****************************************************
// document.addEventListener("DOMContentLoaded", () => {
/******* Popup редактирования профиля *******/
// Кнопка открытия popup редактирования профиля
const buttonEditProfile = document.querySelector(".profile__edit-button");
// Элементы страницы, отображающие данные профия
const profileFields = {
  name: document.querySelector(".profile__title"), // имя
  description: document.querySelector(".profile__description"), // описание
};
/******* Popup создания карточки *******/
// Popup добавления новой карточки и кнопка его открытия
const popupNewCard = document.querySelector(".popup_type_new-card");
const buttonAddCard = document.querySelector(".profile__add-button");

/******* Popup карточки *******/
// Popup карточки
// const popupImageCard = document.querySelector(".popup_type_image");
// const buttonOpenImageCard = document.querySelector(".card__image");

// Массив статически обрабатываемых popup-объектов
const Popups = [
  new ProfilePopup(buttonEditProfile, profileFields),
  new Popup(popupNewCard, buttonAddCard),
];

// Список карточек и назначение ему  обработчика для onclick
const cardsList = document.querySelector(".places__list");
cardsList.addEventListener("click", clickCard);

// Динамическое назначение обработчиков закрытия выбранной карточке
function clickCard(evt) {
  if (evt.target.classList.contains("card__image")) {
    const selectedCard = evt.target.closest(".places__item");
    if (selectedCard) Popups.push(new CardPopup(selectedCard, true));
  }
}
// }); *************************************************************

export { cardTemplate };
