
import Phaser from 'phaser'


export default class Menu extends Phaser.Scene
{
    constructor()
	{
		super('menu')
	}
    create(){
        const {width, height } = this.scale;

        this.add.image(0, 0, "jungle_bg").setDisplaySize(width,height).setOrigin(0);
        //this.add.text(this.game.renderer.width/2, this.game.renderer.height/2, "Bellum Primordia", { fontFamily: 'Pixelify Sans',fontSize: 80, color: '#d7b89c' }).setOrigin(0.5, 0.5);
        this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, "title").setOrigin(0.5, 0.5).setScale(1);
        this.addButton("Start Game", this.game.renderer.height/2 + 350, ()=>this.moveToFightScene(), 10);
        const buttonEnt = this.add.image(this.game.renderer.width-100, this.game.renderer.height-100, 'fullscreenEnt', 0).setOrigin(0).setInteractive().setScale(7);
		const buttonExt = this.add.image(this.game.renderer.width-100, this.game.renderer.height-100, 'fullscreenExt', 0).setOrigin(0).setInteractive().setScale(7);
        buttonExt.setVisible(false);
        buttonEnt.on('pointerup', function ()
        {
            this.scale.startFullscreen();
            buttonEnt.setVisible(false);
            buttonExt.setVisible(true);
        }, this);     
        buttonExt.on('pointerup', function ()
        {
            this.scale.stopFullscreen();
            buttonExt.setVisible(false);
            buttonEnt.setVisible(true);
        }, this);


    }

    moveToFightScene(){
        this.scene.start('FighterChooser', "from loadScene");
    }

    addButton(text, height, action, scale){
        let button = this.add.image(this.game.renderer.width/2, height, "button").setDepth(1).setScale(scale);
        this.add.text(this.game.renderer.width/2, height, text, { fontFamily: 'Pixelify Sans',fontSize: (scale*6), color: '#000000' }).setDepth(1).setOrigin(0.5, 0.5);
        button.setInteractive();

        button.on("pointerover", ()=>{
            button.setTexture("button_hover");
        });

        button.on("pointerout", ()=>{
            button.setTexture("button");
        });

        button.on("pointerup", ()=>{
            button.setTexture("button_pressed");
            button.setTexture("button_selected");
            action();
        });

    }

    
}

