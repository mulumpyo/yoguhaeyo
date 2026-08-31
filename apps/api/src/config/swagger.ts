import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { scalarReferenceOptions } from './scalar'

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('요구해요 API').setVersion('1.0').build(),
  )

  app.use(
    '/docs',
    apiReference({
      content: document,
      ...scalarReferenceOptions,
    }),
  )
}
