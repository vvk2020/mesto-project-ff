export default (function modal() {
  /* Popup:
    buttonOpen - кнопка открытия модального окна
    buttonClose  - кнопка закрытия модального окна
    popup - модальное окно
*/

  class Popup {
    constructor(selectorPopup, selectorButtonOpen) {
      try {
        console.clear();
        // Инициализация ссылок на popup и кнопку его закрытия
        if (selectorPopup.trim()) {
          this.popup = document.querySelector(selectorPopup);
          if (this.popup)
            this.buttonClose = this.popup.querySelector(
              selectorPopup + " .popup__close"
            );
        }
        // Назначение обработчика открытия окна редактирования профиля по кнопке ✏️
        if (selectorButtonOpen.trim()) {
          this.buttonOpen = document.querySelector(selectorButtonOpen);
          this.attachEvent("click", this.openPopup, this.buttonOpen);
        }
      } catch (err) {
        this.error = err; // для последующей обработки ошибки
        console.log(err);
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
    function collectPopups(selectorPopup, selectorButtonOpen) {
      // try {
      //   // Инициализация
      //   if (selectorPopup.trim()) {
      //     popup = document.querySelectorAll(selectorPopup);
      //     // if (this.popup)
      //     //   this.buttonClose = this.popup.querySelector(
      //     //     selectorPopup + " .popup__close"
      //     //   );
      //   }
      //   if (selectorButtonOpen.trim())
      //     this.buttonOpen = document.querySelector(selectorButtonOpen);
      //   // Назначение обработчика открытия окна редактирования профиля по кнопке ✏️
      //   this.attachEvent("click", this.openPopup, this.buttonOpen);
      // } catch (err) {
      //   this.error = err; // для последующей обработки ошибки
      //   console.log(err);
      // }
    }

    // Массив popup-объектов
    const Popups = [
      new Popup(".popup_type_edit", ".profile__edit-button"),
      new Popup(".popup_type_new-card", ".profile__add-button"),
      // new Popup(".popup_type_image", ".card__image"),
    ];

    function clickCard(evt) {
      console.log(evt.target);
    }

    (() => {
      console.log("ok777");
      // Список карточек
      const cardsList = document.querySelector(".places__list");
      console.log(cardsList);

      cardsList.addEventListener("click", clickCard);

      // const cardsArray = Array.from(cards);
      // cardsArray.forEach((card) => {
      //   console.log(card);
      // });
    })();

    // Popups
  });
})();
