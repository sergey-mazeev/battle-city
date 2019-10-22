;(function () {
  'use strict';

  class Renderer {
    constructor(args = {}) {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

      this.canvas.width = args.width || 100;
      this.canvas.height = args.height || 100;
      this.update = args.update || (() => {});
      this.background = args.background || 'black';

      requestAnimationFrame(timestamp => this.tick(timestamp))
    }

    tick(timestamp) {
      this.clear();
      this.update(timestamp);
      requestAnimationFrame(timestamp => this.tick(timestamp))
    }

    draw(cb) {
      return cb(this.canvas, this.context)
    }

    clear() {
      this.draw((canvas, context) => {
        context.fillStyle = this.background;
        context.beginPath();
        context.rect(0, 0, this.canvas.width, this.canvas.height);
        context.fill();
      })
    }

  }

  // Если в window нет GameEngine - то устанавливаем его значение в пустой
  // объект. Если есть - не меняем его
  window.GameEngine = window.GameEngine || {};
  // Записываем в GameEngine описание класса Render
  window.GameEngine.Renderer = Renderer;
})();