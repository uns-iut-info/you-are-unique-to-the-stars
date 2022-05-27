let platformMaterial;
let groundMaterial;
let wallMaterial;
let arrivalMaterial;
let bounceMaterial;

// creates all the nececessary materials for the different platforms
function createMaterials(scene) {
    platformMaterial = new BABYLON.StandardMaterial("platformMaterial", scene);
    platformMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    platformMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);

    groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0);

    wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0);
    wallMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0);

    arrivalMaterial = new BABYLON.StandardMaterial("arrivalMaterial", scene);
    arrivalMaterial.diffuseTexture = new BABYLON.Texture("images/arrival.jpg", scene);
    arrivalMaterial.emissiveColor = new BABYLON.Color3.White;

    bounceMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    bounceMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    bounceMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0.7);
}

// adds a trigger to make the sphere perform a big jump when it hits a bounce platform
function addBounceAction(bounce, scene, sphere) {
    bounce.actionManager = new BABYLON.ActionManager(scene);
    bounce.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                    mesh: sphere,
                    usePreciseIntersection: true
                }
            },
            function () {
                sphere.bounce();
            }
        )
    )
}


// adds a finish animation that will be triggered when the player touches an arrival platform
function addFinishAnimation(arrival, scene, sphere, nextLevel) {

    arrival.particleSystem = createParticleSystem(scene);
    setParticleSystemDefaultValues(arrival);

    // adds the trigger for the finish animation
    arrival.actionManager = new BABYLON.ActionManager(scene);
    arrival.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                    mesh: sphere,
                    usePreciseIntersection: true
                }
            },
            function () {
                // displays the finish animation
                arrival.particleSystem.start();
                setTimeout(() => {
                    arrival.particleSystem.stop();
                }, 1500);
                // loads the next level
                setTimeout(() => {
                    switch (nextLevel) {
                        case 2:
                            loadLevelTwo(scene, sphere);
                            break;
                        case 3:
                            loadLevelThree(scene, sphere);
                            break;
                        case 4:
                            loadLevelFour(scene, sphere);
                            break;
                        case -1:
                            break;
                    }
                }, 2500);
            }
        )
    )
}

// removes all the meshes from the scene except the sphere so the next level can be loaded
function clearMeshes(scene) {
    let index = 0;
    while (scene.meshes.length > 1) {
        if (scene.meshes[index].name != "player") {
            scene.meshes[index].dispose();
        }
        else {
            index = 1;
        }
    }
}

// loads the level one
function loadLevelOne(scene, sphere) {
    createGroundOne(scene);
    createPlatformsOne(scene, sphere);
}

//creates the ground of the level one
function createGroundOne(scene) {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 70, height: 15 }, scene);

    ground.material = groundMaterial;
    ground.position.x = 27;
    return ground;
}

