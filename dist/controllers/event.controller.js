"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventController {
    createBlog(req, res, next) {
        try {
            res
                .status(201)
                .json({ message: "Blog created successfully", data: req.body });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = EventController;
//# sourceMappingURL=event.controller.js.map