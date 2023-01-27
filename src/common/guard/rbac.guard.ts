import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

/**
 * admin 守卫
 */

@Injectable()
export class RbacGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    if (!request?.user?.admin) {
      throw new ForbiddenException('对不起，您无权操作')
    }
    return true
  }

  getRequest(context: ExecutionContext) {
    return getNestExecutionContextRequest(context)
  }
}
