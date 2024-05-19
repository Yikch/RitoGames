export default class ConfigButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, action, scale) {
        super(scene, x, y);

        this.actionTriggered = false;
        this.buttonImage = scene.add.image(0, 0, "button").setDepth(1).setScale(scale);
        this.add(this.buttonImage);

        this.buttonText = scene.add.text(0, 0, text, {
            fontFamily: 'Pixelify Sans',
            fontSize: (scale * 10),
            color: '#000000'
        }).setDepth(1).setOrigin(0.5, 0.5);
        this.add(this.buttonText);

        this.setSize(this.buttonImage.width * scale, this.buttonImage.height * scale);
        this.setInteractive();

        // Add pointer events
        this.on("pointerover", () => {
            this.buttonImage.setTexture("button_hover");
        });
        this.on("pointerout", () => {
            this.buttonImage.setTexture("button");
        });
        this.on("pointerup", () => {
            this.buttonImage.setTexture("button_pressed");
            action();
        });


        // Add this container to the scene
        scene.add.existing(this);
    }
}
