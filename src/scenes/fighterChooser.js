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

import ConfigButton from './UI/configButton';


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

		this.player1Dmg = [25, 25, 25, 25, 25];
		this.player2Dmg = [25, 25, 25, 25, 25];

		this.screenWidth = this.game.renderer.width;
		this.screenHeight = this.game.renderer.height;
		this.add.image(0, 0, "jungle_bg").setDisplaySize(width,height).setOrigin(0).setDepth(-2);

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

		this.configSteps = {
			dmg: [25, 50, 75, 100, 125, 150, 200],
			hp: [50, 75, 100, 125, 150],
		}
		this.configValues = { //the dmg and hp values are the index of the configSteps array
			dmg: 3,
			hp: 2,
			roundNumber: 2,
			roundTime: 120
		}
		this.configOpen = false;
		this.configButton = this.addButton("Config", this.game.renderer.width-100, 100, ()=>this.configUIAction(), 4);
		this.input.gamepad.on('down', (pad, button, index) => {
            if (Phaser.Math.Distance.Between(this.configButton.x, this.configButton.y, this.cursorsPlayer1.x, this.cursorsPlayer1.y) < 50) {
				if (button.index === 0) {
					this.configUIAction();
				}
			}
        });

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
							this.scene.start('fight', {
								playerVictories: [0, 0],
								player1: this.player1Id, player2: this.player2Id, 
								player1Dmg: this.player1Dmg, player2Dmg: this.player2Dmg, 
								numberRounds: this.configValues.roundNumber,
								roundTime: this.configValues.roundTime,
								dmgModifier:this.configSteps.dmg[this.configValues.dmg],
								hpModifier: this.configSteps.hp[this.configValues.hp]
							});
						}
					}
				}
			}

			if (pad2) {
				this.gamepad2Icon.visible = true;
				if(!this.player2Fighter)
					this.player2Advice.text = '      Press A to \nselect a fighter!';
				const stick = pad2.leftStick;
				if (stick.x < -0.1 && this.cursorsPlayer2.x > 0) { this.cursorsPlayer2.x -= 10; }
				if (stick.x > 0.1 && this.cursorsPlayer2.x < this.screenWidth - 10) { this.cursorsPlayer2.x += 10; }
				if (stick.y < -0.1 && this.cursorsPlayer2.y > 0) { this.cursorsPlayer2.y -= 10; }
				if (stick.y > 0.1 && this.cursorsPlayer2.y < this.screenHeight - 10) { this.cursorsPlayer2.y += 10; }
				//check for button presses
				if (pad2.A) {
					if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
						this.selectFighter(2, 'Metal');
					} else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
						this.selectFighter(2, 'Leaf');
					}
					else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.startButton.x, this.startButton.y) < 50) {
						if (this.player1Fighter && this.player2Fighter) {
							this.scene.start('fight', {
								playerVictories: [0, 0],
								player1: this.player1Id, player2: this.player2Id, 
								player1Dmg: this.player1Dmg, player2Dmg: this.player2Dmg, 
								numberRounds: this.configValues.roundNumber,
								roundTime: this.configValues.roundTime,
								dmgModifier:this.configSteps.dmg[this.configValues.dmg],
								hpModifier: this.configSteps.hp[this.configValues.hp]
							});
						}
					}
				}
			}
		}
	}

	iniText(){
		this.timer = this.add.text(500, 56, '')
		this.player1Tag = this.add.text(315, 850, '');
		this.player1Advice = this.add.text(290, 700, '');
		this.player2Tag = this.add.text(1330, 850, '');
		this.player2Advice = this.add.text(1300, 700, '');
		this.gamepadText = this.add.text(600, 900, '');
		let self = this;
		WebFont.load({
			google: {
				families: [ 'Pixelify Sans' ]
			},
			active: function ()
			{
				self.timer.destroy();
				self.player1Tag.destroy();
				self.player1Advice.destroy();
				self.player2Tag.destroy();
				self.player2Advice.destroy();
				self.gamepadText.destroy();
				self.timer = self.add.text(500, 56, 'Choose your fighter',{ fontFamily: 'Pixelify Sans',fontSize: 80, color: '#ff0000' })
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
			else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.startButton.x, this.startButton.y) < 50) {
				if (this.player1Fighter && this.player2Fighter) {
					this.scene.start('fight', {
								playerVictories: [0, 0],
								player1: this.player1Id, player2: this.player2Id, 
								player1Dmg: this.player1Dmg, player2Dmg: this.player2Dmg, 
								numberRounds: this.configValues.roundNumber,
								roundTime: this.configValues.roundTime,
								dmgModifier:this.configSteps.dmg[this.configValues.dmg],
								hpModifier: this.configSteps.hp[this.configValues.hp]
							});
				}
			}
			else if (Phaser.Math.Distance.Between(this.configButton.x, this.configButton.y, this.cursorsPlayer1.x, this.cursorsPlayer1.y) < 50) {
				this.configUIAction();
			}
		});
		this.input.keyboard.on('keydown-Z', () => {
			if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
				this.selectFighter(2, 'Metal');
			} else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
				this.selectFighter(2, 'Leaf');
			}
			else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.startButton.x, this.startButton.y) < 50) {
				if (this.player1Fighter && this.player2Fighter) {
					this.scene.start('fight', {
								playerVictories: [0, 0],
								player1: this.player1Id, player2: this.player2Id, 
								player1Dmg: this.player1Dmg, player2Dmg: this.player2Dmg, 
								numberRounds: this.configValues.roundNumber,
								roundTime: this.configValues.roundTime,
								dmgModifier:this.configSteps.dmg[this.configValues.dmg],
								hpModifier: this.configSteps.hp[this.configValues.hp]
							});
				}
			}
			else if (Phaser.Math.Distance.Between(this.configButton.x, this.configButton.y, this.cursorsPlayer1.x, this.cursorsPlayer1.y) < 50) {
				this.configUIAction();
			}
		});
		
	}

	selectFighter(player, fighter){
		if (player === 1) {
			this.player1Fighter = this.selectPlayerFighter(this.player1Fighter, player, fighter, this.player1Keys,  ['Q', 'E'], 400, 500, this.player1Dmg);
			this.player1Advice.setText('');
			this.player1Id = fighter;
		} else {
			this.player2Fighter = this.selectPlayerFighter(this.player2Fighter, player, fighter, this.player2Keys,  ['Z', 'X'], 1400, 500, this.player2Dmg);
			this.player2Advice.setText('');
			this.player2Id = fighter;
		}
	}

	selectPlayerFighter(playerFighter, player, fighter, playerKeys, atackKeys, x, y, playerDmg) {
		if (playerFighter) playerFighter.destroy();
		if (fighter === 'Metal') {
			playerFighter = new MetalFighter(this, x, y, player, atackKeys, playerDmg);
		} else {
			playerFighter = new LeafFighter(this, x, y, player, atackKeys, playerDmg);
		}
		playerFighter.cursors = playerKeys;
		playerFighter.block();
		playerFighter.body.allowGravity = false;
		return playerFighter;
	}

	addButton(text, width, height, action, scale){
        let button = this.add.image(width, height, "button").setDepth(1).setScale(scale);
        this.add.text(width, height, text, { fontFamily: 'Pixelify Sans',fontSize: (scale*6), color: '#000000' }).setDepth(1).setOrigin(0.5, 0.5);
        button.setInteractive();

        button.on("pointerover", ()=>{
            button.setTexture("button_hover");
        });

        button.on("pointerout", ()=>{
            button.setTexture("button");
        });

        button.on("pointerup", ()=>{
            button.setTexture("button_pressed");
            button.setTexture("button_selected");
            action();
        });
		return button;
    }

	configUIAction(){
		if(this.configOpen){
			this.box.destroy()
			this.dmgModifier.destroy()
			this.dmgValue.destroy()
			this.dmgPlus.destroy()
			this.dmgMinus.destroy()
			this.HPModifier.destroy()
			this.HPValue.destroy()
			this.HPPlus.destroy()
			this.HPMinus.destroy()
			this.roundNumberModifier.destroy()
			this.roundNumberValue.destroy()
			this.roundNumberPlus.destroy()
			this.roundNumberMinus.destroy()
			this.roundTimeModifier.destroy()
			this.roundTimeValue.destroy()
			this.roundTimePlus.destroy()
			this.roundTimeMinus.destroy()
			this.configOpen = false;
		}
		else{
			this.box = this.add.image(this.game.renderer.width-750, 10, 'boxFrame', 1).setDisplaySize(900, 620).setOrigin(0);
			this.dmgModifier = this.add.text(this.game.renderer.width-500, 230, 'Dmg :', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.dmgValue = this.add.text(this.game.renderer.width-350, 230, this.configSteps.dmg[this.configValues.dmg] + "%", { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.dmgPlus = new ConfigButton(this, this.game.renderer.width-125, 245, "+", ()=>this.updateDmg(this.dmgValue, 1), 2);
			this.dmgMinus = new ConfigButton(this, this.game.renderer.width-215, 245,"-", ()=>this.updateDmg(this.dmgValue, -1), 2);

			this.HPModifier = this.add.text(this.game.renderer.width-500, 280, 'HP :', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.HPValue = this.add.text(this.game.renderer.width-350, 280, this.configSteps.hp[this.configValues.hp] + "%", { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.HPPlus = new ConfigButton(this, this.game.renderer.width-125, 295, "+", ()=>this.updateHP(this.HPValue, 1), 2);
			this.HPMinus = new ConfigButton(this, this.game.renderer.width-215, 295,"-", ()=>this.updateHP(this.HPValue, -1), 2);

			this.roundNumberModifier = this.add.text(this.game.renderer.width-500, 330, 'Round Nº:', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.roundNumberValue = this.add.text(this.game.renderer.width-320, 330, this.configValues.roundNumber, { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.roundNumberPlus = new ConfigButton(this, this.game.renderer.width-125, 345, "+", ()=>this.updateroundNumber(this.roundNumberValue, 1), 2);
			this.roundNumberMinus = new ConfigButton(this, this.game.renderer.width-215, 345,"-", ()=>this.updateroundNumber(this.roundNumberValue, -1), 2);

			this.roundTimeModifier = this.add.text(this.game.renderer.width-500, 370, 'Round Time :', { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.roundTimeValue = this.add.text(this.game.renderer.width-330, 370, this.configValues.roundTime, { fontFamily: 'Pixelify Sans',fontSize: 30, color: '#000000' })
			this.roundTimePlus = new ConfigButton(this, this.game.renderer.width-125, 385, "+", ()=>this.updateroundTime(this.roundTimeValue, 10), 2);
			this.roundTimeMinus = new ConfigButton(this, this.game.renderer.width-215, 385,"-", ()=>this.updateroundTime(this.roundTimeValue, -10), 2);

			this.configOpen = true;
		}
	}

	updateroundTime(text, number){
		this.configValues.roundTime += number;
		this.configValues.roundTime = Phaser.Math.Clamp(this.configValues.roundTime, 10, 300);
		text.setText(this.configValues.roundTime);
	}

	updateroundNumber(text, number){
		this.configValues.roundNumber += number;
		this.configValues.roundNumber = Phaser.Math.Clamp(this.configValues.roundNumber, 1, 10);
		text.setText(this.configValues.roundNumber);
	}

	updateHP(text, index){
		this.configValues.hp += index;
		this.configValues.hp = Phaser.Math.Clamp(this.configValues.hp, 0, this.configSteps.hp.length-1);
		text.setText(this.configSteps.hp[this.configValues.hp] + "%");
	}

	updateDmg(text, index){
		this.configValues.dmg += index;
		this.configValues.dmg = Phaser.Math.Clamp(this.configValues.dmg, 0, this.configSteps.dmg.length-1);
		text.setText(this.configSteps.dmg[this.configValues.dmg] + "%");
	}

}

