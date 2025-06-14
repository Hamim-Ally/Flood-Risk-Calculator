import { CLASS_RESIZABLE, CLASS_FLEX, CLASS_GRID, CLASS_SCROLLABLE } from '../../class.js';
import { Element } from '../Element/index.js';

const RESIZE_HANDLE_SIZE = 4;
const VALID_RESIZABLE_VALUES = [
    null,
    'top',
    'right',
    'bottom',
    'left'
];
const CLASS_RESIZING = `${CLASS_RESIZABLE}-resizing`;
const CLASS_RESIZABLE_HANDLE = 'pcui-resizable-handle';
const CLASS_CONTAINER = 'container';
const CLASS_DRAGGED = `${CLASS_CONTAINER}-dragged`;
const CLASS_DRAGGED_CHILD = `${CLASS_DRAGGED}-child`;
/**
 * A container is the basic building block for {@link Element}s that are grouped together. A
 * container can contain any other element including other containers.
 */
class Container extends Element {
    /**
     * Creates a new Container.
     *
     * @param args - The arguments.
     */
    constructor(args = {}) {
        var _a;
        super(args);
        this._scrollable = false;
        this._flex = false;
        this._grid = false;
        this._domResizeHandle = null;
        this._resizePointerId = null;
        this._resizeData = null;
        this._resizeHorizontally = true;
        this._resizeMin = 100;
        this._resizeMax = 300;
        this._draggedStartIndex = -1;
        this._onScroll = (evt) => {
            this.emit('scroll', evt);
        };
        this._onResizeStart = (evt) => {
            if (this._resizePointerId !== null)
                return;
            evt.preventDefault();
            evt.stopPropagation();
            this._domResizeHandle.setPointerCapture(evt.pointerId);
            this._resizePointerId = evt.pointerId;
            this._resizeStart();
        };
        this._onResizeMove = (evt) => {
            if (this._resizePointerId !== evt.pointerId)
                return;
            evt.preventDefault();
            evt.stopPropagation();
            this._resizeMove(evt.clientX, evt.clientY);
        };
        this._onResizeEnd = (evt) => {
            if (this._resizePointerId !== evt.pointerId)
                return;
            evt.preventDefault();
            evt.stopPropagation();
            this._resizeEnd();
            this._domResizeHandle.releasePointerCapture(evt.pointerId);
            this._resizePointerId = null;
        };
        this.class.add(CLASS_CONTAINER);
        this.domContent = this._dom;
        // scroll
        if (args.scrollable) {
            this.scrollable = true;
        }
        // flex
        this.flex = !!args.flex;
        // grid
        let grid = !!args.grid;
        if (grid) {
            if (this.flex) {
                console.error('Invalid Container arguments: "grid" and "flex" cannot both be true.');
                grid = false;
            }
        }
        this.grid = grid;
        // resize related
        this.resizable = (_a = args.resizable) !== null && _a !== void 0 ? _a : null;
        if (args.resizeMin !== undefined) {
            this.resizeMin = args.resizeMin;
        }
        if (args.resizeMax !== undefined) {
            this.resizeMax = args.resizeMax;
        }
    }
    destroy() {
        if (this._destroyed)
            return;
        this.domContent = null;
        if (this._domResizeHandle) {
            this._domResizeHandle.removeEventListener('pointerdown', this._onResizeStart);
            this._domResizeHandle.removeEventListener('pointermove', this._onResizeMove);
            this._domResizeHandle.removeEventListener('pointerup', this._onResizeEnd);
        }
        super.destroy();
    }
    /**
     * Appends an element to the container.
     *
     * @param {Element} element - The element to append.
     */
    append(element) {
        const dom = this._getDomFromElement(element);
        this._domContent.appendChild(dom);
        this._onAppendChild(element);
    }
    /**
     * Appends an element to the container before the specified reference element.
     *
     * @param {Element} element - The element to append.
     * @param {Element} referenceElement - The element before which the element will be appended.
     */
    appendBefore(element, referenceElement) {
        const dom = this._getDomFromElement(element);
        this._domContent.appendChild(dom);
        const referenceDom = referenceElement && this._getDomFromElement(referenceElement);
        this._domContent.insertBefore(dom, referenceDom);
        this._onAppendChild(element);
    }
    /**
     * Appends an element to the container just after the specified reference element.
     *
     * @param {Element} element - The element to append.
     * @param {Element} referenceElement - The element after which the element will be appended.
     */
    appendAfter(element, referenceElement) {
        const dom = this._getDomFromElement(element);
        const referenceDom = referenceElement && this._getDomFromElement(referenceElement);
        const elementBefore = referenceDom ? referenceDom.nextSibling : null;
        if (elementBefore) {
            this._domContent.insertBefore(dom, elementBefore);
        }
        else {
            this._domContent.appendChild(dom);
        }
        this._onAppendChild(element);
    }
    /**
     * Inserts an element in the beginning of the container.
     *
     * @param {Element} element - The element to prepend.
     */
    prepend(element) {
        const dom = this._getDomFromElement(element);
        const first = this._domContent.firstChild;
        if (first) {
            this._domContent.insertBefore(dom, first);
        }
        else {
            this._domContent.appendChild(dom);
        }
        this._onAppendChild(element);
    }
    /**
     * Removes the specified child element from the container.
     *
     * @param element - The element to remove.
     */
    remove(element) {
        if (element.parent !== this)
            return;
        const dom = this._getDomFromElement(element);
        this._domContent.removeChild(dom);
        this._onRemoveChild(element);
    }
    /**
     * Moves the specified child at the specified index.
     *
     * @param element - The element to move.
     * @param index - The index to move the element to.
     */
    move(element, index) {
        const idx = Array.prototype.indexOf.call(this.dom.childNodes, element.dom);
        if (idx === -1) {
            this.appendBefore(element, this.dom.childNodes[index]);
        }
        else if (index !== idx) {
            this.remove(element);
            if (index < idx) {
                this.appendBefore(element, this.dom.childNodes[index]);
            }
            else {
                this.appendAfter(element, this.dom.childNodes[index - 1]);
            }
        }
    }
    /**
     * Clears all children from the container.
     */
    clear() {
        let i = this._domContent.childNodes.length;
        while (i--) {
            const node = this._domContent.childNodes[i];
            if (node.ui && node.ui !== this) {
                node.ui.destroy();
            }
        }
        if (this._domResizeHandle) {
            this._domResizeHandle.removeEventListener('pointerdown', this._onResizeStart);
            this._domResizeHandle.removeEventListener('pointermove', this._onResizeMove);
            this._domResizeHandle.removeEventListener('pointerup', this._onResizeEnd);
            this._domResizeHandle = null;
        }
        this._domContent.innerHTML = '';
        if (this.resizable) {
            this._createResizeHandle();
            this._dom.appendChild(this._domResizeHandle);
        }
    }
    // Used for backwards compatibility with the legacy ui framework
    _getDomFromElement(element) {
        if (element.dom) {
            return element.dom;
        }
        if (element.element) {
            // console.log('Legacy ui.Element passed to Container', this.class, element.class);
            return element.element;
        }
        return element;
    }
    _onAppendChild(element) {
        element.parent = this;
        this.emit('append', element);
    }
    _onRemoveChild(element) {
        element.parent = null;
        this.emit('remove', element);
    }
    _createResizeHandle() {
        const handle = document.createElement('div');
        handle.classList.add(CLASS_RESIZABLE_HANDLE);
        handle.ui = this;
        handle.addEventListener('pointerdown', this._onResizeStart);
        handle.addEventListener('pointermove', this._onResizeMove);
        handle.addEventListener('pointerup', this._onResizeEnd);
        this._domResizeHandle = handle;
    }
    _resizeStart() {
        this.class.add(CLASS_RESIZING);
    }
    _resizeMove(x, y) {
        // if we haven't initialized resizeData do so now
        if (!this._resizeData) {
            this._resizeData = {
                x: x,
                y: y,
                width: this.dom.clientWidth,
                height: this.dom.clientHeight
            };
            return;
        }
        if (this._resizeHorizontally) {
            // horizontal resizing
            let offsetX = this._resizeData.x - x;
            if (this._resizable === 'right') {
                offsetX = -offsetX;
            }
            this.width = RESIZE_HANDLE_SIZE + Math.max(this._resizeMin, Math.min(this._resizeMax, (this._resizeData.width + offsetX)));
        }
        else {
            // vertical resizing
            let offsetY = this._resizeData.y - y;
            if (this._resizable === 'bottom') {
                offsetY = -offsetY;
            }
            this.height = Math.max(this._resizeMin, Math.min(this._resizeMax, (this._resizeData.height + offsetY)));
        }
        this.emit('resize');
    }
    _resizeEnd() {
        this._resizeData = null;
        this.class.remove(CLASS_RESIZING);
    }
    /**
     * Resize the container.
     *
     * @param x - The number of pixels to resize the width.
     * @param y - The number of pixels to resize the height.
     */
    resize(x = 0, y = 0) {
        this._resizeStart();
        this._resizeMove(0, 0);
        this._resizeMove(-x + RESIZE_HANDLE_SIZE, -y);
        this._resizeEnd();
    }
    _getDraggedChildIndex(draggedChild) {
        for (let i = 0; i < this.dom.childNodes.length; i++) {
            if (this.dom.childNodes[i].ui === draggedChild) {
                return i;
            }
        }
        return -1;
    }
    _onChildDragStart(evt, childPanel) {
        this.class.add(CLASS_DRAGGED_CHILD);
        this._draggedStartIndex = this._getDraggedChildIndex(childPanel);
        childPanel.class.add(CLASS_DRAGGED);
        this.emit('child:dragstart', childPanel, this._draggedStartIndex);
    }
    _onChildDragMove(evt, childPanel) {
        const rect = this.dom.getBoundingClientRect();
        const dragOut = (evt.clientX < rect.left || evt.clientX > rect.right || evt.clientY < rect.top || evt.clientY > rect.bottom);
        const childPanelIndex = this._getDraggedChildIndex(childPanel);
        if (dragOut) {
            childPanel.class.remove(CLASS_DRAGGED);
            if (this._draggedStartIndex !== childPanelIndex) {
                this.remove(childPanel);
                if (this._draggedStartIndex < childPanelIndex) {
                    this.appendBefore(childPanel, this.dom.childNodes[this._draggedStartIndex]);
                }
                else {
                    this.appendAfter(childPanel, this.dom.childNodes[this._draggedStartIndex - 1]);
                }
            }
            return;
        }
        childPanel.class.add(CLASS_DRAGGED);
        const y = evt.clientY - rect.top;
        let ind = null;
        // hovered script
        for (let i = 0; i < this.dom.childNodes.length; i++) {
            const otherPanel = this.dom.childNodes[i].ui;
            const otherTop = otherPanel.dom.offsetTop;
            if (i < childPanelIndex) {
                if (y <= otherTop + otherPanel.header.height) {
                    ind = i;
                    break;
                }
            }
            else if (i > childPanelIndex) {
                if (y + childPanel.height >= otherTop + otherPanel.height) {
                    ind = i;
                    break;
                }
            }
        }
        if (ind !== null && childPanelIndex !== ind) {
            this.remove(childPanel);
            if (ind < childPanelIndex) {
                this.appendBefore(childPanel, this.dom.childNodes[ind]);
            }
            else {
                this.appendAfter(childPanel, this.dom.childNodes[ind - 1]);
            }
        }
    }
    _onChildDragEnd(evt, childPanel) {
        this.class.remove(CLASS_DRAGGED_CHILD);
        childPanel.class.remove(CLASS_DRAGGED);
        const index = this._getDraggedChildIndex(childPanel);
        this.emit('child:dragend', childPanel, index, this._draggedStartIndex);
        this._draggedStartIndex = -1;
    }
    /**
     * Iterate over each child element using the supplied function. To early out of the iteration,
     * return `false` from the function.
     *
     * @param fn - The function to call for each child element.
     */
    forEachChild(fn) {
        for (let i = 0; i < this.dom.childNodes.length; i++) {
            const node = this.dom.childNodes[i].ui;
            if (node) {
                const result = fn(node, i);
                if (result === false) {
                    // early out
                    break;
                }
            }
        }
    }
    /**
     * If the current node contains a root, recursively append its children to this node
     * and return it. Otherwise return the current node. Also add each child to the parent
     * under its keyed name.
     *
     * @param node - The current element in the dom structure which must be recursively
     * traversed and appended to its parent.
     * @param node.root - The root node of the dom structure.
     * @param node.children - The children of the root node.
     * @returns The recursively appended element node.
     */
    _buildDomNode(node) {
        const keys = Object.keys(node);
        let rootNode;
        if (keys.includes('root')) {
            rootNode = this._buildDomNode(node.root);
            node.children.forEach((childNode) => {
                const childNodeElement = this._buildDomNode(childNode);
                if (childNodeElement !== null) {
                    rootNode.append(childNodeElement);
                }
            });
        }
        else {
            rootNode = node[keys[0]];
            // @ts-ignore
            this[`_${keys[0]}`] = rootNode;
        }
        return rootNode;
    }
    /**
     * Takes an array of pcui elements, each of which can contain their own child elements, and
     * appends them to this container. These child elements are traversed recursively using
     * _buildDomNode.
     *
     * @param dom - An array of child pcui elements to append to this container.
     *
     * @example
     * buildDom([
     *     {
     *         child1: pcui.Label()
     *     },
     *     {
     *         root: {
     *             container1: pcui.Container()
     *         },
     *         children: [
     *             {
     *                 child2: pcui.Label()
     *             },
     *             {
     *                 child3: pcui.Label()
     *             }
     *         ]
     *     }
     * ]);
     */
    buildDom(dom) {
        dom.forEach((node) => {
            const builtNode = this._buildDomNode(node);
            this.append(builtNode);
        });
    }
    /**
     * Sets whether the Element supports flex layout.
     */
    set flex(value) {
        if (value === this._flex)
            return;
        this._flex = value;
        if (value) {
            this.class.add(CLASS_FLEX);
        }
        else {
            this.class.remove(CLASS_FLEX);
        }
    }
    /**
     * Gets whether the Element supports flex layout.
     */
    get flex() {
        return this._flex;
    }
    /**
     * Sets whether the Element supports the grid layout.
     */
    set grid(value) {
        if (value === this._grid)
            return;
        this._grid = value;
        if (value) {
            this.class.add(CLASS_GRID);
        }
        else {
            this.class.remove(CLASS_GRID);
        }
    }
    /**
     * Gets whether the Element supports the grid layout.
     */
    get grid() {
        return this._grid;
    }
    /**
     * Sets whether the Element should be scrollable.
     */
    set scrollable(value) {
        if (this._scrollable === value)
            return;
        this._scrollable = value;
        if (value) {
            this.class.add(CLASS_SCROLLABLE);
        }
        else {
            this.class.remove(CLASS_SCROLLABLE);
        }
    }
    /**
     * Gets whether the Element should be scrollable.
     */
    get scrollable() {
        return this._scrollable;
    }
    /**
     * Sets whether the Element is resizable and where the resize handle is located. Can be one of
     * 'top', 'bottom', 'right', 'left'. Set to null to disable resizing.
     */
    set resizable(value) {
        if (value === this._resizable)
            return;
        if (VALID_RESIZABLE_VALUES.indexOf(value) === -1) {
            console.error(`Invalid resizable value: must be one of ${VALID_RESIZABLE_VALUES.join(',')}`);
            return;
        }
        // remove old class
        if (this._resizable) {
            this.class.remove(`${CLASS_RESIZABLE}-${this._resizable}`);
        }
        this._resizable = value;
        this._resizeHorizontally = (value === 'right' || value === 'left');
        if (value) {
            // add resize class and create / append resize handle
            this.class.add(CLASS_RESIZABLE);
            this.class.add(`${CLASS_RESIZABLE}-${value}`);
            if (!this._domResizeHandle) {
                this._createResizeHandle();
            }
            this._dom.appendChild(this._domResizeHandle);
        }
        else {
            // remove resize class and resize handle
            this.class.remove(CLASS_RESIZABLE);
            if (this._domResizeHandle) {
                this._dom.removeChild(this._domResizeHandle);
            }
        }
    }
    /**
     * Gets whether the Element is resizable and where the resize handle is located.
     */
    get resizable() {
        return this._resizable;
    }
    /**
     * Sets the minimum size the Element can take when resized in pixels.
     */
    set resizeMin(value) {
        this._resizeMin = Math.max(0, Math.min(value, this._resizeMax));
    }
    /**
     * Gets the minimum size the Element can take when resized in pixels.
     */
    get resizeMin() {
        return this._resizeMin;
    }
    /**
     * Sets the maximum size the Element can take when resized in pixels.
     */
    set resizeMax(value) {
        this._resizeMax = Math.max(this._resizeMin, value);
    }
    /**
     * Gets the maximum size the Element can take when resized in pixels.
     */
    get resizeMax() {
        return this._resizeMax;
    }
    /**
     * Sets the internal DOM element used as a the container of all children. Can be overridden by
     * derived classes.
     */
    set domContent(value) {
        if (this._domContent === value)
            return;
        if (this._domContent) {
            this._domContent.removeEventListener('scroll', this._onScroll);
        }
        this._domContent = value;
        if (this._domContent) {
            this._domContent.addEventListener('scroll', this._onScroll);
        }
    }
    /**
     * Gets the internal DOM element used as a the container of all children.
     */
    get domContent() {
        return this._domContent;
    }
}
/**
 * Fired when a child Element gets added to the Container.
 *
 * @event
 * @example
 * ```ts
 * const container = new Container();
 * container.on('append', (element: Element) => {
 *     console.log('Element added to container:', element);
 * });
 * ```
 */
Container.EVENT_APPEND = 'append';
/**
 * Fired when a child Element gets removed from the Container.
 *
 * @event
 * @example
 * ```ts
 * const container = new Container();
 * container.on('remove', (element: Element) => {
 *     console.log('Element removed from container:', element);
 * });
 * ```
 */
Container.EVENT_REMOVE = 'remove';
/**
 * Fired when the container is scrolled. The native DOM scroll event is passed to the event handler.
 *
 * @event
 * @example
 * ```ts
 * const container = new Container();
 * container.on('scroll', (event: Event) => {
 *     console.log('Container scrolled:', event);
 * });
 * ```
 */
Container.EVENT_SCROLL = 'scroll';
/**
 * Fired when the container gets resized using the resize handle.
 *
 * @event
 * @example
 * ```ts
 * const container = new Container();
 * container.on('resize', () => {
 *     console.log('Container resized to:', container.width, container.height, 'px');
 * });
 * ```
 */
Container.EVENT_RESIZE = 'resize';
Element.register('container', Container);

export { Container };
//# sourceMappingURL=index.js.map
