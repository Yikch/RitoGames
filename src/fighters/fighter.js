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

		this.debug = false;
		this.step = false;
		this.blocked = false; //Wether the fighter can do inputs or not
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
			takeHit: 'take_hit',
			light: 'light',
			hard: 'hard',
			combo1: 'combo1'
		}

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.gamepad = null;

		this.scene.input.keyboard.on('keydown-M', this.resumeAnimation, this);
		this.scene.input.keyboard.on('keydown-N', this.nextFrame, this);
		this.scene.input.keyboard.on(attackKeys[0], this.manageLightAttack, this);
		this.scene.input.keyboard.on(attackKeys[1], this.manageHardAttack, this);
		this.scene.input.keyboard.on(attackKeys[2], this.manageCombo1, this);

		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.body.setCollideWorldBounds();

		// Queremos que el jugador no se salga de los límites del mundo
		this.flipX = this.facing == 'left';

		// Animaciones del jugador
		this.iniAnimations();

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
	setStep(step){
		this.step = step;
	}

	nextFrame(){
		if(this.debug && this.step){
			//let frame = this.anims.currentFrame;
			this.anims.nextFrame();
			//if(frame.isLast && this.anims.currentAnim !== null){
			//	this.playAnimation(this.anims.currentAnim);
			//}
		}
	}

	resumeAnimation(){
		if (this.debug && this.step){
			this.anims.complete();
		}
	}

	playAnimation(animation){
		if (this.debug && this.step){
			this.anims.startAnimation(animation, {start:0}).stop();
			this.nextFrame();
		}
		else
			this.anims.play(animation);
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
		if(this.state === this.STATES.light || this.state === this.STATES.hard || this.state === this.STATES.combo1){
			return;
		}
		if (this.state === this.STATES.jump || this.state === this.STATES.fall || this.state === this.STATES.takeHit) {
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
		else if (this.cursors.right.isDown || (this.gamepad != null && this.gamepad.rightStick.x > 0)) {
			this.body.setVelocityX(this.stats.speed);
			newState = this.STATES.run;
		} 
		else if (this.cursors.down.isDown || (this.gamepad != null && this.gamepad.B)) {
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
		if (!(this.body.onFloor() && !this.blocked))	return false;

		if(this.debug)
			console.log("Light from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.light;
		this.blocked = true
		this.playAnimation(this.id + this.STATES.light + "_start");
		this.anims.chain(this.id + this.STATES.light + "_active")
				.chain(this.id + this.STATES.light + "_recovery");
	}

	manageHardAttack(){
		if (!(this.body.onFloor() && !this.blocked)) return false;

		if(this.debug)
			console.log("Hard from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.hard;
		this.blocked = true
		this.playAnimation(this.id + this.STATES.hard + "_start");
		this.anims.chain(this.id + this.STATES.hard + "_active").chain(this.id + this.STATES.hard + "_recovery");
	}

	manageCombo1(){
		if (!(this.body.onFloor() && !this.blocked)) return false;

		if(this.debug)
			console.log("Combo1 from Fighter" + this.id);
		this.body.setVelocityX(0);
		this.state = this.STATES.combo1;
		this.blocked = true
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
}
