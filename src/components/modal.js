import { createCard, deleteCard } from "../components/card.js";

//! Абстрактный класс popup
class Popup {
  //* Статические константы класса
  static CONST = {
    isOpenClass: "popup_is-opened", // css-класс открытого окна
    closerClass: ".popup__close", // css-класс элемента (кнопки), закрывающего окно
    contentWrapperClass: ".popup__content", // css-класс wrappera контента окна
  };

  constructor(popup, buttonOpen, openIt = false) /** 
    @param popup - модальное окно  
    @param buttonOpen - кнопка открытия окна
    @param buttonClose  - кнопка закрытия окна
    @param openIt - флаг открытия окна сразу после создания
*/ {
    if (popup) {
      this.popup = popup; // модальное онко
      // Определение кнопки закрытия модального окна
      this.openIt = openIt;
      this.buttonClose = this.popup.querySelector(Popup.CONST.closerClass);
      // Назначение обработчика открытия окна редактирования профиля по кнопке ✏️ (если задан)
      if (buttonOpen) {
        this.buttonOpen = buttonOpen;
        this.attachEvent("click", this.openPopup, this.buttonOpen);
      }
      /* Если установлен флаг openIt, то popup открывается сразу после создания. Promise необходим 
      для выполнения initializePopup() строго после завершения работы данного конструктора */
      if (openIt) this.openPopup().then(this.initializePopup.bind(this));
      // Форма на popup (если есть) и ее submit-обработчик
      this.form = this.popup.querySelector("form.popup__form");
      if (this.form) {
        this.form.addEventListener("submit", (evt) => {
          evt.preventDefault(); // блокировка стандартной обработки submit
          this.handleFormSubmit(evt); // подготовка данных формы popup для отправки
          this.popup.classList.remove(Popup.CONST.isOpenClass); // скрытие popup
          // form.submit(); // Отправка данных на сервер
        });
      }
    }
  }

  //* submit-обработчик формы popup (переопределяется в наследниках)
  // Не удалять! Иначе не корректно работает в наследниках
  handleFormSubmit(evt) {
    // console.log("Popup.handleFormSubmit()");
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
    this.attachEvent("click", this.closePopup, this.buttonClose); // по ❌
    this.attachEvent("keydown", this.handleEsc, document); // по Esc
    this.attachEvent("mousedown", this.handleClickOutside); // мышью вне границ окна (click некорректно при выделении текста в поле формы)
  }

  //* Удаление обработчиков событий модального окна перед закрытием
  detachAllEvents() {
    this.detachEvent("click", this.closePopup, this.buttonClose); // по ❌
    this.detachEvent("keydown", this.handleEsc, document); // по Esc
    this.detachEvent("mousedown", this.handleClickOutside); // мышью вне границ окна
  }

  //* Инициализация popup (определяется в наследниках)
  initializePopup() {
    // console.log("Popup.initializePopupForm()");
  }

  //* Завершающие операции перед закрытием popup (определяется в наследниках)
  finalizePopup() {
    // console.log("Popup.finalizePopup()");
  }

  //* Обработчик открытия модального окна по ✏️
  async openPopup() {
    this.popup.classList.add(Popup.CONST.isOpenClass);
    this.attachAllEvents(); // назначение обработчиков событий popup
    /* Если popup неоходимо открыть сразу после конструктора (this.openIt===true), 
    то используем Promise, в противном случае - вызываем как обычно */
    if (this.openIt) {
      await new Promise((resolve) => setTimeout(resolve)); // ожидание завершения работы constructor()
    } else this.initializePopup();
  }

  //* Обработчик закрытия модального окна по ❌
  closePopup() {
    /* Удаление обработчиков событий окна с блокировкой повторного их удаления */
    if (this.popup.classList.contains(Popup.CONST.isOpenClass))
      this.detachAllEvents();
    // Удаление флага открытия окна (налияия обработчиков событий)
    this.popup.classList.remove(Popup.CONST.isOpenClass);
    this.finalizePopup();
  }

  //* Обработчик закрытия модального окна по Esc
  handleEsc(evt) {
    if (evt.key === "Escape") this.closePopup();
  }

  //* Обработчик закрытия модального окна по click вне его границ
  handleClickOutside(evt) {
    const isInsideClick = !!evt.target.closest(Popup.CONST.contentWrapperClass);
    // Закрываем, если click по элементу, не имеющему родителя с .popup__content
    if (!isInsideClick) this.closePopup();
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
      // console.log(Array.from(this.data.entries()));
    }
  }
}

//! Класс popup редактирования профиля
class ProfilePopup extends Popup {
  //* Статические константы класса
  static CONST = {
    //* CSS-классы
    popupClass: ".popup_type_edit", // popup
    //... полей формы popup
    profileNameClass: ".popup__input_type_name", // имени профиля
    profileDescriptionClass: ".popup__input_type_description", // описания профиля
  };

