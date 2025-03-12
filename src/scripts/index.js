import initialCards from "../components/cards.js";
import { createCard, likeCard } from "../components/card.js";
import {
  ProfilePopup,
  CardViewPopup,
  CardAddPopup,
} from "../components/modal.js";
import "../pages/index.css";

//!  DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек
//* popup'ов
const profilePopup = new ProfilePopup(); // редактирования профиля
const cardAddPopup = new CardAddPopup(); // добавления новой карточки
const cardViewPopup = new CardViewPopup(); // просмотра карточки с описанием
//* Кнопки, открывающие popup'ы
const buttonEditProfile = document.querySelector(".profile__edit-button"); // редактирования профиля
const buttonAddCard = document.querySelector(".profile__add-button"); // добавления новой карточки
//

//! Вывод лакльно сохраненных карточек на страницу из initialCards[]
const appendCards = (cardList, ...cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card);
    if (newCard) cardList.append(newCard);
  });
};

appendCards(cardsContainer, ...initialCards);

//! Назначение обработчиков ...

//* ... открытия popup редактирования профиля
buttonEditProfile.addEventListener("click", () => {
  const sources = {
    name: document.querySelector(".profile__title"), // имя
    description: document.querySelector(".profile__description"), // описание
  };
  profilePopup.openModal(sources, sources);
}); // редактирования профиля

//* ... открытия popup добавления новой карточки
buttonAddCard.addEventListener("click", () => {
  cardAddPopup.openModal();
}); // создания новой карточки

//* ... открытия popup карточек и like/dislike 
cardsContainer.addEventListener("click", (evt) => {
  // Открытие popup выбранной карточки
  if (evt.target.classList.contains("card__image")) {
    const selectedCard = evt.target.closest(".places__item");
    if (selectedCard) {
      cardViewPopup.openModal(selectedCard); // открытие popup c картинкой и описанием карточки
    }
  }
  // Обработка like/dislike при click по кнопке 🩷 карточки
  if (evt.target.classList.contains("card__like-button")) {
    likeCard(evt.target); // изменение стиля 🩷
  }
});
