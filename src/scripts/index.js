import initialCards from "../components/cards.js";
import { createCard } from "../components/card.js";
import { openModal, closeModal, initializeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "../components/validation.js";
import "../pages/index.css";

import {
  getCards,
  getProfile,
  setProfile,
  setProfileAvatar,
  getHeaders,
} from "../components/api.js";

//! Селекторы
const SELECTORS = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// class Profile {}

//!  DOM узлы
const cardsContainer = document.querySelector(".places__list"); // контейнер карточек
//* popup's
const profilePopup = document.querySelector(".popup.popup_type_edit"); // редактирования профиля
const newCardPopup = document.querySelector(".popup.popup_type_new-card"); // создания карточки
const cardViewPopup = document.querySelector(".popup.popup_type_image"); // просмотра карточки
const avatarPopup = document.querySelector(".popup_type_avatar"); // просмотра карточки

//* Кнопки открытия popup
const btnEditProfile = document.querySelector(".profile__edit-button"); // редактирования профиля
const btnAddCard = document.querySelector(".profile__add-button"); // добавления новой карточки
const btnAvatar = document.querySelector(".popup__avatar-button"); // обновления аватар

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
})();

function setHandlerFormSubmit(formName, handler) {
  if (document.forms[formName]) {
    document.forms[formName].addEventListener("submit", handler);
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  const data = serializeForm(evt.target); // подготовка данных формы

  // Данные из формы получены (объект для body запроса определен)?
  if (data) {
    // Отправка данных на сервер
    setProfile(data)
      .then((profileData) => {
        changeProfileData(profileData);
      })
      .catch((err) => {
        console.log(err); // вывод ошибкb в консоль
      });
  }
  closeModal(profilePopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  const data = serializeForm(evt.target); // подготовка данных формы

  if (data) {
    // Создание карточки
    const newCard = createCard(data, { onShow: handleShowCard });
    // Добавление созданной карточки в конец списка карточек
    if (newCard && cardsContainer) cardsContainer.prepend(newCard);
  }
  closeModal(newCardPopup);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault(); // блокировка стандартной обработки формы
  const data = serializeForm(evt.target); // подготовка данных формы

  // Данные из формы получены (объект для body запроса определен)?
  if (data && data.link) {
    const avatar = data.link;
    // console.log('=> data.link:', data.link);

    // Проверка: MIME-тип ссылки - image?
    if (avatar) {
      getHeaders(URL)
        .then((resp) => {
          if (resp.ok) {
            const contentType = resp.headers.get("Content-Type"); // тип контента в ответе
            // Проверка: тип контента - изображение?
            if (contentType && contentType.startsWith("image/")) {

              // Аватарки для тестов
              // https://avatars.mds.yandex.net/get-shedevrum/12157372/7365b14fc70811eea7e25e2095d778fc/orig
              // https://masterpiecer-images.s3.yandex.net/2a7fbea67f0e11ee8071ceda526c50ab:upscaled
              // https://avatars.mds.yandex.net/i?id=6e0d4ed1ccf9bd77f6cb44ca7a097ed2c7a9765c-2360343-images-thumbs&n=13
              // https://dianegottsman.com/wp-content/uploads/2019/03/iStock-912327036.jpg

              // Передача в запросе ссылки на новый аватар
              setProfileAvatar({ avatar })
                .then((avatarData) => {
                  console.log("++ avatarData:", avatarData);
                  changeProfileData(avatarData);
                })
                .catch((err) => {
                  console.log(err); // вывод ошибкb в консоль
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  closeModal(avatarPopup);
}

//! Вспомогательные функции popup и его форм

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
    // console.log("serializeForm() => obj:", JSON.stringify(obj, null, 2));
    if (Object.keys(obj).length !== 0) return obj;
  }
}

//! Вывод лакльно сохраненных карточек на страницу из initialCards[]
const appendCards = (cardList, cards) => {
  cards.forEach((card) => {
    const newCard = createCard(card, { onShow: handleShowCard });
    if (newCard) cardList.append(newCard);
  });
};

const changeProfileData = ({ name, about, avatar }) => {
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

//! Инициализация (сразу после загрузил HTML и построения DOM-дерева)
document.addEventListener("DOMContentLoaded", () => {
  //* Подключение валидации форм
  enableValidation(SELECTORS);

  //* Отображение профиля в соответствии с данными сервера
  getProfile()
    .then((res) => {
      changeProfileData(res);
    })
    .catch((err) => {
      console.log(err); // вывод ошибкb в консоль
    });

  //* Загрузка карточек с сервера
  // getCards().then((result) => {
  //   console.log("getCards():", result);
  // });

  //* Захват click на .profile__image:hover::after (всплывающей иконке карандаша на аватарке)
});

//! Добавление локально сохраненных карточек
appendCards(cardsContainer, initialCards);

const URL =
  "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg";

// async function checkImageMimeType(imageUrl) {
//   try {
//     // Выполняем HEAD-запрос (без загрузки тела изображения)
//     const response = await fetch(imageUrl, {
//       method: "HEAD",
//       mode: "cors", // Для кросс-доменных запросов
//       cache: "no-cache", // Игнорируем кеш
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Получаем Content-Type из заголовков
//     const contentType = response.headers.get("Content-Type");

//     // Проверяем, является ли тип изображением
//     if (contentType && contentType.startsWith("image/")) {
//       console.log("Valid image type:", contentType);
//       return contentType; // Возвращаем MIME-тип (например "image/jpeg")
//     } else {
//       throw new Error(`Not an image. Content-Type: ${contentType}`);
//     }
//   } catch (error) {
//     console.error("Error checking image:", error);
//     return null;
//   }
// }

// // Использование
// //! Определение MIME-типа из заголовка ответа
// checkImageMimeType(URL).then((mimeType) => {
//   if (mimeType) {
//     console.log("Image is valid, type:", mimeType);
//     // Действия с валидным изображением
//   } else {
//     console.log("Not a valid image");
//   }
// });

// getpQuery2({ URL: URL, method: "HEAD" });

// function getpQuery2({ URL, method, headers = {}, body = null }) {
//   console.log("URL:", URL);
//   return fetch(URL, {
//     method,
//     headers,
//     ...(body && { body: JSON.stringify(body) }),
//   })
//     .then((res) => {
//       console.log(
//         '=> headers.get("Content-Type"):',
//         res.headers.get("Content-Type")
//       );
//       if (res.ok) return res.json();
//       return Promise.reject(res.status);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
