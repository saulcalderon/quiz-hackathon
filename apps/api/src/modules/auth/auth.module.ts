import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase' }), PrismaModule],
  providers: [SupabaseStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
