import Phaser from 'phaser';

export default class GameEndPanel extends Phaser.Scene {
    constructor() {
        super({ key: 'GameEndPanel' });
    }

    preload() {
    }

	init(data) {
		console.log('GameEndPanel: ', data);
		this.fighter1Id = data.player1;
		this.fighter2Id = data.player2;
		this.player1Dmg = data.player1Dmg;
		this.player2Dmg = data.player2Dmg;
		this.numberRounds = data.numberRounds;
		this.roundTime = data.roundTime;
		this.dmgModifier = data.dmgModifier;
		this.hpModifier = data.hpModifier;
		this.winner = data.winner;
	}

    create() {
		let iniX = this.game.renderer.width/2;
		this.box = this.add.image(iniX, 500, 'boxFrame', 1).setDisplaySize(900, 800)
		// Winner
		this.add.text(iniX, 350, 'Winner: ' + this.winner, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }).setOrigin(0.5);
		const rematchButton = this.add.image(iniX, 450, 'button').setInteractive().setDisplaySize(200, 50);
		const rematchText = this.add.text(iniX, 450, 'Rematch', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }).setOrigin(0.5);
		rematchButton.on('pointerover', () => {
			rematchButton.setTexture('button_hover');
		});
		rematchButton.on('pointerout', () => {
			rematchButton.setTexture('button');
		});
		rematchButton.on('pointerup', () => {
			console.log('Rematch button clicked');
			this.scene.stop();
			this.scene.get('fight').scene.restart({
				playerVictories: [0, 0],
				player1: this.fighter1Id,
				player2: this.fighter2Id,
				player1Dmg: this.player1Dmg,
				player2Dmg: this.player2Dmg,
				numberRounds: this.numberRounds,
				roundTime: this.roundTime,
				dmgModifier: this.dmgModifier,
				hpModifier: this.hpModifier
			});
		});

		// Choose Fighter button
		const chooseFighterButton = this.add.image(iniX, 550, 'button').setInteractive().setDisplaySize(200, 50);
		const chooseFighterText = this.add.text(iniX, 550, 'Fighter Select', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }).setOrigin(0.5);
		chooseFighterButton.on('pointerover', () => {
			chooseFighterButton.setTexture('button_hover');
		});
		chooseFighterButton.on('pointerout', () => {
			chooseFighterButton.setTexture('button');
		});
		chooseFighterButton.on('pointerup', () => {
			console.log('Choose Fighter button clicked');
			this.scene.get("fight").scene.stop();
			this.scene.start('FighterChooser', "from GameEndPanel");
		});

		// Exit button
		const exitButton = this.add.image(iniX, 650, 'button').setInteractive().setDisplaySize(200, 50);
		const exitText = this.add.text(iniX, 650, 'Exit', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }).setOrigin(0.5);
		exitButton.on('pointerover', () => {
			exitButton.setTexture('button_hover');
		});
		exitButton.on('pointerout', () => {
			exitButton.setTexture('button');
		});
		exitButton.on('pointerup', () => {
			console.log('Exit button clicked');
			this.scene.get("fight").scene.stop();
			this.scene.start('menu', "from GameEndPanel");
		});
    }
}
