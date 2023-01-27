import { UseGuards, applyDecorators } from '@nestjs/common'

import { RbacGuard } from '../guard/rbac.guard'

export function Admin() {
  const decorators: (ClassDecorator | PropertyDecorator | MethodDecorator)[] =
    []

  decorators.push(UseGuards(RbacGuard))

  return applyDecorators(...decorators)
}
