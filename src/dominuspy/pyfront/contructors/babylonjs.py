from browser import window
from javascript import JSConstructor


class Babylon:

    @staticmethod
    def startbabylon():
        babylon = window.BABYLON
        return babylon

    @staticmethod
    def enginec(babylon, canvas):
        enginec = JSConstructor(babylon.Engine)
        engine = enginec(canvas, True)
        return engine

    @staticmethod
    def scenec(babylon, engine):
        scenec = JSConstructor(babylon.Scene)
        scene = scenec(engine)
        return scene

    @staticmethod
    def vector3c(babylon):
        vector3 = JSConstructor(babylon)
        return vector3

    @staticmethod
    def vector3zeroc(babylon):
        vector3zero = JSConstructor(babylon.Vector3.Zero)
        return vector3zero

    @staticmethod
    def freecamerac(babylon, name, position, scene):
        camerac = JSConstructor(babylon.FreeCamera)
        camera = camerac(name, position, scene)
        return camera

    @staticmethod
    def hemic(babylon, name, position, scene):
        hemic = JSConstructor(babylon.HemisphericLight)
        hemi = hemic(name, position, scene)
        return hemi

    @staticmethod
    def loadscene(babylon, meshes, path, engine, tasks):
        load = JSConstructor(babylon.SceneLoader.Load)
        load(meshes, path, engine, tasks)