  constructor(buttonOpen, OutputFields, openIt = false) {
    /**  
      @param buttonOpen - кнопка открытия модального окна
      @param OutputFields -  объект ссылок на элементы профия
      @param openIt - флаг необходимости открытия модального окна: true - открыть, false - создать 
    */
    const popup = document.querySelector(ProfilePopup.CONST.popupClass);
    if (popup) {
      super(popup, buttonOpen, openIt);
      //* Поля формы popup
      this.profileName = popup.querySelector(
        ProfilePopup.CONST.profileNameClass
      ); // Имя профиля
      this.profileDescription = popup.querySelector(
        ProfilePopup.CONST.profileDescriptionClass
      ); // Описание профиля
      // Элементы страницы, отображающие данные профиля
      if (OutputFields) this.OutputFields = OutputFields;
    }
  }

  //* Инициализация popup (определяется в наследниках)
  initializePopup() {
    super.initializePopup();
    // Передача данных в поля формы popup
    if (this.OutputFields) {
      // Имя профиля
      if (this.OutputFields.name.textContent) {
        this.profileName.value = this.OutputFields.name.textContent;
      }
      // Описание профиля
      if (this.OutputFields.description.textContent) {
        this.profileDescription.value =
          this.OutputFields.description.textContent;
      }
    }
  }

  //* Завершающие операции перед закрытием popup
  handleFormSubmit(evt) {
    super.handleFormSubmit(evt);
    this.serializeForm(); // подготовка данных для отправки на сервер
    // Передача данных из popup профиля на страницу
    if (this.OutputFields && this.data) {
      this.OutputFields.name.textContent = this.data.get("name"); // имя
      this.OutputFields.description.textContent = this.data.get("description"); // описание
    }
  }
}

//! Класс popup отображения выбранной карточки
class CardViewPopup extends Popup {
  // Статические константы класса
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

  constructor(Card, openIt = false) {
    /**  
      @param Card - ссылка на выбранную карточку
      @param openIt - флаг необходимости открытия модального окна: true - открыть, false - создать
    */
    const popup = document.querySelector(CardViewPopup.CONST.popupClass);
    if (popup) {
      super(popup, null, openIt);
      //* Элементы popup
      this.imagePopup = this.popup.querySelector(
        CardViewPopup.CONST.popupImageClass
      ); // картинка
      this.captionPopup = this.popup.querySelector(
        CardViewPopup.CONST.popupCaptionClass
      ); // описание
      //* Элементы карточки
      if (Card) {
        this.Card = Card;
        this.imageCard = this.Card.querySelector(
          CardViewPopup.CONST.imageCardClass
        ); // картинка
        this.titleCard = this.Card.querySelector(
          CardViewPopup.CONST.titleCardClass
        ); // описание
      }
    }
  }

  //* Передача данных элементам popup из карточки
  initializePopup() {
    if (this.Card) {
      if (this.imageCard && this.imagePopup) {
        this.imagePopup.src = this.imageCard.src;
        this.imagePopup.alt = this.imageCard.textContent;
        this.captionPopup.textContent = this.titleCard.textContent;
      }
    }
  }
}

//! Класс popup создания карточки
class CardInsPopup extends Popup {
  //* Статические константы класса
  static CONST = {
    //* CSS-классы
    popupClass: ".popup_type_new-card", // popup
    cardsContainerClass: ".places__list", // контейнер хранения карточек
    //... полей формы popup
    cardNameClass: ".popup__input_type_card-name", // иназвание
    urlClass: ".popup__input_type_url", // url картинки
  };

  constructor(
    buttonOpen,
    openIt = false /**  
      @param buttonOpen - кнопка открытия модального окна
      @param OutputFields -  объект ссылок на элементы профия
      @param openIt - флаг необходимости открытия модального окна: true - открыть, false - создать 
    */
  ) {
    const popup = document.querySelector(CardInsPopup.CONST.popupClass);
    if (popup) {
      super(popup, buttonOpen, openIt);
      //* Поля формы popup
      this.cardName = popup.querySelector(CardInsPopup.CONST.cardNameClass); // название
      this.url = popup.querySelector(CardInsPopup.CONST.urlClass); // url картинки
    }
    //* Контейнер хранения карточек
    const cardsContainer = document.querySelector(
      CardInsPopup.CONST.cardsContainerClass
    );
    if (cardsContainer) this.cardsContainer = cardsContainer;
  }

  //* Инициализация popup
  initializePopup() {
    super.initializePopup();
    this.form.reset(); // очистка полей формы popup
  }

  //* Добавление созданной карточки в начало списка карточек
  addCard() {
    if (
      this.cardsContainer &&
      this.data.get("place-name") &&
      this.data.get("link")
    ) {
      this.Card = createCard({
        name: this.data.get("place-name"),
        link: this.data.get("link"),
      });
      if (this.Card) this.cardsContainer.prepend(this.Card);
    }
  }

  //* Завершающие операции перед закрытием popup
  handleFormSubmit(evt) {
    super.handleFormSubmit(evt);
    this.serializeForm(); // подготовка данных для отправки на сервер
    this.addCard(); // Добавление карточки на страницу
  }
}

export { Popup, ProfilePopup, CardViewPopup, CardInsPopup };
