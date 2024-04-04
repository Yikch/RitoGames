import SimpleProjectile from '../projectiles/simpleProjectile.js';
import Trap from '../projectiles/trap.js';
import Fighter from './fighter.js';

//This class encapsulates the metal fighter that extends the normal fighter
const SPRITE = 'metal';
export default class MetalFighter extends Fighter {
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
			speed: 300,
			jumpSpeed: -800,
		}
	}

	/**
	 * Creación de las animaciones del jugador
	 */
	iniAnimations() {
		this.load_light_atack();
		this.load_hard_atack();
		this.load_projectile_atack();
		this.load_combo1();
		this.load_combo2();
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.idle,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'idle_', start: 0, end:7}),
			frameRate: 10,
			repeat: -1
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.run,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'run_', start: 0, end: 7}),
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
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'defend_', start: 0, end: 11}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.defend + "_end",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'defend_', start: 11, end: 11}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.takeHit,
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'take_hit_', start: 0, end: 5}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_death",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'death_', start: 0, end: 8}),
			frameRate: 10
		});
	}

	load_light_atack(){
		this.scene.anims.create({
			key: SPRITE + "_" + "light_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 0}),
			frameRate: 99999
		});
		this.scene.anims.create({
			key: SPRITE + "_" + "light_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 2}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + "light_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 2, end: 5}),
			frameRate: 50
		});
		this.on('animationstart', function (animation, frame) {
			if (animation.key === this.id + "light_active"){
				this.hb = this.scene.add.zone(
					this.x + (this.facing == 'left' ? -250 : 100), 
					this.y + this.height + 70, 
					250, 80
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		}, this);
	}

	load_hard_atack(){
		this.scene.anims.create({
			key: SPRITE + "_hard_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 0, end: 1}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_hard_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 2, end: 5}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_hard_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 6, end: 7}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + "hard_active"){
				this.hb = this.scene.add.zone(
					this.x + (this.facing === 'left' ? -300 : 200), 
					this.y + this.height, 
					200, 130
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this);
			}
		});
	}

	load_projectile_atack(){
		this.scene.anims.create({
			key: SPRITE + "_projectile_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'projectile_cast_', start: 0, end: 2}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_projectile_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'projectile_cast_', start: 3, end: 4}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_projectile_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'projectile_cast_', start: 5, end: 6}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'projectile_active'){
				let knife = new SimpleProjectile(
								this.scene, 
								this.x + (this.facing == 'left' ? -100 : 100), 
								this.y + this.height + 25, 
								'metal', 'projectile_throw',
								35, 8,
								30, this.facing, 5
							);
				this.scene.addColision(knife, this);
				knife.move();
			}
		});
	}

	load_combo1(){
		this.scene.anims.create({
			key: SPRITE + "_combo1_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 0, end: 2}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo1_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 3, end: 8}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_combo1_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'sp_atk_', start: 9, end: 10}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'combo1_active'){
				this.hb = this.scene.add.zone(
					this.x + (this.facing === 'left' ? -165 : 65), 
					this.y + this.height + 42, 
					945, 300
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this, 300);
			}
		});
	}

	load_combo2(){
		this.scene.anims.create({
			key: SPRITE + "_combo2_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'trap_cast_', start: 0, end: 4}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_combo2_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'trap_cast_', start: 5, end: 6}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_combo2_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'trap_cast_', start: 7, end: 9}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + 'combo2_start'){
				if (this.facing === 'right'){
					this.body.setVelocityX(-380);
				}
				else{
					this.body.setVelocityX(380);
				}
				this.body.setVelocityY(-400);
			}
			if (animation.key === this.id + 'combo2_active'){
				let trap = new Trap( this.scene, 
									this.x + (this.facing == 'left' ? -140 : 140), 
									this.y + this.height + 120, this, 
									'metalProjectiles', 'trap_land_', 'trap_detonate_', 
									15, 15, 10
								);
				trap.detonate();
			}
		});
	}

}