//creates the platforms of the level one
function createPlatformsOne(scene, sphere) {

    let platformsPos = [
        { x: 13, y: 3 },
        { x: 26, y: 6.5 },
        { x: 39, y: 10 }
    ]

    let platform = new BABYLON.MeshBuilder.CreateBox("platform0", { height: 2, width: 6, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = platformsPos[0].x;
    platform.position.y = platformsPos[0].y;

    for (let i = 1; i < platformsPos.length; i++) {
        let instance = platform.createInstance("platform" + i);
        instance.position.x = platformsPos[i].x;
        instance.position.y = platformsPos[i].y;
    }

    let wall = new BABYLON.MeshBuilder.CreateBox("wall", { height: 13, width: 6, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 52;
    wall.position.y = 6.5;

    let arrival = new BABYLON.MeshBuilder.CreateBox("arrival", { height: 2, width: 6, depth: 2 }, scene);
    arrival.material = arrivalMaterial;
    arrival.position.x = 52;
    arrival.position.y = 14;
    addFinishAnimation(arrival, scene, sphere, 2);

}

// loads the level two
function loadLevelTwo(scene, sphere) {
    clearMeshes(scene);
    createGroundTwo(scene);
    createPlatformsTwo(scene, sphere);
    sphere.resetPos();
}

//creates the ground of the level two
function createGroundTwo(scene) {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 80, height: 15 }, scene);
    ground.position.x = 33;
    ground.material = groundMaterial;
    return ground;
}

//creates the platforms of the level two
function createPlatformsTwo(scene, sphere) {


    let mediumPlatformsPos = [
        { x: 25, y: 7 },
        { x: 37, y: 11 },
        { x: 28, y: 15 }
    ]

    let platform = new BABYLON.MeshBuilder.CreateBox("largePlatform", { height: 2, width: 6, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = 13;
    platform.position.y = 3;

    platform = new BABYLON.MeshBuilder.CreateBox("mediumPlatform0", { height: 2, width: 4, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = mediumPlatformsPos[0].x;
    platform.position.y = mediumPlatformsPos[0].y;


    for (let i = 1; i < mediumPlatformsPos.length; i++) {
        let instance = platform.createInstance("mediumPlatform" + i);
        instance.position.x = mediumPlatformsPos[i].x;
        instance.position.y = mediumPlatformsPos[i].y;
    }

    platform = new BABYLON.MeshBuilder.CreateBox("smallPlatform0", { height: 2, width: 2, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = 39;
    platform.position.y = 19;

    let instanceSmall = platform.createInstance("smallPlatform1");
    instanceSmall.position.x = 50;
    instanceSmall.position.y = 21;

    let wall = new BABYLON.MeshBuilder.CreateBox("wall", { height: 22, width: 6, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 64;
    wall.position.y = 11;

    let arrival = new BABYLON.MeshBuilder.CreateBox("arrival", { height: 2, width: 6, depth: 2 }, scene);
    arrival.material = arrivalMaterial;
    arrival.position.x = 64;
    arrival.position.y = 23;
    addFinishAnimation(arrival, scene, sphere, 3);
}


// loads the level three
function loadLevelThree(scene, sphere) {
    clearMeshes(scene);
    createGroundThree(scene);
    createPlatformsThree(scene, sphere);
    sphere.resetPos();
}

//creates the ground of the level three
function createGroundThree(scene) {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 120, height: 15 }, scene);
    ground.position.x = 55;
    ground.material = groundMaterial;
    return ground;
}

//creates the platforms of the level three
function createPlatformsThree(scene, sphere) {

    let platformsPos = [
        { x: 15, y: 3 },
        { x: 32, y: 6 },
        { x: 55, y: 7 },
        { x: 67, y: 3.5 },
        { x: 58, y: 14.5 },
        { x: 79, y: 10 },
        { x: 92, y: 13 }
    ]

    let platform = new BABYLON.MeshBuilder.CreateBox("platform0", { height: 2, width: 6, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = platformsPos[0].x;
    platform.position.y = platformsPos[0].y;

    for (let i = 1; i < platformsPos.length; i++) {
        let instance = platform.createInstance("platform" + i);
        instance.position.x = platformsPos[i].x;
        instance.position.y = platformsPos[i].y;
    }


    let wall = new BABYLON.MeshBuilder.CreateBox("wall0", { height: 11, width: 4, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 45;
    wall.position.y = 5.5;

    let bounce = new BABYLON.MeshBuilder.CreateBox("bounce", { height: 0.5, width: 2, depth: 2 }, scene);
    bounce.material = bounceMaterial;
    bounce.position.x = 92;
    bounce.position.y = 14.25;
    addBounceAction(bounce, scene, sphere);

    wall = new BABYLON.MeshBuilder.CreateBox("wall1", { height: 23, width: 8, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 107;
    wall.position.y = 11.5;

    let arrival = new BABYLON.MeshBuilder.CreateBox("arrival", { height: 2, width: 8, depth: 2 }, scene);
    arrival.material = arrivalMaterial;
    arrival.position.x = 107;
    arrival.position.y = 24;
    addFinishAnimation(arrival, scene, sphere, 4);
}

// loads the level four
function loadLevelFour(scene, sphere) {
    clearMeshes(scene);
    createGroundFour(scene);
    createPlatformsFour(scene, sphere);
    sphere.resetPos();
}

//creates the ground of the level four
function createGroundFour(scene) {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 136, height: 15 }, scene);
    ground.position.x = 60;
    ground.material = groundMaterial;
    return ground;
}


//creates the platforms of the level four
function createPlatformsFour(scene, sphere) {

    let largePlatformsPos = [
        { x: 59, y: 8 },
        { x: 74, y: 6 },
        { x: 85, y: 3 }
    ]

    let mediumPlatformsPos = [
        { x: 15, y: 3 },
        { x: 58, y: 35 },
        { x: 62, y: 29 },
        { x: 58, y: 23 },
        { x: 62, y: 17 },
        { x: 86, y: 10 }
    ]

    let smallPlatformsPos = [
        { x: 25, y: 6 },
        { x: 20, y: 18.5 },
        { x: 30, y: 22 },
        { x: 42, y: 34 },
        { x: 98, y: 14 },
        { x: 108, y: 18 }
    ]


    let platform = new BABYLON.MeshBuilder.CreateBox("largePlatform0", { height: 2, width: 6, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = largePlatformsPos[0].x;
    platform.position.y = largePlatformsPos[0].y;

    for (let i = 1; i < largePlatformsPos.length; i++) {
        let instance = platform.createInstance("largePlatform" + i);
        instance.position.x = largePlatformsPos[i].x;
        instance.position.y = largePlatformsPos[i].y;
    }

    platform = new BABYLON.MeshBuilder.CreateBox("mediumPlatform0", { height: 2, width: 4, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = mediumPlatformsPos[0].x;
    platform.position.y = mediumPlatformsPos[0].y;

    for (let i = 1; i < mediumPlatformsPos.length; i++) {
        let instance = platform.createInstance("mediumPlatform" + i);
        instance.position.x = mediumPlatformsPos[i].x;
        instance.position.y = mediumPlatformsPos[i].y;
    }

    platform = new BABYLON.MeshBuilder.CreateBox("smallPlatform0", { height: 2, width: 2, depth: 2 }, scene);
    platform.material = platformMaterial;
    platform.position.x = smallPlatformsPos[0].x;
    platform.position.y = smallPlatformsPos[0].y;

    for (let i = 1; i < smallPlatformsPos.length; i++) {
        let instance = platform.createInstance("smallPlatform" + i);
        instance.position.x = smallPlatformsPos[i].x;
        instance.position.y = smallPlatformsPos[i].y;
    }

    let bounce = new BABYLON.MeshBuilder.CreateBox("bounce0", { height: 0.5, width: 2, depth: 2 }, scene);
    bounce.material = bounceMaterial;
    bounce.position.x = 25;
    bounce.position.y = 7.25;
    addBounceAction(bounce, scene, sphere);

    let instanceBounce = bounce.createInstance("bounce1");
    instanceBounce.position.x = 30;
    instanceBounce.position.y = 23.25;
    addBounceAction(instanceBounce, scene, sphere);

    let wall = new BABYLON.MeshBuilder.CreateBox("wall0", { height: 36, width: 2, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 55;
    wall.position.y = 18;

    wall = new BABYLON.MeshBuilder.CreateBox("wall1", { height: 28, width: 2, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 65;
    wall.position.y = 30;

    wall = new BABYLON.MeshBuilder.CreateBox("wall2", { height: 20, width: 4, depth: 2 }, scene);
    wall.material = wallMaterial;
    wall.position.x = 119;
    wall.position.y = 10;

    let arrival = new BABYLON.MeshBuilder.CreateBox("arrival", { height: 2, width: 4, depth: 2 }, scene);
    arrival.material = arrivalMaterial;
    arrival.position.x = 119;
    arrival.position.y = 21;
    addFinishAnimation(arrival, scene, sphere, -1);
}