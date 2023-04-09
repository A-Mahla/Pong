"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SocketIOAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.app = app;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.use((socket, next) => {
            console.log('socket in middleware: ', socket.handshake);
            next();
        });
        return server;
    }
}
exports.SocketIOAdapter = SocketIOAdapter;
//# sourceMappingURL=socket-io.adapter.js.map