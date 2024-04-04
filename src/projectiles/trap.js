//A simple projectile class that extends phaser.gameobject and receives a texture, speed and direction

export default class Trap extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor del proyectil
	 * @param {Phaser.Scene} scene Escena a la que pertenece el proyectil
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 * @param {string} atlasKey Clave del atlas que contiene la textura del proyectil
	 * @param {string} prefixThrow prefijo de la animacion para el lanzamiento
	 * @param {string} prefixDetonate prefijo de la animacion para la detonacion
	 * @param {number} damage Daño del proyectil
	 */
	constructor(scene, x, y, fighter, atlasKey, prefixThrow, prefixDetonate, width, height, damage) {
		super(scene, x, y, atlasKey);

		this.setScale(5);
		this.damage = damage;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.body.setSize(width, height);
		this.body.allowGravity = true;
		this.atlasKey = atlasKey;
		this.fighter = fighter;
		this.prefixThrow = prefixThrow;
		this.prefixDetonate = prefixDetonate;
	}

	detonate() {
		this.scene.anims.create({
			key: "trap_throw",
			frames: this.scene.anims.generateFrameNames(this.atlasKey, { prefix: this.prefixThrow, start: 1, end: 3}),
			frameRate: 5
		});
		this.scene.anims.create({
			key: "trap_detonate",
			frames: this.scene.anims.generateFrameNames(this.atlasKey, { prefix: this.prefixDetonate, start: 1, end: 5}),
			frameRate: 20
		});
		this.on('animationstart', (animation, frame) => {
			if (animation.key === 'trap_detonate'){
				this.hb = this.scene.add.zone(
					this.x, 
					this.y + this.height - 10, 
					350, 110
				);
				this.scene.physics.add.existing(this.hb, true);
				this.hb.body.debugBodyColor = 0x00ff00;
				this.scene.addColision(this.hb, this.fighter);
			}
		});
		this.on('animationcomplete', (animation, frame) => {
			if (animation.key === 'trap_detonate'){
				this.scene.destroyHB(this.hb);
				this.hb.destroy();
				this.destroy();
			}
		});
		this.scene.physics.add.collider(this, this.scene.floor);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);
		this.anims.startAnimation("trap_throw");
		this.anims.chain("trap_detonate");
	}
	
}