"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    port: 456,
    secure: false,
    auth: {
        user: process.env.smtp_email,
        pass: process.env.smtp_password
    }
});
exports.default = transporter;
