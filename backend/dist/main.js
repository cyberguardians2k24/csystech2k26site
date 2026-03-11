"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CYSTECH 2K26 API')
        .setDescription('Vibranium-powered symposium backend API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const preferredPort = Number(process.env.PORT) || 3001;
    let activePort = preferredPort;
    try {
        await app.listen(activePort);
    }
    catch (error) {
        if (error?.code === 'EADDRINUSE') {
            activePort = preferredPort + 1;
            console.warn(`\n⚠ Port ${preferredPort} is already in use. Falling back to ${activePort}.\n`);
            await app.listen(activePort);
        }
        else {
            throw error;
        }
    }
    console.log(`\n🟣 CYSTECH API running on http://localhost:${activePort}/api`);
    console.log(`   Swagger docs: http://localhost:${activePort}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map