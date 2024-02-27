import Phaser from 'phaser'

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Fighter extends Phaser.GameObjects.Sprite {

	/**
	 * Constructor del jugador
	 * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 */
	constructor(scene, x, y, name, speed) {
		super(scene, x, y, 'player');
		this.STATES = {
			idle: 'idle',
			run: 'run',
			jump: 'j_up_loop',
			fall: 'j_down_loop',
			defend: 'defend',
		}
		this.name = name;
		this.position = {x, y};
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		// Queremos que el jugador no se salga de los límites del mundo
		this.body.setCollideWorldBounds();
		this.body.setSize(35, 45);
		this.speed = speed;
		this.jumpSpeed = -800;
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.setScale(5);
		this.currentstate = this.STATES.idle;
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
			this.currentstate = newState;
			this.anims.play({key :newState, repeat: -1});
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
		if(this.currentstate === this.STATES.jump || this.currentstate === this.STATES.fall){
			newState = this.currentstate;
		}
		else if (this.cursors.up.isDown) {
			this.body.setVelocityY(this.jumpSpeed);
			newState = this.STATES.jump;
		}
		else if (this.cursors.left.isDown) {
			this.body.setVelocityX(-this.speed);
			newState = this.STATES.run;
		}
		else if (this.cursors.right.isDown) {
			this.body.setVelocityX(this.speed);
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
		this.updateAnimation(newState, this.currentstate);
	}
}
