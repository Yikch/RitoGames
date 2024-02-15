import Phaser from 'phaser'
import Fighter from '../fighters/fighter.js';

import player from '../../assets/sprites/player.png';

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
        this.load.image('player', player);
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        this.fighter = new Fighter(this, 200, 300);
        this.fighter2 = new Fighter(this, 800, 300);
    }
}
