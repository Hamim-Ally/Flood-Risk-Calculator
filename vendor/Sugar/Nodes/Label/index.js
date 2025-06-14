import { CLASS_DEFAULT_MOUSEDOWN, CLASS_MULTIPLE_VALUES } from '../../class.js';
import { Element } from '../Element/index.js';

const CLASS_LABEL = 'label';
/**
 * The Label is a simple span element that displays some text.
 */
class Label extends Element {
    /**
     * Creates a new Label.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a, _b, _c;
        super(Object.assign({ dom: 'span' }, args));
        this.class.add(CLASS_LABEL);
        this._unsafe = (_a = args.unsafe) !== null && _a !== void 0 ? _a : false;
        this.text = (_c = (_b = args.text) !== null && _b !== void 0 ? _b : args.value) !== null && _c !== void 0 ? _c : '';
        if (args.allowTextSelection) {
            this.class.add(CLASS_DEFAULT_MOUSEDOWN);
        }
        if (args.nativeTooltip) {
            this.dom.title = this.text;
        }
        this.placeholder = args.placeholder;
        this.renderChanges = args.renderChanges;
        this.on('change', () => {
            if (this.renderChanges) {
                this.flash();
            }
        });
    }
    _updateText(value) {
        this.class.remove(CLASS_MULTIPLE_VALUES);
        if (this._text === value)
            return false;
        this._text = value;
        if (this._unsafe) {
            this._dom.innerHTML = value;
        }
        else {
            this._dom.textContent = value;
        }
        this.emit('change', value);
        return true;
    }
    /**
     * Sets the text of the Label.
     */
    set text(value) {
        if (value === undefined || value === null) {
            value = '';
        }
        const changed = this._updateText(value);
        if (changed && this._binding) {
            this._binding.setValue(value);
        }
    }
    /**
     * Gets the text of the Label.
     */
    get text() {
        return this._text;
    }
    set value(value) {
        this.text = value;
    }
    get value() {
        return this.text;
    }
    /* eslint accessor-pairs: 0 */
    set values(values) {
        const different = values.some(v => v !== values[0]);
        if (different) {
            this._updateText('');
            this.class.add(CLASS_MULTIPLE_VALUES);
        }
        else {
            this._updateText(values[0]);
        }
    }
    set placeholder(value) {
        if (value) {
            this.dom.setAttribute('placeholder', value);
        }
        else {
            this.dom.removeAttribute('placeholder');
        }
    }
    get placeholder() {
        return this.dom.getAttribute('placeholder');
    }
    set renderChanges(value) {
        this._renderChanges = value;
    }
    get renderChanges() {
        return this._renderChanges;
    }
}
Element.register('label', Label);

export { Label };
//# sourceMappingURL=index.js.map
