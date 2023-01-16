
import type { ExecutionContext } from '@nestjs/common'


export function getNestExecutionContextRequest(
  context: ExecutionContext,
) {
  return context.switchToHttp().getRequest()
}