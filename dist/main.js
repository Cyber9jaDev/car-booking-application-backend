"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const secret = process.env.JWT_KEY;
    if (!secret) {
        throw new Error('JWT_KEY must be defined');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.use(session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
        }
    }));
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map