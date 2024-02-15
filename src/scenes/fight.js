import Phaser from 'phaser'
import Fighter from '../fighters/fighter.js';

import crystal from '../../assets/sprites/crystal/crystal_mauler.png';
import crystalJSON from '../../assets/sprites/crystal/crystal_mauler.json';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Fight extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'fight' });
    }

    preload() {
        //this.load.image('player', player);
		this.load.aseprite({key : 'crystal', textureURL : crystal, atlasURL: crystalJSON});
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        //this.fighter = new Fighter(this, 200, 300);
        //this.fighter2 = new Fighter(this, 800, 300);
		let x = this.anims.createFromAseprite('crystal');
		let y = this.add.sprite(200, 300).play({ key: '3_atk', repeat: -1 }).setScale(3);
		console.log(x);
		console.log(y);
    }
}
