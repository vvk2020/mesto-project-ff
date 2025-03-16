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
    document.addEventListener("keydown", handleEscWrapper);
    popup.classList.add(CSS_CLASSES.isOpen); // отображение popup
  }
}

//! Wrapper обработчика события закрытия окна по Esc
/*  
  ОТКРЫТОЕ модальное окно может быть ТОЛЬКО ОДНО. Если необходимо 
  открыть новое модальное окно, текущее модальное окно необходимо 
  закрыть.
*/
function handleEscWrapper(evt) {
  if (evt.key === "Escape") {
    const popups = document.querySelectorAll(".popup");
    if (popups) {
      //* Поиск первого открытого popup
      const openPopup = Array.from(popups).find((popup) => {
        if (popup && popup.classList.contains("popup_is-opened")) return popup;
      });
      //* Закрытие первого найденного открытого popup
      closeModal(openPopup);
    }
  }
}

//! Закрытие popup
function closeModal(popup) {
  if (popup && popup.classList.contains("popup")) {
    // Удаление listner, закрывающего popup по Esc
    document.removeEventListener("keydown", handleEscWrapper);
    // Cкрытие popup
    popup.classList.remove(CSS_CLASSES.isOpen);
  }
}

//! Инициализация модального окна
const initializeModal = (popup) => {
  if (popup && popup.classList.contains("popup")) {
    //* Добавление модификатора popup для анимации при его открытии/закрытии
    if (!popup.classList.contains("popup_is-animated"))
      popup.classList.add("popup_is-animated");

    //* Назначение обработчиков закрытия popup по...
    //... кнопке ❌ popup просмотра карточки
    const btnClose = popup.querySelector("button.popup__close");
    if (btnClose)
      btnClose.addEventListener("click", () => {
        closeModal(popup);
      });
    //... click вне границ popup просмотра карточки
    popup.addEventListener("mousedown", (evt) => {
      const isInsideClick = !!evt.target.closest(".popup__content");
      if (!isInsideClick) closeModal(popup);
    });
  }
};

export { openModal, closeModal, initializeModal };
