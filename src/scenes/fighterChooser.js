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
import MetalFighter from '../fighters/leafFighter';


import cursorSprite from '../../assets/cursor_default.png'
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
		this.load.image('cursors', cursorSprite, {
			frameWidth: 32,
			frameHeight: 32,
		});
	}

	create() {
		// Display title
		this.screenWidth = this.game.renderer.width;
		this.screenHeight = this.game.renderer.height;
		//this.add.image(0, 0, "jungle_bg").setDisplaySize(width,height).setOrigin(0);

		this.iniText();
		this.iniCursorAndKeys();

		// Display icons
		this.iniIcons();
	}

	update() {
		if (this.player1Keys.up.isDown && this.cursorsPlayer1.y > 0) { this.cursorsPlayer1.y -= 10; }
		if (this.player1Keys.down.isDown && this.cursorsPlayer1.y < this.screenHeight - 10) { this.cursorsPlayer1.y += 10; }
		if (this.player1Keys.left.isDown && this.cursorsPlayer1.x > 0) { this.cursorsPlayer1.x -= 10; }
		if (this.player1Keys.right.isDown && this.cursorsPlayer1.x < this.screenWidth - 10) { this.cursorsPlayer1.x += 10; }
	
		if (this.player2Keys.up.isDown && this.cursorsPlayer2.y > 0) { this.cursorsPlayer2.y -= 10; }
		if (this.player2Keys.down.isDown && this.cursorsPlayer2.y < this.screenHeight - 10) { this.cursorsPlayer2.y += 10; }
		if (this.player2Keys.left.isDown && this.cursorsPlayer2.x > 0) { this.cursorsPlayer2.x -= 10; }
		if (this.player2Keys.right.isDown && this.cursorsPlayer2.x < this.screenWidth - 10) { this.cursorsPlayer2.x += 10; }
	}

	iniText(){
		let self = this; // Para usarlo en active
		WebFont.load({
			google: {
				families: [ 'Pixelify Sans' ]
			},
			active: function () // se llama a esta función cuando está cargada
			{
				self.timer = self.add.text(550, 56, 'Choose your fighter',
								{ fontFamily: 'Pixelify Sans',fontSize: 80, color: '#ff0000' })
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
		this.iniPlayer1Keys();
		this.iniPlayer2Keys();
		this.addCursorInteractivity();
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
		this.fighter1Icon = this.add.image(700, 350, 'Metal');
		this.fighter2Icon = this.add.image(1100, 350, 'Leaf');
		// Set up icon interaction
		this.fighter1Icon.setInteractive();
		this.fighter2Icon.setInteractive();
	}

	addCursorInteractivity(){
		this.input.keyboard.on('keydown-Q', () => {
			if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
				this.selectFighter(1, 'Metal');
			} else if (Phaser.Math.Distance.Between(this.cursorsPlayer1.x, this.cursorsPlayer1.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
				this.selectFighter(1, 'Leaf');
			}
		});
		this.input.keyboard.on('keydown-X', () => {
			if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter1Icon.x, this.fighter1Icon.y) < 50) {
				this.selectFighter(2, 'Metal');
			} else if (Phaser.Math.Distance.Between(this.cursorsPlayer2.x, this.cursorsPlayer2.y, this.fighter2Icon.x, this.fighter2Icon.y) < 50) {
				this.selectFighter(2, 'Leaf');
			}
		});
	}

	selectFighter(player, fighter){
		if (player == 1){
			if (this.player1Fighter) this.player1Fighter.destroy();
			if (fighter == 'Metal') 
				this.player1Fighter = new MetalFighter(this, 400, 500, 1, ['Q', 'E']);
			else 
				this.player1Fighter = new LeafFighter(this, 400, 500, 1, ['Q', 'E']);

			this.player1Fighter.cursors = this.player1Keys;
			this.player1Fighter.block();
			this.player1Fighter.body.allowGravity = false;
		}
		else{
			if (this.player2Fighter) this.player2Fighter.destroy();
			if (fighter === 'Metal') 
				this.player2Fighter = new MetalFighter(this, 1400, 500, 2, ['Z', 'X']);
			else 
				this.player2Fighter = new LeafFighter(this, 1400, 500, 2, ['Z', 'X']);

			this.player2Fighter.cursors = this.player2Keys;
			this.player2Fighter.block();
			this.player2Fighter.body.allowGravity = false;
		}
	}

}

