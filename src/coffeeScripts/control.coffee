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


###waitSound = (sound, data.waitSound) ->
  if data.waitSound == false
    data.waitSound = true
    sound.play()
  if data.waitSound == true
    setTimeout(()->
      data.waitSound = false
    ,1000)###


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
    data.points = destroyBox(data.Balltingo, data.boxClone[i],data.ball, data.points, data.waitSoundExploit)
    i++

  if data.barra.intersectsMesh(data.ball, false)
    hitBallBar = new BABYLON.Sound("Hit ball with bar","../assets/hitballbar.mp3", data.Balltingo, ()->
      if data.waitSoundBar == false
        data.waitSoundBar = true
        hitBallBar.play()
      if data.waitSoundBar == true
        setTimeout(()->
          data.waitSoundBar = false
        ,600)
    , { volume: 0.7})

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



createPhantomBox = (Balltingo, box) ->
  phantomBox = new BABYLON.Mesh.CreateBox("mesh", 3, Balltingo)
  phantomBox.position = box.position
  phantomBox.scaling = box.scaling
  phantomBox.visibility = 0
  console.log(box.scaling)
  material = new BABYLON.StandardMaterial("transparent", Balltingo)
  material.alpha = 0
  phantomBox.material = material
  return phantomBox


fireBox = (Balltingo, phanthomBox, box) ->
  fire = new BABYLON.ParticleSystem("fire" + box.name, 2000, Balltingo)
  fire.particleTexture = new BABYLON.Texture("../assets/fire.png", Balltingo)
  fire.emitter = phanthomBox
  fire.minEmitBox = new BABYLON.Vector3(-1, 0, 0)
  fire.maxEmitBox = new BABYLON.Vector3(1, 0, 0)
  fire.color1 = new BABYLON.Color4(0.82, 0.62, 0.13, 1.0)
  fire.color2 = new BABYLON.Color4(0.29, 0.31, 1.0, 0.8)
  fire.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)
  fire.minSize = 0.1
  fire.maxSize = 0.3
  fire.minLifeTime = 0.2
  fire.maxLifeTime = 0.5
  fire.emitRate = 2000
  fire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE
  fire.gravity = new BABYLON.Vector3(0, -9.81, 0)
  fire.direction1 = new BABYLON.Vector3(1, 8, 3)
  fire.direction2 = new BABYLON.Vector3(-2, 8, -4)
  fire.minAngularSpeed = 0
  fire.maxAngularSpeed = Math.PI
  fire.minEmitPower = 1
  fire.maxEmitPower = 4
  fire.updateSpeed = 0.005
  fire.start()
  setTimeout(()->
    fire.stop()
    phanthomBox.dispose()
  ,800)
  return fire

destroyBox = (Balltingo, box, ball, points, waitSoundExploit) ->
  if box.intersectsMesh(ball, false)
    if box.isDisposed() == false and box.checkCollisions == true
      ball.applyImpulse(new BABYLON.Vector3(-5,0,0),ball.position)
      box.checkCollisions = false
      points = points + 50
      $('.score').text(' ' + points)
      phantomBox = createPhantomBox(Balltingo, box)
      fire = fireBox(Balltingo, phantomBox, box)
      exploit = new BABYLON.Sound("exploit box","../assets/exploit.mp3", Balltingo, ()->
        if waitSoundExploit == false
          waitSoundExploit = true
          exploit.play()
        if waitSoundExploit == true
          setTimeout(()->
            waitSoundExploit = false
          ,600)
      , { volume: 0.7})
    setTimeout(()->
      box.dispose()
    ,50)
  return points