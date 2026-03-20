# Accessibility Checker

Веб-сервис для автоматизированной проверки доступности (Accessibility / a11y) веб-страниц.

Приложение анализирует DOM, runtime-состояние страницы и вычисленные стили, выявляет проблемы доступности и формирует структурированный отчёт с оценкой качества интерфейса.

---

## Основные возможности

Сервис выполняет комплексную проверку доступности:

### Проверки

1. Альтернативный текст изображений (Alt Text)
2. Структура и семантика страницы
3. Цветовая контрастность (WCAG)
4. Клавиатурная навигация
5. Доступность мультимедиа
6. Масштабируемость интерфейса
7. Сложность визуальной структуры (Structure Complexity)

---

### Аналитика и отчёты

- Единый **Rule Engine**
- Severity weighting:
    - error = -5
    - warning = -2
- Итоговый **score и grade**
    - 90+ → A
    - 75+ → B
    - 50+ → C
- Модульная статистика
- Dashboard с графиками
- Таблица проблем
- Recommendations engine (не только ошибки, но и рекомендации)

---

### История проверок

- Сохранение результатов в **IndexedDB (Dexie)**
- Просмотр сохранённых отчётов без повторного анализа
- Удаление и очистка истории
- Переход к деталям проверки

---

## Архитектура проекта

Проект разделён на два независимых приложения:

---

### 1. Backend

Backend отвечает за получение **runtime snapshot страницы**.

Функциональность:

1. Открытие страницы через Playwright / Puppeteer
2. Сбор DOM-структуры
3. Получение вычисленных стилей
4. Извлечение:
    - текстовых элементов
    - интерактивных элементов
    - медиа
    - параметров доступности
5. Возврат snapshot на frontend

---

### 2. Frontend

Frontend отвечает за анализ и отображение:

1. Отправка URL на backend
2. Получение snapshot
3. Построение **visual structure model**
4. Запуск всех checkers:
    - ContrastChecker
    - StructureComplexityChecker
    - KeyboardChecker и др.
5. Агрегация результатов через **Rule Engine**
6. Формирование:
    - score
    - grade
    - summary
    - recommendations
7. Отображение:
    - Dashboard (графики)
    - Таблица результатов
8. Сохранение истории в IndexedDB

---

## Стек технологий

### Frontend

- React
- TypeScript
- Vite
- ECharts (графики)
- Dexie (IndexedDB)
- CSS (custom design system)

### Backend

- Node.js
- Express
- Playwright / Puppeteer

---
# Установка и запуск

Можно использовать любой пакетный менеждер, лично я пользуюсь pnpm

## 1. Клонирование репозитория

```
git clone <repo-url>
cd diploma
```

 ## 2. Backend
 ```
 cd backend
 ```

### Установка зависсимостей

| pnpm | npm | yarn |
|------|-----|------|
| `pnpm i` | `npm install` | `yarn` |

### Запуск backend

| pnpm | npm | yarn |
|------|-----|------|
| `pnpm run start` | `npm run start` | `yarn start` |
Backend будет доступен по адресу
```http://localhost:3001```
 ## 3. Frontend
``` 
cd frontend
```

### Установка зависсимостей

| pnpm | npm | yarn |
|------|-----|------|
| `pnpm i` | `npm install` | `yarn` |

### Запуск frontend

| pnpm | npm | yarn |
|------|-----|------|
| `pnpm run dev` | `npm run dev` | `yarn dev` |

Frontend будет доступен по адресу
```http://localhost:5173```

