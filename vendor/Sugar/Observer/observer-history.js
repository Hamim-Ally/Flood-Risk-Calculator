import { __extends } from './node_modules/tslib/tslib.es6.js';
import { Events } from './events.js';
import { Observer } from './observer.js';

/**
 * The ObserverHistory module provides a mechanism for tracking changes to an Observer object and
 * storing them in a history stack.
 */
var ObserverHistory = /** @class */ (function (_super) {
    __extends(ObserverHistory, _super);
    /**
     * @param args - Arguments
     */
    function ObserverHistory(args) {
        if (args === void 0) { args = {}; }
        var _this = _super.call(this) || this;
        _this._enabled = true;
        _this._prefix = '';
        _this._combine = false;
        _this._selfEvents = [];
        _this.item = args.item;
        _this._history = args.history;
        _this._enabled = args.enabled || true;
        _this._prefix = args.prefix || '';
        _this._combine = args.combine || false;
        _this._initialize();
        return _this;
    }
    ObserverHistory.prototype._initialize = function () {
        var _this = this;
        this._selfEvents.push(this.item.on('*:set', function (path, value, valueOld) {
            if (!_this._enabled || !_this._history)
                return;
            // need jsonify
            if (value instanceof Observer) {
                value = value.json();
            }
            // action
            var action = {
                name: _this._prefix + path,
                combine: _this._combine,
                undo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    if (valueOld === undefined) {
                        item.unset(path);
                    }
                    else {
                        item.set(path, valueOld);
                    }
                    item.history.enabled = true;
                },
                redo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    if (value === undefined) {
                        item.unset(path);
                    }
                    else {
                        item.set(path, value);
                    }
                    item.history.enabled = true;
                }
            };
            _this._history.add(action);
        }));
        this._selfEvents.push(this.item.on('*:unset', function (path, valueOld) {
            if (!_this._enabled || !_this._history)
                return;
            // action
            var action = {
                name: _this._prefix + path,
                combine: _this._combine,
                undo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.set(path, valueOld);
                    item.history.enabled = true;
                },
                redo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.unset(path);
                    item.history.enabled = true;
                }
            };
            _this._history.add(action);
        }));
        this._selfEvents.push(this.item.on('*:insert', function (path, value, ind) {
            if (!_this._enabled || !_this._history)
                return;
            // need jsonify
            // if (value instanceof Observer)
            //     value = value.json();
            // action
            var action = {
                name: _this._prefix + path,
                combine: _this._combine,
                undo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.removeValue(path, value);
                    item.history.enabled = true;
                },
                redo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.insert(path, value, ind);
                    item.history.enabled = true;
                }
            };
            _this._history.add(action);
        }));
        this._selfEvents.push(this.item.on('*:remove', function (path, value, ind) {
            if (!_this._enabled || !_this._history)
                return;
            // need jsonify
            // if (value instanceof Observer)
            //     value = value.json();
            // action
            var action = {
                name: _this._prefix + path,
                combine: _this._combine,
                undo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.insert(path, value, ind);
                    item.history.enabled = true;
                },
                redo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.removeValue(path, value);
                    item.history.enabled = true;
                }
            };
            _this._history.add(action);
        }));
        this._selfEvents.push(this.item.on('*:move', function (path, value, ind, indOld) {
            if (!_this._enabled || !_this._history)
                return;
            // action
            var action = {
                name: _this._prefix + path,
                combine: _this._combine,
                undo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.move(path, ind, indOld);
                    item.history.enabled = true;
                },
                redo: function () {
                    var item = _this.item.latest();
                    if (!item)
                        return;
                    item.history.enabled = false;
                    item.move(path, indOld, ind);
                    item.history.enabled = true;
                }
            };
            _this._history.add(action);
        }));
    };
    ObserverHistory.prototype.destroy = function () {
        this._selfEvents.forEach(function (evt) {
            evt.unbind();
        });
        this._selfEvents.length = 0;
        this.item = null;
    };
    Object.defineProperty(ObserverHistory.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObserverHistory.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        set: function (value) {
            this._prefix = value || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObserverHistory.prototype, "combine", {
        get: function () {
            return this._combine;
        },
        set: function (value) {
            this._combine = !!value;
        },
        enumerable: false,
        configurable: true
    });
    return ObserverHistory;
}(Events));

export { ObserverHistory };
