import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    return data ? user?.[data] : user;
  },
);
