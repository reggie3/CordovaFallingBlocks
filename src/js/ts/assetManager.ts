/// <reference path="./defs/three/three.d.ts" />
/// <reference path="./defs/lodash/lodash.d.ts" />
/// <reference path="./defs/howler/howler.d.ts" />

import * as _ from "lodash";
import * as THREE from "three";
import * as Howl from "howler";

export class AssetManager {

    static imgPath = "./myassets/graphics/";
    static soundPath = "./myassets/sounds/";
    static threeFontPath = "./myassets/threeTypefaces/";
    static assets = {
        leftButton: {type: "texture", source: AssetManager.imgPath + "buttonLeft.png", tag: "buttonLeft"},
        downButton: {type: "texture", source: AssetManager.imgPath + "buttonDown.png", tag: "buttonDown"},
        rightButton: {type: "texture", source: AssetManager.imgPath + "buttonRight.png", tag: "buttonRight"},
        btnRed: {type: "texture", source: AssetManager.imgPath + "btnRed.png", tag: "btnRed", material: null},
        btnCyan: {type: "texture", source: AssetManager.imgPath + "btnCyan.png", tag: "btnCyan", material: null},
        btnPurple: {type: "texture", source: AssetManager.imgPath + "btnPurple.png", tag: "btnPurple", material: null},
        gentilis_bold: {type: "threeFont", source: AssetManager.threeFontPath + "gentilis_bold" + ".typeface.js", font: null},
        gentilis_regular: {type: "threeFont", source: AssetManager.threeFontPath + "gentilis_regular" + ".typeface.js", font: null},
        helvetiker_bold: {type: "threeFont", source: AssetManager.threeFontPath + "helvetiker_bold" + ".typeface.js", font: null},
        helvetiker_regular: {type: "threeFont", source: AssetManager.threeFontPath + "helvetiker_regular" + ".typeface.js", font: null},
        optimer_bold: {type: "threeFont", source: AssetManager.threeFontPath + "optimer_bold" + ".typeface.js", font: null},
        optimer_regular: {type: "threeFont", source: AssetManager.threeFontPath + "optimer_regular" + ".typeface.js", font: null},
        blueProgressBar: {type: "texture", source: AssetManager.imgPath + "bluebar.jpg", material: null},
        bkgLoading: {type: "texture", source: AssetManager.imgPath + "bkgLoadingScreen.jpg", material: null},
        switch: {type: "sound", source: AssetManager.soundPath + "218115__mastersdisaster__switch-on-livingroom.wav", soundSprite: null},
        click: {type: "sound", source: AssetManager.soundPath + "Click2-Sebastian-759472264.mp3", soundSprite: null},
        snap: {type: "sound", source: AssetManager.soundPath + "177496__snapper4298__snap-1.wav", soundSprite: null},
        glassClink: {type: "sound", source: AssetManager.soundPath + "2_small_glass_bowls_stack.mp3", soundSprite: null},
        bounce: {type: "sound", source: AssetManager.soundPath + "large_balloon_bounce_002.mp3", soundSprite: null}
    };
    static numAssetsToLoad = 0;
    static numAssetsLoaded = 0;
    static image = {};
    static sounds = {};
    static onProgress;
    static onComplete;
    static allAssetsLoaded = false;
    static context;     // this is the context that this function is called from, it will act like "this" in the callback functions

    constructor() {

    }

    static loadAssets(context, onInit, onProgress, onComplete) {
        AssetManager.onProgress = onProgress;
        AssetManager.onComplete = onComplete;

        // set the context to be used by the callback function
        AssetManager.context = context;

        // send the total number of items that need to be loaded
        onInit(context, Object.keys(AssetManager.assets).length);

        _.forEach(AssetManager.assets, function(asset, key){
            switch (asset.type) {
                case "texture":
                    AssetManager.loadTexture (asset);
                    break;
                case "threeFont":
                    AssetManager.loadThreeFont(asset);
                    break;
                case "sound":
                    AssetManager.loadSound(asset);
                    break;
            }
            // console.log(value.source);
            // this.loadImage(value);
            // this.loadSounds(value);
            AssetManager.numAssetsToLoad ++;
        });
        // {
        //     if (AssetManager.myassets.hasOwnProperty(asset)) {
        //         console.log(AssetManager.myassets.source)
        //     }
        // }
        return {};
    }

    static loadSound(asset) {
        asset.soundSprite = new Howl.Howl({
            urls: [asset.source]
        });
        AssetManager.assetLoaded();
    }

    static loadTexture(asset) {
        let loader = new THREE.TextureLoader();
        asset.texture = loader.load(
            asset.source,
            // Function when resource is loaded
            function(texture) {
                // do something with the texture
                asset.texture = texture;
                asset.material = new THREE.MeshBasicMaterial({
                    map: texture
                });
                AssetManager.assetLoaded();
            }
        );
    }

    static loadThreeFont(asset) {
        let loader = new THREE.FontLoader();
        loader.load( asset.source, function ( response ) {
            asset.font = response;
            AssetManager.assetLoaded();
        });
    }

    static assetLoaded() {
        AssetManager.numAssetsLoaded ++;
                AssetManager.onProgress(AssetManager.context);

                if (AssetManager.numAssetsLoaded ===  AssetManager.numAssetsToLoad) {
                    AssetManager.onComplete(AssetManager.context);
                }
    }
    static getAssetByTag(tag: string) {
        return AssetManager.assets[tag];
    }

    loadSound(path) {

    }

    imageLoaded () {
        debugger;
    }

    handleComplete(a, b, c) {
        debugger;
    }
}