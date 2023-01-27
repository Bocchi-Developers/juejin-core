import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { AuthService } from '~/modules/auth/auth.service'
import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

import { AuthGuard } from './auth.guard'

/**
 * 区分 admin 和 user 的守卫
 */

@Injectable()
export class RolesGuard extends AuthGuard implements CanActivate {
  constructor(protected readonly authService: AuthService) {
    super(authService)
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    let isAdmin = false
    try {
      await super.canActivate(context)
      isAdmin = request.user.admin
      // eslint-disable-next-line no-empty
    } catch {}
    request.isUser = !isAdmin
    request.isAdmin = isAdmin

    return true
  }

  getRequest(context: ExecutionContext) {
    return getNestExecutionContextRequest(context)
  }
}
