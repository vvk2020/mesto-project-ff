let CONFIG = {}; // параметры конфигурации валидации

// Определение валидности полей ввода
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

//! Контроль доступности submit-кнопки по состоянию полей ввода:
//! если хотя бы один input невалидный, то submit-кнопка не доступна
const toggleButtonState = (inputList, button) => {
  if (hasInvalidInput(inputList)) {
    button.disabled = true;
    button.classList.add(CONFIG.inactiveButtonClass);
  } else {
    button.disabled = false;
    button.classList.remove(CONFIG.inactiveButtonClass);
  }
};

//!
const showInputError = (form, input, errorMessage) => {
  const errorElement = form.querySelector(`.${input.id}-error`);
  input.classList.add(CONFIG.inputErrorClass);
  errorElement.classList.add(CONFIG.errorClass);
  errorElement.textContent = errorMessage;
};

//!
const hideInputError = (form, input) => {
  const errorElement = form.querySelector(`.${input.id}-error`);
  input.classList.remove(CONFIG.inputErrorClass);
  errorElement.classList.remove(CONFIG.errorClass);
  errorElement.textContent = "";
};

//! Контроль отображения кастомного сообщения об ошибке ввода
const isValid = (form, input) => {
  if (input.validity.patternMismatch)
    input.setCustomValidity(input.dataset.errorMessage);
  else input.setCustomValidity("");

  //* Управление отображением сообщения об ошибке ввода в input
  if (!input.validity.valid)
    showInputError(form, input, input.validationMessage);
  else hideInputError(form, input);
};

//! Добавление обработчиков всем input выбранной формы
const setEventListeners = (form) => {
  const inputList = Array.from(form.querySelectorAll(CONFIG.inputSelector));
  const button = form.querySelector(CONFIG.submitButtonSelector);

  // Состояние кнопки перед вводом данных в input
  toggleButtonState(inputList, button);

  // Добавление обработчиков всем полям ввода формы
  inputList.forEach((input) => {
    input.addEventListener("input", () => {
      // console.log("input.validity:", input.validity);
      //* Контроль отображения кастомного сообщения об ошибке ввода
      isValid(form, input);
      // Вызовем toggleButtonState и передадим ей массив полей и кнопку
      toggleButtonState(inputList, button);
    });
  });
  // }
};

//! Включение валидации (обработчиков событий)
function enableValidation({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
} = {}) {
  CONFIG = arguments[0]; // Инициализация параметров конфигурации модуля
  // console.log("CONFIG:", CONFIG);

  // Создание списка форм с input-полями
  const formsList = Array.from(
    document.querySelectorAll(
      `${CONFIG.formSelector}:has(${CONFIG.inputSelector})`
    )
  );
  // Добавление обработчиков полям выбранных форм
  formsList.forEach((form) => {
    setEventListeners(form);
  });
}

//! Очистка ошибок валидации формы и деактивация кнопки (при неудачной валидации)
function clearValidation(
  form
  // {
  //   formSelector,
  //   inputSelector,
  //   submitButtonSelector,
  //   inactiveButtonClass,
  //   inputErrorClass,
  //   errorClass,
  // } = {}
) {
  // Очистка ошибок ввода данных в поля формы
  const inputList = Array.from(form.querySelectorAll(CONFIG.inputSelector));
  inputList.forEach((input) => hideInputError(form, input));

  // Деактивация submit-кнопки
  const button = form.querySelector(CONFIG.submitButtonSelector);
  toggleButtonState(inputList, button);
}

export { enableValidation, clearValidation };
