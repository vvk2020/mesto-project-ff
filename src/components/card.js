//* Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

//* Функция создания карточки
const createCard = (card, onShow, onLike = likeCard, onDelete = deleteCard) => {
  // Клонирование карточки по шаблону
  const newCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Если клон успешно создан, то его инициализация
  if (newCard) {
    // Картинка карточки
    const cardImage = newCard.querySelector(".card__image");

    if (cardImage) {
      // Данные карточки
      cardImage.src = card.link;
      cardImage.alt = card.name;
      // Обработчик открытия popup просмотра карточки
      cardImage.addEventListener("click", () => {
        onShow(card); // открываем popup
      });
    }

    newCard.querySelector(".card__title").textContent = card.name;

    // Обработчик удаления карточки (автоматически удаляется после первого срабатывания)
    const deleteButton = newCard.querySelector(".card__delete-button");
    if (deleteButton)
      deleteButton.addEventListener(
        "click",
        () => {
          onDelete(newCard);
        },
        { once: true }
      );

    // Обработка like/dislike карточки по кнопке 🤍
    const likeButton = newCard.querySelector(".card__like-button");
    if (likeButton)
      likeButton.addEventListener("click", () => {
        onLike(likeButton);
      });
  }
  return newCard;
};

//* Обработчик like/dislike карточки (🤍<=>🩷/)
function likeCard(likeButton) {
  if (likeButton) likeButton.classList.toggle("card__like-button_is-active");
}

//* Функция удаления карточки
const deleteCard = (card) => {
  if (card) {
    card.remove(); // удаление карточки
    card = null; //  пометка для GC
  }
};

export { createCard, deleteCard, likeCard };
