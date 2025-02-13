// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list"); // контейнер карточек

// @todo: Функция создания карточки
createCard = (card, handler = deleteCards) => {
  // Клонирование карточки по шаблону
  const newCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Если клон успешно создан, то его инициализация
  if (newCard) {
    // Данные карточки
    newCard.querySelector(".card__image").src = card.link;
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
deleteCards = (...cards) => {
  cards.forEach((card) => {
    if (card) card.remove();
  });
};

// @todo: Вывести карточки на страницу
appendCards = (cardList, ...cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card);
    if (newCard) cardList.append(newCard);
  });
};

appendCards(placesList, ...initialCards);
