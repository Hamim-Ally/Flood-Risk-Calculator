import { Container } from '../Container/index.js';
import { Element } from '../Element/index.js';
import { Label } from '../Label/index.js';

const CLASS_LABEL_GROUP = 'label-group';
const CLASS_LABEL_TOP = `${CLASS_LABEL_GROUP}-align-top`;
/**
 * Represents a group of an {@link Element} and a {@link Label}. Useful for rows of labeled fields.
 */
class LabelGroup extends Container {
    /**
     * Creates a new LabelGroup.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a, _b;
        super(args);
        this.class.add(CLASS_LABEL_GROUP);
        this._label = new Label({
            text: (_a = args.text) !== null && _a !== void 0 ? _a : 'Label',
            nativeTooltip: args.nativeTooltip
        });
        this.append(this._label);
        this._field = (_b = args.field) !== null && _b !== void 0 ? _b : null;
        if (this._field) {
            this.append(this._field);
        }
        this.labelAlignTop = args.labelAlignTop;
    }
    /**
     * The label element.
     */
    get label() {
        return this._label;
    }
    /**
     * The field element.
     */
    get field() {
        return this._field;
    }
    /**
     * Sets the text of the label.
     */
    set text(value) {
        this._label.text = value;
    }
    /**
     * Gets the text of the label.
     */
    get text() {
        return this._label.text;
    }
    /**
     * Sets whether to align the label at the top of the group. Defaults to `false` which aligns it at the center.
     */
    set labelAlignTop(value) {
        if (value) {
            this.class.add(CLASS_LABEL_TOP);
        }
        else {
            this.class.remove(CLASS_LABEL_TOP);
        }
    }
    /**
     * Gets whether to align the label at the top of the group.
     */
    get labelAlignTop() {
        return this.class.contains(CLASS_LABEL_TOP);
    }
}
Element.register('labelgroup', LabelGroup);

export { LabelGroup };
//# sourceMappingURL=index.js.map
