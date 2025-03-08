export default (function modal() {
  /*************  Редактирование профиля *************/

  /*************  Классы *************/
  /*
    buttonOpen - кнопка открытия модального окна
    buttonClose  - кнопка закрытия модального окна

*/

  class Popup {
    constructor(selectorPopup, selectorButtonOpen) {
      try {
        // Инициализируем popup
        if (selectorPopup.trim()) {
          this.popup = document.querySelector(selectorPopup);
          if (this.popup)
            this.buttonClose = this.popup.querySelector(
              selectorPopup + " .popup__close"
            );
          // console.log("buttonClose: ", this.buttonClose);
        }
        // console.log("+++ this.popup: ", this.popup);
        // else return null;
        if (selectorButtonOpen.trim())
          this.buttonOpen = document.querySelector(selectorButtonOpen);
        // Назначение обработчика открытия окна редактирования профиля по кнопке ✏️
        this.attachEvent("click", this.openPopup, this.buttonOpen);

        // console.log("buttonOpen: ", this.popup, this.buttonOpen );
        // return this;
      } catch (err) {
        this.error = err; // для последующей обработки ошибки
        console.log(err);
      }
    }

    // Универсальная функция назначения обработчика событий
    attachEvent(event, handler, obj = this.popup) {
      if (obj && event && handler)
        obj.addEventListener(event, { handleEvent: handler, object: this });
      console.log("attachEvent");
    }

    // Универсальная функция удаления обработчика событий
    detachEvent(event, handler, obj = this.popup) {
      if (obj && event && handler)
        obj.removeEventListener(event, { handleEvent: handler, object: this });
      console.log("detachEvent");
    }

    // Назначение обработчиков событий закрытия модального окна
    attachAllEvents() {
      this.attachEvent("click", this.closePopup); // по ❌
      this.attachEvent("keydown", this.handleEsc, document); // по Esc
      // document.addEventListener("keydown", { handleEvent: this.handleEsc, object: this }); // по Esc
      // popupEditProfile.addEventListener("click", handleClickOutside); // по click вне границ окна
    }

    // Удаление обработчиков событий модального окна перед закрытием
    detachAllEvents() {
      this.detachEvent("click", this.closePopup); // по ❌
      this.detachEvent("keydown", this.handleEsc, document); // по Esc
      // document.removeEventListener("keydown", { handleEvent: this.handleEsc, object: this }); // по ❌
      // popupEditProfile.removeEventListener("click", handleClickOutside);
    }

    // Обработчик открытия модального окна по ✏️
    openPopup() {
      this.object.popup.classList.add("popup_is-opened");
      this.object.attachAllEvents(); // назначение обработчиков событий для открытого окна
    }

    // Обработчик закрытия модального окна по ❌
    closePopup() {
      this.object.popup.classList.remove("popup_is-opened");
      this.object.detachAllEvents(); // удаление обработчиков событий
      // console.log('a: ', a)
    }

    // Обработчик закрытия модального окна по Esc
    handleEsc(event) {
      console.log("this.object: ", this.object);
      if (event.key === "Escape") this.object.closePopup({object: this.object});
      // if (event.key === "Escape") this.object.closePopup().bind(this.object);
    }
  }

  // const profEdtPopup = new Popup(".profile__edit-button");

  const Popups = [
    new Popup(".popup_type_edit", ".profile__edit-button"),
    // new Popup("", ".profile__edit-button"),
    new Popup(".popup_type_new-card", ".profile__add-button"),
  ];
})();
