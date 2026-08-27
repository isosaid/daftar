# Вход и синхронизация — настройка за 5 минут

Пока `config.js` пустой, платформа работает без входа: данные лежат в одном браузере
и на телефоне не появятся. Чтобы страничка открывалась на всех устройствах,
подключите Firebase — бесплатно, свой сервер не нужен.

## 1. Создать проект

https://console.firebase.google.com → **Add project** → имя `daftar` →
Google Analytics можно выключить → Create project.

## 2. Включить вход по почте

Слева **Build → Authentication** → **Get started** →
вкладка **Sign-in method** → **Email/Password** → включить верхний тумблер → **Save**.

Второй тумблер (Email link) не нужен.

## 3. Создать базу

Слева **Build → Firestore Database** → **Create database** →
регион `eur3` или ближайший → **Start in production mode** → Create.

Затем вкладка **Rules**, заменить содержимое на это и нажать **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Это правило означает: каждый видит только свою запись. Чужие данные недоступны
даже при попытке обратиться напрямую.

## 4. Получить ключи

Шестерёнка вверху слева → **Project settings** → прокрутить до **Your apps** →
значок **`</>`** (Web) → App nickname `daftar` → **Register app**.

Появится блок `firebaseConfig`. Нужны четыре строки: `apiKey`, `authDomain`,
`projectId`, `appId`.

## 5. Вписать ключи

Открыть `config.js` в репозитории (кнопка-карандаш на GitHub) и заполнить:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "daftar-xxxx.firebaseapp.com",
  projectId: "daftar-xxxx",
  appId: "1:123...:web:abc..."
};
```

Commit changes. Через минуту сайт запросит вход.

## 6. Разрешить домен

**Authentication → Settings → Authorized domains** → **Add domain** →
`isosaid.github.io`. Без этого вход с сайта не сработает.

---

## Вопросы, которые обычно возникают

**Эти ключи секретные?**
Нет. `apiKey` у Firebase — публичный идентификатор проекта, он всегда виден
в коде страницы. Данные защищают правила из шага 3, а не ключ.

**Сколько стоит?**
Бесплатный тариф Spark: 50 000 чтений и 20 000 записей в день, 1 ГБ хранилища.
Личный бюджет расходует единицы записей в день.

**Забыли пароль?**
Firebase Console → Authentication → Users → выбрать пользователя → Reset password.

**Что если интернета нет?**
Платформа работает: данные сохраняются в браузере, в строке под именем видно
«нет связи — работаем локально». При следующем выходе в сеть уйдут в облако.

**Как вернуться к работе без входа?**
На экране входа — ссылка «Продолжить без входа». Эти данные останутся
только на текущем устройстве и в облако не попадут.
