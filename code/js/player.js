// vars for handling inputs
let inputStates = {
        left : false,
        right : false,
        up : false,
        //space : false
};

// different directions used for player movements
const direction = {
    right: new BABYLON.Vector3(1, 0, 0),
    left: new BABYLON.Vector3(-1, 0, 0),
    up: new BABYLON.Vector3(0, 1, 0),
    down: new BABYLON.Vector3(0, -1, 0)
};

// creates the sphere that will be controlled by the player
function createSphere(scene) {
    let sphere = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 2, segments: 32 }, scene);
    let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.emissiveColor = new BABYLON.Color3(0, 0.2, 1);
    sphere.material = sphereMaterial;
    sphere.position.y = 1;
    sphere.isPickable = false;
    sphere.moveSpeed = 0;
    sphere.jumpSpeed = 0;
    sphere.gravity = 0.01;
    sphere.maxJumpSpeed = 0.3;
    sphere.maxBounceJumpSpeed = 0.5;
    sphere.jumping = false;


    // handles sphere movements using player inputs
    sphere.move = () => {

        //moves the sphere
        sphere.position.x += sphere.moveSpeed;

        // the player tries to jump
        if (inputStates.up && !sphere.jumping) {
            if (checkIfCanJump(sphere)) {
                sphere.jumpSpeed = sphere.maxJumpSpeed;
                sphere.jumping = true;
            }
        }
        // the player tries to move left
        if (inputStates.left && !inputStates.right) {
            let dist = checkIfCanMove(sphere, direction.left)
            if (dist == -1) {
                sphere.moveSpeed = -0.25;
            }
            else {
                sphere.moveSpeed = -dist;
            }

        }
        // the player tries to move right
        if (inputStates.right && !inputStates.left) {
            let dist = checkIfCanMove(sphere, direction.right)
            if (dist == -1) {
                sphere.moveSpeed = 0.25;
            }
            else {
                sphere.moveSpeed = dist;
            }
        }


        // detects if the player is getting off a platform
        if (((inputStates.right && !inputStates.left) || (inputStates.left && !inputStates.right)) && !sphere.jumping) {
            if (checkIfCanMove(sphere, direction.down) == -1) {
                sphere.jumping = true;
            }
        }

        // the player doesn't try to move left or right or tries both at the same time => the sphere stops
        if ((!inputStates.right && !inputStates.left) || (inputStates.left && inputStates.right)) {
            sphere.moveSpeed = 0;
        }


        // the sphere is jumping (= jumping + falling)
        if (sphere.jumping) {
            //jumping phase
            if (sphere.jumpSpeed > 0) {
                let dist = checkIfCanMove(sphere, direction.up)
                //the sphere keeps going up
                if (dist == -1) {
                    sphere.position.y += sphere.jumpSpeed;
                    sphere.jumpSpeed -= sphere.gravity;
                }
                // the sphere hit something above it => it stops going up
                else {
                    if (dist > 0) {
                        sphere.position.y += dist;
                        sphere.jumpSpeed = 0;
                    }

                }
            }
            //falling phase
            else {
                let dist = checkIfCanMove(sphere, direction.down)
                //the sphere keeps going down
                if (dist == -1) {
                    sphere.position.y += sphere.jumpSpeed;
                    sphere.jumpSpeed -= sphere.gravity;
                    if (sphere.jumpSpeed <= -sphere.maxJumpSpeed) {
                        sphere.jumpSpeed = -sphere.maxJumpSpeed;
                    }
                }
                //the sphere hit something under it => it stops going down
                else {
                    if (dist > 0) {
                        sphere.jumpSpeed = -dist;
                        sphere.position.y += sphere.jumpSpeed;
                        sphere.jumping = false;
                    }

                }

            }


        }
    }

    // initiates a big jump
    sphere.bounce = () => {
        sphere.jumpSpeed = sphere.maxBounceJumpSpeed;
        sphere.jumping = true;
    }
    return sphere;
}


// checks if the sphere can jump <=> touches the ground or the top of a platform
function checkIfCanJump(sphere) {
    let origin = sphere.position;
    let length = 1.01;
    let ray = new BABYLON.Ray(origin, direction.down, length);
    let pickInfo = scene.pickWithRay(ray);
    return pickInfo.hit;
}

// checks if the sphere can move <=> is not blocked by the environment
function checkIfCanMove(sphere, dir) {
    let origin = sphere.position;
    let length = 1;
    let rays = [];
    switch (dir) {
        // creates 3 horizontal rays (at the top, middle and bottom of the sphere) that will look for obstacles on the left or the right of the sphere
        case direction.left:
        case direction.right:
            length += Math.abs(sphere.moveSpeed);
            rays[0] = new BABYLON.Ray(origin, dir, length);
            rays[1] = new BABYLON.Ray(new BABYLON.Vector3(origin.x, origin.y - 0.99), dir, length);
            rays[2] = new BABYLON.Ray(new BABYLON.Vector3(origin.x, origin.y + 0.99), dir, length);
            break;

        // creates 3 vertical rays (on the left, middle and right of the sphere) that will look for obstacles above or below the sphere
        case direction.up:
        case direction.down:
            length += Math.abs(sphere.jumpSpeed);
            rays[0] = new BABYLON.Ray(origin, dir, length);
            rays[1] = new BABYLON.Ray(new BABYLON.Vector3(origin.x - 0.99, origin.y), dir, length);
            rays[2] = new BABYLON.Ray(new BABYLON.Vector3(origin.x + 0.99, origin.y), dir, length);
    }

    let rayHelpers = [];
    let pickInfo;

    // each ray will try to detect if the sphere is about to collide with something
    for (let i = 0; i < rays.length; i++) {
        /*rayHelpers[i] = new BABYLON.RayHelper(rays[i]);
        rayHelpers[i].show(scene, new BABYLON.Color3.Red);
        setTimeout(() => {
            rayHelpers[i].hide(rays[i]);
        }, 50);*/
        pickInfo = scene.pickWithRay(rays[i]);

        // the current ray detected something
        if (pickInfo.hit) {
            console.log("ray " + i + " : " + pickInfo.distance);
            console.log(pickInfo.pickedMesh.name)
            return pickInfo.distance - 1;
        }
    }

    // nothing has been detected by the rays
    return -1;
}

// detects if a key is pressed or released and if it's handled, updates the correponding inputState 
function modifySettings() {

    //if a handled key is pressed, sets the corresponding inputState to true 
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            inputStates.right = true;
        }/* else if (event.key === " ") {
            inputStates.space = true;
        }*/
    }, false);

    //if a handled key is released, sets the corresponding inputState to false
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            inputStates.right = false;
        }/* else if (event.key === " ") {
            inputStates.space = false;
        }*/
    }, false);
}