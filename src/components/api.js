//! Авторизация и доступ
const BASE_URL = "https://nomoreparties.co/v1/wff-cohort-35/"; // базовый url
const API_TOKEN = process.env.API_TOKEN; // токен

//! Унифицированная функция запроса к серверу, возвращающая его ответ
function httpBaseQuery({ url, method = "GET", headers = {}, body = null }) {
  // console.log("httpBaseQuery() => body:", JSON.stringify(body, null, 2));
  return fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
}

//! Функция авторизированного запроса к серверу, возвращающая объект ответа
function httpQuery({ endURL, method, headers = {}, body }) {
  headers.authorization = API_TOKEN;
  // console.log("httpQuery() => body:", JSON.stringify(body, null, 2));
  return httpBaseQuery({ url: BASE_URL + endURL, method, headers, body }).then(
    (resp) => {
      if (resp.ok) return resp.json();
      return Promise.reject(`Ошибка: ${resp.status}`);
    }
  );
}

//! Прикладные функции запросов

//* Запрос карточек мест (не только своих)
function getCards() {
  return httpQuery({ endURL: "cards" });
}

//* Запрос добавления новой карточки
function saveCard(body) {
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
}

//* Запрос данных своего профиля
function getProfile() {
  return httpQuery({ endURL: "users/me" });
}

//* Изменение профиля
function setProfile(body) {
  return httpQuery({
    endURL: "users/me",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

//* Запрос MIME-типа в заголовке
function getHeaders(url) {
  return httpBaseQuery({
    url,
    method: "HEAD",
    mode: "cors", // для кросс-доменных запросов
    cache: "no-cache", // игнорируем кеш
  });
}

//* Изменение аватара профиля
function setProfileAvatar(body) {
  return httpQuery({
    endURL: "users/me/avatar",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

export {
  getCards,
  getProfile,
  setProfile,
  setProfileAvatar,
  getHeaders,
  saveCard,
};
