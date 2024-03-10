import Phaser from 'phaser'

import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import metal from '../../assets/sprites/metal/metal_fighter.png';

import metalJSON from '../../assets/sprites/metal/metal_fighter.json';

import Controller from '../controller/controller.js';

import forest_back from '../../assets/background/forest_back.png';
import forest_mid from '../../assets/background/forest_mid.png';
import forest_front from '../../assets/background/forest_front.png';
import forest_lights from '../../assets/background/forest_lights.png';
import MetalFighter from '../fighters/metalFighter.js';


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
		this.controller = new Controller(this);
		this.numPads = 0;
    }

    preload() {
        //this.load.image('player', player);
		this.load.image('forest_back', forest_back);
		this.load.image('forest_mid', forest_mid);
		this.load.image('forest_front', forest_front);
		this.load.image('forest_lights', forest_lights);
		this.load.spritesheet('leaf', leaf, { frameWidth: 288, frameHeight: 128 });
		this.load.atlas('metal', metal, metalJSON);
		this.controller = new Controller(this);
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {

		const { width, height } = this.scale;
		this.add.image(0,0, 'forest_back').setDisplaySize(width, height).setOrigin(0,0);
		this.add.image(0, 0, 'forest_mid').setDisplaySize(width, height).setOrigin(0,0);
		this.add.image(0,0, 'forest_lights').setDisplaySize(width, height).setOrigin(0,0);
		this.add.image(0,0, 'forest_front').setDisplaySize(width, height).setOrigin(0,0);

		let floor = this.physics.add.staticGroup().create(0, height);
		floor.setDisplaySize(width, 150).setOrigin(0, 1).refreshBody();
		floor.setImmovable(true);
		floor.body.allowGravity = false;
		floor.renderFlags = 0;

		this.fighter = new MetalFighter(this, 300, 300, 'right');
		this.physics.add.collider(this.fighter, floor);

        this.fighter2 = new MetalFighter(this, 1000, 300, 'left');
		this.fighter2.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
		this.physics.add.collider(this.fighter2, floor);
		this.physics.add.collider(this.fighter, this.fighter2);

		this.input.gamepad.once('connected', (pad) => {
			if(this.numPads === 0){
				this.fighter.initPad(pad);
				this.numPads++;
			}
			else if(this.numPads){
				this.fighter2.initPad(pad);
				this.numPads++;
			}
		});
    }
}
