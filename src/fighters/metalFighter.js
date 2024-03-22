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
			health: 100,
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
			key: SPRITE + "_" + this.STATES.light + "_start",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 0}),
			frameRate: 99999
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.light + "_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 0, end: 2}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.light + "_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: '1_atk_', start: 2, end: 5}),
			frameRate: 50
		});
		this.on('animationstart', function (animation, frame) {
			if (animation.key === this.id + this.STATES.light + "_active"){
				this.hb = this.scene.physics.add.staticBody( //Poner un zone
					this.x + (this.facing == 'left' ? -250 : 0), 
					this.y + this.height + 25, 250, 80
				);
				this.scene.add.existing(this.hb);
				this.scene.physics.add.existing(this.hb, true);
				this.scene.addColision(this.hb, this);
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
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 0, end: 1}),
			frameRate: 20
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.hard + "_active",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 2, end: 5}),
			frameRate: 10
		});
		this.scene.anims.create({
			key: SPRITE + "_" + this.STATES.hard + "_recovery",
			frames: this.scene.anims.generateFrameNames(SPRITE, { prefix: 'air_atk_', start: 6, end: 7}),
			frameRate: 10
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === this.id + this.STATES.hard + '_active'){
				this.hb = this.scene.physics.add.staticBody(
					this.x + (this.facing === 'left' ? -300 : 100), 
					this.y + this.height - 50, 200, 130
				);
				this.scene.add.existing(this.hb);
				this.scene.physics.add.existing(this.hb, true);
				this.scene.addColision(this.hb, this);
			}
		});
		this.on('animationcomplete', function (animation, frame) {
			if (animation.key === this.id + this.STATES.hard + '_active'){
				if(this.hb !== null){
					this.hb = this.hb.destroy()
				}
			}
			else if (animation.key === this.id + this.STATES.hard + '_recovery'){
				this.blocked = false;
				this.updateAnimation(this.STATES.idle, this.state);
			}
		}, this);
	}

}