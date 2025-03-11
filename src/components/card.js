import { cardTemplate } from "../scripts/index.js";

//* Функция создания карточки
const createCard = (card, handler = deleteCard) => {
  // Клонирование карточки по шаблону
  const newCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Если клон успешно создан, то его инициализация
  if (newCard) {
    // Данные карточки
    const cardImage = newCard.querySelector(".card__image");
    if (cardImage) {
      cardImage.src = card.link;
      cardImage.alt = card.name;
    }
    newCard.querySelector(".card__title").textContent = card.name;
    // Обработчик удаления карточки
    const deleteButton = newCard.querySelector(".card__delete-button");
    if (deleteButton)
      deleteButton.addEventListener("click", () => {
        handler(newCard);
      });
  }
  return newCard;
};

//* Функция изменения стиля 🩷 like-кнопки карточки
function likeCard(likeButton) {
  if (likeButton) likeButton.classList.toggle("card__like-button_is-active");
}

//* Функция удаления карточки
const deleteCard = (card) => {
  if (card) card.remove();
};

export { createCard, deleteCard, likeCard };
