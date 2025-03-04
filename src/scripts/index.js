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
    // try: (newCard.querySelector(".card__image") = {src: card.link, alt: card.name });

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
