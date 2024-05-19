import Phaser from 'phaser'
import comboManager from '../combos/comboManager';

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
	constructor(scene, x, y, sprite, player, atackKeys, playerDmg) {
		super(scene, x, y, sprite);

		this.XIndex = 2;
		this.YIndex = 3;
		this.hb = [];
		this.enemyHB = [];
		this.end = false;

		this.playerDmg = playerDmg;

		this.keys = atackKeys;
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

		this.DIRECTIONS = {
			forward: 'forward',
			forward_up: 'forward_up',
			forward_down: 'forward_down',
			backward: 'backward',
			backward_up: 'backward_up',
			backward_down: 'backward_down',
			up: 'up',
			down: 'down'
		}

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.gamepad = null;

		this.comboManager = new comboManager(this.getCombos());
		this.iniAtacks(atackKeys);

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
				this.manageAtack('light');
			}
			else if (this.gamepad.Y) {
				this.manageAtack('hard');
			}
		}, this);
	}

	iniAtacks(atackKeys){
		const keys = atackKeys.map((key) => { return "keydown-" + key});
		this.scene.input.keyboard.on(keys[0], () => this.manageAtack('light'), this);
		this.scene.input.keyboard.on(keys[1], () => this.manageAtack('hard'), this);
	}

	iniAnimations(){throw new Error('createAnimations() must be implemented');}
	iniStats(){throw new Error('createStats() must be implemented');}

	getCombos(){
		return [
			{id: 'combo1', keys:[this.DIRECTIONS.down, this.DIRECTIONS.forward_down, this.DIRECTIONS.forward, 'light']},
			{ id: 'combo2', keys : [this.DIRECTIONS.down, this.DIRECTIONS.forward_down, this.DIRECTIONS.forward, 'hard']},
			{ id: 'combo3', keys : [this.DIRECTIONS.down, this.DIRECTIONS.backward_down, this.DIRECTIONS.backward, 'light']}
			//,{ id: 'combo4', keys : [this.DIRECTIONS.down, this.DIRECTIONS.backward_down, this.DIRECTIONS.backward, 'hard']},
		]
	}

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
		if(this.is_defending() && this.is_overlapping()) return;
		let oldState = this.state;

		this.check_collisions();
		if(!(this.is_atacking() || this.is_recovering())){
			this.update_air();
			this.check_movement(t);
		}
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
			if(this.going_backwards() && !(this.state === this.STATES.atacking)){
				this.state = this.STATES.defend;
			}
			else{
				if(this.debug)
					console.log("Take Hit from Fighter" + this.id);
				this.state = this.STATES.takeHit;
				this.hitbox = null;
				this.enemyHB.forEach((hb) => {
					if(this.scene.physics.overlap(this, hb)){
						this.hitbox = hb;
					}
					
				});
				if(this.hitbox.name === "light"){
					this.stats.health -= this.playerDmg[0];
				}else if(this.hitbox.name === "hard"){
					this.stats.health -= this.playerDmg[1];
				}else if(this.hitbox.name === "combo1"){
					this.stats.health -= this.playerDmg[2];
				}else if(this.hitbox.name === "combo2"){
					this.stats.health -= this.playerDmg[3];
				}else if(this.hitbox.name === "combo3"){
					this.stats.health -= this.playerDmg[4];
				}
				this.scene.updateHP(this);
				if(this.stats.health <= 0){
					this.scene.gameOver(this);
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

	check_movement(t){
		if (!this.can_move()) return;
		const dir = this.getDirection();
		this.comboManager.addMovementInput(dir, t);
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
		if(this.debug)
			console.log("Atack from Fighter" + this.id);
		if (!this.can_atack()) return false;
		const combo = this.comboManager.checkSpecialMove(id, this.scene.time.now);
		id = combo ? combo : id;
		this.body.setVelocityX(0);
		this.state = this.STATES.atacking;
		this.anims.startAnimation(this.id + id + "_start");
		this.anims.chain(this.id + id + "_active").chain(this.id + id + "_recovery");
	}

	// FUNCION EN DESUSO, hay que decidir si usarlo (actualmente se usa el StartAnimation de preupdate para animar el takeHit)
	// punshing representa la velocidad de push causado por un combo o ataque que pueda generar un push, por defecto es 0
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
		this.scene.input.keyboard.on('keycombomatch', () => {
			if(this.debug)
				console.log("Combo from Fighter" + this.id);
			this.manageAtack('combo1');
		});
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
	unblock(){ this.end = false;}
	can_atack(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	can_move(){return !this.end && (this.state === this.STATES.idle || this.state === this.STATES.run);}
	is_atacking(){return this.state === this.STATES.atacking;}
	is_hit(){return this.state === this.STATES.takeHit;}
	is_defending(){return this.state === this.STATES.defend;}
	is_recovering(){return this.state === this.STATES.recovering;}
	going_left(){return (this.cursors.left.isDown || (this.gamepad != null && this.gamepad.leftStick.x < 0))}
	going_right(){return (this.cursors.right.isDown || (this.gamepad != null && this.gamepad.leftStick.x > 0))}
	going_up(){return (this.cursors.up.isDown || (this.gamepad != null && this.gamepad.leftStick.y < 0))}
	going_down(){return (this.cursors.down.isDown || (this.gamepad != null && this.gamepad.leftStick.y > 0))}
	going_forward(){
		return (this.facing === 'right') && this.going_right() ||
				(this.facing === 'left') && this.going_left();
	}
	going_backwards(){
		return (this.facing === 'left') && this.going_right() ||
				(this.facing === 'right') && this.going_left();
	}

	getDirection(){
		const forward = this.going_forward();
		const backward = this.going_backwards();
		const up = this.going_up();
		const down = this.going_down();
		if (forward && up) return this.DIRECTIONS.forward_up;
		if (forward && down) return this.DIRECTIONS.forward_down;
		if (backward && up) return this.DIRECTIONS.backward_up;
		if (backward && down) return this.DIRECTIONS.backward_down;
		if (forward) return this.DIRECTIONS.forward;
		if (backward) return this.DIRECTIONS.backward;
		if (up) return this.DIRECTIONS.up;
		if (down) return this.DIRECTIONS.down;
		return undefined;
	}
}
