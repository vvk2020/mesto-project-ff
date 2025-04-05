//* Шаблон карточки
const cardTemplate = document.querySelector("#card-template").content;

//* Функция создания карточки
const createCard = (card, profileId, { onShow, onDelete, onLike } = {}) => {
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
      } else deleteButton.remove();
    }

    // Обработка like/dislike карточки по кнопке 🤍
    const likeButton = newCard.querySelector(".card__like-button");
    const cardLikeCount = newCard.querySelector(".card__like-count");

    if (likeButton)
      likeButton.addEventListener("click", () => {
        onLike(
          card._id,
          !likeButton.classList.contains("card__like-button_is-active")
        )
          .then((count) => {
            likeCard(likeButton); // 🤍<=>🩷
            cardLikeCount.textContent = count; // количества like
          })
          .catch((err) => {
            console.log("Ошибка like/dislike карточки: ", err);
          });
      });

    // Начальное (при создании списка карточек) отображение like-свойств карточки
    if (card.likes && Array.isArray(card.likes)) {
      // Отображение like
      if (card.likes.some((like) => like._id === profileId)) {
        likeButton.classList.add("card__like-button_is-active");
      }
      // Отображение количества like карточки
      if (cardLikeCount) {
        cardLikeCount.textContent = card.likes.length;
      }
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
