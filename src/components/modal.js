//! Константы модуля
const CONST = {
  // CSS-классы
  isOpenClass: "popup_is-opened", // открытого окна
  closerClass: ".popup__close", // элемента (кнопки), закрывающего окно
  contentWrapperClass: ".popup__content", // wrappera контента окна
};

//! Открытие popup
function openModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    attachPopupEvents(popup); // назначение обработчиков событий popup
    popup.classList.add(CONST.isOpenClass); // отображение popup
  }
}

//! Закрытие popup
function closeModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    popup.classList.remove(CONST.isOpenClass); // скрытие popup
    detachPopupEvents(popup); // удаление обработчиков событий popup
  }
}

//! Назначение обработчиков popup
function attachPopupEvents(popup) {
  //* Обработчики закрытия popup по ...
  if (popup) {
    //*... кнопке ❌
    const buttonClose = popup.querySelector("button.popup__close");
    if (buttonClose)
      buttonClose.addEventListener("click", {
        handleEvent: closePopup,
        popup: popup,
      });
    //* ... click вне границ окна
    popup.addEventListener("mousedown", {
      handleEvent: handleClickOutside,
      popup: popup,
    });
    //* ... Esc
    document.addEventListener("keydown", {
      handleEvent: handleEsc,
      popup: popup,
    });
  }
}

//! Удаление обработчиков событий по ...
function detachPopupEvents(popup) {
  if (popup) {
    //* ... ❌
    const buttonClose = popup.querySelector("button.popup__close");
    buttonClose.removeEventListener("click", closeModal);
    //* ... click вне границ окна
    popup.removeEventListener("mousedown", handleClickOutside);
    //* ... Escape
    document.removeEventListener("keydown", handleEsc);
  }
}

//! Обработчики событий

//* Обработчик закрытия popup по ❌
function closePopup(evt) {
  closeModal(this.popup);
}

//* Обработчик закрытия popup по Esc
function handleEsc(evt) {
  if (evt.key === "Escape") closeModal(this.popup);
}

//* Обработчик закрытия popup по click вне его границ
function handleClickOutside(evt) {
  const isInsideClick = !!evt.target.closest(".popup__content");
  if (!isInsideClick) closeModal(this.popup);
}

export { openModal, closeModal };
