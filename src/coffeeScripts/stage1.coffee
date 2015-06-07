loadScene1 = (canvas, engine)->
  BABYLON.SceneLoader.Load "", "../assets/balltingo.babylon", engine, (Balltingo) ->
    Balltingo.executeWhenReady (->
      Balltingo.enablePhysics(new BABYLON.Vector3(0,-1000,0), new BABYLON.OimoJSPlugin())
      world = OIMO.World()
      Balltingo.debugLayer.show(true)
      Balltingo.setGravity(0,-1000,0)
      data = setObjects(Balltingo)
      control(data)
      renderAll(data,canvas,engine)
      return
      ), (progress) ->
    return
  return

setObjects = (Balltingo) ->
  camera = Balltingo.getCameraByName("Camera")
  camera.cameraDirection = new BABYLON.Vector3(0.2, 0, 0)
  barra = Balltingo.getMeshByID("Bar")
  barraBody = barra.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor,{mass: 1000, friction: 0.00001, restitution:0.00001})
  barra.checkCollisions = true
  ball = Balltingo.getMeshByName("Ball")
  ballBody = ball.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor,{mass: 1, friction: 0.00001, restitution: 3})
  floor = Balltingo.getMeshByID("Floor")
  floor.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 0, restitution:0.00001})
  wall1 = Balltingo.getMeshByID("Wall1")
  wall1.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 0})
  wall2 = Balltingo.getMeshByID("Wall2")
  wall2.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 0})
  wall3 = Balltingo.getMeshByID("Wall3")
  wall3.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 0})
  wall4 = Balltingo.getMeshByID("Wall4")
  wall4.checkCollisions = true
  wall4.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 0})
  data = {
    camera: camera
    Balltingo: Balltingo
    barra: barra
    barraBody: barraBody
    ball: ball
    ballBody: ballBody
    floor: floor
    wall1: wall1
    wall2: wall2
    wall3: wall3
    wall4: wall4
    start: false
    lostLife: false
  }
  return data

renderAll= (data,canvas,engine) ->
  engine.runRenderLoop ->
    if data.lostLife == false
      move(data)
    else
      data.Balltingo.disablePhysicsEngine()
      data.barra.position = new BABYLON.Vector3(7.510099523162842,1.1533535261154175,0.12769986588954926)
      data.ball.position = new BABYLON.Vector3(6.1724,1.3657924724578858,0.1358)
      data.lostLife = false
      resetScene = ->
        window.location.reload()
      setTimeout resetScene,1000
    data.Balltingo.render()

