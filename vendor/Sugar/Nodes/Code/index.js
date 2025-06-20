import { Container } from '../Container/index.js';
import { Element } from '../Element/index.js';
import { Label } from '../Label/index.js';

const CLASS_ROOT = 'pcui-code';
const CLASS_INNER = `${CLASS_ROOT}-inner`;
/**
 * Represents a code block.
 */
class Code extends Container {
    /**
     * Creates a new Code.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        super(args);
        this.class.add(CLASS_ROOT);
        this._inner = new Label({
            class: CLASS_INNER
        });
        this.append(this._inner);
        if (args.text) {
            this.text = args.text;
        }
    }
    /**
     * Sets the text to display in the code block.
     */
    set text(value) {
        this._text = value;
        this._inner.text = value;
    }
    /**
     * Gets the text to display in the code block.
     */
    get text() {
        return this._text;
    }
}
Element.register('code', Code);

export { Code };
//# sourceMappingURL=index.js.map
