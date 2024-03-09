import Phaser from 'phaser'
import StaticBody from 'phaser/src/physics/arcade/StaticBody.js';
import Fighter from '../fighters/fighter.js';

import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import metal from '../../assets/sprites/metal/metal_fighter.png';

import metalJSON from '../../assets/sprites/metal/metal_fighter.json';

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
    }

    preload() {
        //this.load.image('player', player);
		this.load.image('forest_back', forest_back);
		this.load.image('forest_mid', forest_mid);
		this.load.image('forest_front', forest_front);
		this.load.image('forest_lights', forest_lights);
		this.load.spritesheet('leaf', leaf, { frameWidth: 288, frameHeight: 128 });
		this.load.atlas('metal', metal, metalJSON);
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
		console.log(this.fighter.originX, this.fighter.originY);

        this.fighter2 = new MetalFighter(this, 1000, 300, 'left');
		this.physics.add.collider(this.fighter2, floor);
		this.physics.add.overlap(this.fighter, this.fighter2, this.loseHP, null, this)

		this.hpbar = this.add.graphics();
		this.hpbar.cantidad = 500;
    }

	update ()
    {
        this.hpbar.clear();

		this.hpbar.displayWidth = this.hpbar.cantidad;

        this.hpbar.fillStyle(0x2d2d2d);
        this.hpbar.fillRect(64, 64, 500, 48);

        this.hpbar.fillStyle(0xff0000); // color red
        this.hpbar.fillRect(64, 64, this.hpbar.displayWidth, 48);
    }

	loseHP()
	{
		if (this.hpbar.cantidad > 0){
			this.hpbar.cantidad = this.hpbar.cantidad - 10;
		}
	}
}
