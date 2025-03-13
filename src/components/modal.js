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
    popup.classList.add(CONST.isOpenClass); // отображение popup'а
  }
}

//! Закрытие popup
function closeModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    popup.classList.remove(CONST.isOpenClass); // скрытие popup'а
  }
}

export { openModal, closeModal };
