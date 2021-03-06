var bGUI = bGUI || {};

(function() {
    "use strict";
    var GUISystem = function(scene, guiWidth, guiHeight) {
        this._scene = scene;
        var mainCam = scene.activeCamera;
        mainCam.layerMask -= bGUI.GUISystem.LAYER_MASK;
        if (this._scene.activeCameras.indexOf(mainCam) == -1) {
            this._scene.activeCameras.push(mainCam);
        }
        this.dpr = window.devicePixelRatio;
        if (typeof guiWidth === "undefined") {
            guiWidth = scene.getEngine().getRenderWidth();
        }
        if (typeof guiHeight === "undefined") {
            guiHeight = scene.getEngine().getRenderHeight();
        }
        this.zoom = Math.max(guiWidth, guiHeight) / Math.max(scene.getEngine().getRenderingCanvas().width, scene.getEngine().getRenderingCanvas().height);
        this._camera = null;
        this._initCamera();
        this._scene.activeCamera = mainCam;
        this._scene.cameraToUseForPointers = mainCam;
        this.objects = [];
        this.groups = [];
        this.visible = true;
    };
    GUISystem.prototype.getScene = function() {
        return this._scene;
    };
    GUISystem.prototype.getCamera = function() {
        return this._camera;
    };
    GUISystem.prototype._initCamera = function() {
        this._camera = new BABYLON.FreeCamera("GUICAMERA", new BABYLON.Vector3(0, 0, -30), this._scene);
        this._camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.layerMask = bGUI.GUISystem.LAYER_MASK;
        var width = this.dpr * this._scene.getEngine().getRenderingCanvas().width;
        var height = this.dpr * this._scene.getEngine().getRenderingCanvas().height;
        var right = width / this.dpr;
        var top = height / this.dpr;
        this._camera.orthoTop = top / 2;
        this._camera.orthoRight = right / 2;
        this._camera.orthoBottom = -top / 2;
        this._camera.orthoLeft = -right / 2;
        this.guiWidth = right;
        this.guiHeight = top;
        this._scene.activeCameras.push(this._camera);
    };
    GUISystem.prototype.dispose = function() {
        this.objects.forEach(function(p) {
            p.dispose();
        });
        this.objects = [];
        this.groups.forEach(function(g) {
            g.dispose();
        });
        this.groups = [];
        this._camera.dispose();
        this.getScene().activeCamera.layerMask += bGUI.GUISystem.LAYER_MASK;
    };
    GUISystem.prototype.add = function(mesh) {
        var p = new bGUI.GUIObject(mesh, this);
        this.objects.push(p);
        return p;
    };
    GUISystem.prototype.setVisible = function(bool) {
        this.visible = bool;
        this.objects.forEach(function(p) {
            p.setVisible(bool);
        });
    };
    GUISystem.prototype.isVisible = function() {
        return this.visible;
    };
    GUISystem.prototype.getObjectByName = function(name) {
        for (var o = 0; o < this.objects.length; o++) {
            if (this.objects[o].mesh.name === name) {
                return this.objects[o];
            }
        }
        return null;
    };
    GUISystem.prototype.getGroupByName = function(name) {
        for (var o = 0; o < this.groups.length; o++) {
            if (this.groups[o].name === name) {
                return this.groups[o];
            }
        }
        return null;
    };
    GUISystem.prototype.enableClick = function() {
        var _this = this;
        this._onPointerDown = function(evt) {
            var predicate = function(mesh) {
                return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasPickTriggers;
            };
            _this._scene._updatePointerPosition(evt);
            var pickResult = _this._scene.pick(_this._scene._pointerX, _this._scene._pointerY, predicate, false, _this.getCamera());
            if (pickResult.hit) {
                if (pickResult.pickedMesh.actionManager) {
                    pickResult.pickedMesh.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger, BABYLON.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
            }
        };
        this._onPointerUp = function(evt) {
            var predicate = function(mesh) {
                return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasPickTriggers;
            };
            _this._scene._updatePointerPosition(evt);
            var pickResult = _this._scene.pick(_this._scene._pointerX, _this._scene._pointerY, predicate, false, _this.getCamera());
            if (pickResult.hit) {
                if (pickResult.pickedMesh.actionManager) {
                    pickResult.pickedMesh.actionManager.processTrigger(BABYLON.ActionManager.OnPickUpTrigger, BABYLON.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
            }
        };
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this._scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", this._onPointerDown, false);
        this._scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up", this._onPointerUp, false);
    };
    GUISystem.prototype.disableClick = function() {
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this._scene.getEngine().getRenderingCanvas().removeEventListener(eventPrefix + "down", this._onPointerDown, false);
        this._scene.getEngine().getRenderingCanvas().removeEventListener(eventPrefix + "up", this._onPointerUp, false);
    };
    GUISystem.LAYER_MASK = 8;
    bGUI.GUISystem = GUISystem;
})();

var bGUI = bGUI || {};

(function() {
    var GUIObject = function(mesh, guiSystem) {
        this.mesh = mesh;
        this.guiSystem = guiSystem;
        this.onClick = null;
        this.mesh.actionManager = new BABYLON.ActionManager(mesh._scene);
        var _this = this;
        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(e) {
            if (_this.onClick) {
                _this.onClick(e);
            }
        });
        this.mesh.actionManager.registerAction(updateOnPointerUp);
        this.mesh.layerMask = bGUI.GUISystem.LAYER_MASK;
        this.guiSystem.objects.push(this);
        this.guiposition(BABYLON.Vector3.Zero());
    };
    GUIObject.prototype.guiposition = function(gp) {
        this.guiPosition = gp;
        this.mesh.position = new BABYLON.Vector3(gp.x / this.guiSystem.zoom - this.guiSystem.guiWidth / 2, this.guiSystem.guiHeight / 2 - gp.y / this.guiSystem.zoom, gp.z);
    };
    GUIObject.prototype.relativePosition = function(pos) {
        if (pos) {
            this.mesh.position.x = this.guiSystem.guiWidth * pos.x - this.guiSystem.guiWidth / 2;
            this.mesh.position.y = this.guiSystem.guiHeight * (1 - pos.y) - this.guiSystem.guiHeight / 2;
            this.mesh.position.z = pos.z;
        } else {
            return new BABYLON.Vector3((this.mesh.position.x + this.guiSystem.guiWidth / 2) / this.guiSystem.guiWidth, (this.guiSystem.guiHeight / 2 - this.mesh.position.y) / this.guiSystem.guiHeight, this.mesh.position.z);
        }
    };
    GUIObject.prototype.position = function(pos) {
        if (pos) {
            this.mesh.position = pos;
            this.guiPosition = new BABYLON.Vector3(this.guiSystem.guiWidth / 2 + pos.x, this.guiSystem.guiHeight / 2 + pos.y, pos.z);
        } else {
            return this.mesh.position;
        }
    };
    GUIObject.prototype.scaling = function(scale) {
        if (scale) {
            this.mesh.scaling = scale;
        } else {
            return this.mesh.scaling;
        }
    };
    GUIObject.prototype.dispose = function() {
        this.mesh.dispose();
    };
    GUIObject.prototype.setVisible = function(bool) {
        this.mesh.isVisible = bool;
    };
    GUIObject.prototype.flip = function(duration) {
        var end = this.mesh.rotation.y + Math.PI * 2;
        if (typeof duration === "undefined") {
            duration = 1e3;
        }
        BABYLON.Animation.CreateAndStartAnimation("flip", this.mesh, "rotation.y", 30, 30 * duration * .001, this.mesh.rotation.y, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    };
    bGUI.GUIObject = GUIObject;
})();

var bGUI = bGUI || {};

(function() {
    var GUIGroup = function(name, gui) {
        this.guiSystem = gui;
        this.name = name;
        this.elements = [];
        this.guiSystem.groups.push(this);
    };
    GUIGroup.prototype.setVisible = function(bool) {
        this.elements.forEach(function(e) {
            e.setVisible(bool);
        });
    };
    GUIGroup.prototype.add = function(guiElement) {
        this.elements.push(guiElement);
    };
    GUIGroup.prototype.dispose = function() {
        this.elements.forEach(function(e) {
            e.dispose();
        });
        this.elements = [];
    };
    GUIGroup.prototype.isVisible = function() {
        return this.elements.length != 0 ? this.elements[0].mesh.isVisible : false;
    };
    bGUI.GUIGroup = GUIGroup;
})();

var bGUI = bGUI || {};

(function() {
    var GUIPanel = function(name, texture, textureOnPress, guisystem) {
        bGUI.GUIObject.call(this, BABYLON.Mesh.CreatePlane(name, 1, guisystem.getScene()), guisystem);
        this.texture = texture;
        var textSize = this.texture.getBaseSize();
        if (textSize.width === 0) {
            textSize = this.texture.getSize();
        }
        this.texture.hasAlpha = true;
        var mat = new BABYLON.StandardMaterial(name + "_material", guisystem.getScene());
        mat.emissiveColor = BABYLON.Color3.White();
        mat.diffuseTexture = texture;
        mat.backFaceCulling = false;
        this.mesh.material = mat;
        this.mesh.scaling = new BABYLON.Vector3((textSize.width - .1) / guisystem.zoom, (textSize.height - .1) / guisystem.zoom, 1);
        this.texturePressed = textureOnPress;
        if (this.texturePressed) {
            this.texturePressed.hasAlpha = true;
        }
        var _this = this;
        var updateOnPick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
            if (_this.texturePressed) {
                _this.mesh.material.diffuseTexture = _this.texturePressed;
            }
        });
        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(e) {
            _this.mesh.material.diffuseTexture = _this.texture;
        });
        this.mesh.actionManager.registerAction(updateOnPick);
        this.mesh.actionManager.registerAction(updateOnPointerUp);
    };
    GUIPanel.prototype = Object.create(bGUI.GUIObject.prototype);
    GUIPanel.prototype.constructor = bGUI.GUIPanel;
    bGUI.GUIPanel = GUIPanel;
})();

var bGUI = bGUI || {};

(function() {
    var GUIText = function(name, width, height, options, guisystem) {
        var dynamicTexture = new BABYLON.DynamicTexture(name, {
            width: width,
            height: height
        }, guisystem.getScene(), true);
        var ctx = dynamicTexture.getContext();
        ctx.font = options.font;
        ctx.textBaseline = options.textBaseline || "middle";
        ctx.textAlign = options.textAlign || "start";
        ctx.direction = options.direction || "inherit";
        ctx.fillStyle = options.color || "#ffffff";
        this._ctx = ctx;
        var size = dynamicTexture.getSize();
        ctx.fillText(options.text, size.width / 2, size.height / 2);
        bGUI.GUIPanel.call(this, name, dynamicTexture, null, guisystem);
        dynamicTexture.update();
    };
    GUIText.prototype = Object.create(bGUI.GUIPanel.prototype);
    GUIText.prototype.constructor = GUIText;
    GUIText.prototype.update = function(text) {
        var size = this.texture.getSize();
        this._ctx.clearRect(0, 0, size.width, size.height);
        this._ctx.fillText(text, size.width / 2, size.height / 2);
        this.texture.update();
    };
    bGUI.GUIText = GUIText;
})();