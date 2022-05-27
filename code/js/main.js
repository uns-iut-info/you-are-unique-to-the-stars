let canvas;
let engine;
let scene;

window.onload = startGame;

window.addEventListener("resize", () => {
    engine.resize()
});

// starts the game
function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    modifySettings();

    let sphere = scene.getMeshByName("player");

    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime();

        sphere.move();

        scene.render();
    });

}