;(function () {
    'use strict';

    class Sprite {
      constructor() {

      }
    }

  // Если в window нет GameEngine - то устанавливаем его значение в пустой
  // объект. Если есть - не меняем его
  window.GameEngine = window.GameEngine || {};
  // Записываем в GameEngine описание класса Render
  window.GameEngine.Sprite = Sprite;
})();