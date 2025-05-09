// import initialCards from "../components/cards.js";
import { Profile } from "../components/profile.js";
import { createCard, removeCard } from "../components/card.js";
import { openModal, closeModal, initializeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "../components/validation.js";
import "../pages/index.css";

import {
  getCards,
  getProfile,
  setProfile,
  setProfileAvatar,
  getHeaders,
  saveCard,
  deleteCard,
  evaluateCard,
} from "../components/api.js";

//! Профиль
const profile = new Profile();

//! Селекторы
const SELECTORS = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//!  DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек
//* popup's
const profilePopup = document.querySelector(".popup.popup_type_edit"); // редактирования профиля
const newCardPopup = document.querySelector(".popup.popup_type_new-card"); // создания карточки
const cardViewPopup = document.querySelector(".popup.popup_type_image"); // просмотра карточки
const avatarPopup = document.querySelector(".popup_type_avatar"); // просмотра карточки
const cardDelConfirmPopup = document.querySelector(".popup_confirm-del-card"); // просмотра карточки

//* Кнопки открытия popup
const btnEditProfile = document.querySelector(".profile__edit-button"); // редактирования профиля
const btnAddCard = document.querySelector(".profile__add-button"); // добавления новой карточки

//* Источники данных для форм popup
const nameProfile = document.querySelector(".profile__title"); // имя профиля
const descrProfile = document.querySelector(".profile__description"); // описание профиля
const avatarProfile = document.querySelector(".profile__image"); // описание профиля

//* Элементы popup просмотра карточки
const imageCardViewPopup = cardViewPopup.querySelector("img.popup__image");
const captionCardViewPopup = cardViewPopup.querySelector(".popup__caption");

//* Inputs формы popup редактирования профиля
const nameProfilePopupInput = profilePopup.querySelector(
  "input.popup__input_type_name"
); // input имени профиля
const descrProfilePopupInput = profilePopup.querySelector(
  "input.popup__input_type_description"
); // input описания профиля

//* Input формы popup обновления аватар
const urlAvatarPopupInput = avatarPopup.querySelector(
  "input.popup__input_type_avatar"
);

//! Обработчики событий

//* Обработчик отображения popup просмотра карточки
function handleShowCard(card) {
  setupCardViewPopup(card); // настройка popup
  if (cardViewPopup) openModal(cardViewPopup); // открытие popup
}

//! Назначение обработчиков событий ...

(() => {
  //* ... кнопки открытия popup редактирования профиля
  if (btnEditProfile) {
    btnEditProfile.addEventListener("click", () => {
      if (profilePopup) {
        setupEditProfilePopup(); // настройка popup
        openModal(profilePopup); // открытие popup

        // Сброс ошибок ввода и деактивация submit-кнопки
        const formEditProfile = profilePopup.querySelector(".popup__form");
        clearValidation(formEditProfile);
      }
    });
  }

  //* ... кнопки открытия popup создания карточки
  if (btnAddCard) {
    // Добавление обработчика открытия модального окна и сброс формы
    btnAddCard.addEventListener("click", () => {
      if (newCardPopup) {
        resetNewCardPopupForm(); // сброс формы
        openModal(newCardPopup); // открытие popup
        // Сброс ошибок ввода и деактивация submit-кнопки
        const formCardProfile = newCardPopup.querySelector(".popup__form");
        clearValidation(formCardProfile);
      }
    });
  }

  //* ... кнопки открытия popup обновления аватар
  if (avatarProfile) {
    // Обработка наведения курсора на аватарку
    avatarProfile.addEventListener("mouseenter", () => {
      avatarProfile.classList.add("avatar-edit_active");
    });

    // Обработка ухода курсора на аватарку
    avatarProfile.addEventListener("mouseleave", () => {
      avatarProfile.classList.remove("avatar-edit_active");
    });

    // Обработка клика по аватарке
    avatarProfile.addEventListener("click", () => {
      if (avatarProfile.classList.contains("avatar-edit_active")) {
        if (avatarPopup) {
          setupAvatarPopup(); // настройка popup
          openModal(avatarPopup); // открытие popup
          // Сброс ошибок ввода и деактивация submit-кнопки
          const formEditAvatar = avatarPopup.querySelector(".popup__form");
          clearValidation(formEditAvatar);
        }
      }
    });
  }

  //* ... закрытия popup и его преднастройка
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    initializeModal(popup);
  });

  //* ... submit-обработчика формам popup
  setHandlerFormSubmit("edit-profile", handleEditProfileSubmit);
  setHandlerFormSubmit("new-place", handleNewCardSubmit);
  setHandlerFormSubmit("edit-avatar", handleAvatarSubmit);
  setHandlerFormSubmit("confirm-del-card", handleCardDelSubmit);
})();

