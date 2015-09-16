var loadScene1, renderAll, setObjects;

loadScene1 = function(canvas, engine) {
  BABYLON.SceneLoader.Load("", "../assets/balltingo.babylon", engine, function(Balltingo) {
    Balltingo.executeWhenReady((function() {
      var world;
      Balltingo.enablePhysics(new BABYLON.Vector3(0, -1000, 0), new BABYLON.OimoJSPlugin());
      world = OIMO.World();
      Balltingo.setGravity(0, -1000, 0);
      setObjects(Balltingo);
    }), function(progress) {});
  });
};

setObjects = function(Balltingo) {
  var ball, ballBody, barra, barraBody, boxes, camera, floor, wall1, wall2, wall3, wall4;
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
  boxes = new BABYLON.SceneLoader.ImportMesh('Box', '../assets/', 'box.babylon', Balltingo, function(newMeshes) {
    var box, boxClone, col, data, i, lifes, points, row, separate, waitSoundBar, waitSoundExploit, waitSoundWall, x, y, z;
    box = newMeshes[0];
    x = -8;
    y = 1.9;
    z = -6;
    box.position = new BABYLON.Vector3(x, y, z);
    box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
      mass: 1000
    });
    box.checkCollisions = true;
    row = 0;
    boxClone = [];
    col = 0;
    i = 0;
    separate = 2;
    points = 0;
    lifes = 3;
    waitSoundWall = false;
    waitSoundBar = false;
    waitSoundExploit = false;
    $('.score').text(' ' + points);
    $('.lifes').text(' ' + lifes);
    while (row < 3) {
      while (col < 4) {
        z = z + 3;
        boxClone[i] = box.clone("boxClone" + col);
        boxClone[i].position = new BABYLON.Vector3(x, y, z);
        boxClone[i].setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
          mass: 1000
        });
        boxClone[i].checkCollisions = true;
        col++;
        i++;
      }
      z = -6;
      x = x + 4;
      if (row < 2) {
        boxClone[i] = box.clone("boxClone" + row);
        boxClone[i].position = new BABYLON.Vector3(x, y, z);
        boxClone[i].setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
          mass: 1000
        });
        boxClone[i].checkCollisions = true;
      }
      col = 0;
      row++;
      i++;
    }
    i = 0;
    boxClone.push(box);
    data = {
      waitSoundWall: waitSoundWall,
      waitSoundBar: waitSoundBar,
      waitSoundExploit: waitSoundExploit,
      camera: camera,
      Balltingo: Balltingo,
      ball: ball,
      ballBody: ballBody,
      barra: barra,
      barraBody: barraBody,
      boxClone: boxClone,
      floor: floor,
      lifes: lifes,
      points: points,
      wall1: wall1,
      wall2: wall2,
      wall3: wall3,
      wall4: wall4,
      start: false,
      lostLife: false
    };
    control(data);
    renderAll(data, canvas, engine);
  });
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
