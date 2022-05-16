
//creates the ground
function createGround(scene) {
    let ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 120, height: 15 }, scene);
    ground.position.x = 55;
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0);
    ground.material = groundMaterial;
    return ground;
}

//creates the platforms of the level
function createPlatforms(scene, sphere) {
    let box = new BABYLON.MeshBuilder.CreateBox("platform1", { height: 2, width: 6, depth: 2 }, scene);
    let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 3.5;
    box.position.x = 15;

    box = new BABYLON.MeshBuilder.CreateBox("platform2", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 7;
    box.position.x = 30;


    box = new BABYLON.MeshBuilder.CreateBox("wall1", { height: 11, width: 4, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0);
    box.material = boxMaterial;
    box.position.y = 5.5;
    box.position.x = 45;


    box = new BABYLON.MeshBuilder.CreateBox("platform3", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 7;
    box.position.x = 55;


    box = new BABYLON.MeshBuilder.CreateBox("platform4", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 3.5;
    box.position.x = 67;


    box = new BABYLON.MeshBuilder.CreateBox("platform5", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 14.5;
    box.position.x = 58;


    box = new BABYLON.MeshBuilder.CreateBox("platform6", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 10;
    box.position.x = 79;


    box = new BABYLON.MeshBuilder.CreateBox("bounce1", { height: 0.5, width: 2, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0.7);
    box.material = boxMaterial;
    box.position.y = 14.25;
    box.position.x = 92;

    // adds a trigger to make the sphere perform a big jump when it hits this platform
    box.actionManager = new BABYLON.ActionManager(scene);
    box.actionManager.registerAction(
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


    box = new BABYLON.MeshBuilder.CreateBox("platform7", { height: 2, width: 6, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.7, 0, 0);
    box.material = boxMaterial;
    box.position.y = 13;
    box.position.x = 92;


    box = new BABYLON.MeshBuilder.CreateBox("wall2", { height: 23, width: 8, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0);
    box.material = boxMaterial;
    box.position.y = 11.5;
    box.position.x = 107;

    box = new BABYLON.MeshBuilder.CreateBox("arrival", { height: 2, width: 8, depth: 2 }, scene);
    boxMaterial = new BABYLON.StandardMaterial("arrivalMaterial", scene);
    boxMaterial.diffuseTexture = new BABYLON.Texture("images/arrival.jpg", scene);
    boxMaterial.emissiveColor = new BABYLON.Color3.White;
    box.material = boxMaterial;
    box.position.y = 24;
    box.position.x = 107;

    // adding a finish animation that will be triggered when the player touches this platform
    box.particleSystem = createParticleSystem(scene);
    setParticleSystemDefaultValues(box);

    // adding the trigger for the finish animation
    box.actionManager = new BABYLON.ActionManager(scene);
    box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                    mesh: sphere,
                    usePreciseIntersection: true
                }
            },
            function () {
                box.particleSystem.start();
                setTimeout(() => {
                    box.particleSystem.stop();
                }, 1500);
            }
        )
    )
}