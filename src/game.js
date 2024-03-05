import Fight from './scenes/fight.js'
import Phaser from 'phaser'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
	//transparent: true,
    scene: [Fight],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);
