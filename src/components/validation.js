// Функция принимает массив полей ввода
// и элемент кнопки, состояние которой нужно менять
const toggleButtonState = (inputList, buttonElement) => {
  // // Если есть хотя бы один невалидный инпут
  // if (hasInvalidInput(inputList)) {
  //   // сделай кнопку неактивной
  // buttonElement.disabled = true;
  //   buttonElement.classList.add('form__submit_inactive');
  // } else {
  //   // иначе сделай кнопку активной
  //   buttonElement.disabled = false;
  //   buttonElement.classList.remove('form__submit_inactive');
  // }
};

//!
const showInputError = (form, input, errorMessage) => {
  console.log("showInputError");
  // Находим элемент ошибки внутри самой функции
  const errorElement = form.querySelector(`.${input.id}-error`);
  console.log("errorElement", errorElement);
  // Остальной код такой же
  input.classList.add("popup__input_type_error");
  errorElement.textContent = errorMessage;
  // errorElement.classList.add("form__input-error_active");
};

//!
const hideInputError = (form, input) => {
  console.log("hideInputError");
  // Находим элемент ошибки
  const errorElement = form.querySelector(`.${input.id}-error`);
  console.log("errorElement", errorElement, input.id);
  // Остальной код такой же
  input.classList.remove("popup__input_type_error");
  // errorElement.classList.remove("form__input-error_active");
  errorElement.textContent = "";
};

//! Контроль отображения кастомного сообщения об ошибке ввода
const isValid = (form, input) => {
  // console.log("input.validity:", input.validity);
  if (input.validity.patternMismatch)
    // данные атрибута доступны у элемента инпута через ключевое слово dataset.
    // обратите внимание, что в js имя атрибута пишется в camelCase (да-да, в
    // HTML мы писали в kebab-case, это не опечатка)
    input.setCustomValidity(input.dataset.errorMessage);
  else input.setCustomValidity("");

  //* Управление отображением сообщения об ошибке ввода в input
  if (!input.validity.valid)
    showInputError(form, input, input.validationMessage);
  else hideInputError(form, input);
};

//! Добавление обработчиков всем input выбранной формы
const setEventListeners = (
  form,
  { inputSelector, submitButtonSelector } = {}
) => {
  if (form && inputSelector && submitButtonSelector) {
    // Находим все поля внутри формы
    const inputList = Array.from(form.querySelectorAll(inputSelector));
    // const button = form.querySelector(submitButtonSelector);

    // Состояние кнокпуи перед вводом данных в input
    // toggleButtonState(inputList, button);

    // Добавление обработчиков всем полям ввода формы
    inputList.forEach((input) => {
      input.addEventListener("input", () => {
        // console.log("input.validity:", input.validity);
        //* Контроль отображения кастомного сообщения об ошибке ввода
        isValid(form, input);
        // Вызовем toggleButtonState и передадим ей массив полей и кнопку
        // toggleButtonState(inputList, button);
      });
    });
  }
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
  if (formSelector && inputSelector && submitButtonSelector) {
    // console.log("arguments[0]:", arguments[0]);

    // Создание списка форм с input-полями
    const formsList = Array.from(
      document.querySelectorAll(`${formSelector}:has(${inputSelector})`)
    );
    // Добавление обработчиков полям выбранных форм
    formsList.forEach((form) => {
      setEventListeners(form, { inputSelector, submitButtonSelector });
    });
  }
  // else console.log("undef");
}

function clearValidation() {}

export { enableValidation, clearValidation };
