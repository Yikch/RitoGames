//This class is a initial screen that displays the game logo and a button to start the game

import start from '../../assets/background/initScreen.jpg';

export default class InitialScreen extends Phaser.Scene {
	constructor() {
		super({ key: 'initialScreen' });
	}

	preload() {
		this.load.image('start', start);
	}

	create() {
		const { width, height } = this.scale;
		this.add.image(0, 0, 'start').setDisplaySize(width, height).setOrigin(0,0);
		this.add.text(width/2 - 150, height/2 + 50, 'start').setFontSize(150).setStroke("Yellow", 15)
			.setColor("Black").setInteractive().on('pointerdown', () => {
			this.scene.start('fight');
		});
	}
}