function setHandlerFormSubmit(formName, handler) {
  if (document.forms[formName]) {
    document.forms[formName].addEventListener("submit", handler);
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  toggleSubmitButtonText(profilePopup); // toggle текста submit-кнопки ("Схранение...")
  const data = serializeForm(evt.target); // подготовка данных формы
  // Данные из формы получены (объект для body запроса определен)?
  if (data) {
    // Отправка данных на сервер
    setProfile(data)
      .then((profileData) => {
        renderProfile(profileData);
        closeModal(profilePopup);
      })
      .catch((err) => {
        console.log(err); // вывод ошибкb в консоль
      })
      .finally(() => {
        toggleSubmitButtonText(profilePopup); // toggle текста submit-кнопки ("Схранить")
      });
  } else closeModal(profilePopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  toggleSubmitButtonText(newCardPopup); // toggle текста submit-кнопки ("Схранение...")
  const data = serializeForm(evt.target); // подготовка данных формы
  // Данные из формы получены (объект для body запроса определен)?
  if (data) {
    // Отправка данных на сервер
    saveCard({ name: data["place-name"], link: data.link })
      .then((respData) => {
        if (respData) {
          // Создание карточки
          const newCard = createCard(respData, profile._id, {
            onShow: handleShowCard,
            onDelete: handleDeleteCard,
            onLike: handleLikeCard,
          });
          // Добавление созданной карточки в начало списка
          if (newCard && cardsContainer) cardsContainer.prepend(newCard);
          closeModal(newCardPopup);
        }
      })
      .catch((err) => {
        console.log("Ошибка сохранения карточки:", err); // вывод ошибкb в консоль
      })
      .finally(() => {
        toggleSubmitButtonText(newCardPopup); // toggle текста submit-кнопки ("Схранить")
      });
  } else closeModal(newCardPopup);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  toggleSubmitButtonText(avatarPopup); // toggle текста submit-кнопки ("Схранение...")
  const data = serializeForm(evt.target); // подготовка данных формы

  // Данные из формы получены (объект для body запроса определен)?
  if (data && data.link) {
    const avatar = data.link;
    // Проверка: MIME-тип ссылки - image?
    if (avatar) {
      getHeaders(avatar)
        .then((resp) => {
          if (!resp.ok) return Promise.reject(resp.status);
          // Проверка: тип контента - изображение?
          const contentType = resp.headers.get("Content-Type"); // тип контента в ответе
          if (!contentType || !contentType.startsWith("image/"))
            return Promise.reject(`ссылка не на картинку`);
          // Сохранение fetch-запросом ссылки на новый аватар
          return setProfileAvatar({ avatar });
        })
        .then((avatarData) => {
          renderProfile(avatarData); // вывод данных профиля и его аватар на страницу
          closeModal(avatarPopup);
        })
        .catch((err) => {
          console.log("Ошибка обновления аватар:", err);
        })
        .finally(() => {
          toggleSubmitButtonText(avatarPopup); // toggle текста submit-кнопки ("Схранить")
        });
    } else closeModal(avatarPopup);
  } else closeModal(avatarPopup);
}

function handleCardDelSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  if ("cardId" in evt.target.dataset) {
    const cardId = evt.target.dataset.cardId;
    deleteCard(cardId)
      .then((resp) => {
        if (!resp.ok) return Promise.reject(resp.status);
        closeModal(cardDelConfirmPopup);
        removeCard(cardId); // удаление карточки со страницы
      })
      .catch((err) => {
        console.log("Ошибка удаления карточки:", err);
      });
    // Удаление аттрибута, хранящего Id карточки
    delete evt.target.dataset.cardId;
  } else closeModal(cardDelConfirmPopup);
}

//! Вспомогательные функции popup и его форм

//* Изменение текста submit-кнопки popup в процессе сохранения
function toggleSubmitButtonText(popup) {
  if (popup) {
    const button = popup.querySelector(
      'button[type="submit"].button.popup__button'
    );
    if (button) {
      if (button.textContent.trim() === "Сохранить")
        button.textContent = "Сохранение...";
      else button.textContent = "Сохранить";
    }
  }
}

//* Преднастройка popup отображения карточки
function setupCardViewPopup(card) {
  // Трансфер данных из карточки в popup
  if (card.name && card.link && imageCardViewPopup) {
    // Картинка карточки
    imageCardViewPopup.src = card.link;
    imageCardViewPopup.alt = card.name;
    // Название карточки
    if (captionCardViewPopup) captionCardViewPopup.textContent = card.name;
  }
}

//* Преднастройка popup редактирования профиля
function setupEditProfilePopup() {
  // Трансфер данных из страницы в popup
  if (nameProfile && nameProfilePopupInput)
    nameProfilePopupInput.value = nameProfile.textContent; // имя профиля
  if (descrProfile && descrProfilePopupInput)
    descrProfilePopupInput.value = descrProfile.textContent; // описание профиля
}

//* Преднастройка popup обновления аватара
function setupAvatarPopup() {
  // Трансфер url аватара из карточки в popup
  if (avatarProfile && urlAvatarPopupInput) {
    // Выделение адреса из backgroundImage
    const urlMatch = avatarProfile.style.backgroundImage.match(
      /url\(["']?([^"')]+)["']?\)/
    );
    const avatarURL = urlMatch ? urlMatch[1] : null;
    // Передача URL аватара в input формы popup
    if (avatarURL) urlAvatarPopupInput.value = avatarURL;
  }
}

//* Сброс формы popup создания карточки
function resetNewCardPopupForm() {
  document.forms["new-place"].reset(); // сброс формы (очистка полей)
}

//* Подготовка данных формы popup
// Возвращает объект obj полей (input#name) и их значений формы form.
// ( obj==={} ⇒ return undefined )
function serializeForm(form) {
  if (form) {
    const { elements } = form;
    const obj = {};
    Array.from(elements)
      .filter((item) => !!item.name)
      .forEach((element) => {
        const { name, value } = element;
        obj[name] = value;
      });
    if (Object.keys(obj).length !== 0) return obj;
  }
}

function handleDeleteCard(cardId) {
  if (document.forms["confirm-del-card"]) {
    // Передаем Id карточки в popup подтверждения удаления карточки
    document.forms["confirm-del-card"].dataset.cardId = cardId;
    openModal(cardDelConfirmPopup); // открытие popup
  }
}

function handleLikeCard(cardId, like) {
  // Запрос на постановку/удаление like (true/false)
  return evaluateCard(cardId, like)
    .then((card) => {
      // Воврат количества like карточки
      if (card.likes && Array.isArray(card.likes))
        return Promise.resolve(card.likes.length);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

//! Вывод карточек на страницу
const appendCards = (cardList, cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card, profile._id, {
      onShow: handleShowCard,
      onDelete: handleDeleteCard,
      onLike: handleLikeCard,
    });
    if (newCard) cardList.append(newCard);
  });
};

//! Вывод данных профиля и его аватар на страницу
const renderProfile = ({ name, about, avatar }) => {
  if (nameProfile && name) {
    nameProfile.textContent = name;
  }
  if (descrProfile && about) {
    descrProfile.textContent = about;
  }
  if (avatarProfile && avatar) {
    avatarProfile.style.backgroundImage = `url("${avatar}")`;
  }
};

const initializeApp = () => {
  Promise.all([getProfile(), getCards()])
    .then((resps) => {
      // Обработка promise запроса данных профиля
      if (resps[0]) {
        profile.data = resps[0]; // обновлени локальных данных
        renderProfile(resps[0]);
      }
      // Обработка promise запроса данных карточек мест
      if (resps[1] && Array.isArray(resps[1]) && resps[1].length > 0) {
        // Добавление карточек, полученных сс сервера
        appendCards(cardsContainer, resps[1]);
      }
    })
    .catch((err) => {
      console.log(err); // вывод ошибкb в консоль
    });
};

//! Инициализация (сразу после загрузил HTML и построения DOM-дерева)
document.addEventListener("DOMContentLoaded", () => {
  //* Подключение валидации форм
  enableValidation(SELECTORS);
  initializeApp();
});
