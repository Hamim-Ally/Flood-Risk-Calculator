import { Container } from '../Container/index.js';
import { Element } from '../Element/index.js';

const CLASS_INFOBOX = 'pcui-infobox';
/**
 * Represents an information box.
 */
class InfoBox extends Container {
    /**
     * Creates a new InfoBox.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a, _b, _c, _d;
        super(args);
        this._titleElement = new Element();
        this._textElement = new Element();
        this.class.add(CLASS_INFOBOX);
        this.append(this._titleElement);
        this.append(this._textElement);
        this._unsafe = (_a = args.unsafe) !== null && _a !== void 0 ? _a : false;
        this.icon = (_b = args.icon) !== null && _b !== void 0 ? _b : '';
        this.title = (_c = args.title) !== null && _c !== void 0 ? _c : '';
        this.text = (_d = args.text) !== null && _d !== void 0 ? _d : '';
    }
    /**
     * Sets the icon of the info box.
     */
    set icon(value) {
        if (this._icon === value)
            return;
        this._icon = value;
        if (value) {
            // set data-icon attribute but first convert the value to a code point
            this.dom.setAttribute('data-icon', String.fromCodePoint(parseInt(value, 16)));
        }
        else {
            this.dom.removeAttribute('data-icon');
        }
    }
    /**
     * Gets the icon of the info box.
     */
    get icon() {
        return this._icon;
    }
    /**
     * Sets the title of the info box.
     */
    set title(value) {
        if (this._title === value)
            return;
        this._title = value;
        if (this._unsafe) {
            this._titleElement.dom.innerHTML = value;
        }
        else {
            this._titleElement.dom.textContent = value;
        }
    }
    /**
     * Gets the title of the info box.
     */
    get title() {
        return this._title;
    }
    /**
     * Sets the text of the info box.
     */
    set text(value) {
        if (this._text === value)
            return;
        this._text = value;
        if (this._unsafe) {
            this._textElement.dom.innerHTML = value;
        }
        else {
            this._textElement.dom.textContent = value;
        }
    }
    /**
     * Gets the text of the info box.
     */
    get text() {
        return this._text;
    }
}
Element.register('infobox', InfoBox);

export { InfoBox };
//# sourceMappingURL=index.js.map
