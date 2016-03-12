/// <reference path="./defs/jquery/jquery.d.ts" />

/// <reference path="./defs/hammer/hammer.d.ts" />

/// <reference path="./assetManager.ts" />
/// <reference path="./gameObject.ts" />
/// <reference path="./gameScreen.ts" />
/// <reference path="./settingsScreen.ts" />
/// <reference path="./playScreen.ts" />

/// <reference path="./loadingScreen.ts" />
/// <reference path="./startScreen.ts" />
/// <reference path="./threeItem.ts" />
/// <reference path="./controls.ts" />
/// <reference path="./fallingItem.ts" />

import * as Hammer from "hammerjs";
import * as THREE from "three";
import * as $ from "jquery";


import AssetManager = require("./assetManager");
import GameObject = require("./gameObject");
import GameScreen = require("./gameScreen");
import SettingsScreen = require("./settingsScreen");
import CreditsScreen = require("./creditsScreen");
import StartScreen = require("./startScreen");
import LoadingScreen = require("./loadingScreen");
import PlayScreen = require("./playScreen");

import Candy = require("./candy");
import Controls = require("./controls");
import FallingItem = require("./fallingItem");

export class Game {
    gameObject;   // game object
    screens = {
            playScreen: null,
            loadingScreen: null,
            startScreen: null,
            settingsScreen: null,
            creditsScreen: null
        };

    // clock;

    xPositions = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    numBlocksOnPlayfield = 10;
    numBlocksAcrossScene = 20;
    blockWidth = 10;

    constructor() {
        // console.log("constructing game");
    }

    createGame() {
        alert("game created");
        GameScreen.Screen.init();
        this.gameObject = new GameObject.Game(GameScreen.Screen.getWidth(), GameScreen.Screen.getHeight());
        this.blockWidth = Math.floor(GameScreen.Screen.getWidth() / this.numBlocksAcrossScene);

        // load the loading screen first, and pass it a callback that loads and creates everything else
        this.screens.loadingScreen = new LoadingScreen.LoadingScreen({
            name: "loadingScreen",
            overlay: "loadingOverlay",
            // order: 1,
            blockWidth: this.blockWidth,
            screenDim : {
                width: GameScreen.Screen.getWidth(),
                height: GameScreen.Screen.getHeight()
            },
            nextScreen: this.screens.playScreen
        }, this.doPreloadAndCreateScreens.bind(this));

        // show the loading screen
        GameScreen.Screen.setCurrentcreen(this.screens.loadingScreen);
        let self = this;
        // render loop
        let render = function() {

            requestAnimationFrame(render);
            Candy.Candy.update(self.gameObject.clock.getDelta(), self.gameObject.clock.getElapsedTime());

            switch (GameScreen.Screen.getCurrentScreen().name) {
                case "playScreen":
                    if (FallingItem.FallingItem.getNumFallingItemsMoving() <= 0) {
                        self.createFallingItem();
                    }
                    break;
                case "loadingScreen":
                    self.screens.loadingScreen.update(self.gameObject.clock.getDelta(), self.gameObject.clock.getElapsedTime());
                break;
            };

            self.gameObject.render(GameScreen.Screen.getCurrentScreen());
            // kill a random FallingItem to test if FallingItems drop after the one under them is removed from the screen
            // FallingItem.FallingItem.killRandom();
        };
        render();
    };


    // do all the presload tasks (create screens, objects, etc.)
     doPreloadAndCreateScreens() {
         // let self = this;
        AssetManager.AssetManager.loadAssets(this,
            function(context, numberAssets) {    // asset loaded initialization function
                console.log(numberAssets + " assets");

                // the loading screen progress bar will increment for each asset and each of the screens
                context.screens.loadingScreen.initProgressBar(numberAssets + (Object.keys(context.screens).length - 1));
            },
            function(context) {    // called when each asset is loaded (onProgress)
                context.screens.loadingScreen.updateProgress(1);
            },
            function(context) {    // coalled at on complete
                console.log("finished");
                // create the screens
                context.screens.playScreen = new PlayScreen.PlayScreen({
                    name: "playScreen",
                    overlay: "playScreenOverlay",
                    order: 1,
                    blockWidth: context.blockWidth,
                    prevScreen: context.screens.loadingScreen
                });
                context.screens.loadingScreen.updateProgress(1);
                context.screens.startScreen = new StartScreen.StartScreen({
                    name: "startScreen",
                    overlay: "startOverlay",
                    order: 0,
                    blockWidth: context.blockWidth
                });
                context.screens.loadingScreen.updateProgress(1);
                context.screens.settingsScreen = new SettingsScreen.SettingsScreen({
                    name: "settingsScreen",
                    overlay: "settingsOverlay",
                    // order: 4,
                    blockWidth: context.blockWidth
                });
                context.screens.loadingScreen.updateProgress(1);

                context.screens.creditsScreen = new CreditsScreen.CreditsScreen({
                    name: "creditsScreen",
                    overlay: "creditsOverlay",
                    // order: 4,
                    blockWidth: context.blockWidth
                });
                context.screens.loadingScreen.updateProgress(1);

                // set up the next and prev screens for the individual screens
                context.screens.loadingScreen.nextScreen = context.screens.playScreen;
                context.screens.playScreen.prevScreen = context.screens.loadingScreen;
            });
    }

    createFallingItem() {
        let min = 0; // left bound
        let max = this.xPositions.length;  // right bound
        // get random number between them
        let xPos = this.blockWidth * this.xPositions[Math.floor(Math.random() * (max - min) + min)];

        // console.log(xPos);
        let candy = new Candy.Candy(
            {
                width: this.blockWidth, height: this.blockWidth, depth: this.blockWidth,
                x: xPos,
                y: 20 * this.blockWidth,
                name: "candy",
                screen: this.screens.playScreen,
                customMaterial: true
            });

        this.screens.playScreen.add(candy);
    }
}