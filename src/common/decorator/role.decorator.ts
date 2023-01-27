import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

export const IsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx)
    return request.isUser
  },
)

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx)
    return request.isAdmin
  },
)
