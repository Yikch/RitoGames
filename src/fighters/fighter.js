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
	constructor(scene, x, y, sprite, facing) {
		super(scene, x, y, sprite);

		this.debug = false;
		this.blocked = false;
		this.facing = facing;
		this.id = "";
		this.STATES = {
			idle: 'idle',
			run: 'run',
			jump: 'j_up',
			fall: 'j_down',
			defend: 'defend',
			light: 'light',
			hard: 'hard'
		}
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.gamepad = null;

		this.scene.input.keyboard.on('keydown-M', this.resumeAnimation, this);
		this.scene.input.keyboard.on('keydown-N', this.nextFrame, this);

		this.scene.input.keyboard.on('keydown-Z', this.manageLightAttack, this);
		this.scene.input.keyboard.on('keydown-X', this.manageHardAttack, this);

		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.body.setCollideWorldBounds();

		// Queremos que el jugador no se salga de los límites del mundo
		this.flipX = facing == 'left';

		// Animaciones del jugador
		this.iniAnimations();

		//Estadisticas de los personajes
		this.stats = this.iniStats()
		this.state = this.STATES.idle;
	}

	initPad(gamepad){
		this.gamepad = gamepad;
	}

	iniAnimations(){throw new Error('createAnimations() must be implemented');}

	iniStats(){throw new Error('createStats() must be implemented');}

	setDebug(debug){
		this.debug = debug;
		if (!this.debug){
			this.anims.restart();
		}
	}

	nextFrame(){
		if(this.debug){
			this.anims.nextFrame();
		}
	}

	resumeAnimation(){
		if (this.debug){
			this.anims.resume();
			this.anims.complete();
		}
	}

	playAnimation(animation, infinite = false){
		if (this.debug){
			this.anims.startAnimation(animation, {start:0, repeat: infinite ? -1 : 1}).stop();
			this.nextFrame();
		}
		else
			this.anims.play(animation, infinite ? -1 : 1);
	}

	updateAnimation(newState, oldState) {
		if(oldState === this.STATES.jump || oldState === this.STATES.fall){
			if(this.body.velocity.y > 0){
				newState = this.STATES.fall;
			}
			else if (this.body.velocity.y == 0){
				newState = this.STATES.idle;
			}
		}
		if(newState !== oldState){
			this.state = newState;
			this.playAnimation(this.id + newState, true);
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
		let newState;
		if(this.state === this.STATES.light || this.state === this.STATES.hard){
			return;
		}
		if (this.state === this.STATES.jump || this.state === this.STATES.fall) {
			newState = this.state;
		} 
		else if (this.cursors.up.isDown || (this.gamepad != null && this.gamepad.A)) {
			this.body.setVelocityY(this.stats.jumpSpeed);
			newState = this.STATES.jump;
		} 
		else if (this.cursors.left.isDown || (this.gamepad != null && this.gamepad.rightStick.x < 0)) {
			this.body.setVelocityX(-this.stats.speed);
			newState = this.STATES.run;
		}
		else if (this.cursors.right.isDown) {
			this.body.setVelocityX(this.stats.speed);
			newState = this.STATES.run;
		} 
		else if (this.cursors.down.isDown) {
			this.body.setVelocityX(0);
			newState = this.STATES.defend;
		} 
		else {
			this.body.setVelocityX(0);
			newState = this.STATES.idle;
		}
		this.updateAnimation(newState, this.state);
	}

	manageLightAttack(){
		if(this.debug)
			console.log("Light from Fighter" + this.id);
		if (this.body.onFloor() && !this.blocked){
			this.body.setVelocityX(0);
			this.state = this.STATES.light;
			this.blocked = true
			this.playAnimation(this.id + this.STATES.light);
			return true;
		}
		return false;
	}

	manageHardAttack(){
		if(this.debug)
			console.log("Hard from Fighter" + this.id);
		if (this.body.onFloor() && !this.blocked){
			this.body.setVelocityX(0);
			this.state = this.STATES.hard;
			this.blocked = true
			this.playAnimation(this.id + this.STATES.hard);
			return true;
		}
		return false;
	}
}
