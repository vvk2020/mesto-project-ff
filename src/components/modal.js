//! Константы модуля
// CSS-классы
const CSS_CLASSES = {
  isOpen: "popup_is-opened", // открытого popup
  closer: ".popup__close", // элемента (кнопки), закрывающего окно
  contentWrapper: ".popup__content", // wrappera контента окна
};

//! Открытие popup
function openModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    // Назначение обработчика закрытия popup по кнопке Esc
    document.addEventListener(
      "keydown",
      (evt) => {
        if (evt.key === "Escape") closeModal(popup);
      },
      { once: true }
    );

    popup.classList.add(CSS_CLASSES.isOpen); // отображение popup
  }
}

//! Закрытие popup
function closeModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    popup.classList.remove(CSS_CLASSES.isOpen); // скрытие popup
  }
}

export { openModal, closeModal };
