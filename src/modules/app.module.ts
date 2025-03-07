import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { configValidationSchema } from '../config/schema.config'
import { Permission } from '../entities/permission.entity'
import { LoggerMiddleware } from '../middleware/logger.middleware'
import { OrdersModule } from '../orders/orders.module'
import { PermissionsModule } from '../permissions/permissions.module'
import { ProductsModule } from '../products/products.module'
import { UsersModule } from '../users/users.module'

import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt.guard'
import { DatabaseModule } from './database.module'
import { RolesModule } from './roles/roles.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: Permission,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
