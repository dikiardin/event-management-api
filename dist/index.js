"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const event_router_1 = __importDefault(require("./routers/event.router"));
const PORT = process.env.PORT || "8181";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandling();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    route() {
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>Classbase API</h1>");
        });
        // define route
        const authRouter = new auth_router_1.default();
        const eventRouter = new event_router_1.default();
        this.app.use("/auth", authRouter.getRouter());
        this.app.use("/event", eventRouter.getRouter());
    }
    errorHandling() {
        this.app.use((error, req, res, next) => {
            console.log(error);
            res.status(error.code || 500).send(error);
        });
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`API Running: http://localhost:${PORT}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=index.js.map