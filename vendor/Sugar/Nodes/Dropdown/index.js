import { Button, Menu } from '../../../Sugar/index.js';

class Dropdown extends Button {
    #menu = null;
    #onWindowClick = null;

    constructor(args = {}) {
        super(args);

        this.alignMenu = args.alignMenu;

        if (args.menu) {
            if (Array.isArray(args.menu)) { 
                this.menuClass = args.menuClass;
                this.#menu = new Menu({ 
                    items: args.menu,
                    class: this.menuClass
                }); 
            }
            else if (typeof args.menu === 'object') { this.#menu = args.menu; }

            document.body.appendChild(this.#menu.dom);
            this.on('click', () => { this.openMenu() });

            this.#onWindowClick = (e) => {
                if (!this.#menu.dom.contains(e.target) && !this.dom.contains(e.target)) {this.closeMenu()}
            };

            window.addEventListener('click', this.#onWindowClick);
        }
    }

    set hideMenu(value){this.#menu.hidden = value;}

    openMenu() {
        if (!this.#menu) return;
        const rect = this.dom.getBoundingClientRect();
        let vertical =  rect.bottom;
        let horizontal = rect.left;
        this.#menu.hidden = false;
        const menuWidth = this.#menu._containerMenuItems.dom.offsetWidth;

        if(this.alignMenu === 'right') {horizontal = rect.right - menuWidth}

        this.#menu.position(horizontal, vertical);
        // this.#menu.position(rect.left, rect.bottom);
    }

    closeMenu() {
        if (this.#menu) {
            this.#menu.hidden = true;
        }
    }

    destroy() {
        if (!this.#menu) return;

        window.removeEventListener('click', this.#onWindowClick);
        this.#menu.destroy?.();
        this.#menu = null;

        super.destroy?.();
    }
}

export { Dropdown };
