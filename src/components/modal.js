import { createCard, deleteCard } from "../components/card.js";

//! Абстрактный класс popup
class Popup {
  static CONST = {
    //* CSS-классы
    isOpenClass: "popup_is-opened", // открытого окна
    closerClass: ".popup__close", // элемента (кнопки), закрывающего окно
    contentWrapperClass: ".popup__content", // wrappera контента окна
  };

  constructor(popup) {
    if (popup) {
      this.popup = popup; // модальное онко
      // Кнопка закрытия окна
      this.buttonClose = this.popup.querySelector(Popup.CONST.closerClass);
      // Форма popup (если есть) и ее submit-обработчик
      this.form = this.popup.querySelector("form.popup__form");
      if (this.form) {
        this.form.addEventListener("submit", (evt) => {
          evt.preventDefault(); // блокировка стандартной обработки submit
          this.finalize(); // завершающие операции перед закрытием
          this.popup.classList.remove(Popup.CONST.isOpenClass); // скрытие popup
          this.serializeForm(); // подготовка данных для отправки на сервер
          // form.submit(); // Отправка данных на сервер
        });
      }
    }
  }

  //* Завершающие операции перед закрытием popup
  finalize() {
    // Передача данных из полей формы на страницу
    if (this.outputSources && this.formInputs) {
      for (const key in this.formInputs) {
        if (this.formInputs[key])
          this.outputSources[key].textContent = this.formInputs[key].value;
      }
    }
  }

  //* Универсальная функция назначения обработчика событий
  attachEvent(event, handler, obj = this.popup) {
    if (obj && event && handler)
      obj.addEventListener(event, handler.bind(this));
  }

  //* Универсальная функция удаления обработчика событий
  detachEvent(event, handler, obj = this.popup) {
    if (obj && event && handler)
      obj.removeEventListener(event, handler.bind(this));
  }

  //* Назначение обработчиков событий закрытия модального окна
  attachAllEvents() {
    this.attachEvent("click", this.closeModal, this.buttonClose); // по ❌
    this.attachEvent("keydown", this.handleEsc, document); // по Esc
    this.attachEvent("mousedown", this.handleClickOutside); // мышью вне окна
  }

  //* Удаление обработчиков событий модального окна перед закрытием
  detachAllEvents() {
    this.detachEvent("click", this.closeModal, this.buttonClose); // по ❌
    this.detachEvent("keydown", this.handleEsc, document); // по Esc
    this.detachEvent("mousedown", this.handleClickOutside); // мышью вне окна
  }

  //* Инициализация popup
  initialize() {
    if (this.form) {
      this.form.reset(); // сброс формы
      // Передача данных из dataSource в поля формы popup
      if (this.inputSources) {
        for (const key in this.inputSources) {
          if (this.formInputs[key] && this.inputSources[key]) {
            this.formInputs[key].value = this.inputSources[key].textContent;
          }
        }
      }
    }
  }

  //* Обработчик открытия модального окна по ✏️
  openModal(inputSources, outputSources) {
    if (inputSources) this.inputSources = inputSources; // источники данных для формы
    if (outputSources) this.outputSources = outputSources; // источники, куда будут выведены данные формы
    this.popup.classList.add(Popup.CONST.isOpenClass);
    this.attachAllEvents(); // назначение обработчиков событий popup
    this.initialize();
  }

  //* Обработчик закрытия модального окна по ❌
  closeModal() {
    /* Удаление обработчиков событий окна с блокировкой повторного их удаления */
    if (this.popup.classList.contains(Popup.CONST.isOpenClass))
      this.detachAllEvents();
    // Удаление класса, отображающего окно
    this.popup.classList.remove(Popup.CONST.isOpenClass);
  }

  //* Обработчик закрытия модального окна по Esc
  handleEsc(evt) {
    if (evt.key === "Escape") this.closeModal();
  }

  //* Обработчик закрытия модального окна по click вне его границ
  handleClickOutside(evt) {
    const isInsideClick = !!evt.target.closest(Popup.CONST.contentWrapperClass);
    // Закрываем, если click по элементу, не имеющему предка с .popup__content
    if (!isInsideClick) this.closeModal();
  }

