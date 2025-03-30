//! Авторизация и доступ
const BASE_URL = "https://nomoreparties.co/v1/wff-cohort-35/"; // базовый url
const API_TOKEN = process.env.API_TOKEN; // токен

//! Унифицированная функция запроса к серверу
function httpQuery({ endURL, method = "GET", headers = {}, body = null }) {
  headers.authorization = API_TOKEN;
  return fetch(BASE_URL + endURL, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res.status);
  });
}

//! Прикладные функции запросов

//* Запрос карточек мест (не только своих)
function getCards() {
  return httpQuery({ endURL: "cards" });
}

//* Запрос данных своего профиля
function getProfile() {
  return httpQuery({ endURL: "users/me" });
}

//* Изменение своего профиля
function setProfile(name, about) {
  return httpQuery({
    endURL: "users/me",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: { name, about },
  });
}

export { getCards, getProfile, setProfile };
