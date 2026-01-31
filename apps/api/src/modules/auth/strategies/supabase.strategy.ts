import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { PrismaService } from '../../prisma/prisma.service';

type SupabaseJwtPayload = {
  sub: string;
  email?: string;
  aud: string;
  exp: number;
  iat: number;
};

const DEV_JWT_SECRET = 'dev-secret-do-not-use-in-production';
const logger = new Logger('SupabaseStrategy');

function getJwtConfig(): StrategyOptionsWithoutRequest {
  const supabaseUrl = process.env.SUPABASE_URL;
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (supabaseUrl) {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['RS256'],
    };
  }

  if (jwtSecret) {
    logger.warn('Using SUPABASE_JWT_SECRET for auth - development mode');
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    };
  }

  logger.warn('Using DEV_JWT_SECRET - auth will only work with dev tokens');
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: DEV_JWT_SECRET,
    algorithms: ['HS256'],
  };
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(private readonly prisma: PrismaService) {
    super(getJwtConfig());
  }

  async validate(payload: SupabaseJwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token: missing subject');
    }

    let user = await this.prisma.user.findUnique({
      where: { supabaseId: payload.sub },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          supabaseId: payload.sub,
          balance: 0,
          xp: 0,
        },
      });
    }

    return user;
  }
}
