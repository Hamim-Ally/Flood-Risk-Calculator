import { Container, Overlay, Label, Button } from "../../vendor/Sugar/index.js";

class PopupWindow extends Overlay {

    constructor(args = {}) {
        super(args);
        this.class.add('popup-window')

        this.title = args.title;

        this.main = new Container({
            class: 'window-content',
            flex: true,
            flexDirection: 'column',
        });

        const header = new Container({
            class: 'header',
            flex: true,
            flexDirection: 'row',
            justifyContent: 'space-between',
        });

        const title = new Label({
            class: 'title',
            text: this.title,
        });


        const closeButton = new Button({
            class: 'close-button',
            icon: 'E132',
        });

        closeButton.on('click', () => this.hidden = true);

        header.append(title);
        header.append(closeButton);
        this.append(header);
        this.append(this.main);
    }

    appendElement(element) { this.main.append(element); }
}

export { PopupWindow }






