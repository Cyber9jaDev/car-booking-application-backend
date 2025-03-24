"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://127.0.0.1:3000/',
            'http://localhost:3000/',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'https://127.0.0.1:3000/',
            'https://localhost:3000/',
            'https://127.0.0.1:3000',
            'https://localhost:3000',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map