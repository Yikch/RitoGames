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
		this.hb = [];
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
			atacking: 'atacking',
		}

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.gamepad = null;

		this.scene.input.keyboard.on(attackKeys[0], () => this.manageAtack('light'), this);
		this.scene.input.keyboard.on(attackKeys[1], () => this.manageAtack('hard'), this);
		this.scene.input.keyboard.on(attackKeys[2], () => this.manageAtack('combo1'), this);
		this.scene.input.keyboard.on(attackKeys[3],  () => this.manageAtack('combo2'), this);
		this.scene.input.keyboard.on(attackKeys[4],  () => this.manageAtack('combo3'), this);


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
		if ((this.cursors.up.isDown || (this.gamepad != null && this.gamepad.A)) && this.body.onFloor()) {
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

	manageAtack(id){
		if (!this.can_atack()) return false;
		if(this.debug)
			console.log("Atack from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.atacking;
		this.anims.startAnimation(this.id + id + "_start");
		this.anims.chain(this.id + id + "_active").chain(this.id + id + "_recovery");
	}

	load_animation_events(){
		this.on('animationstop', (animation, frame) => {
			if(this.hb !== null)
				this.scene.destroyHB(this.hb);
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

	setOrientation(orientation){
		this.facing = orientation;
		this.flipX = this.facing === 'left';
	}

	block(){ this.end = true;}
	can_atack(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	can_move(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	is_atacking(){return this.state === this.STATES.atacking;}
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
