export default (function modal() {
  /* Popup:
    buttonOpen - кнопка открытия модального окна
    buttonClose  - кнопка закрытия модального окна
    popup - модальное окно
    openIt - флаг необходимости открытия модального окна
*/

  class Popup {
    constructor(popup, buttonOpen, openIt = false) {
      console.clear();
      if (popup) {
        this.popup = popup; // модальное онко
        // Определение кнопки закрытия модального окна
        this.buttonClose = this.popup.querySelector(".popup__close");
        // Назначение обработчика открытия окна редактирования профиля по кнопке ✏️ (если задан)
        if (buttonOpen) {
          this.buttonOpen = buttonOpen;
          this.attachEvent("click", this.openPopup, this.buttonOpen);
        }
        // Открыть зщзгз сразу?
        if (openIt) this.openPopup();
      }
    }

    // Универсальная функция назначения обработчика событий
    attachEvent(event, handler, obj = this.popup) {
      // console.log("attach: ", obj, event, handler);
      if (obj && event && handler)
        obj.addEventListener(event, handler.bind(this));
    }

    // Универсальная функция удаления обработчика событий
    detachEvent(event, handler, obj = this.popup) {
      // console.log("detach: ", obj, event, handler);
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
      console.log("event", event);
      this.detachEvent("click", this.closePopup, this.buttonClose); // по ❌
      this.detachEvent("keydown", this.handleEsc, document); // по Esc
      this.detachEvent("click", this.handleClickOutside); // click вне границ окна
    }

    // Обработчик открытия модального окна по ✏️
    openPopup() {
      this.popup.classList.add("popup_is-opened");
      this.attachAllEvents(); // назначение обработчиков событий окна
    }

    // Обработчик закрытия модального окна по ❌
    closePopup() {
      /* Удаление обработчиков событий окна с блокировкой повторного их удаления */
      if (this.popup.classList.contains("popup_is-opened"))
        this.detachAllEvents();
      // Удаление флага открытия окна (налияия обработчиков событий)
      this.popup.classList.remove("popup_is-opened");
    }

    // Обработчик закрытия модального окна по Esc
    handleEsc(evt) {
      if (evt.key === "Escape") {
        this.closePopup();
      }
    }

    // Обработчик закрытия модального окна по click вне его границ
    handleClickOutside(evt) {
      const isInsideClick = !!evt.target.closest(".popup__content");
      // Закрываем, если click по элементу, не имеющему родителя с .popup__content
      if (!isInsideClick) this.closePopup();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Popup редактирования профиля и кнопка его открытия
    const popupEditProfile = document.querySelector(".popup_type_edit");
    const buttonEditProfile = document.querySelector(".profile__edit-button");

    // Popup добавления новой карточки и кнопка его открытия
    const popupNewCard = document.querySelector(".popup_type_new-card");
    const buttonAddCard = document.querySelector(".profile__add-button");

    // Popup просмотра карточки
    const popupImageCard = document.querySelector(".popup_type_image");
    // const buttonOpenImageCard = document.querySelector(".card__image");

    // Массив статически обрабатываемых popup-объектов
    const Popups = [
      new Popup(popupEditProfile, buttonEditProfile),
      new Popup(popupNewCard, buttonAddCard),
    ];

    // Список карточек и назначение ему  обработчика для onclick
    const cardsList = document.querySelector(".places__list");
    cardsList.addEventListener("click", clickCard);

    // Динамическое назначение обработчиков закрытия выбранной карточке
    function clickCard(evt) {
      if (evt.target.classList.contains("card__image")) {
        Popups.push(new Popup(popupImageCard, null, true));
      }
    }
  });
})();
