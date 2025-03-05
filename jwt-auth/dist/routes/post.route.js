"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.default.Router();
router.get("/", auth_1.auth, post_controller_1.getPosts);
router.post("/", auth_1.auth, auth_1.isAdmin, post_controller_1.createPost);
exports.default = router;
