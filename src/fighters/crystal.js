import Phaser from 'phaser'

import crystal from '../../assets/sprites/crystal/crystal_mauler.png';
import crystalJSON from '../../assets/sprites/crystal/crystal_mauler.json';
import Fighter from './fighter';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Crystal extends Fighter {

	/**
	 * Constructor del jugador
	 * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 */
	constructor(scene, x, y, name, speed) {
		super(scene, x, y, name, speed);
		
		scene.load.aseprite({key : 'crystal', textureURL : crystal, atlasURL: crystalJSON});
		this.anims.createFromAseprite('crystal');
		this.anims.play({key :this.currentstate, repeat: -1});
	}

}
