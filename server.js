/**
 * Мини проект на чистом node.js
 * @type {module:http}
 */
// Подключаем модуль http для создания сервера
const http = require('http');
// Подключаем модуль fs для работы с файловой системой
const fs = require('fs');
// Подключаем модуль url для разбивки url запроса
const url = require('url');
// Подключаем npm модуль slugify для управления форматом строки url
const slugify = require('slugify');
// Подключаем свой модуль для формирования шаблона на основание получаемых данных
const replaceTemplate = require('./modules/replaceTemplate');

// Формируем запросы на получение шаблонов в начале работы сервера (экономит время при формировании ответов)
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8',
);

// Получаем динамические данные
const dataJSON = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8',
);
const dataObj = JSON.parse(dataJSON);
const slugs = dataObj.map(el => slugify(el.productName, {
  lower: true,
}));

// Создаем сервер
const server = http.createServer((req, res) => {
  // получаем из url имя пути и объект с id или другой переменной
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    // Устанавливаем заголовки для корректного чтения браузером вашего ответа
    res.writeHead(200, { 'Content-type': 'text/html'});

    // Формируем карточки на основании полученных данных из json
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    // Встовляем их в основной template
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // Отпровляем клиенту
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    // Устанавливаем заголовки для корректного чтения браузером вашего ответа
    res.writeHead(200, { 'Content-type': 'text/html' });

    // Получаем данные на запрос конкретного продукта
    const product = dataObj[query.id];
    // Форморуем шаблон из полученных данных
    const output = replaceTemplate(tempProduct, product);
    res.end(output)

    // API
  } else if (pathname === '/api') {
    // Устанавливаем заголовки для корректного чтения браузером вашего ответа
    res.writeHead(200, { 'Content-type': 'application/json'});
    res.end(data);

    // Not found page
  } else {
    // Устанавливаем заголовки для корректного чтения браузером вашего ответа
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    //Отдаем заголовок
    res.end('<h1>Page not found!</h1>')
  }

});

// Ставим на прослушку
server.listen(3000, 'localhost', () => {
  console.log('Server starting in 3000 port');
});
