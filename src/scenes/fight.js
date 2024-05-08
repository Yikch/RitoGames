import Phaser from 'phaser';

import forest_back from '../../assets/background/forest_back.png';
import forest_mid from '../../assets/background/forest_mid.png';
import forest_front from '../../assets/background/forest_front.png';
import forest_lights from '../../assets/background/forest_lights.png';
import MetalFighter from '../fighters/metalFighter.js';
import LeafFighter from '../fighters/leafFighter.js'


const P1Coords = {x: 400, y: 300};
const P2Coords = {x: 1300, y: 300};
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

	constructor(numberRounds = 2, playerVictories = [0, 0]) {
		super({ key: 'fight' });
		this.numPads = 0;

		this.round = 1;
		this.numberRounds = numberRounds;
		this.playerVictories = playerVictories
    }

	init(data){
		this.fighter1Id = data.player1;
		this.fighter2Id = data.player2;
	}

    preload() {
        //this.load.image('player', player);
		this.load.image('forest_back', forest_back);
		this.load.image('forest_mid', forest_mid);
		this.load.image('forest_front', forest_front);
		this.load.image('forest_lights', forest_lights);
    
	    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	}

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
		const {width, height } = this.scale;
		
		this.roundTime = 120;
		this.iniStage(width, height);
		this.iniDebug();
		this.iniFighter1(this.fighter1Id, P1Coords);
		this.iniFighter2(this.fighter2Id, P2Coords);
		this.iniGUI();

		this.input.gamepad.once('connected', () => {
			if(this.input.gamepad.pad1 != null) this.fighter.initPad(this.input.gamepad.pad1);
			if(this.input.gamepad.pad2 != null) this.fighter2.initPad(this.input.gamepad.pad2);
		});
		this.roundStart();

		const buttonEnt = this.add.image(this.game.renderer.width-100, this.game.renderer.height-100, 'fullscreenEnt', 0).setOrigin(0).setInteractive().setScale(7);
		const buttonExt = this.add.image(this.game.renderer.width-100, this.game.renderer.height-100, 'fullscreenExt', 0).setOrigin(0).setInteractive().setScale(7);
        buttonExt.setVisible(false);
        buttonEnt.on('pointerup', function ()
        {
            this.scale.startFullscreen();
            buttonEnt.setVisible(false);
            buttonExt.setVisible(true);
        }, this);     
        buttonExt.on('pointerup', function ()
        {
            this.scale.stopFullscreen();
            buttonExt.setVisible(false);
            buttonEnt.setVisible(true);
        }, this);
	}

	roundStart(){
		this.startTimer();
		this.fighter.unblock();
		this.fighter2.unblock();
	}

	update (t, dt)
	{
		super.update(t, dt);
		if(this.fighter.x > this.fighter2.x){
			this.fighter.setOrientation('left');
			this.fighter2.setOrientation('right');
		}
		else{
			this.fighter.setOrientation('right');
			this.fighter2.setOrientation('left');
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

	startTimer(){
		let self = this; // Para usarlo en active
		WebFont.load({
			google: {
				families: [ 'Pixelify Sans' ]
			},
			active: function () // se llama a esta función cuando está cargada
			{
				self.timer = self.add.text(800, 56, self.roundTime.toString(),
								{ fontFamily: 'Pixelify Sans',fontSize: 80, color: '#ff0000' })
			}
		});
		this.time.addEvent({ delay: 1000, 
			callback: () => {
				this.timer.setText((parseInt(this.timer.text) - 1).toString());
			}, 
			callbackScope: this, loop: true 
		});
		this.time.addEvent({ delay: 1000 * this.roundTime, 
			callback: () => {
				this.time.removeAllEvents();
				this.gameOver();
			}, 
			callbackScope: this, loop: false
		});
	}

	gameOver(player){
		const pl = player === this.fighter ? 0 : 1;
		this.playerVictories[pl]++;
		this.round++;

		if (this.round > this.numberRounds)
			this.endGame();
		else{
			this.scene.restart({numberRounds: this.numberRounds, playerVictories: this.playerVictories});
		}
	}

	endGame(){
		this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' });
		
		if(this.fighter.stats.health > this.fighter2.stats.health)
			this.add.text(400, 400, 'Player 1 wins', { fontSize: '64px', fill: '#ff0000' });
		else
			this.add.text(400, 400, 'Player 2 wins', { fontSize: '64px', fill: '#ff0000' });
		this.fighter.block();
		this.fighter2.block();
	}

	updateHP(fighter){
		if (fighter === this.fighter)
			this.hpbar_p1.cantidad = this.fighter.stats.health;
		else
			this.hpbar_p2.cantidad = this.fighter2.stats.health;
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

	iniGUI(){

		this.hpbar_p1 = this.add.graphics();
		this.hpbar_p1.cantidad = this.fighter.stats.health;

		this.hpbar_p2 = this.add.graphics();
		this.hpbar_p2.cantidad = this.fighter2.stats.health;

		for (let i = 0; i < this.numberRounds; i++){
			i < this.playerVictories[0] 
				? this.add.circle(500 - i * 50, 130, 10, 0x00ff00) : this.add.circle(500 - i * 50, 130, 10, 0xff0000);
			i < this.playerVictories[1] 
				? this.add.circle(1300 + i * 50, 130, 10, 0x00ff00) : this.add.circle(1300 + i * 50, 130, 10, 0xff0000);
		}
		this.updateHP(this.fighter);
		this.updateHP(this.fighter2);
	}

	iniFighter1(id){
		const attackKeysP1 = ['Q', 'E'];
		if (id === 'Leaf')
			this.fighter = new LeafFighter(this, P1Coords.x, P1Coords.y, 1, attackKeysP1);
		else
			this.fighter = new MetalFighter(this, P1Coords.x, P1Coords.y, 1, attackKeysP1);

		this.fighter.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
		this.physics.add.collider(this.fighter, this.floor);
		this.fighter.block();
	}

	iniFighter2(id){
		const attackKeysP2 = ['Z', 'X'];		
		if (id === 'Leaf')
			this.fighter2 = new LeafFighter(this, P2Coords.x, P2Coords.y, 2, attackKeysP2);
		else
			this.fighter2 = new MetalFighter(this, P2Coords.x, P2Coords.y, 2, attackKeysP2);
		this.fighter2.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.fighter2, this.floor);
		this.physics.add.collider(this.fighter, this.fighter2);
		this.fighter2.block();
	}

	iniDebug(){
		//make it so when someone presses P it will toggle the debug mode
		this.keyboard = this.input.keyboard.addKeys({
			debug: Phaser.Input.Keyboard.KeyCodes.P,
		});
		this.physics.world.drawDebug = false;
		this.keyboard.debug.on('down', () => {
			if (!this.physics.world.drawDebug){
				this.physics.world.drawDebug = true;
				this.timer.text = '9999';
			}
			else{
				this.physics.world.drawDebug = false;
				this.physics.world.debugGraphic.clear();
			}
			this.fighter.setDebug(!this.fighter.debug);
			this.fighter2.setDebug(!this.fighter2.debug);
		});
	}

	destroyHB(gameobject){
		this.fighter2.enemyHB = this.fighter2.enemyHB.filter((hb) => hb !== gameobject);
		this.fighter.enemyHB = this.fighter.enemyHB.filter((hb) => hb !== gameobject);
		gameobject.destroy();
	}

	addColision(gameobject, fighter){
		if (fighter === this.fighter)
			this.fighter2.enemyHB.push(gameobject);
		else
			this.fighter.enemyHB.push(gameobject);
	}
}
