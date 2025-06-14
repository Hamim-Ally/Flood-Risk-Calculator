import { BindingObserversToElement } from '../../binding/BindingObserversToElement/index.js';
import { Container } from '../Container/index.js';
import { Label } from '../Label/index.js';
import { RadioButton } from '../RadioButton/index.js';

const CLASS_ROOT = 'pcui-gridview-item';
const CLASS_ROOT_RADIO = 'pcui-gridview-radio-container';
const CLASS_SELECTED = `${CLASS_ROOT}-selected`;
const CLASS_TEXT = `${CLASS_ROOT}-text`;
const CLASS_RADIO_BUTTON = 'pcui-gridview-radiobtn';
/**
 *  Represents a grid view item used in {@link GridView}.
 */
class GridViewItem extends Container {
    /**
     * Creates a new GridViewItem.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a, _b, _c;
        super(Object.assign({ tabIndex: 0 }, args));
        /**
         * Determines whether the item can be selected. Defaults to `true`.
         */
        this.allowSelect = true;
        this._onRadioButtonClick = () => {
            this._radioButton.value = this.selected;
        };
        this._onFocus = () => {
            this.emit('focus');
        };
        this._onBlur = () => {
            this.emit('blur');
        };
        this.allowSelect = (_a = args.allowSelect) !== null && _a !== void 0 ? _a : true;
        this._type = (_b = args.type) !== null && _b !== void 0 ? _b : null;
        this._selected = false;
        if (args.type === 'radio') {
            this.class.add(CLASS_ROOT_RADIO);
            this._radioButton = new RadioButton({
                class: CLASS_RADIO_BUTTON,
                binding: new BindingObserversToElement()
            });
            // @ts-ignore Remove radio button click event listener
            this._radioButton.dom.removeEventListener('click', this._radioButton._onClick);
            this._radioButton.dom.addEventListener('click', this._onRadioButtonClick);
            this.append(this._radioButton);
        }
        else {
            this.class.add(CLASS_ROOT);
        }
        this._labelText = new Label({
            class: CLASS_TEXT,
            binding: new BindingObserversToElement(),
            text: (_c = args.text) !== null && _c !== void 0 ? _c : ''
        });
        this.append(this._labelText);
        this.dom.addEventListener('focus', this._onFocus);
        this.dom.addEventListener('blur', this._onBlur);
    }
    destroy() {
        if (this._destroyed)
            return;
        this.dom.removeEventListener('focus', this._onFocus);
        this.dom.removeEventListener('blur', this._onBlur);
        super.destroy();
    }
    focus() {
        this.dom.focus();
    }
    blur() {
        this.dom.blur();
    }
    link(observers, paths) {
        this._labelText.link(observers, paths);
    }
    unlink() {
        this._labelText.unlink();
    }
    /**
     * Sets whether the item is selected.
     */
    set selected(value) {
        if (value) {
            this.focus();
        }
        if (this._selected === value)
            return;
        this._selected = value;
        if (value) {
            // Update radio button if it exists
            if (this._radioButton) {
                this._radioButton.value = value;
            }
            else {
                this.class.add(CLASS_SELECTED);
            }
            this.emit('select', this);
        }
        else {
            // Update radio button if it exists
            if (this._radioButton) {
                this._radioButton.value = false;
            }
            else {
                this.class.remove(CLASS_SELECTED);
            }
            this.emit('deselect', this);
        }
    }
    /**
     * Gets whether the item is selected.
     */
    get selected() {
        return this._selected;
    }
    /**
     * Sets the text of the item.
     */
    set text(value) {
        this._labelText.text = value;
    }
    /**
     * Gets the text of the item.
     */
    get text() {
        return this._labelText.text;
    }
    /**
     * Gets the next visible sibling grid view item.
     */
    get nextSibling() {
        let sibling = this.dom.nextSibling;
        while (sibling) {
            if (sibling.ui instanceof GridViewItem && !sibling.ui.hidden) {
                return sibling.ui;
            }
            sibling = sibling.nextSibling;
        }
        return null;
    }
    /**
     * Gets the previous visible sibling grid view item.
     */
    get previousSibling() {
        let sibling = this.dom.previousSibling;
        while (sibling) {
            if (sibling.ui instanceof GridViewItem && !sibling.ui.hidden) {
                return sibling.ui;
            }
            sibling = sibling.previousSibling;
        }
        return null;
    }
}

export { GridViewItem };
//# sourceMappingURL=index.js.map
