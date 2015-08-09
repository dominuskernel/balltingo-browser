control= (data) ->
  onKeyDown = (event) ->
    if event.keyCode == 65
      data.barraBody.moveLeft = true
      data.barraBody.moveRight = false
    else if event.keyCode == 68
      data.barraBody.moveLeft = false
      data.barraBody.moveRight = true
    if event.keyCode == 32 and data.start == false
      data.ball.applyImpulse(new BABYLON.Vector3(-20,0,0),data.ball.position)
      data.start = true
      data.lostLife = false
      return data


  onKeyUp = (event) ->
    data.barraBody.moveLeft = false
    data.barraBody.moveRight = false


  BABYLON.Tools.RegisterTopRootEvents([
    {
      name: "keydown"
      handler: onKeyDown
    }
    {
      name: "keyup"
      handler: onKeyUp
    }
  ])
  return data

move = (data) ->
  s= 2.5
  i= 0
  if data.barraBody.moveLeft && data.barra.position.z > -5
    data.barra.applyImpulse(new BABYLON.Vector3(0,0,-s),data.barra.position)
  else if data.barraBody.moveRight
    data.barra.applyImpulse(new BABYLON.Vector3(0,0,s),data.barra.position)
  data.barraBody.body.linearVelocity.scaleEqual(0.92)
  data.barraBody.body.angularVelocity.scaleEqual(0)
  if data.barra.intersectsMesh(data.ball,false)
    data.ball.applyImpulse(new BABYLON.Vector3(-5,0,0),data.ball.position)
  while i < data.boxClone.length
    data.points = destroyBox(data.Balltingo, data.boxClone[i],data.ball, data.points)
    i++
  if data.wall4.intersectsMesh(data.ball,false)
    data.start = false
    data.lostLife = true
  else if data.start == false
    data.start = false
    data.lostLife = false
  else
    data.start = true
    data.lostLife = false
  return data

fireBox = (Balltingo, box) ->
  fire = new BABYLON.ParticleSystem("fire" + box.name, 2000, Balltingo)
  fire.particleTexture = new BABYLON.Texture("../assets/fire.png", Balltingo)
  fire.emitter = box
  fire.minEmitBox = new BABYLON.Vector3(-1, 0, 0)
  fire.maxEmitBox = new BABYLON.Vector3(1, 0, 0)
  fire.color1 = new BABYLON.Color4(0.82, 0.62, 0.13, 1.0)
  fire.color2 = new BABYLON.Color4(0.29, 0.31, 1.0, 0.8)
  fire.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)
  fire.minSize = 0.1
  fire.maxSize = 0.3
  fire.minLifeTime = 0.5
  fire.maxLifeTime = 2
  fire.emitRate = 2000
  fire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE
  fire.gravity = new BABYLON.Vector3(0, -9.81, 0)
  fire.direction1 = new BABYLON.Vector3(1, 8, 3)
  fire.direction2 = new BABYLON.Vector3(-1, 8, -3)
  fire.minAngularSpeed = 0
  fire.maxAngularSpeed = Math.PI
  fire.minEmitPower = 3
  fire.maxEmitPower = 8
  fire.updateSpeed = 0.005
  fire.start()
  setTimeout(()->
    fire.stop()
  ,300)
  return fire

destroyBox = (Balltingo, box, ball, points) ->
  if box.intersectsMesh(ball, false)
    if box.isDisposed() == false and box.checkCollisions == true
      box.checkCollisions = false
      points = points + 50
      $('.score').text(' ' + points)
      fire = fireBox(Balltingo, box)
    setTimeout(()->
      box.dispose()
    ,200)
  return points