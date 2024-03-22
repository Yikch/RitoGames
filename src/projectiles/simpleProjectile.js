//A simple projectile class that extends phaser.gameobject and receives a texture, speed and direction

export default class SimpleProjectile extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor del proyectil
	 * @param {Phaser.Scene} scene Escena a la que pertenece el proyectil
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 * @param {string} atlasKey Clave del atlas que contiene la textura del proyectil
	 * @param {string} frameKey Clave del frame de la textura en el atlas
	 * @param {number} speed Velocidad del proyectil
	 * @param {string} direction Dirección a la que se mueve el proyectil
	 * @param {number} damage Daño del proyectil
	 */
	constructor(scene, x, y, atlasKey, frameKey, speed, direction, damage) {
		super(scene, x, y, atlasKey, frameKey);

		this.damage = damage;
		this.speed = speed;
		this.direction = direction;
		this.scene.physics.world.enable(this);
		this.scene.add.existing(this);
	}

	//A tween that moves the projectile in the direction it was created
	move() {
		this.scene.tweens.add({
			targets: this,
			x: this.x + (this.direction == 'left' ? -this.speed : this.speed),
			duration: 1000,
			ease: 'Linear',
			onComplete: () => {
				this.destroy();
			}
		});
	}
}