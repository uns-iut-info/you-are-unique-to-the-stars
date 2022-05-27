
//creates the scene of the game
function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    // defines the background color
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);

    let sphere = createSphere(scene);

    createMaterials(scene);
    loadLevelOne(scene, sphere);

    createFollowCamera(scene, sphere);
    createLight(scene);

    return scene;
}

// creates the camera that will follow the player
function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 1, -20), scene);
    camera.radius = 25;
    camera.lockedTarget = target;
    camera.heightOffset = 1;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.1;
    camera.inputs.clear();
    camera.attachControl(canvas);

    return camera;
}

// adds light to the scene
function createLight(scene) {
    let light = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(5, 1, 0), scene);
    light.intensity = 0.3;
    // defines the color of the light
    light.diffuse = new BABYLON.Color3(1, 1, 1);
}

// creates a particle system that will triggered at the end of a level
function createParticleSystem(scene) {
    // creates the particle system
    var particleSystem = new BABYLON.ParticleSystem(
        "particles",
        2000,
        scene
    );

    // defines the texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture(
        "images/flare.png",
        scene
    );
    return particleSystem;
}

// defines how the particle system will look
function setParticleSystemDefaultValues(target) {
    let particleSystem = target.particleSystem;

    // where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(target.position.x, target.position.y + 2, target.position.z);

    // colors of all particles RGBA
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0, 0, 1, 1.0);

    // number of particles emitted per second
    particleSystem.emitRate = 100;

    // gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -15, 0);

    // direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-4, 5, 0);
    particleSystem.direction2 = new BABYLON.Vector3(4, 5, 0);

    // speed of the particles
    particleSystem.minEmitPower = 2;
    particleSystem.maxEmitPower = 4;

    // size of each particle (random between...)
    particleSystem.minSize = 0.4;
    particleSystem.maxSize = 0.8;
}