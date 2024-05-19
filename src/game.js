import Fight from './scenes/fight.js'
import LoadScene from './scenes/loadScene.js'
import MenuScene from './scenes/menu.js'
import FighterChooserScene from './scenes/fighterChooser.js'
import GameEndPanel from './scenes/UI/gameEndPanel.js'
import Phaser from 'phaser'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */

let config = {
    type: Phaser.AUTO,
    parent: "game",
    width: 1800,
    height: 1000,
    scale: {
        mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        gamepad: true
    },
    pixelArt: true,
	//transparent: true,
    scene: [LoadScene, MenuScene, FighterChooserScene, Fight, GameEndPanel],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);
