;(function () {
  'use strict';

  class Loader {
    constructor() {
      // Объект для хранения списка для загрузки ресурсов. После успешной
      // загрузки - удаляются из этого объекта
      this.loadOrder = {
        images: [],
        jsons: [],
      };
      // Объект для хранения загруженных ресурсов
      this.resources = {
        images: [],
        jsons: [],
      }
    }

    // Метод добавления изображения в список для загрузки
    addImage(name, src) {
      const {images} = this.loadOrder;
      this.loadOrder.images = [...images, {name, src}];
    }

    // Метод получения загруженного изображения
    getImage(name) {
      return this.resources.images[name];
    }

    // Метод получения загруженного json
    getJson(name) {
      return this.resources.jsons[name];
    }

    // Метод добавления файла json в список для загрузки
    addJson(name, src) {
      const {jsons} = this.loadOrder;
      this.loadOrder.jsons = [...jsons, {name, src}];
    }

    // Метод загрузки ресурсов
    load(cb) {
      // Берем массивы изображений и json из списка загрузки
      const {images, jsons} = this.loadOrder;
      // Объявляем пустой массив промисов, нужен,чтобы в дальнейшем
      // использовать Promise.all(Arr)
      let promises = [];
      // Загрузка изображений
      // Итерируемся по массиву изображений, с помощью деструктивного
      // присваивания берем у каждого элемента из массива имя и путь ({name,
      // src})
      images.map(({name, src}) => {
        // Используя статический метод класса Loader loadImage загружаем
        // изображение по указанному пути `src`
        const promise = Loader.loadImage(src)
          // т.к. Loader.loadImage возвращает Promise - подписываемся на его
          // результат
          .then(img => {
            // Добавляем загруженное изображение в именнованный массив с
            // ресурсами-изображениями
            this.resources.images[name] = img;
            // фильтруем массив со списком изображений для загрузки таким
            // образом, чтобы удалить загруженный элемент
            this.loadOrder.images = this.loadOrder.images.filter(el => el.name !== name);
          });
        // Добавляем описанный выше promise в массив промисов для Promise.all
        promises = [...promises, promise];
      });

      // Загрузка json
      // Итерируемся по массиву json, с помощью деструктивного присваивания
      // берем у каждого элемента из массива имя и путь ({name, src})
      jsons.map(({name, src}) => {
        // Используя статический метод класса Loader loadJson загружаем json по
        // указанному пути `src`
        const promise = Loader.loadJson(src)
          // т.к. Loader.loadJson возвращает Promise - подписываемся на его
          // результат
          .then(json => {
            // Добавляем загруженный json в именнованный массив с ресурсами-json
            this.resources.jsons[name] = json;
            // фильтруем массив со списком json для загрузки таким образом,
            // чтобы удалить загруженный элемент
            this.loadOrder.jsons = this.loadOrder.jsons.filter(el => el.name !== name);
          });
        // Добавляем описанный выше promise в массив промисов для Promise.all
        promises = [...promises, promise];
      });

      // С помощью Promise.all проходимся по собранному массиву promises
      // затем - выполняем переданный в функцию load первым атрибутом callback
      Promise.all(promises).then(cb);
    }

    // Статический метод для загрузки изображения, принимает единственным
    // атрибутом путь к изображению
    static loadImage(src) {
      // Из метода возвращается обещание
      return new Promise((resolve, reject) => {
        try {
          // создаем наше изображение - экземпляр класса Image
          const image = new Image;
          // после загрузки изображения - запускаем resolve callback обещания
          // (успешное завершение)
          image.addEventListener('load', () => resolve(image));
          // в качестве атрибута src - устанавливаем переданный в функцию адрес
          // до изображения
          image.setAttribute('src', src);
        }
        catch (err) {
          // в случае ошибки - передаём ошибку в reject callback обещания
          // (неудачное завершение).
          reject(err);
        }
      })
    }

    // Статический метод для загрузки json, принимает единственным
    // атрибутом путь к json
    static loadJson(src) {
      // Метод возвращает обещание (т.к. fetch возращает promise)
      return fetch(src)
        // Подписываемся на результат fetch. При получении данных - переводим их в json
        .then(result => result.json())
        // возвращаем получнные данные
        .then(json => json)
        // При ошибке - вывести её в консоль
        .catch(err => console.warn(err));
    }
  }

  // Если в window нет GameEngine - то устанавливаем его значение в пустой объект. Если есть - не меняем его
  window.GameEngine = window.GameEngine || {};
  // Записываем в GameEngine описание класса Loader
  window.GameEngine.Loader = Loader;
})();