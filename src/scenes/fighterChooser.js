import Phaser from 'phaser';
import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import leafPic from '../../assets/sprites/leaf/leaf_ranger.png';

import metal from '../../assets/sprites/metal/metal_fighter.png';
import metalPic from '../../assets/sprites/metal/metal_bladekeeper.png';
import leafProjectiles from '../../assets/sprites/leaf/projectiles.png';
import metalProjectiles from '../../assets/sprites/metal/projectile.png'


import metalJSON from '../../assets/sprites/metal/metal_fighter.json';
import leafJSON from '../../assets/sprites/leaf/leaf_fighter.json';
import leafProjectilesJSON from '../../assets/sprites/leaf/projectiles.json';
import metalProjectilesJSON from '../../assets/sprites/metal/projectile.json'
import MetalFighter from '../fighters/metalFighter';


import cursorSprite from '../../assets/UI/cursor_default.png'
import gamepadSprite from '../../assets/UI/gamepad.png'
import start from '../../assets/UI/start.png'
import LeafFighter from '../fighters/leafFighter';


export default class FighterChooserScene extends Phaser.Scene {
	constructor() {
		super({key:'FighterChooser'});
	}

	preload() {
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
		this.load.atlas('metal', metal, metalJSON);
		this.load.atlas('leaf', leaf, leafJSON);
		this.load.atlas('leafProjectiles', leafProjectiles, leafProjectilesJSON);
		this.load.atlas('metalProjectiles', metalProjectiles, metalProjectilesJSON);
		// Load assets
		this.load.image('Metal', metalPic);
		this.load.image('Leaf', leafPic);
		this.load.image('cursors', cursorSprite, {frameWidth: 32,frameHeight: 32});
		this.load.image('gamepad', gamepadSprite, {frameWidth: 32,frameHeight: 32});
		this.load.image('start', start, {frameWidth: 32,frameHeight: 32});
	}

	create() {
		// Display title
		const {width, height } = this.scale;
		this.physics.world.drawDebug = false;

		this.player1Fighter = null;
		this.player2Fighter = null;

		this.screenWidth = this.game.renderer.width;
		this.screenHeight = this.game.renderer.height;
		this.add.image(0, 0, "jungle_bg").setDisplaySize(width,height).setOrigin(0).setDepth(-2);

		this.iniText();
		this.iniCursorAndKeys();

		// Display icons
		this.iniIcons();
	}

