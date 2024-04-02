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
	constructor(scene, x, y, player, attackKeys) {
		super(scene, x, y, SPRITE, player, attackKeys);

		this.hb = null;
		this.id = SPRITE + "_";
		this.setScale(5);
		this.body.setSize(30, 50);
		this.body.setOffset(this.width/2 - 15, this.height - 50);

		this.anims.play({key :this.id + this.state, repeat: -1});
	}


	iniStats() {
		return {
			health: 500,
			speed: 200,
			jumpSpeed: -600,
		}
	}

	/**
	 * Creación de las animaciones del jugador
	 */
	iniAnimations() {
		this.load_light_atack();
		this.load_hard_atack();
		this.load_combo1();
		this.load_combo2();
		this.load_combo3();
		this.load_animation_events();
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.idle,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'idle_', start: 0, end:10}),
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
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'defend_', start: 0, end: 12}),
			frameRate: 10,
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.defend + "_end",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'defend_', start: 7}),
			frameRate: 10,
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.takeHit,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'take_hit_', start: 0, end: 5}),
			frameRate: 12
		});
		this.scene.anims.create({
			key: SPRITE + "_death",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'death_', start: 0, end: 17}),
			frameRate: 10
		});
	}

	load_light_atack(){
		this.scene.anims.create({
			key: SPRITE + "_light_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 3}),
			frameRate: 40
		});
		this.scene.anims.create({
			key: SPRITE + "_light_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 4, end: 7}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_light_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 8, end: 8}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'light_active'){
				this.hb = this.scene.add.zone(
					this.x + (this.facing == 'left' ? -300 : 0), 
					this.y + this.height + 25, 
					225, 70
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		});
		}
	
	load_hard_atack(){
		this.scene.anims.create({
			key: SPRITE + "_hard_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 0, end: 7}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_hard_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 8, end: 9}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_hard_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '2_atk_', start: 10, end: 13}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'hard_active'){
				let arrow = new SimpleProjectile(
								this.scene, 
								this.x + (this.facing == 'left' ? -100 : 100), 
								this.y + this.height + 25, 
								'leafProjectiles', 'arrow',
								35, 8,
								30, this.facing, 10
							);
				this.scene.addColision(arrow, this);
				arrow.move();
			}
		});
	}

	load_combo1(){
		this.scene.anims.create({
			key: SPRITE + "_combo1_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '3_atk_', start: 0, end: 6}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo1_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '3_atk_', start: 7, end: 9}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo1_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '3_atk_', start: 10, end: 11}),
			frameRate: 20
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'combo1_active'){
				this.hb = this.scene.add.zone(
					this.x + (this.facing == 'left' ? -15 : 15), 
					this.y + this.height - 175, 
					225, 140
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		});
	}

	load_combo2(){
		this.scene.anims.create({
			key: SPRITE + "_combo2_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 0, end: 8}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo2_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 10, end: 12}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo2_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 13, end: 16}),
			frameRate: 20
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'combo2_active'){
				this.hb = this.scene.add.zone(
					this.x + (this.facing == 'left' ? -15 : 15), 
					this.y + this.height - 175, 
					225, 140
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		});
	}
	load_combo3(){
		this.scene.anims.create({
			key: SPRITE + "_combo3_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 0, end: 4}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo3_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 5, end: 6}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo3_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 7, end: 8}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'combo3_active'){
				this.hb = this.scene.add.zone(
					this.x + (this.facing == 'left' ? -15 : 15), 
					this.y + this.height - 175, 
					225, 140
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		});
	}

}