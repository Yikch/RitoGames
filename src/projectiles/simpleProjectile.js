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
	constructor(scene, x, y, atlasKey, frameKey, width, height, speed, direction, damage) {
		super(scene, x, y, atlasKey, frameKey);

		this.setScale(5);
		this.setFlipX(direction == 'left');
		this.damage = damage;
		this.speed = speed;
		this.direction = direction;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.body.setSize(width, height);
		this.body.allowGravity = false;
	}

	//A tween that moves the projectile in the direction it was created
	move() {
		this.scene.tweens.add({
			targets: this,
			x: (this.direction == 'left' ? 0 : this.scene.scale.width),
			duration: 1000 - this.speed * 10,
			ease: 'Linear',
			onComplete: () => {
				this.destroy();
			}
		});
	}
}