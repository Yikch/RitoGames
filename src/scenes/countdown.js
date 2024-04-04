//a scene that only does a countdown to start the game writing 3 2 1 fight in the middle fo the screen
//using a font of 64px and red color

import Phaser from 'phaser'

export default class Countdown extends Phaser.Scene
{
	constructor()
	{
		super('countdown')
	}

	preload()
	{
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	}

	create()
	{
		const { width, height } = this.scale
		WebFont.load({
			google: {
				families: [ 'Press Start 2P' ]
			},
			active: () => {
				this.text = this.add.text(width * 0.5, height * 0.5, '3', {
					fontFamily: 'Press Start 2P',
					fontSize: 80,
					color: '#ff0000'
				});
			}
		});

		this.time.delayedCall(1000, () => {
			this.text.setText('2');
		});

		this.time.delayedCall(2000, () => {
			this.text.setText('1');
		});

		this.time.delayedCall(3000, () => {
			this.text.setText('FIGHT!');
		});

		this.time.delayedCall(4000, () => {
			console.log(this.events.listeners('roundStart'));
			this.events.emit('roundStart');
			this.scene.stop('countdown');
		});

	}
}