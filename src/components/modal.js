/* Popup - абстрактный класс popup:
  popup - модальное окно  
  buttonOpen - кнопка открытия модального окна
  buttonClose  - кнопка закрытия модального окна
  openIt - флаг необходимости открытия модального окна: true - открыть, false - создать
*/

class Popup {
  // Статические константы класса
  static CONST = {
    isOpenClass: "popup_is-opened", // css-класс открытого окна
    closerClass: ".popup__close", // css-класс элемента (кнопки), закрывающего окно
    contentWrapperClass: ".popup__content", // css-класс wrappera контента окна
  };

  constructor(popup, buttonOpen, openIt = false) {
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
      /* popup открывается сразу после создания, если установлен флаг openIt или не задан элемент,
      его открывающий (buttonOpen). Promise используется для выполнения initializePopup() строго 
      после завершения работы данного конструктора */
      if (openIt || !buttonOpen)
        this.openPopup().then(this.initializePopup.bind(this));
    }
  }

  // Универсальная функция назначения обработчика событий
  attachEvent(event, handler, obj = this.popup) {
    if (obj && event && handler)
      obj.addEventListener(event, handler.bind(this));
  }

  // Универсальная функция удаления обработчика событий
  detachEvent(event, handler, obj = this.popup) {
    if (obj && event && handler)
      obj.removeEventListener(event, handler.bind(this));
  }

  // Назначение обработчиков событий закрытия модального окна
  attachAllEvents() {
    this.attachEvent("click", this.closePopup, this.buttonClose); // по ❌
    this.attachEvent("keydown", this.handleEsc, document); // по Esc
    this.attachEvent("click", this.handleClickOutside); // click вне границ окна
  }

  // Удаление обработчиков событий модального окна перед закрытием
  detachAllEvents() {
    this.detachEvent("click", this.closePopup, this.buttonClose); // по ❌
    this.detachEvent("keydown", this.handleEsc, document); // по Esc
    this.detachEvent("click", this.handleClickOutside); // click вне границ окна
  }

  // Инициализация popup (определяется в наследниках])
  initializePopup() {
    console.log("Popup.initializePopupForm()");
  }

  // Обработчик открытия модального окна по ✏️
  async openPopup() {
    this.popup.classList.add(Popup.CONST.isOpenClass);
    this.attachAllEvents(); // назначение обработчиков событий окна
    /* Если popup неоходимо открыть сразу после конструктора (this.openIt===true), то используем Promise,
    если нет - вызываем как обычно */
    if (this.openIt) {
      await new Promise((resolve) => setTimeout(resolve)); // ожидание завершения работы constructor()
    } else this.initializePopup();
  }

  // Обработчик закрытия модального окна по ❌
  closePopup() {
    /* Удаление обработчиков событий окна с блокировкой повторного их удаления */
    if (this.popup.classList.contains(Popup.CONST.isOpenClass))
      this.detachAllEvents();
    // Удаление флага открытия окна (налияия обработчиков событий)
    this.popup.classList.remove(Popup.CONST.isOpenClass);
  }

  // Обработчик закрытия модального окна по Esc
  handleEsc(evt) {
    if (evt.key === "Escape") {
      this.closePopup();
    }
  }

  // Обработчик закрытия модального окна по click вне его границ
  handleClickOutside(evt) {
    const isInsideClick = !!evt.target.closest(Popup.CONST.contentWrapperClass);
    // Закрываем, если click по элементу, не имеющему родителя с .popup__content
    if (!isInsideClick) this.closePopup();
  }

  // Подготовка данных формы popup (в т.ч. перед отправкой на сервер)
  // https://doka.guide/js/deal-with-forms/
  // https://learn.javascript.ru/formdata => fformData.get(name) – получает значение поля с именем name,
  // serializeForm(formNode) {
  //   const { elements } = formNode;
  //   const data = new FormData(); // данные формы для отправки на сервер

  //   Array.from(elements)
  //     .filter((item) => !!item.name)
  //     .forEach((element) => {
  //       const { name, type } = element;
  //       const value = type === "checkbox" ? element.checked : element.value; // поддержка checkbox

  //       data.append(name, value);
  //     });
  //   return data;
  // }
}

// Класс popup редактирования профиля
class ProfilePopup extends Popup {
  // Статические константы класса
  static CONST = {
    /******** CSS-классы *******/
    popupClass: ".popup_type_edit", // popup
    //... полей формы popup
    profileNameClass: ".popup__input_type_name", // имени профиля
    profileDescriptionClass: ".popup__input_type_description", // описания профиля
  };

  constructor(buttonOpen, OutputFields, openIt = false) {
    /*  buttonOpen - кнопка открытия модального окна
        OutputFields -  объект ссылок на элементы профия
        openIt - флаг необходимости открытия модального окна: true - открыть, false - создать */
    const popup = document.querySelector(ProfilePopup.CONST.popupClass);
    if (popup) {
      super(popup, buttonOpen, openIt);

      /******* Поля формы popup *******/
      this.profileName = popup.querySelector(
        ProfilePopup.CONST.profileNameClass
      ); // Имя профиля
      this.profileDescriptionClass = popup.querySelector(
        ProfilePopup.CONST.profileDescriptionClass
      ); // Описание профиля
      // Элементы страницы, отображающие данные профиля
      if (OutputFields) this.OutputFields = OutputFields;
    }
  }

  initializePopup() {
    /******* Передача данных в поля формы popup *******/
    if (this.OutputFields) {
      // Имя профиля
      if (this.OutputFields.name.textContent) {
        this.profileName = this.popup.querySelector(
          ProfilePopup.CONST.profileNameClass
        );
        this.profileName.value = this.OutputFields.name.textContent;
      }
      // Описание профиля
      if (this.OutputFields.description.textContent) {
        this.profileDescription = this.popup.querySelector(
          ProfilePopup.CONST.profileDescriptionClass
        );
        this.profileDescription.value =
          this.OutputFields.description.textContent;
      }
    }
  }
}

// Класс popup отображения выбранной карточки
class CardPopup extends Popup {
  // Статические константы класса
  static CONST = {
    /******** CSS-классы *******/
    // ... popup и его элементов:
    popupClass: ".popup_type_image", // popup
    popupImageClass: ".popup__image", // картинки
    popupCaptionClass: ".popup__caption", // описания
    // ... элементов карточки:
    imageCardClass: ".card__image", // картинки
    titleCardClass: ".card__title", // описания
  };

  constructor(Card, openIt = false) {
    /*  Card - ссылка на выбранную карточку
        openIt - флаг необходимости открытия модального окна: true - открыть, false - создать */
    const popup = document.querySelector(CardPopup.CONST.popupClass);
    if (popup) {
      super(popup, null, openIt);
      /******* Элементы popup *******/
      this.imagePopup = this.popup.querySelector(
        CardPopup.CONST.popupImageClass
      ); // картинка
      this.captionPopup = this.popup.querySelector(
        CardPopup.CONST.popupCaptionClass
      ); // описание
      /******* Элементы карточки *******/
      if (Card) {
        this.Card = Card;
        this.imageCard = this.Card.querySelector(
          CardPopup.CONST.imageCardClass
        ); // картинка
        this.titleCard = this.Card.querySelector(
          CardPopup.CONST.titleCardClass
        ); // описание
      }
    }
  }

  // Передача данных элементам popup из карточки
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

export { Popup, ProfilePopup, CardPopup };
