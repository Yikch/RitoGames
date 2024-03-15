import Phaser from 'phaser';
import MetalFighter from '../fighters/metalFighter.js';

import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import metal from '../../assets/sprites/metal/metal_fighter.png';
import leafProjectiles from '../../assets/sprites/leaf/projectiles.png';
import metalProjectiles from '../../assets/sprites/metal/projectile_and_trap.png'


import metalJSON from '../../assets/sprites/metal/metal_fighter.json';
import leafJSON from '../../assets/sprites/leaf/leaf_fighter.json';
import leafProjectilesJSON from '../../assets/sprites/leaf/projectiles.json';
import metalProjectilesJSON from '../../assets/sprites/metal/projectile_and_trap.json'

class EditorScene extends Phaser.Scene {
	constructor() {
		super('EditorScene');
	}

	preload() {
		this.load.atlas('metal', metal, metalJSON);
		this.load.atlas('leaf', leaf, leafJSON);
		this.load.atlas('leafProjectiles', leafProjectiles, leafProjectilesJSON);
		this.load.atlas('metalProjectiles', metalProjectiles, metalProjectilesJSON);
	}

	create() {
		const { width, height } = this.scale;
		this.cameras.main.setBackgroundColor('#000000');


		this.fighter = this.add.sprite(width/2, height/2, 'metal', 'PNG animations/01_idle/01_idle_1.png');
		this.fighter.setScale(5);

		//Create it in the middle of the screen
		/* const attackKeysP1 = ['keydown-Q', 'keydown-E'];
		this.fighter = new MetalFighter(this, width/2, height/2, 'right', attackKeysP1);
		this.fighter.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
		this.fighter.setOrigin(0.5, 0.5);
		this.fighter.body.setAllowGravity(false);
 */
		this.redPoint = this.add.circle(this.fighter.x, this.fighter.y, 5, 0xff0000);
		this.redPoint.setOrigin(0.5, 0.5);

		const animations = this.fighter.anims.animations;
		let animationTexts = [];
		let y = 50;
		
		/* for (const animationName in animations) {
			const text = this.add.text(this.cameras.main.centerX, y, animationName, { fill: '#000000' });
			text.setOrigin(0.5);
			text.setInteractive({ useHandCursor: true });
			text.on('pointerdown', () => {
				this.fighter.anims.play(animationName);
			});

			animationTexts.push(text);
			y += 30;
		}
		console.log(animations);
		this.input.on('pointerdown', (pointer) => {
			if (pointer.rightButtonDown()) {
				this.fighter.x = pointer.x;
				this.fighter.y = pointer.y;
				this.redPoint.setPosition(pointer.x, pointer.y);
			}
			
		}); */
	}
	
	update(){
		this.redPoint.setPosition(this.fighter.x, this.fighter.y);
	}
}

export default EditorScene;