import Phaser from 'phaser';

import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import metal from '../../assets/sprites/metal/metal_fighter.png';
import leafProjectiles from '../../assets/sprites/leaf/projectiles.png';
import metalProjectiles from '../../assets/sprites/metal/projectile_and_trap.png'


import metalJSON from '../../assets/sprites/metal/metal_fighter.json';
import leafJSON from '../../assets/sprites/leaf/leaf_fighter.json';
import leafProjectilesJSON from '../../assets/sprites/leaf/projectiles.json';
import metalProjectilesJSON from '../../assets/sprites/metal/projectile_and_trap.json'


import forest_back from '../../assets/background/forest_back.png';
import forest_mid from '../../assets/background/forest_mid.png';
import forest_front from '../../assets/background/forest_front.png';
import forest_lights from '../../assets/background/forest_lights.png';
import MetalFighter from '../fighters/metalFighter.js';
import LeafFighter from '../fighters/leafFighter.js'

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
		this.numPads = 0;
    }

    preload() {
        //this.load.image('player', player);
		this.load.image('forest_back', forest_back);
		this.load.image('forest_mid', forest_mid);
		this.load.image('forest_front', forest_front);
		this.load.image('forest_lights', forest_lights);

		this.load.atlas('metal', metal, metalJSON);
		this.load.atlas('leaf', leaf, leafJSON);
		this.load.atlas('leafProjectiles', leafProjectiles, leafProjectilesJSON);
		this.load.atlas('metalProjectiles', metalProjectiles, metalProjectilesJSON);
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {

		const {width, height } = this.scale;
		
		this.iniStage(width, height);
		this.iniDebug();
		this.iniFighter1();
		this.iniFighter2();
		

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

		this.hpbar_p1 = this.add.graphics();
		this.hpbar_p1.cantidad = 500;

		this.hpbar_p2 = this.add.graphics();
		this.hpbar_p2.cantidad = 500;
    }

	update ()
    {

		if(this.time.now >= this.fighter.tiempoInmune){
			this.fighter.golpeado = false;
		}

		if(this.time.now >= this.fighter2.tiempoInmune){
			this.fighter2.golpeado = false;
		}

        this.hpbar_p1.clear();

		this.hpbar_p1.displayWidth = this.hpbar_p1.cantidad;

        this.hpbar_p1.fillStyle(0x2d2d2d);
        this.hpbar_p1.fillRect(64, 64, 500, 48);

        this.hpbar_p1.fillStyle(0xff0000); // color red
        this.hpbar_p1.fillRect(64, 64, this.hpbar_p1.displayWidth, 48);

		this.hpbar_p2.clear();

		this.hpbar_p2.displayWidth = this.hpbar_p2.cantidad;

        this.hpbar_p2.fillStyle(0x2d2d2d);
        this.hpbar_p2.fillRect(1250, 64, 500, 48);

        this.hpbar_p2.fillStyle(0xff0000); // color red
        this.hpbar_p2.fillRect(1250, 64, this.hpbar_p2.displayWidth, 48);
    }

	//this.physics.add.overlap(this.fighter, this.fighter2, this.loseHP, null, this)
	loseHP_p1()
	{
		if (this.hpbar_p1.cantidad > 0){
			if(this.fighter.golpeado === false){
				this.hpbar_p1.cantidad = (this.hpbar_p1.cantidad - 40) >= 0 ? this.hpbar_p1.cantidad - 40 : 0;
				this.fighter.golpeado = true;
				// tiempo inmune del fighter de ser golpeado
				// Dependera del tiempo de la animacion de ser atacado
				this.fighter.tiempoInmune = this.time.now + 1000;
			}

		}
    }

	loseHP_p2()
	{
		if (this.hpbar_p2.cantidad > 0){
			if(this.fighter2.golpeado === false){
				this.hpbar_p2.cantidad = (this.hpbar_p2.cantidad - 40) >= 0 ? this.hpbar_p2.cantidad - 40 : 0;
				this.fighter2.golpeado = true;
				// tiempo inmune del fighter de ser golpeado
				// Dependera del tiempo de la animacion de ser atacado
				this.fighter2.tiempoInmune = this.time.now + 1000;
			}

		}
    }

	iniStage(width, height){
		this.add.image(0,0, 'forest_back').setDisplaySize(width,height).setOrigin(0,0);
		this.add.image(0, 0, 'forest_mid').setDisplaySize(width,height).setOrigin(0,0);
		this.add.image(0,0, 'forest_lights').setDisplaySize(width,height).setOrigin(0,0);
		this.add.image(0,0, 'forest_front').setDisplaySize(width,height).setOrigin(0,0);

		this.floor = this.physics.add.staticGroup().create(0,height);
		this.floor.setDisplaySize(width, 150).setOrigin(0, 1).refreshBody();
		this.floor.setImmovable(true);
		this.floor.body.allowGravity = false;
		this.floor.renderFlags = 0;
	}

	iniFighter1(){
		const attackKeysP1 = ['keydown-Q', 'keydown-E'];
		this.fighter = new MetalFighter(this, 300, 300, 'right', attackKeysP1);
		this.fighter.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
		this.physics.add.collider(this.fighter, this.floor);
		this.fighter.golpeado = false;
	}

	iniFighter2(){
		const attackKeysP2 = ['keydown-Z', 'keydown-X'];
		this.fighter2 = new LeafFighter(this, 1000, 300, 'left', attackKeysP2);
		this.fighter2.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.fighter2, this.floor);
		this.physics.add.collider(this.fighter, this.fighter2);
		this.fighter2.golpeado = false;
	}

	iniDebug(){
		//make it so when someone presses P it will toggle the debug mode
		this.keyboard = this.input.keyboard.addKeys({
			debug: Phaser.Input.Keyboard.KeyCodes.P,
			step: Phaser.Input.Keyboard.KeyCodes.O, 
		});
		this.physics.world.drawDebug = false;
		this.keyboard.debug.on('down', () => {
			if (!this.physics.world.drawDebug)
				this.physics.world.drawDebug = true;
			else{
				this.physics.world.drawDebug = false;
				this.physics.world.debugGraphic.clear();
			}
			this.fighter.setDebug(!this.fighter.debug);
			this.fighter2.setDebug(!this.fighter2.debug);
		});
		this.keyboard.step.on('down', () => {
			this.fighter.setStep(!this.fighter.step);
			this.fighter2.setStep(!this.fighter2.step);
		});
	}
}
