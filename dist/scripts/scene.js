var Scene;

Scene = (function() {
  function Scene(canvas, engine) {
    this.canvas = canvas;
    this.engine = engine;
  }

  Scene.prototype.loadScene1 = function() {
    return loadScene1(this.canvas, this.engine);
  };

  return Scene;

})();
