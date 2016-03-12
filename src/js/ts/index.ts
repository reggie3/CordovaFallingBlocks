import Game = require("./game");

export class Application {

    static game;


    static initialize() {
        console.log("creating app");
        Application.game = new Game.Game();
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            alert("mobile");
            document.addEventListener("deviceready", Application.onDeviceReady, false);
        } else {
            alert("browser");
            Application.onDeviceReady();
        }
    }

    static onDeviceReady() {
        alert("on device ready called");
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", Application.onPause, false);
        document.addEventListener("resume", Application.onResume, false);

        console.log("creating game");
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        Application.game.createGame();
    }

    static onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    static onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
}

window.onload = function () {
    Application.initialize();
};