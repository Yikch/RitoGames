import Phaser from 'phaser'

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Fighter extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Constructor del jugador
	 * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 */
	constructor(scene, x, y, sprite, player, attackKeys) {
		super(scene, x, y, sprite);

		this.XIndex = 2;
		this.YIndex = 3;
		this.enemyHB = [];
		this.end = false;

		this.debug = false;
		this.step = false;
		this.golpeado = false; //Wether the fighter is being hit or not
		this.player = player - 1; //Will be a bool value
		this.facing = player == 1 ? 'right' : 'left';
		this.id = "";

		this.STATES = {
			idle: 'idle',
			run: 'run',
			jump: 'j_up',
			fall: 'j_down',
			defend: 'defend',
			recovering: 'defend_end',
			takeHit: 'take_hit',
			light: 'light',
			hard: 'hard',
			combo1: 'combo1',
			projectile: 'projectile'
		}

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.gamepad = null;

		this.scene.input.keyboard.on(attackKeys[0], this.manageLightAttack, this);
		this.scene.input.keyboard.on(attackKeys[1], this.manageHardAttack, this);
		if(attackKeys[2] !== null)
			this.scene.input.keyboard.on(attackKeys[2], this.manageProjectileAttack, this);
		this.scene.input.keyboard.on(attackKeys[3], this.manageCombo1, this);

		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.body.setCollideWorldBounds();
		this.body.pushable = false;

		// Queremos que el jugador no se salga de los límites del mundo
		this.flipX = this.facing == 'left';

		// Animaciones del jugador
		this.iniAnimations();
		this.load_animation_events();

		//Estadisticas de los personajes
		this.stats = this.iniStats()
		this.state = this.STATES.idle;

		this.scale = window.screen.width / 350;
	}

	initPad(gamepad){
		this.gamepad = gamepad;
		this.gamepad.on('down', () => {
			if (this.gamepad.X) {
				this.manageLightAttack();
			}
			else if (this.gamepad.Y) {
				this.manageHardAttack();
			}
		}, this);
	}

	iniAnimations(){throw new Error('createAnimations() must be implemented');}
	iniStats(){throw new Error('createStats() must be implemented');}

	setDebug(debug){
		this.debug = debug;
		if (!this.debug){
			this.anims.restart();
		}
	}
	/**
	 * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
	 * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
	 * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
	 * @override
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);
		if(this.end) return ;
		if(this.is_atacking() || this.is_recovering() || (this.is_defending() && this.is_overlapping())) return;
		let oldState = this.state;
		this.check_collisions();
		this.update_air();
		this.check_movement();
		if (oldState !== this.state){
			this.anims.startAnimation(this.id + this.state);
		}
		
	}

	check_collisions(){
		if(this.is_defending() && !this.is_overlapping()){
			this.state = this.STATES.recovering;
		}
		else if (this.is_overlapping() && !this.is_hit()){
			this.anims.chain();
			this.anims.stop();
			this.body.setVelocityX(0);
			if(this.going_backwards()){
				this.state = this.STATES.defend;
			}
			else{
				if(this.debug)
					console.log("Take Hit from Fighter" + this.id);
				this.state = this.STATES.takeHit;
				this.stats.health -= 25;
				this.scene.updateHP(this.player);
				if(this.stats.health <= 0){
					this.scene.gameOver(this.player);
					this.anims.chain(this.id + "death");
				}
			}
		}
		else if (!this.is_overlapping() && this.is_hit()){
			this.state = this.STATES.idle;
		}
	}

	update_air(){
		if(this.state === this.STATES.jump || this.state === this.STATES.fall){
			if(this.body.velocity.y > 0){
				this.state = this.STATES.fall;
			}
			else if (this.body.velocity.y == 0){
				this.state = this.STATES.idle;
			}
		}
	}

	check_movement(){
		if (!this.can_move()) return;
		if (this.cursors.up.isDown || (this.gamepad != null && this.gamepad.A)) {
			this.body.setVelocityY(this.stats.jumpSpeed);
			this.state = this.STATES.jump;
		} 
		else if (this.going_left()) {
			this.body.setVelocityX(-this.stats.speed);
			this.state = this.STATES.run;
		}
		else if (this.going_right()) {
			this.body.setVelocityX(this.stats.speed);
			this.state = this.STATES.run;
		} 
		else {
			this.body.setVelocityX(0);
			this.state = this.STATES.idle;
		}
	}

	manageLightAttack(){
		if (!this.can_atack())	return false;

		if(this.debug)
			console.log("Light from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.light;
		this.anims.startAnimation(this.id + this.STATES.light + "_start");
		this.anims.chain(this.id + this.STATES.light + "_active")
				.chain(this.id + this.STATES.light + "_recovery");
	}

	manageHardAttack(){
		if (!this.can_atack()) return false;

		if(this.debug)
			console.log("Hard from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.hard;
		this.blocked = true;
		this.playAnimation(this.id + this.STATES.hard + "_start");
		this.anims.chain(this.id + this.STATES.hard + "_active").chain(this.id + this.STATES.hard + "_recovery");
	}

	manageProjectileAttack(){
		if (!(this.body.onFloor() && !this.blocked)) return false;

		if(this.debug)
			console.log("Projectile from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.projectile;
		this.blocked = true;
		this.playAnimation(this.id + this.STATES.projectile + "_start");
		this.anims.chain(this.id + this.STATES.projectile + "_active")
				.chain(this.id + this.STATES.projectile + "_recovery");

	}

	manageCombo1(){
		if (!(this.body.onFloor() && !this.blocked)) return false;

		if(this.debug)
			console.log("Combo1 from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.combo1;
		this.blocked = true;
		this.playAnimation(this.id + this.STATES.combo1 + "_start");
		this.anims.chain(this.id + this.STATES.combo1 + "_active")
			.chain(this.id + this.STATES.combo1 + "_recovery");

	}

	manageTakeHit(pushing = 0){
		if(this.golpeado) return false;
		if(this.debug)
			console.log("Take Hit from Fighter" + this.id);
		this.golpeado = true;
		this.blocked = true;

		this.anims.chain();
		this.anims.stop();
		if(pushing === 0){
			this.body.setVelocityX(0);
		}
		else{
			this.body.setVelocityX(this.facing === 'left' ? pushing : -pushing);
		}
		this.state = this.STATES.takeHit;
		this.playAnimation(this.id + this.STATES.takeHit);
		this.on('animationcomplete', (animation, frame) => {
			if (animation.key === this.id + this.STATES.takeHit){
				this.golpeado = false;
				this.blocked = false;
				this.body.setVelocityX(0);
				this.updateAnimation(this.STATES.idle, this.state);
			}
		});
	}

	load_animation_events(){
		this.on('animationstop', (animation, frame) => {
			if(this.hb !== null)
				this.hb.destroy();
		})
		this.on('animationcomplete', (animation, frame) => {
			let animStrings = animation.key.split("_");
			if (animStrings.includes("recovery") || animStrings.includes("end")){
				this.state = this.STATES.idle;
				this.anims.startAnimation(this.id + this.STATES.idle);
			}
			else if (animStrings.includes('active')){
				if(this.hb !== null){
					this.scene.destroyHB(this.hb);
					this.hb.destroy();
				}
			}
		});
	}

	is_overlapping(){
		let result = false;
		this.enemyHB.forEach((hb) => {
			result = result || this.scene.physics.overlap(this, hb);
		});
		return result;
	}

	block(){ this.end = true;}
	can_atack(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	can_move(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	is_atacking(){return this.state === this.STATES.light || this.state === this.STATES.hard;}
	is_hit(){return this.state === this.STATES.takeHit;}
	is_defending(){return this.state === this.STATES.defend;}
	is_recovering(){return this.state === this.STATES.recovering;}
	going_left(){return (this.cursors.left.isDown || (this.gamepad != null && this.gamepad.rightStick.x < 0))}
	going_right(){return (this.cursors.right.isDown || (this.gamepad != null && this.gamepad.rightStick.x > 0))}
	going_forward(){
		return (this.facing === 'right') && this.going_right() ||
				(this.facing === 'left') && this.going_left();
	}
	going_backwards(){
		return (this.facing === 'left') && this.going_right() ||
				(this.facing === 'right') && this.going_left();
	}
}
