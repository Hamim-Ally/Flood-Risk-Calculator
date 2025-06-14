/**
 * EventHandle manages the binding and unbinding of event listeners. It provides a convenient way
 * to add, remove, and invoke event handlers associated with specific event names. Each EventHandle
 * is linked to an 'owner' object, typically an instance of the Events class, allowing for elegant
 * event management and chaining.
 */
var EventHandle = /** @class */ (function () {
    /**
     * Creates an instance of EventHandle.
     *
     * @param owner - Owner
     * @param name - Name
     * @param fn - Callback function
     */
    function EventHandle(owner, name, fn) {
        this.owner = owner;
        this.name = name;
        this.fn = fn;
    }
    /**
     * Unbinds the event handle from the owner, effectively removing the event listener. After
     * calling this method, the event handle will no longer trigger the callback function when the
     * event is emitted.
     */
    EventHandle.prototype.unbind = function () {
        if (!this.owner) {
            return;
        }
        this.owner.unbind(this.name, this.fn);
        this.owner = null;
        this.name = null;
        this.fn = null;
    };
    /**
     * Invokes the callback function associated with the event handle. This method directly
     * triggers the event's callback without the event being emitted by the event system.
     */
    EventHandle.prototype.call = function (_events) {
        if (!this.fn) {
            return;
        }
        this.fn.call(this.owner, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
    };
    /**
     * Registers a new event listener on the same owner as the EventHandle. This method allows
     * chaining additional event listeners to the owner of this event handle.
     *
     * @param name - Name
     * @param fn - Callback function
     * @returns EventHandle
     */
    EventHandle.prototype.on = function (name, fn) {
        return this.owner.on(name, fn);
    };
    return EventHandle;
}());

export { EventHandle };
