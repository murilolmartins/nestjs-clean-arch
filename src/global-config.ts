import { INestApplication, ValidationPipe } from '@nestjs/common'

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 422,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
}
