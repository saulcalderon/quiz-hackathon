import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import * as fs from 'fs';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // #region agent log
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    fs.appendFileSync('/Users/saulcalderon/Desktop/Personal/quiz-hackathon/.cursor/debug.log', JSON.stringify({location:'auth.guard.ts:canActivate',message:'Auth guard checking',data:{hasAuthHeader:!!authHeader,authHeaderPrefix:authHeader?.substring(0,20),url:request.url,hasSupabaseUrl:!!process.env.SUPABASE_URL,hasJwtSecret:!!process.env.SUPABASE_JWT_SECRET},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'}) + '\n');
    // #endregion

    return super.canActivate(context);
  }

  // #region agent log
  handleRequest(err: Error, user: unknown, info: Error, context: ExecutionContext) {
    fs.appendFileSync('/Users/saulcalderon/Desktop/Personal/quiz-hackathon/.cursor/debug.log', JSON.stringify({location:'auth.guard.ts:handleRequest',message:'Auth result',data:{hasError:!!err,errorMessage:err?.message,hasUser:!!user,infoMessage:info?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'}) + '\n');
    return super.handleRequest(err, user, info, context);
  }
  // #endregion
}
