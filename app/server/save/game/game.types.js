"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.gamePatron = void 0;
exports.gamePatron = {
    countDownRequired: false,
    canvasHeight: 640,
    canvasWidth: 1200,
    playerHeight: 100,
    playerWidth: 5
};
var Status;
(function (Status) {
    Status[Status["EMPTY"] = 0] = "EMPTY";
    Status[Status["LOCKED"] = 1] = "LOCKED";
    Status[Status["ONE_PLAYER"] = 2] = "ONE_PLAYER";
    Status[Status["TWO_PLAYER"] = 3] = "TWO_PLAYER";
    Status[Status["RUNNING"] = 4] = "RUNNING";
    Status[Status["OVER"] = 5] = "OVER";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=game.types.js.map