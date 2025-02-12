// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list"); // контейнер карточек

// @todo: Функция создания карточки
createPlaceCard = (card) => {
  // Клонирование карточки по шаблону
  const newPlaceCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Заполнение данными клона карточки
  newPlaceCard.querySelector(".card__image").src = card.link;
  newPlaceCard.querySelector(".card__title").textContent = card.name;
  // Обработчик удаления карточки
  const deleteButton = newPlaceCard.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    newPlaceCard.remove();
  });
  return newPlaceCard;
};

// @todo: Функция удаления карточки

// FIXME: нужна ли отдельная функция ?

// @todo: Вывести карточки на страницу
appendCards = (cards, cardList) => {
  cards.forEach((card) => {
    cardList.append(createPlaceCard(card));
  });
};

appendCards(initialCards, placesList);
