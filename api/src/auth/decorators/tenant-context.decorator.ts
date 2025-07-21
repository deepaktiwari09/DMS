import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Extract tenant context from the authenticated user
    return {
      organizationId: request.user?.organizationId,
      userId: request.user?.sub || request.user?.id,
      userRole: request.user?.role,
    };
  },
);