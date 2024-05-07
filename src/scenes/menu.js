
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
        this.addButton("Start Game", this.game.renderer.height/2 + 350, ()=>this.moveToFightScene());
    }

    moveToFightScene(){
        this.scene.start('fight', "from loadScene");
    }

    addButton(text, height, action){
        let button = this.add.image(this.game.renderer.width/2, height, "button").setDepth(1).setScale(10);
        this.add.text(this.game.renderer.width/2, height, text, { fontFamily: 'Pixelify Sans',fontSize: 60, color: '#000000' }).setDepth(1).setOrigin(0.5, 0.5);
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

