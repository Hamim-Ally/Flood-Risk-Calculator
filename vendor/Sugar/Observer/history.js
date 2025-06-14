import { __extends, __awaiter, __generator } from 'tslib/tslib.es6.js';
import { Events } from './events.js';

/**
 * Manages history actions for undo/redo operations. This class keeps track of actions that can be
 * undone and redone, allowing for complex state management in applications such as editors, games,
 * or any interactive applications where state changes need to be reversible.
 *
 * @example
 * const history = new History();
 *
 * // Define an action
 * const action = {
 *   name: 'draw',
 *   undo: () => { console.log('Undo draw'); },
 *   redo: () => { console.log('Redo draw'); }
 * };
 *
 * // Add the action to history
 * history.add(action);
 *
 * // Perform undo
 * history.undo();
 *
 * // Perform redo
 * history.redo();
 */
var History = /** @class */ (function (_super) {
    __extends(History, _super);
    function History() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._executing = 0;
        _this._actions = [];
        _this._currentActionIndex = -1;
        _this._canUndo = false;
        _this._canRedo = false;
        return _this;
    }
    /**
     * Adds a new history action to the stack. If the action has a combine flag and matches the
     * current action's name, the redo function of the current action is updated. If actions have
     * been undone before adding this new action, it removes all actions that come after the
     * current action to maintain a consistent history.
     *
     * @param action - The action to add.
     * @returns Returns `true` if the action is successfully added, `false` otherwise.
     */
    History.prototype.add = function (action) {
        if (!action.name) {
            console.error('Trying to add history action without name');
            return false;
        }
        if (!action.undo) {
            console.error('Trying to add history action without undo method', action.name);
            return false;
        }
        if (!action.redo) {
            console.error('Trying to add history action without redo method', action.name);
            return false;
        }
        // If an action is added after some actions have been undone, remove all actions that come
        // after the current action to ensure the history is consistent.
        if (this._currentActionIndex !== this._actions.length - 1) {
            this._actions = this._actions.slice(0, this._currentActionIndex + 1);
        }
        // If the combine flag is true and the current action has the same name, replace the redo
        // function of the current action with the new action's redo function.
        if (action.combine && this.currentAction && this.currentAction.name === action.name) {
            this.currentAction.redo = action.redo;
        }
        else {
            var length_1 = this._actions.push(action);
            this._currentActionIndex = length_1 - 1;
        }
        this.emit('add', action.name);
        this.canUndo = true;
        this.canRedo = false;
        return true;
    };
    /**
     * Adds a new history action and immediately executes its redo function.
     *
     * @param action - The action.
     * @returns A promise that resolves once the redo function has been executed.
     */
    History.prototype.addAndExecute = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.add(action)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        this.executing++;
                        return [4 /*yield*/, action.redo()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.executing--;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Undoes the last history action. This method retrieves the current action from the history
     * stack and executes the action's undo function.
     *
     * @returns A promise that resolves once the undo function has been executed.
     */
    History.prototype.undo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name, undo, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.canUndo) {
                            return [2 /*return*/];
                        }
                        name = this.currentAction.name;
                        undo = this.currentAction.undo;
                        this._currentActionIndex--;
                        this.emit('undo', name);
                        if (this._currentActionIndex < 0) {
                            this.canUndo = false;
                        }
                        this.canRedo = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.executing++;
                        return [4 /*yield*/, undo()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        ex_1 = _a.sent();
                        console.info('%c(History#undo)', 'color: #f00');
                        console.log(ex_1.stack);
                        return [3 /*break*/, 5];
                    case 4:
                        this.executing--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Redoes the next history action. This retrieves the next action from the history stack and
     * executes the action's redo function.
     *
     * @returns A promise that resolves once the redo function has been executed.
     */
    History.prototype.redo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var redo, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.canRedo) {
                            return [2 /*return*/];
                        }
                        this._currentActionIndex++;
                        redo = this.currentAction.redo;
                        this.emit('redo', this.currentAction.name);
                        this.canUndo = true;
                        if (this._currentActionIndex === this._actions.length - 1) {
                            this.canRedo = false;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.executing++;
                        return [4 /*yield*/, redo()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        ex_2 = _a.sent();
                        console.info('%c(History#redo)', 'color: #f00');
                        console.log(ex_2.stack);
                        return [3 /*break*/, 5];
                    case 4:
                        this.executing--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all history actions.
     */
    History.prototype.clear = function () {
        if (!this._actions.length)
            return;
        this._actions.length = 0;
        this._currentActionIndex = -1;
        this.canUndo = false;
        this.canRedo = false;
    };
    Object.defineProperty(History.prototype, "currentAction", {
        /**
         * The current history action.
         */
        get: function () {
            return this._actions[this._currentActionIndex] || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "lastAction", {
        /**
         * The last action committed to the history.
         */
        get: function () {
            return this._actions[this._actions.length - 1] || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "canUndo", {
        /**
         * Gets whether we can undo at this time.
         */
        get: function () {
            return this._canUndo && !this.executing;
        },
        /**
         * Sets whether we can undo at this time.
         */
        set: function (value) {
            if (this._canUndo === value)
                return;
            this._canUndo = value;
            if (!this.executing) {
                this.emit('canUndo', value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "canRedo", {
        /**
         * Gets whether we can redo at this time.
         */
        get: function () {
            return this._canRedo && !this.executing;
        },
        /**
         * Sets whether we can redo at this time.
         */
        set: function (value) {
            if (this._canRedo === value)
                return;
            this._canRedo = value;
            if (!this.executing) {
                this.emit('canRedo', value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "executing", {
        /**
         * Gets the number of async actions currently executing.
         */
        get: function () {
            return this._executing;
        },
        /**
         * Sets the number of async actions currently executing.
         */
        set: function (value) {
            if (this._executing === value)
                return;
            this._executing = value;
            if (this._executing) {
                this.emit('canUndo', false);
                this.emit('canRedo', false);
            }
            else {
                this.emit('canUndo', this._canUndo);
                this.emit('canRedo', this._canRedo);
            }
        },
        enumerable: false,
        configurable: true
    });
    return History;
}(Events));

export { History };
