var control, destroyBox, move;

control = function(data) {
  var onKeyDown, onKeyUp;
  onKeyDown = function(event) {
    if (event.keyCode === 65) {
      data.barraBody.moveLeft = true;
      data.barraBody.moveRight = false;
    } else if (event.keyCode === 68) {
      data.barraBody.moveLeft = false;
      data.barraBody.moveRight = true;
    }
    if (event.keyCode === 32 && data.start === false) {
      data.ball.applyImpulse(new BABYLON.Vector3(-20, 0, 0), data.ball.position);
      data.start = true;
      data.lostLife = false;
      return data;
    }
  };
  onKeyUp = function(event) {
    data.barraBody.moveLeft = false;
    return data.barraBody.moveRight = false;
  };
  BABYLON.Tools.RegisterTopRootEvents([
    {
      name: "keydown",
      handler: onKeyDown
    }, {
      name: "keyup",
      handler: onKeyUp
    }
  ]);
  return data;
};

move = function(data) {
  var i, s;
  s = 2.5;
  i = 0;
  if (data.barraBody.moveLeft && data.barra.position.z > -5) {
    data.barra.applyImpulse(new BABYLON.Vector3(0, 0, -s), data.barra.position);
  } else if (data.barraBody.moveRight) {
    data.barra.applyImpulse(new BABYLON.Vector3(0, 0, s), data.barra.position);
  }
  data.barraBody.body.linearVelocity.scaleEqual(0.92);
  data.barraBody.body.angularVelocity.scaleEqual(0);
  if (data.barra.intersectsMesh(data.ball, false)) {
    data.ball.applyImpulse(new BABYLON.Vector3(-5, 0, 0), data.ball.position);
  }
  while (i < data.boxClone.length) {
    destroyBox(data.boxClone[i], data.ball);
    i++;
  }
  if (data.wall4.intersectsMesh(data.ball, false)) {
    data.start = false;
    data.lostLife = true;
  } else if (data.start === false) {
    data.start = false;
    data.lostLife = false;
  } else {
    data.start = true;
    data.lostLife = false;
  }
  return data;
};

destroyBox = function(box, ball) {
  if (box.intersectsMesh(ball, false)) {
    return setTimeout(function() {
      return box.dispose();
    }, 200);
  }
};
