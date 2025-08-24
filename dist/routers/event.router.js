"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyRole_1 = require("../middleware/verifyRole");
const verifyToken_1 = require("../middleware/verifyToken");
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
class EventRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.eventController = new event_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/create", verifyToken_1.verifyToken, verifyRole_1.verifyAuthor, this.eventController.createBlog);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = EventRouter;
//# sourceMappingURL=event.router.js.map