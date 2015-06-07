var canvas, engine, scene;

if (BABYLON.Engine.isSupported()) {
  canvas = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = new Scene(canvas, engine);
  scene.loadScene1();
} else {
  window.alert("Puede que no tenga usted activado el WebGL, por lo tanto compruebe si esta activado. Firefox soporta bastante bien WebGL");
}
