import SimpleProjectile from '../projectiles/simpleProjectile.js';
import Fighter from './fighter.js';

//This class encapsulates the metal fighter that extends the normal fighter
const SPRITE = 'leaf';
export default class LeafFighter extends Fighter {
	/**
	 * Constructor del jugador
	 * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 * @param {string} facing Dirección a la que mira el jugador
	 */
	constructor(scene, x, y, facing, attackKeys) {
		super(scene, x, y, SPRITE, facing, attackKeys);

		this.hb = null;
		this.id = SPRITE + "_";
		this.setScale(5);
		this.body.setSize(30, 50);
		this.body.setOffset(this.width/2 - 15, this.height - 50);

		this.anims.play({key :this.id + this.state, repeat: -1});
	
		this.on('animationcomplete', function (animation, frame) {
			if (animation.key === this.id + this.STATES.light | animation.key === this.id + this.STATES.hard){
				this.blocked = false;
				if(this.hb !== null){
					this.hb.destroy();
					this.hb = null;
				}
				this.updateAnimation(this.STATES.idle, this.state);
			}
		}, this);
	}


	iniStats() {
		return {
			health: 100,
			speed: 200,
			jumpSpeed: -600,
		}
	}

	manageLightAttack() {
		if (!super.manageLightAttack()) return false;
		if (this.body.onFloor()){
			this.hb = this.scene.physics.add.staticBody(
						this.x + (this.facing == 'left' ? -250 : 0), 
						this.y + this.height + 25, 250, 80
			);
			this.scene.add.existing(this.hb);
			this.scene.physics.add.existing(this.hb, true);
		}
	}

	//Esto está mal en todos los lights, no debería hacer esto si no puede hacerlo
	manageHardAttack() {
		if (!super.manageHardAttack()) return;
		if (this.body.onFloor()){
			let arrow = this.createArrow();
			this.scene.tweens.add({
				targets: arrow,
				x: (this.facing == 'left' ? -100 : this.scene.width),
				ease: 'linear',
				duration: 1000,
				delay: 750,
				onStart: () => {
					arrow.body.enable = true;
					arrow.setActive(true).setVisible(true);
				}
			});
		}
	}

	createArrow(){
		let arrow;
		(arrow = this.scene.add
			.sprite(this.x + (this.facing == 'left' ? -100 : 100), 
			this.y + this.height + 25, 
			'leafProjectiles', 'arrow')
			.setScale(5).setVisible(false).setActive(false)
		);
		arrow.flipX = this.facing === 'left'
		
		this.scene.physics.add.existing(arrow, false);
		arrow.body.setSize(20,5).setAllowGravity(false);
		arrow.body.enable = false;
		return arrow;
	}

	/**
	 * Creación de las animaciones del jugador
	 */
	iniAnimations() {
		this.load_light_atack();
		this.load_hard_atack();
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.idle,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'idle_', start: 0, end:11}),
			frameRate: 10,
			repeat: -1
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.run,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'run_', start: 0, end: 8}),
			frameRate: 10,
			repeat: -1
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.jump,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'jump_up_', start: 0, end: 2}),
			frameRate: 10,
			repeat: -1
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.fall,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'jump_down_', start: 0, end: 2}),
			frameRate: 10,
			repeat: -1
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.defend,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'defend_', start: 0, end: 18}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_hit",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'take_hit_', start: 0, end: 5}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_death",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'death_', start: 0, end: 17}),
			frameRate: 10
		});
	}

	load_light_atack(){
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.light + "_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 3}),
			frameRate: 99999
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.light + "_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 3, end: 7}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.light + "_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 8, end: 9}),
			frameRate: 50
		});
		this.on('animationstart', function (animation, frame) {
			if (animation.key === this.id + this.STATES.light + "_active"){
				this.hb = this.scene.physics.add.staticBody(
					this.x + (this.facing == 'left' ? -250 : 0), 
					this.y + this.height + 25, 250, 80
				);
				this.scene.add.existing(this.hb);
				this.scene.physics.add.existing(this.hb, true);
			}
		}, this);
		this.on('animationcomplete', function (animation, frame) {
			if (animation.key === this.id + this.STATES.light + "_active"){
				if(this.hb !== null){
					this.hb = this.hb.destroy()
				}
			}
			else if (animation.key === this.id + this.STATES.light + "_recovery"){
				this.blocked = false;
				this.updateAnimation(this.STATES.idle, this.state);
			}
		}, this);
	}

	load_hard_atack(){
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.hard + "_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 0, end: 8}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.hard + "_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 9, end: 9}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.hard + "_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 10, end: 12}),
			frameRate: 10
		});
		this.on('animationstart', function (animation, frame) {
			if (animation.key === this.id + this.STATES.hard + '_active'){
				let arrow = new SimpleProjectile(
								this.scene, 
								this.x + (this.facing == 'left' ? -100 : 100), 
								this.y + this.height + 25, 
								'leafProjectiles', 'arrow', 
								200, this.facing, 10
							);
				this.scene.addColision(arrow, this);
				arrow.move();
			}
		}, this);
		this.on('animationcomplete', function (animation, frame) {
			if (animation.key === this.id + this.STATES.hard + '_recovery'){
				this.blocked = false;
				this.updateAnimation(this.STATES.idle, this.state);
			}
		}, this);
	}

}