  //* Подготовка данных формы popup (в т.ч. перед отправкой на сервер)
  serializeForm() {
    if (this.form) {
      const { elements } = this.form;
      this.data = new FormData(); // данные формы для отправки на сервер
      Array.from(elements)
        .filter((item) => !!item.name)
        .forEach((element) => {
          const { name, type } = element;
          const value = type === "checkbox" ? element.checked : element.value; // поддержка checkbox
          this.data.append(name, value);
        });
    }
  }
}

//! Класс popup редактирования профиля
class ProfilePopup extends Popup {
  static CONST = {
    //* CSS-классы
    popupClass: ".popup_type_edit", // popup
    //... полей формы popup
    profileNameClass: ".popup__input_type_name", // имени профиля
    profileDescriptionClass: ".popup__input_type_description", // описания профиля
  };

  constructor() {
    const popup = document.querySelector(ProfilePopup.CONST.popupClass);
    if (popup) {
      super(popup);
      //* Поля формы popup
      this.formInputs = {
        name: popup.querySelector(ProfilePopup.CONST.profileNameClass), // имя профиля
        description: popup.querySelector(
          ProfilePopup.CONST.profileDescriptionClass
        ), // описание профиля
      };
    }
  }
}

//! Класс popup отображения выбранной карточки
class CardViewPopup extends Popup {
  static CONST = {
    // * CSS-классы
    // ... popup и его элементов:
    popupClass: ".popup_type_image", // popup
    popupImageClass: ".popup__image", // картинки
    popupCaptionClass: ".popup__caption", // описания
    // ... элементов карточки:
    imageCardClass: ".card__image", // картинки
    titleCardClass: ".card__title", // описания
  };

  constructor() {
    const popup = document.querySelector(CardViewPopup.CONST.popupClass);
    if (popup) {
      super(popup);
      // Определение popup-элементов
      this.popupElements = {
        image: this.popup.querySelector(CardViewPopup.CONST.popupImageClass), // картинка
        title: this.popup.querySelector(CardViewPopup.CONST.popupCaptionClass), // описание
      };
    }
  }

  openModal(Card) {
    // Получение данных из карточки
    if (Card) {
      this.card = {
        image: Card.querySelector(CardViewPopup.CONST.imageCardClass), // картинка
        title: Card.querySelector(CardViewPopup.CONST.titleCardClass), // описание
      };
    }
    super.openModal();
  }

  initialize() {
    super.initialize();
    // Передача данных карточки в popup
    if (this.card) {
      if (
        this.card.image &&
        this.card.title &&
        this.popupElements.image &&
        this.popupElements.title
      ) {
        this.popupElements.image.src = this.card.image.src;
        this.popupElements.image.alt = this.card.title.textContent;
        this.popupElements.title.textContent = this.card.title.textContent;
      }
    }
  }
}

//! Класс popup создания карточки
class CardAddPopup extends Popup {
  static CONST = {
    //* CSS-классы
    popupClass: ".popup_type_new-card", // popup
    cardsContainerClass: ".places__list", // контейнер хранения карточек
    //... полей формы popup
    cardNameClass: ".popup__input_type_card-name", // иназвание
    urlClass: ".popup__input_type_url", // url картинки
  };

  constructor() {
    const popup = document.querySelector(CardAddPopup.CONST.popupClass);
    if (popup) {
      super(popup);
      //* Поля формы popup
      this.formInputs = {
        cardName: popup.querySelector(CardAddPopup.CONST.cardNameClass), // название
        url: popup.querySelector(CardAddPopup.CONST.urlClass), // url
      };
    }
    //* Контейнер хранения карточек
    const cardsContainer = document.querySelector(
      CardAddPopup.CONST.cardsContainerClass
    );
    if (cardsContainer) this.cardsContainer = cardsContainer;
  }

  //* Добавление созданной карточки в начало списка карточек
  addCardToList() {
    if (
      this.cardsContainer &&
      this.formInputs.cardName.value &&
      this.formInputs.url.value
    ) {
      this.Card = createCard({
        name: this.formInputs.cardName.value,
        link: this.formInputs.url.value,
      });
      if (this.Card) this.cardsContainer.prepend(this.Card);
    }
  }

  //* Завершающие операции перед закрытием popup
  finalize() {
    super.finalize();
    this.addCardToList(); // Добавление карточки на страницу
  }
}

export { ProfilePopup, CardViewPopup, CardAddPopup };
