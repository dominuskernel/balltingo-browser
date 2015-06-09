var loadScene1, renderAll, setObjects;

loadScene1 = function(canvas, engine) {
  BABYLON.SceneLoader.Load("", "../assets/balltingo.babylon", engine, function(Balltingo) {
    Balltingo.executeWhenReady((function() {
      var data, world;
      Balltingo.enablePhysics(new BABYLON.Vector3(0, -1000, 0), new BABYLON.OimoJSPlugin());
      world = OIMO.World();
      Balltingo.debugLayer.show(true);
      Balltingo.setGravity(0, -1000, 0);
      data = setObjects(Balltingo);
      control(data);
      renderAll(data, canvas, engine);
    }), function(progress) {});
  });
};

setObjects = function(Balltingo) {
  var ball, ballBody, barra, barraBody, camera, data, floor, wall1, wall2, wall3, wall4;
  camera = Balltingo.getCameraByName("Camera");
  camera.cameraDirection = new BABYLON.Vector3(0.2, 0, 0);
  barra = Balltingo.getMeshByID("Bar");
  barraBody = barra.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 1000,
    friction: 0.00001,
    restitution: 0.00001
  });
  barra.checkCollisions = true;
  ball = Balltingo.getMeshByName("Ball");
  ballBody = ball.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {
    mass: 1,
    friction: 0.00001,
    restitution: 3
  });
  floor = Balltingo.getMeshByID("Floor");
  floor.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 0,
    restitution: 0.00001
  });
  wall1 = Balltingo.getMeshByID("Wall1");
  wall1.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 0
  });
  wall2 = Balltingo.getMeshByID("Wall2");
  wall2.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 0
  });
  wall3 = Balltingo.getMeshByID("Wall3");
  wall3.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 0
  });
  wall4 = Balltingo.getMeshByID("Wall4");
  wall4.checkCollisions = true;
  wall4.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 0
  });
  BABYLON.SceneLoader.ImportMesh('Box', '../assets/', 'box.babylon', Balltingo, function(newMeshes) {
    var box, boxClone, col, row, separate, x, y, z;
    box = newMeshes[0];
    x = -8;
    y = 1.9;
    z = -6;
    box.position = new BABYLON.Vector3(x, y, z);
    box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
      mass: 1000
    });
    row = 0;
    col = 0;
    separate = 2;
    while (row < 3) {
      while (col < 4) {
        z = z + 3;
        boxClone = box.clone("boxClone" + col);
        boxClone.position = new BABYLON.Vector3(x, y, z);
        boxClone.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
          mass: 1000
        });
        col++;
      }
      z = -6;
      x = x + 4;
      if (row < 2) {
        boxClone = box.clone("boxClone" + row);
        boxClone.position = new BABYLON.Vector3(x, y, z);
        boxClone.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
          mass: 1000
        });
      }
      col = 0;
      row++;
    }
  });
  data = {
    camera: camera,
    Balltingo: Balltingo,
    barra: barra,
    barraBody: barraBody,
    ball: ball,
    ballBody: ballBody,
    floor: floor,
    wall1: wall1,
    wall2: wall2,
    wall3: wall3,
    wall4: wall4,
    start: false,
    lostLife: false
  };
  return data;
};

renderAll = function(data, canvas, engine) {
  return engine.runRenderLoop(function() {
    var resetScene;
    if (data.lostLife === false) {
      move(data);
    } else {
      data.Balltingo.disablePhysicsEngine();
      data.barra.position = new BABYLON.Vector3(7.510099523162842, 1.1533535261154175, 0.12769986588954926);
      data.ball.position = new BABYLON.Vector3(6.1724, 1.3657924724578858, 0.1358);
      data.lostLife = false;
      resetScene = function() {
        return window.location.reload();
      };
      setTimeout(resetScene, 1000);
    }
    return data.Balltingo.render();
  });
};
