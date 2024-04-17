import Phaser from 'phaser'
import jungle_bg from '../../assets/background/images/Jungle.png';
import button_selected from '../../assets/UI/PixelArtUIElementsI/UI/Button/Button_selected.png';
import button_hover from '../../assets/UI/PixelArtUIElementsI/UI/Button/Button_hover.png';
import button_pressed from '../../assets/UI/PixelArtUIElementsI/UI/Button/Button_pressed.png';
import button from '../../assets/UI/PixelArtUIElementsI/UI/Button/Button.png';
export default class LoadScene extends Phaser.Scene
{
    constructor()
	{
		super('loadscene')
	}
    preload(){
        this.load.image("jungle_bg", jungle_bg)

        this.load.image("button_selected", button_selected)
        this.load.image("button_hover", button_hover)
        this.load.image("button_pressed", button_pressed)
        this.load.image("button", button)
        

        // ME DA ERROR: phaser.js:120866 Error decoding audio:
        //this.load.audio("title_music", "../../assets/sounds/victory.mp3"); 
        
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //color white
            }
        });

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        });

        this.load.on("complete", ()=>{
            console.log("donee");
        });

    }
    create(){
        this.scene.start('menu', "from loadScene");
    }
}