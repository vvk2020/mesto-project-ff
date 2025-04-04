//! Авторизация и доступ
const BASE_URL = "https://nomoreparties.co/v1/wff-cohort-35/"; // базовый url
// const API_TOKEN = process.env.API_TOKEN; // токен
const API_TOKEN = "daac000b-c031-49fc-9356-0394a8a42db9"; // токен

//! Унифицированная функция запроса к серверу, возвращающая его ответ
const httpBaseQuery = ({ url, method = "GET", headers = {}, body = null }) => {
  return fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
};

//! Функция авторизированного запроса к серверу, возвращающая объект ответа
const httpQuery = ({ endURL, method, headers = {}, body }) => {
  headers.authorization = API_TOKEN;
  return httpBaseQuery({ url: BASE_URL + endURL, method, headers, body }).then(
    (resp) => {
      if (resp.ok) return resp.json();
      return Promise.reject(`Ошибка: ${resp.status}`);
    }
  );
};

//! Прикладные функции запросов

//* Запрос карточек мест (не только своих)
const getCards = () => {
  return httpQuery({ endURL: "cards" });
};

//* Запрос добавления новой карточки
const saveCard = (body) => {
  if (body.name && body.link) {
    // Проверка: тип контента body.link - изображение?
    return getHeaders(body.link).then((resp) => {
      if (!resp.ok) return Promise.reject(resp.status);
      const contentType = resp.headers.get("Content-Type"); // тип контента в ответе
      if (!contentType || !contentType.startsWith("image/"))
        return Promise.reject(`ссылка не на картинку`);
      // Сохранение карточки на сервере
      return httpQuery({
        endURL: "cards",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }).then((saveResp) => saveResp);
    });
  }
};

//* Запрос удаления карточки по ее Id
const deleteCard = (cardId) => {
  return httpBaseQuery({
    url: `${BASE_URL}cards/${cardId}`,
    method: "DELETE",
    headers: { authorization: API_TOKEN },
  });
};

//* Запрос данных своего профиля
const getProfile = () => {
  return httpQuery({ endURL: "users/me" });
};

//* Изменение профиля
const setProfile = (body) => {
  return httpQuery({
    endURL: "users/me",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
};

//* Запрос MIME-типа в заголовке
const getHeaders = (url) => {
  return httpBaseQuery({
    url,
    method: "HEAD",
    mode: "cors", // для кросс-доменных запросов
    cache: "no-cache", // игнорируем кеш
  });
};

//* Изменение аватара профиля
const setProfileAvatar = (body) => {
  return httpQuery({
    endURL: "users/me/avatar",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
};

const evaluateCard = (cardId, like) => {
  return httpBaseQuery({
    url: `${BASE_URL}cards/likes/${cardId}`,
    method: like ? "PUT" : "DELETE",
    headers: { authorization: API_TOKEN },
  });
};

export {
  getCards,
  getProfile,
  setProfile,
  setProfileAvatar,
  getHeaders,
  saveCard,
  deleteCard,
  evaluateCard,
};