	update() {
		// Keyboard input
		if (this.player1Keys.up.isDown && this.cursorsPlayer1.y > 0) { this.cursorsPlayer1.y -= 10; }
		if (this.player1Keys.down.isDown && this.cursorsPlayer1.y < this.screenHeight - 10) { this.cursorsPlayer1.y += 10; }
		if (this.player1Keys.left.isDown && this.cursorsPlayer1.x > 0) { this.cursorsPlayer1.x -= 10; }
		if (this.player1Keys.right.isDown && this.cursorsPlayer1.x < this.screenWidth - 10) { this.cursorsPlayer1.x += 10; }
	
		if (this.player2Keys.up.isDown && this.cursorsPlayer2.y > 0) { this.cursorsPlayer2.y -= 10; }
		if (this.player2Keys.down.isDown && this.cursorsPlayer2.y < this.screenHeight - 10) { this.cursorsPlayer2.y += 10; }
		if (this.player2Keys.left.isDown && this.cursorsPlayer2.x > 0) { this.cursorsPlayer2.x -= 10; }
		if (this.player2Keys.right.isDown && this.cursorsPlayer2.x < this.screenWidth - 10) { this.cursorsPlayer2.x += 10; }

		// Gamepad input
		if (this.input.gamepad.total > 0) {
			const pad1 = this.input.gamepad.getPad(0);
			const pad2 = this.input.gamepad.getPad(1);
			if (pad1) {
				this.gamepad1Icon.visible = true;
				if (!this.player1Fighter)
					this.player1Advice.text = '      Press A to \nselect a fighter!';
				const stick = pad1.leftStick;
				if (stick.x < -0.1 && this.cursorsPlayer1.x > 0) { this.cursorsPlayer1.x -= 10; }
				if (stick.x > 0.1 && this.cursorsPlayer1.x < this.screenWidth - 10) { this.cursorsPlayer1.x += 10; }
				if (stick.y < -0.1 && this.cursorsPlayer1.y > 0) { this.cursorsPlayer1.y -= 10; }
				if (stick.y > 0.1 && this.cursorsPlayer1.y < this.screenHeight - 10) { this.cursorsPlayer1.y += 10; }
				//check for button presses
				if (pad1.A) {
					if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
						this.selectFighter(1, 'Metal');
					} else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
						this.selectFighter(1, 'Leaf');
					}else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.startButton.x, this.startButton.y) < 50) {
						if (this.player1Fighter && this.player2Fighter) {
							this.scene.start('fight', {player1: this.player1Id, player2: this.player2Id});
						}
					}
				}
			}

			if (pad2) {
				this.gamepad2Icon.visible = true;
				if(!this.player2Fighter)
					this.player2Advice.text = '      Press A to \nselect a fighter!';
				const stick = pad2.leftStick;
				if (stick.x < -0.1 && this.cursorsPlayer1.x > 0) { this.cursorsPlayer1.x -= 10; }
				if (stick.x > 0.1 && this.cursorsPlayer1.x < this.screenWidth - 10) { this.cursorsPlayer1.x += 10; }
				if (stick.y < -0.1 && this.cursorsPlayer1.y > 0) { this.cursorsPlayer1.y -= 10; }
				if (stick.y > 0.1 && this.cursorsPlayer1.y < this.screenHeight - 10) { this.cursorsPlayer1.y += 10; }
				//check for button presses
				if (pad2.A) {
					if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
						this.selectFighter(2, 'Metal');
					} else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
						this.selectFighter(2, 'Leaf');
					}
					else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.startButton.x, this.startButton.y) < 50) {
						if (this.player1Fighter && this.player2Fighter) {
							this.scene.start('fight', {player1: this.player1Id, player2: this.player2Id});
						}
					}
				}
			}
		}
	}

	iniText(){
		let self = this; // Para usarlo en active
		WebFont.load({
			google: {
				families: [ 'Pixelify Sans' ]
			},
			active: function () // se llama a esta función cuando está cargada
			{
				self.timer = self.add.text(500, 56, 'Choose your fighter',
								{ fontFamily: 'Pixelify Sans',fontSize: 80, color: '#ff0000' })
				self.player1Tag = self.add.text(315, 850, 'Player 1', { fontFamily: 'Pixelify Sans',fontSize: 40, color: '#ff0000' });
				self.player1Advice = self.add.text(290, 700, '      Press Q to \nselect a fighter!', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#ffffff' });
				self.player2Tag = self.add.text(1330, 850, 'Player 2', { fontFamily: 'Pixelify Sans',fontSize: 40, color: '#0000FF' });
				self.player2Advice = self.add.text(1300, 700, '      Press Z to \nselect a fighter!', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#ffffff' });
				self.gamepadText = self.add.text(600, 900, 'PRESS ANY BUTTON TO CONNECT A GAMEPAD', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#ffffff' });
			}
		});

	}

	iniCursorAndKeys(){
		// Create cursors for player 1 and player 2
		this.cursorsPlayer1 = this.add.sprite(100, 100, 'cursors');
		this.cursorsPlayer2 = this.add.sprite(100, 200, 'cursors');
		//Give each cursor a border to make it more visible
		this.cursorsPlayer1.setTint(0xFF0000);
		this.cursorsPlayer2.setTint(0x0000FF);
		//Make it so the cursors are displayed above the icons
		this.cursorsPlayer1.setDepth(1);
		this.cursorsPlayer2.setDepth(1);

		this.iniIcons();
		this.iniControls();
		this.addCursorInteractivity();
	}

	iniControls(){
		this.iniPlayer1Keys();
		this.iniPlayer2Keys();
	}


	iniPlayer1Keys(){
		this.player1Keys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
	}

	iniPlayer2Keys(){
		this.player2Keys = this.input.keyboard.createCursorKeys();
	}

	iniIcons(){
		this.fighter1Icon = this.add.image(660, 250, 'Metal');
		this.fighter2Icon = this.add.image(1100, 250, 'Leaf');
		this.fighter1Icon.setScale(1.5);
		this.fighter2Icon.setScale(1.5);
		// Set up icon interaction
		this.fighter1Icon.setInteractive();
		this.fighter2Icon.setInteractive();

		//Display the keyboard and gamepad icons
		this.gamepad1Icon = this.add.image(390, 925, 'gamepad');
		this.gamepad1Icon.setScale(0.3);
		this.gamepad1Icon.visible = false;
		this.gamepad2Icon = this.add.image(1405, 925, 'gamepad');
		this.gamepad2Icon.setScale(0.3);
		this.gamepad2Icon.visible = false;

		this.startButton = this.add.image(875, 600, 'start');
		this.startButton.setScale(0.5);
		this.startButton.setInteractive();

	}

	addCursorInteractivity(){
		this.input.keyboard.on('keydown-Q', () => {
			if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
				this.selectFighter(1, 'Metal');
			} else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
				this.selectFighter(1, 'Leaf');
			}
			if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.startButton.x, this.startButton.y) < 50) {
				if (this.player1Fighter && this.player2Fighter) {
					this.scene.start('fight', {player1: this.player1Id, player2: this.player2Id});
				}
			}
		});
		this.input.keyboard.on('keydown-Z', () => {
			if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
				this.selectFighter(2, 'Metal');
			} else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
				this.selectFighter(2, 'Leaf');
			}
			if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.startButton.x, this.startButton.y) < 50) {
				if (this.player1Fighter && this.player2Fighter) {
					this.scene.start('fight', {player1: this.player1Id, player2: this.player2Id});
				}
			}
		});
		
	}

	selectFighter(player, fighter){
		if (player === 1) {
			this.player1Fighter = this.selectPlayerFighter(this.player1Fighter, player, fighter, this.player1Keys,  ['Q', 'E'], 400, 500);
			this.player1Advice.setText('');
			this.player1Id = fighter;
		} else {
			this.player2Fighter = this.selectPlayerFighter(this.player2Fighter, player, fighter, this.player2Keys,  ['Z', 'X'], 1400, 500);
			this.player2Advice.setText('');
			this.player2Id = fighter;
		}
	}

	selectPlayerFighter(playerFighter, player, fighter, playerKeys, atackKeys, x, y) {
		if (playerFighter) playerFighter.destroy();
		if (fighter === 'Metal') {
			playerFighter = new MetalFighter(this, x, y, player, atackKeys);
		} else {
			playerFighter = new LeafFighter(this, x, y, player, atackKeys);
		}
		playerFighter.cursors = playerKeys;
		playerFighter.block();
		playerFighter.body.allowGravity = false;
		return playerFighter;
	}
}

