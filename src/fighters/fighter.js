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

		this.facing = facing;
		this.id = "";
		this.STATES = {
			idle: 'idle',
			run: 'run',
			jump: 'j_up',
			fall: 'j_down',
			defend: 'defend',
		}
		this.cursors = this.scene.input.keyboard.createCursorKeys();

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

	iniAnimations(){
		throw new Error('createAnimations() must be implemented');
	}

	iniStats(){
		throw new Error('createStats() must be implemented');
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
			this.anims.play({key : this.id + newState, repeat: -1});
		}
	}

	/**
	 * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
	 * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
	 * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
	 * @override
	 */
	preUpdate(t,dt) {
		super.preUpdate(t,dt);
		let newState;
		if(this.state === this.STATES.jump || this.state === this.STATES.fall){
			newState = this.state;
		}
		else if (this.cursors.up.isDown) {
			this.body.setVelocityY(this.stats.jumpSpeed);
			newState = this.STATES.jump;
		}
		else if (this.cursors.left.isDown) {
			this.body.setVelocityX(-this.stats.speed);
			newState = this.STATES.run;
		}
		else if (this.cursors.right.isDown) {
			this.body.setVelocityX(this.stats.speed);
			newState = this.STATES.run;
		}
		else if(this.cursors.down.isDown){
			this.body.setVelocityX(0);
			newState = this.STATES.defend;
		}
		else {
			this.body.setVelocityX(0);
			newState = this.STATES.idle
		}
		this.updateAnimation(newState, this.state);
		//console.log(this.x, this.y, this.state)
	}
}
