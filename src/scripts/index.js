import { initialCards } from './cards.js'
import '../pages/index.css';
/*
import addIcon from '../images/add-icon.svg';
import card_1 from '../images/card_1.jpg';
import card_2 from '../images/card_2.jpg';
import card_3 from '../images/card_3.jpg';
import closeIcon from '../images/close.svg';
import deleteIcon from '../images/delete-icon.svg';
import editIcon from '../images/edit-icon.svg';
import likeActive from '../images/like-active.svg';
import likeInactive from '../images/like-inactive.svg';
*/
// Добавленные
// import avatar from '../images/avatar.jpg';
// import logo from '../images/logo.svg';

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
    newCard.querySelector(".card__image").src = card.link;
    newCard.querySelector(".card__image").alt = card.name;
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