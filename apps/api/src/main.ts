import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { setupSwagger } from './config/swagger'
import { AppModule } from './modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setupSwagger(app)
  await app.listen(app.get(ConfigService).getOrThrow('API_PORT'))
}

void bootstrap()
