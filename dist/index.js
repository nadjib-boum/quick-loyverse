"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routes_1 = __importDefault(require("./routes"));
const errors_1 = __importDefault(require("./middlewares/errors"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/api", (0, routes_1.default)());
app.use(errors_1.default.logger, errors_1.default.handler);
const { PORT = 5000 } = process.env;
app.listen(PORT, async () => {
    console.log("App Is Running on Localhost, PORT:", PORT);
});
