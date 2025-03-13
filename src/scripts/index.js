import initialCards from "../components/cards.js";
import { createCard, deleteCard, likeCard } from "../components/card.js";
import { openModal } from "../components/modal.js";
import "../pages/index.css";

/*********************************************************************************************/

//!  DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек
//* popup's
// const profilePopup = document.querySelector(".popup.popup_type_edit"); // редактирования профиля
// const cardAddPopup = document.querySelector(".popup.popup_type_new-card"); // создания карточки
const cardViewPopup = document.querySelector(".popup.popup_type_image"); // просмотра карточки

//* поля popup просмотра карточки
const imageCardViewPopup = cardViewPopup.querySelector("img.popup__image");
const captionCardViewPopup = cardViewPopup.querySelector(".popup__caption");

//! Обработчики событий

//* Обработчик отображения popup просмотра карточки
function handleShowCard(card) {
  setupCardViewPopup(card); // настройка popup
  if (cardViewPopup) openModal(cardViewPopup); // открытие popup
}

//* Обработчик закрытия popup просмотра карточки
function handleHideCard(card) {
  // setupCardViewPopup(card); // настройка popup
  if (cardViewPopup) closeModal(cardViewPopup); // открытие popup
}

//! Вспомогательные функции

//* Настройка окна отображения карточки
function setupCardViewPopup(card) {
  // Трансфер данных из карточки в popup
  if (card.name && card.link && imageCardViewPopup) {
    // Картинка
    if (imageCardViewPopup) {
      imageCardViewPopup.src = card.link;
      imageCardViewPopup.alt = card.name;
    }
    // Название
    if (captionCardViewPopup) captionCardViewPopup.textContent = card.name;
  }
}

//! Вывод лакльно сохраненных карточек на страницу из initialCards[]
const appendCards = (cardList, ...cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card, handleShowCard);
    if (newCard) cardList.append(newCard);
  });
};

// // Инициализация popup'ов

appendCards(cardsContainer, ...initialCards);

/*********************************************************************************************/

// //* popup'ов
// const profilePopup = new ProfilePopup(); // редактирования профиля
// const cardAddPopup = new CardAddPopup(); // добавления новой карточки
// const cardViewPopup = new CardViewPopup(); // просмотра карточки с описанием
// //* Кнопки, открывающие popup'ы
// const buttonEditProfile = document.querySelector(".profile__edit-button"); // редактирования профиля
// const buttonAddCard = document.querySelector(".profile__add-button"); // добавления новой карточки

/*
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
*/

// export { cardAddPopup };
