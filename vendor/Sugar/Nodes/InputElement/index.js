import { CLASS_FOCUS } from '../../class.js';
import { Element } from '../Element/index.js';

const CLASS_INPUT_ELEMENT = 'pcui-input-element';
/**
 * The InputElement is an abstract class that manages an input DOM element. It is the superclass of
 * {@link TextInput} and {@link NumericInput}. It is not intended to be used directly.
 */
class InputElement extends Element {
    constructor(args = {}) {
        var _a, _b, _c, _d, _e;
        super(args);
        /**
         * Determines whether the input should blur when the enter key is pressed.
         */
        this.blurOnEnter = true;
        /**
         * Determines whether the input should blur when the escape key is pressed.
         */
        this.blurOnEscape = true;
        this._onInputFocus = (evt) => {
            this.class.add(CLASS_FOCUS);
            this.emit('focus', evt);
            this._prevValue = this._domInput.value;
        };
        this._onInputBlur = (evt) => {
            this.class.remove(CLASS_FOCUS);
            this.emit('blur', evt);
        };
        this._onInputKeyUp = (evt) => {
            if (evt.key !== 'Escape') {
                this._onInputChange(evt);
            }
            this.emit('keyup', evt);
        };
        this._onInputCtxMenu = (evt) => {
            this._domInput.select();
        };
        this._updateInputReadOnly = () => {
            const readOnly = !this.enabled || this.readOnly;
            if (readOnly) {
                this._domInput.setAttribute('readonly', 'true');
            }
            else {
                this._domInput.removeAttribute('readonly');
            }
        };
        this.class.add(CLASS_INPUT_ELEMENT);
        let input = args.input;
        if (!input) {
            input = document.createElement('input');
            input.type = 'text';
        }
        input.ui = this;
        input.tabIndex = 0;
        input.autocomplete = 'off';
        this._onInputKeyDownEvt = this._onInputKeyDown.bind(this);
        this._onInputChangeEvt = this._onInputChange.bind(this);
        input.addEventListener('change', this._onInputChangeEvt);
        input.addEventListener('keydown', this._onInputKeyDownEvt);
        input.addEventListener('focus', this._onInputFocus);
        input.addEventListener('blur', this._onInputBlur);
        input.addEventListener('contextmenu', this._onInputCtxMenu, false);
        this.dom.appendChild(input);
        this._domInput = input;
        this._suspendInputChangeEvt = false;
        if (args.value !== undefined) {
            this._domInput.value = args.value;
        }
        this.placeholder = (_a = args.placeholder) !== null && _a !== void 0 ? _a : '';
        this.renderChanges = (_b = args.renderChanges) !== null && _b !== void 0 ? _b : false;
        this.blurOnEnter = (_c = args.blurOnEnter) !== null && _c !== void 0 ? _c : true;
        this.blurOnEscape = (_d = args.blurOnEscape) !== null && _d !== void 0 ? _d : true;
        this.keyChange = (_e = args.keyChange) !== null && _e !== void 0 ? _e : false;
        this._prevValue = null;
        this.on('change', () => {
            if (this.renderChanges) {
                this.flash();
            }
        });
        this.on('disable', this._updateInputReadOnly);
        this.on('enable', this._updateInputReadOnly);
        this.on('readOnly', this._updateInputReadOnly);
        this._updateInputReadOnly();
    }
    destroy() {
        if (this._destroyed)
            return;
        const input = this._domInput;
        input.removeEventListener('change', this._onInputChangeEvt);
        input.removeEventListener('keydown', this._onInputKeyDownEvt);
        input.removeEventListener('focus', this._onInputFocus);
        input.removeEventListener('blur', this._onInputBlur);
        input.removeEventListener('keyup', this._onInputKeyUp);
        input.removeEventListener('contextmenu', this._onInputCtxMenu);
        super.destroy();
    }
    _onInputKeyDown(evt) {
        if (evt.key === 'Enter' && this.blurOnEnter) {
            // do not fire input change event on blur
            // if keyChange is true (because a change event)
            // will have already been fired before for the current
            // value
            this._suspendInputChangeEvt = this.keyChange;
            this._domInput.blur();
            this._suspendInputChangeEvt = false;
        }
        else if (evt.key === 'Escape') {
            this._suspendInputChangeEvt = true;
            const prev = this._domInput.value;
            this._domInput.value = this._prevValue;
            this._suspendInputChangeEvt = false;
            // manually fire change event
            if (this.keyChange && prev !== this._prevValue) {
                this._onInputChange(evt);
            }
            if (this.blurOnEscape) {
                this._domInput.blur();
            }
        }
        this.emit('keydown', evt);
    }
    _onInputChange(evt) { }
    focus(select) {
        this._domInput.focus();
        if (select) {
            this._domInput.select();
        }
    }
    blur() {
        this._domInput.blur();
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
        var _a;
        return (_a = this.dom.getAttribute('placeholder')) !== null && _a !== void 0 ? _a : '';
    }
    /**
     * Sets the method to call when keyup is called on the input DOM element.
     */
    set keyChange(value) {
        if (this._keyChange === value)
            return;
        this._keyChange = value;
        if (value) {
            this._domInput.addEventListener('keyup', this._onInputKeyUp);
        }
        else {
            this._domInput.removeEventListener('keyup', this._onInputKeyUp);
        }
    }
    /**
     * Gets the method to call when keyup is called on the input DOM element.
     */
    get keyChange() {
        return this._keyChange;
    }
    /**
     * Gets the input DOM element.
     */
    get input() {
        return this._domInput;
    }
    set renderChanges(value) {
        this._renderChanges = value;
    }
    get renderChanges() {
        return this._renderChanges;
    }
}

export { InputElement };
//# sourceMappingURL=index.js.map
