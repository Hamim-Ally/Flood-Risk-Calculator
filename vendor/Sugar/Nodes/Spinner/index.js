import { Element } from '../Element/index.js';

const CLASS_ROOT = 'pcui-spinner';
function createSmallThick(size, dom) {
    const spinner = dom || document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spinner.classList.add('spin');
    spinner.setAttribute('width', size);
    spinner.setAttribute('height', size);
    spinner.setAttribute('viewBox', '0 0 14 14');
    spinner.setAttribute('fill', 'none');
    spinner.innerHTML = '<path d="M7 14C3.13871 14 0 10.8613 0 7C0 3.13871 3.13871 0 7 0C10.8613 0 14 3.13871 14 7C14 10.8613 10.8613 14 7 14ZM7 2.25806C4.38064 2.25806 2.25806 4.38064 2.25806 7C2.25806 9.61935 4.38064 11.7419 7 11.7419C9.61935 11.7419 11.7419 9.61935 11.7419 7C11.7419 4.38064 9.61935 2.25806 7 2.25806Z" fill="#773417"/><path class="pcui-spinner-highlight" d="M7 14V11.7419C9.61935 11.7419 11.7419 9.61935 11.7419 7H14C14 10.8613 10.8613 14 7 14Z" fill="#FF6600"/>';
    return spinner;
}
/**
 * Represents a spinning icon.
 */
class Spinner extends Element {
    /**
     * Creates a new Spinner.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a, _b;
        if (((_a = args.type) !== null && _a !== void 0 ? _a : 'small-thick') === Spinner.TYPE_SMALL_THICK) {
            const dom = createSmallThick((_b = args.size) !== null && _b !== void 0 ? _b : 12, args.dom);
            args = Object.assign(Object.assign({}, args), { dom });
        }
        super(args);
        this.class.add(CLASS_ROOT);
    }
}
Spinner.TYPE_SMALL_THICK = 'small-thick';

export { Spinner };
//# sourceMappingURL=index.js.map
