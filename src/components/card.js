//* Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

//* Функция создания карточки
const createCard = (
  card,
  profileId,
  { onShow, onDelete, onLike = likeCard } = {}
) => {
  // Клонирование карточки по шаблону
  const newCard = cardTemplate
    .querySelector(".places__item.card")
    .cloneNode(true);
  // Если клон успешно создан, то его инициализация
  if (newCard) {
    // Сохранение Id карточки (для removeCard() - удаления со страницы)
    newCard.dataset.cardId = card._id;

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

    // Отображение заголовка карточки
    newCard.querySelector(".card__title").textContent = card.name;

    // Обработчик удаления карточки (автоматически удаляется после первого срабатывания)
    const deleteButton = newCard.querySelector(".card__delete-button");
    if (deleteButton && profileId) {
      // Если карточка - своя, то добавляем обработчик удаления,
      // если нет - скрываем кнопку  удаления
      if (card.owner._id === profileId) {
        deleteButton.addEventListener(
          "click",
          () => {
            onDelete(card._id); // card._id - для удаления
          },
          { once: true }
        );
      } else deleteButton.style.display = "none";
    }

    // Обработка like/dislike карточки по кнопке 🤍
    const likeButton = newCard.querySelector(".card__like-button");
    if (likeButton)
      likeButton.addEventListener("click", () => {
        onLike(likeButton);
      });

    // Отображение количества лайков карточки
    const cardLikeCount = newCard.querySelector(".card__like-count");

    if (cardLikeCount && card.likes && Array.isArray(card.likes)) {
      cardLikeCount.textContent = card.likes.length;
    }
  }
  return newCard;
};

//* Обработчик like/dislike карточки (🤍<=>🩷/)
function likeCard(likeButton) {
  if (likeButton) likeButton.classList.toggle("card__like-button_is-active");
}

//* Функция удаления карточки
const removeCard = (cardId) => {
  // Поиск карточки по ее cardId
  const card = document.querySelector(
    `.places__item.card[data-card-id="${cardId}"]`
  );
  // Удаление карточки со страницы
  if (card) {
    card.remove(); // удаление
    card = null; //  пометка для GC
  }
};

export { createCard, removeCard, likeCard };
