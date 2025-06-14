import { __extends } from './node_modules/tslib/tslib.es6.js';
import { Events } from './events.js';
import { arrayEquals } from './utils.js';

/**
 * The Observer class is used to observe and manage changes to an object. It allows for tracking
 * modifications to nested properties, emitting events on changes, and maintaining state
 * consistency. This is particularly useful in applications where state management and change
 * tracking are critical, such as in data-driven interfaces or collaborative applications.
 *
 * @example
 * const data = {
 *   name: 'John',
 *   age: 30,
 *   address: {
 *     city: 'New York',
 *     zip: '10001'
 *   }
 * };
 *
 * const observer = new Observer(data);
 *
 * observer.on('name:set', (newValue, oldValue) => {
 *   console.log(`Name changed from ${oldValue} to ${newValue}`);
 * });
 *
 * observer.set('name', 'Jane'); // Logs: Name changed from John to Jane
 */
var Observer = /** @class */ (function (_super) {
    __extends(Observer, _super);
    /**
     * Creates a new Observer instance.
     *
     * @param data - The initial data to observe.
     * @param options - Additional options for the observer.
     */
    function Observer(data, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._destroyed = false;
        _this._path = '';
        _this._keys = [];
        _this._data = {};
        _this._pathsWithDuplicates = null;
        _this._parent = null;
        _this._parentPath = '';
        _this._parentField = null;
        _this._parentKey = null;
        _this._latestFn = null;
        _this._silent = false;
        // array paths where duplicate entries are allowed - normally
        // we check if an array already has a value before inserting it
        // but if the array path is in here we'll allow it
        _this._pathsWithDuplicates = null;
        if (options.pathsWithDuplicates) {
            _this._pathsWithDuplicates = {};
            for (var i = 0; i < options.pathsWithDuplicates.length; i++) {
                _this._pathsWithDuplicates[options.pathsWithDuplicates[i]] = true;
            }
        }
        _this.patch(data);
        _this._parent = options.parent || null;
        _this._parentPath = options.parentPath || '';
        _this._parentField = options.parentField || null;
        _this._parentKey = options.parentKey || null;
        _this._latestFn = options.latestFn || null;
        _this._silent = false;
        var propagate = function (evt) {
            return function (path, arg1, arg2, arg3) {
                if (!this._parent) {
                    return;
                }
                var key = this._parentKey;
                if (!key && (this._parentField instanceof Array)) {
                    key = this._parentField.indexOf(this);
                    if (key === -1) {
                        return;
                    }
                }
                path = "".concat(this._parentPath, ".").concat(key, ".").concat(path);
                var state;
                if (this._silent) {
                    state = this._parent.silence();
                }
                this._parent.emit("".concat(path, ":").concat(evt), arg1, arg2, arg3);
                this._parent.emit("*:".concat(evt), path, arg1, arg2, arg3);
                if (this._silent) {
                    this._parent.silenceRestore(state);
                }
            };
        };
        // propagate set
        _this.on('*:set', propagate('set'));
        _this.on('*:unset', propagate('unset'));
        _this.on('*:insert', propagate('insert'));
        _this.on('*:remove', propagate('remove'));
        _this.on('*:move', propagate('move'));
        return _this;
    }
    Observer._splitPath = function (path) {
        var cache = Observer._splitPathsCache;
        var result = cache[path];
        if (!result) {
            result = path.split('.');
            cache[path] = result;
        }
        else {
            result = result.slice();
        }
        return result;
    };
    Observer.prototype.silence = function () {
        this._silent = true;
        // history hook to prevent array values to be recorded
        var historyState = this.history && this.history.enabled;
        if (historyState) {
            this.history.enabled = false;
        }
        // sync hook to prevent array values to be recorded as array root already did
        var syncState = this.sync && this.sync.enabled;
        if (syncState) {
            this.sync.enabled = false;
        }
        return [historyState, syncState];
    };
    Observer.prototype.silenceRestore = function (state) {
        this._silent = false;
        if (state[0]) {
            this.history.enabled = true;
        }
        if (state[1]) {
            this.sync.enabled = true;
        }
    };
    Observer.prototype._prepare = function (target, key, value, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var i;
        var state;
        var path = (target._path ? ("".concat(target._path, ".")) : '') + key;
        var type = typeof value;
        target._keys.push(key);
        if (type === 'object' && (value instanceof Array)) {
            target._data[key] = value.slice(0);
            for (i = 0; i < target._data[key].length; i++) {
                if (typeof target._data[key][i] === 'object' && target._data[key][i] !== null) {
                    if (target._data[key][i] instanceof Array) {
                        target._data[key][i].slice(0);
                    }
                    else {
                        target._data[key][i] = new Observer(target._data[key][i], {
                            parent: this,
                            parentPath: path,
                            parentField: target._data[key],
                            parentKey: null
                        });
                    }
                }
                else {
                    state = this.silence();
                    this.emit("".concat(path, ".").concat(i, ":set"), target._data[key][i], null, remote);
                    this.emit('*:set', "".concat(path, ".").concat(i), target._data[key][i], null, remote);
                    this.silenceRestore(state);
                }
            }
            if (silent) {
                state = this.silence();
            }
            this.emit("".concat(path, ":set"), target._data[key], null, remote);
            this.emit('*:set', path, target._data[key], null, remote);
            if (silent) {
                this.silenceRestore(state);
            }
        }
        else if (type === 'object' && (value instanceof Object)) {
            if (typeof target._data[key] !== 'object') {
                target._data[key] = {
                    _path: path,
                    _keys: [],
                    _data: {}
                };
            }
            for (i in value) {
                if (typeof value[i] === 'object') {
                    this._prepare(target._data[key], i, value[i], true, remote);
                }
                else {
                    state = this.silence();
                    target._data[key]._data[i] = value[i];
                    target._data[key]._keys.push(i);
                    this.emit("".concat(path, ".").concat(i, ":set"), value[i], null, remote);
                    this.emit('*:set', "".concat(path, ".").concat(i), value[i], null, remote);
                    this.silenceRestore(state);
                }
            }
            if (silent) {
                state = this.silence();
            }
            // passing undefined as valueOld here
            // but we should get the old value to be consistent
            this.emit("".concat(path, ":set"), value, undefined, remote);
            this.emit('*:set', path, value, undefined, remote);
            if (silent) {
                this.silenceRestore(state);
            }
        }
        else {
            if (silent) {
                state = this.silence();
            }
            target._data[key] = value;
            this.emit("".concat(path, ":set"), value, undefined, remote);
            this.emit('*:set', path, value, undefined, remote);
            if (silent) {
                this.silenceRestore(state);
            }
        }
        return true;
    };
    /**
     * @param path - Path to the property in the object.
     * @param value - Value to set.
     * @param silent - If true, the change will not be recorded in history.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @param force - If true, the value will be set even if it is the same as the current value.
     * @returns Returns true if the value was successfully set and false otherwise.
     */
    Observer.prototype.set = function (path, value, silent, remote, force) {
        var _this = this;
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        if (force === void 0) { force = false; }
        var i;
        var valueOld;
        var keys = Observer._splitPath(path);
        var length = keys.length;
        var key = keys[length - 1];
        var node = this;
        var nodePath = '';
        var obj = this;
        var state;
        for (i = 0; i < length - 1; i++) {
            if (node instanceof Array) {
                node = node[keys[i]];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else {
                if (i < length && typeof node._data[keys[i]] !== 'object') {
                    if (node._data[keys[i]]) {
                        obj.unset((node._path ? "".concat(node._path, ".") : '') + keys[i]);
                    }
                    node._data[keys[i]] = {
                        _path: path,
                        _keys: [],
                        _data: {}
                    };
                    node._keys.push(keys[i]);
                }
                if (i === length - 1 && node._path) {
                    nodePath = "".concat(node._path, ".").concat(keys[i]);
                }
                node = node._data[keys[i]];
            }
        }
        if (node instanceof Array) {
            var ind = parseInt(key, 10);
            if (node[ind] === value && !force) {
                return false;
            }
            valueOld = node[ind];
            if (valueOld instanceof Observer) {
                valueOld = valueOld.json();
            }
            else {
                valueOld = obj.json(valueOld);
            }
            node[ind] = value;
            if (value instanceof Observer) {
                value._parent = obj;
                value._parentPath = nodePath;
                value._parentField = node;
                value._parentKey = null;
            }
            if (silent) {
                state = obj.silence();
            }
            obj.emit("".concat(path, ":set"), value, valueOld, remote);
            obj.emit('*:set', path, value, valueOld, remote);
            if (silent) {
                obj.silenceRestore(state);
            }
            return true;
        }
        else if (node._data && !node._data.hasOwnProperty(key)) {
            if (typeof value === 'object') {
                return obj._prepare(node, key, value, false, remote);
            }
            node._data[key] = value;
            node._keys.push(key);
            if (silent) {
                state = obj.silence();
            }
            obj.emit("".concat(path, ":set"), value, null, remote);
            obj.emit('*:set', path, value, null, remote);
            if (silent) {
                obj.silenceRestore(state);
            }
            return true;
        }
        if (typeof value === 'object' && (value instanceof Array)) {
            if (arrayEquals(value, node._data[key]) && !force) {
                return false;
            }
            valueOld = node._data[key];
            if (!(valueOld instanceof Observer)) {
                valueOld = obj.json(valueOld);
            }
            if (node._data[key] && node._data[key].length === value.length) {
                state = obj.silence();
                // handle new array instance
                if (value.length === 0) {
                    node._data[key] = value;
                }
                for (i = 0; i < node._data[key].length; i++) {
                    if (node._data[key][i] instanceof Observer) {
                        node._data[key][i].patch(value[i], true);
                    }
                    else if (node._data[key][i] !== value[i]) {
                        node._data[key][i] = value[i];
                        obj.emit("".concat(path, ".").concat(i, ":set"), node._data[key][i], valueOld && valueOld[i] || null, remote);
                        obj.emit('*:set', "".concat(path, ".").concat(i), node._data[key][i], valueOld && valueOld[i] || null, remote);
                    }
                }
                obj.silenceRestore(state);
            }
            else {
                node._data[key] = [];
                value.forEach(function (val) {
                    _this._doInsert(node, key, val, undefined, true);
                });
                state = obj.silence();
                for (i = 0; i < node._data[key].length; i++) {
                    obj.emit("".concat(path, ".").concat(i, ":set"), node._data[key][i], valueOld && valueOld[i] || null, remote);
                    obj.emit('*:set', "".concat(path, ".").concat(i), node._data[key][i], valueOld && valueOld[i] || null, remote);
                }
                obj.silenceRestore(state);
            }
            if (silent) {
                state = obj.silence();
            }
            obj.emit("".concat(path, ":set"), value, valueOld, remote);
            obj.emit('*:set', path, value, valueOld, remote);
            if (silent) {
                obj.silenceRestore(state);
            }
            return true;
        }
        else if (typeof value === 'object' && (value instanceof Object)) {
            var changed = false;
            valueOld = node._data[key];
            if (!(valueOld instanceof Observer)) {
                valueOld = obj.json(valueOld);
            }
            keys = Object.keys(value);
            if (!node._data[key] || !node._data[key]._data) {
                if (node._data[key]) {
                    obj.unset((node._path ? "".concat(node._path, ".") : '') + key);
                }
                else {
                    changed = true;
                }
                node._data[key] = {
                    _path: path,
                    _keys: [],
                    _data: {}
                };
            }
            var c = void 0;
            for (var n in node._data[key]._data) {
                if (!value.hasOwnProperty(n)) {
                    c = obj.unset("".concat(path, ".").concat(n), true);
                    if (c)
                        changed = true;
                }
                else if (node._data[key]._data.hasOwnProperty(n)) {
                    if (!obj._equals(node._data[key]._data[n], value[n])) {
                        c = obj.set("".concat(path, ".").concat(n), value[n], true);
                        if (c)
                            changed = true;
                    }
                }
                else {
                    c = obj._prepare(node._data[key], n, value[n], true, remote);
                    if (c)
                        changed = true;
                }
            }
            for (i = 0; i < keys.length; i++) {
                if (value[keys[i]] === undefined && node._data[key]._data.hasOwnProperty(keys[i])) {
                    c = obj.unset("".concat(path, ".").concat(keys[i]), true);
                    if (c)
                        changed = true;
                }
                else if (typeof value[keys[i]] === 'object') {
                    if (node._data[key]._data.hasOwnProperty(keys[i])) {
                        c = obj.set("".concat(path, ".").concat(keys[i]), value[keys[i]], true);
                        if (c)
                            changed = true;
                    }
                    else {
                        c = obj._prepare(node._data[key], keys[i], value[keys[i]], true, remote);
                        if (c)
                            changed = true;
                    }
                }
                else if (!obj._equals(node._data[key]._data[keys[i]], value[keys[i]])) {
                    if (typeof value[keys[i]] === 'object') {
                        c = obj.set("".concat(node._data[key]._path, ".").concat(keys[i]), value[keys[i]], true);
                        if (c)
                            changed = true;
                    }
                    else if (node._data[key]._data[keys[i]] !== value[keys[i]]) {
                        changed = true;
                        if (node._data[key]._keys.indexOf(keys[i]) === -1) {
                            node._data[key]._keys.push(keys[i]);
                        }
                        node._data[key]._data[keys[i]] = value[keys[i]];
                        state = obj.silence();
                        obj.emit("".concat(node._data[key]._path, ".").concat(keys[i], ":set"), node._data[key]._data[keys[i]], null, remote);
                        obj.emit('*:set', "".concat(node._data[key]._path, ".").concat(keys[i]), node._data[key]._data[keys[i]], null, remote);
                        obj.silenceRestore(state);
                    }
                }
            }
            if (changed) {
                if (silent) {
                    state = obj.silence();
                }
                var val = obj.json(node._data[key]);
                obj.emit("".concat(node._data[key]._path, ":set"), val, valueOld, remote);
                obj.emit('*:set', node._data[key]._path, val, valueOld, remote);
                if (silent) {
                    obj.silenceRestore(state);
                }
                return true;
            }
            return false;
        }
        var data;
        if (!node.hasOwnProperty('_data') && node.hasOwnProperty(key)) {
            data = node;
        }
        else {
            data = node._data;
        }
        if (data[key] === value && !force) {
            return false;
        }
        if (silent) {
            state = obj.silence();
        }
        valueOld = data[key];
        if (!(valueOld instanceof Observer)) {
            valueOld = obj.json(valueOld);
        }
        data[key] = value;
        obj.emit("".concat(path, ":set"), value, valueOld, remote);
        obj.emit('*:set', path, value, valueOld, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    /**
     * Query whether the object has the specified property.
     *
     * @param path - Path to the value.
     * @returns Returns true if the value is present and false otherwise.
     */
    Observer.prototype.has = function (path) {
        var keys = Observer._splitPath(path);
        var node = this;
        for (var i = 0, len = keys.length; i < len; i++) {
            // eslint-disable-next-line eqeqeq
            if (node == undefined) {
                return undefined;
            }
            if (node._data) {
                node = node._data[keys[i]];
            }
            else {
                node = node[keys[i]];
            }
        }
        return node !== undefined;
    };
    /**
     * @param path - Path to the value.
     * @param raw - Retrieve the observer object without converting it to JSON.
     * @returns The value at the specified path.
     */
    Observer.prototype.get = function (path, raw) {
        if (raw === void 0) { raw = false; }
        var keys = Observer._splitPath(path);
        var node = this;
        for (var i = 0; i < keys.length; i++) {
            // eslint-disable-next-line eqeqeq
            if (node == undefined) {
                return undefined;
            }
            if (node._data) {
                node = node._data[keys[i]];
            }
            else {
                node = node[keys[i]];
            }
        }
        if (raw) {
            return node;
        }
        if (node == null) {
            return null;
        }
        return this.json(node);
    };
    Observer.prototype.getRaw = function (path) {
        return this.get(path, true);
    };
    Observer.prototype._equals = function (a, b) {
        if (a === b) {
            return true;
        }
        else if (a instanceof Array && b instanceof Array && arrayEquals(a, b)) {
            return true;
        }
        return false;
    };
    /**
     * @param path - Path to the value.
     * @param silent - If true, the change will not be recorded in history.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @returns Returns true if the value was successfully unset and false otherwise.
     */
    Observer.prototype.unset = function (path, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var i;
        var keys = Observer._splitPath(path);
        var key = keys[keys.length - 1];
        var node = this;
        var obj = this;
        for (i = 0; i < keys.length - 1; i++) {
            if (node instanceof Array) {
                node = node[keys[i]];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else {
                node = node._data[keys[i]];
            }
        }
        if (!node._data || !node._data.hasOwnProperty(key)) {
            return false;
        }
        var valueOld = node._data[key];
        if (!(valueOld instanceof Observer)) {
            valueOld = obj.json(valueOld);
        }
        // recursive
        if (node._data[key] && node._data[key]._data) {
            // do this in reverse order because node._data[key]._keys gets
            // modified as we loop
            for (i = node._data[key]._keys.length - 1; i >= 0; i--) {
                obj.unset("".concat(path, ".").concat(node._data[key]._keys[i]), true);
            }
        }
        node._keys.splice(node._keys.indexOf(key), 1);
        delete node._data[key];
        var state;
        if (silent) {
            state = obj.silence();
        }
        obj.emit("".concat(path, ":unset"), valueOld, remote);
        obj.emit('*:unset', path, valueOld, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    /**
     * @param path - Path to the value.
     * @param ind - Index of the value.
     * @param silent - If true, the remove event will not be emitted.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @returns Returns true if the value was successfully removed and false otherwise.
     */
    Observer.prototype.remove = function (path, ind, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var keys = Observer._splitPath(path);
        var key = keys[keys.length - 1];
        var node = this;
        var obj = this;
        for (var i = 0; i < keys.length - 1; i++) {
            if (node instanceof Array) {
                node = node[parseInt(keys[i], 10)];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else if (node._data && node._data.hasOwnProperty(keys[i])) {
                node = node._data[keys[i]];
            }
            else {
                return false;
            }
        }
        if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) {
            return false;
        }
        var arr = node._data[key];
        if (arr.length < ind) {
            return false;
        }
        var value = arr[ind];
        if (value instanceof Observer) {
            value._parent = null;
        }
        else {
            value = obj.json(value);
        }
        arr.splice(ind, 1);
        var state;
        if (silent) {
            state = obj.silence();
        }
        obj.emit("".concat(path, ":remove"), value, ind, remote);
        obj.emit('*:remove', path, value, ind, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    /**
     * @param path - Path to the value.
     * @param value - Value to remove.
     * @param silent - If true, the remove event will not be emitted.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @returns Returns true if the value was successfully removed and false otherwise.
     */
    Observer.prototype.removeValue = function (path, value, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var keys = Observer._splitPath(path);
        var key = keys[keys.length - 1];
        var node = this;
        var obj = this;
        for (var i = 0; i < keys.length - 1; i++) {
            if (node instanceof Array) {
                node = node[parseInt(keys[i], 10)];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else if (node._data && node._data.hasOwnProperty(keys[i])) {
                node = node._data[keys[i]];
            }
            else {
                return;
            }
        }
        if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) {
            return;
        }
        var arr = node._data[key];
        var ind = arr.indexOf(value);
        if (ind === -1) {
            return;
        }
        if (arr.length < ind) {
            return;
        }
        value = arr[ind];
        if (value instanceof Observer) {
            value._parent = null;
        }
        else {
            value = obj.json(value);
        }
        arr.splice(ind, 1);
        var state;
        if (silent) {
            state = obj.silence();
        }
        obj.emit("".concat(path, ":remove"), value, ind, remote);
        obj.emit('*:remove', path, value, ind, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    /**
     * @param path - Path to the value.
     * @param value - Value to insert.
     * @param ind - Index to insert the value at.
     * @param silent - If true, the insert event will not be emitted.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @returns Returns true if the value was successfully inserted and false otherwise.
     */
    Observer.prototype.insert = function (path, value, ind, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var keys = Observer._splitPath(path);
        var key = keys[keys.length - 1];
        var node = this;
        var obj = this;
        for (var i = 0; i < keys.length - 1; i++) {
            if (node instanceof Array) {
                node = node[parseInt(keys[i], 10)];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else if (node._data && node._data.hasOwnProperty(keys[i])) {
                node = node._data[keys[i]];
            }
            else {
                return;
            }
        }
        if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) {
            return;
        }
        var arr = node._data[key];
        value = obj._doInsert(node, key, value, ind);
        if (ind === undefined) {
            ind = arr.length - 1;
        }
        var state;
        if (silent) {
            state = obj.silence();
        }
        obj.emit("".concat(path, ":insert"), value, ind, remote);
        obj.emit('*:insert', path, value, ind, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    Observer.prototype._doInsert = function (node, key, value, ind, allowDuplicates) {
        if (allowDuplicates === void 0) { allowDuplicates = false; }
        var arr = node._data[key];
        if (typeof value === 'object' && !(value instanceof Observer) && value !== null) {
            if (value instanceof Array) {
                value = value.slice(0);
            }
            else {
                value = new Observer(value);
            }
        }
        var path = node._path ? "".concat(node._path, ".").concat(key) : key;
        if (value !== null && !allowDuplicates && (!this._pathsWithDuplicates || !this._pathsWithDuplicates[path])) {
            if (arr.indexOf(value) !== -1) {
                return;
            }
        }
        if (ind === undefined) {
            arr.push(value);
        }
        else {
            arr.splice(ind, 0, value);
        }
        if (value instanceof Observer) {
            value._parent = this;
            value._parentPath = path;
            value._parentField = arr;
            value._parentKey = null;
        }
        else {
            value = this.json(value);
        }
        return value;
    };
    /**
     * @param path - Path to the value.
     * @param indOld - Index of the value to move.
     * @param indNew - Index to move the value to.
     * @param silent - If true, the move event will not be emitted.
     * @param remote - State value passed to the set event used to disable remote event emission.
     * @returns Returns true if the value was successfully moved and false otherwise.
     */
    Observer.prototype.move = function (path, indOld, indNew, silent, remote) {
        if (silent === void 0) { silent = false; }
        if (remote === void 0) { remote = false; }
        var keys = Observer._splitPath(path);
        var key = keys[keys.length - 1];
        var node = this;
        var obj = this;
        for (var i = 0; i < keys.length - 1; i++) {
            if (node instanceof Array) {
                node = node[parseInt(keys[i], 10)];
                if (node instanceof Observer) {
                    path = keys.slice(i + 1).join('.');
                    obj = node;
                }
            }
            else if (node._data && node._data.hasOwnProperty(keys[i])) {
                node = node._data[keys[i]];
            }
            else {
                return;
            }
        }
        if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) {
            return;
        }
        var arr = node._data[key];
        if (arr.length < indOld || arr.length < indNew || indOld === indNew) {
            return;
        }
        var value = arr[indOld];
        arr.splice(indOld, 1);
        if (indNew === -1) {
            indNew = arr.length;
        }
        arr.splice(indNew, 0, value);
        if (!(value instanceof Observer)) {
            value = obj.json(value);
        }
        var state;
        if (silent) {
            state = obj.silence();
        }
        obj.emit("".concat(path, ":move"), value, indNew, indOld, remote);
        obj.emit('*:move', path, value, indNew, indOld, remote);
        if (silent) {
            obj.silenceRestore(state);
        }
        return true;
    };
    Observer.prototype.patch = function (data, removeMissingKeys) {
        if (removeMissingKeys === void 0) { removeMissingKeys = false; }
        if (typeof data !== 'object') {
            return;
        }
        for (var key in data) {
            if (typeof data[key] === 'object' && !this._data.hasOwnProperty(key)) {
                this._prepare(this, key, data[key]);
            }
            else if (this._data[key] !== data[key]) {
                this.set(key, data[key]);
            }
        }
        if (removeMissingKeys) {
            for (var key in this._data) {
                if (!data.hasOwnProperty(key)) {
                    this.unset(key);
                }
            }
        }
    };
    /**
     * @param target - The object to JSONify.
     * @returns The current state of the object tracked by the observer.
     */
    Observer.prototype.json = function (target) {
        var key, n;
        var obj = {};
        var node = target === undefined ? this : target;
        var len, nlen;
        if (node instanceof Object && node._keys) {
            len = node._keys.length;
            for (var i = 0; i < len; i++) {
                key = node._keys[i];
                var value = node._data[key];
                var type = typeof value;
                if (type === 'object' && (value instanceof Array)) {
                    obj[key] = value.slice(0);
                    nlen = obj[key].length;
                    for (n = 0; n < nlen; n++) {
                        if (typeof obj[key][n] === 'object') {
                            obj[key][n] = this.json(obj[key][n]);
                        }
                    }
                }
                else if (type === 'object' && (value instanceof Object)) {
                    obj[key] = this.json(value);
                }
                else {
                    obj[key] = value;
                }
            }
        }
        else {
            if (node === null) {
                return null;
            }
            else if (typeof node === 'object' && (node instanceof Array)) {
                obj = node.slice(0);
                len = obj.length;
                for (n = 0; n < len; n++) {
                    obj[n] = this.json(obj[n]);
                }
            }
            else if (typeof node === 'object') {
                for (key in node) {
                    if (node.hasOwnProperty(key)) {
                        obj[key] = node[key];
                    }
                }
            }
            else {
                obj = node;
            }
        }
        return obj;
    };
    Observer.prototype.forEach = function (fn, target, path) {
        if (path === void 0) { path = ''; }
        var node = target || this;
        for (var i = 0; i < node._keys.length; i++) {
            var key = node._keys[i];
            var value = node._data[key];
            var type = (this.schema && this.schema.has(path + key) && this.schema.get(path + key).type.name.toLowerCase()) || typeof value;
            if (type === 'object' && (value instanceof Array)) {
                fn(path + key, 'array', value, key);
            }
            else if (type === 'object' && (value instanceof Object)) {
                fn(path + key, 'object', value, key);
                this.forEach(fn, value, "".concat(path + key, "."));
            }
            else {
                fn(path + key, type, value, key);
            }
        }
    };
    /**
     * Returns the latest observer instance. This is important when
     * dealing with undo / redo where the observer might have been deleted
     * and/or possibly re-created.
     *
     * @returns The latest instance of the observer.
     */
    Observer.prototype.latest = function () {
        return this._latestFn ? this._latestFn() : this;
    };
    /**
     * Destroys the observer instance.
     */
    Observer.prototype.destroy = function () {
        if (this._destroyed)
            return;
        this._destroyed = true;
        this.emit('destroy');
        this.unbind();
    };
    Object.defineProperty(Observer.prototype, "latestFn", {
        get: function () {
            return this._latestFn;
        },
        set: function (value) {
            this._latestFn = value;
        },
        enumerable: false,
        configurable: true
    });
    // cache calls to path.split(path, '.')
    // as they take considerable time especially during loading
    // if there are a lot of observers like entities, assets etc.
    Observer._splitPathsCache = {};
    return Observer;
}(Events));

export { Observer };
