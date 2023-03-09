/**
 * /!\ This is a typescript decorator not a NestJS
 *
 * This decorator replace the implementation of by a throw new Error
 * if the code compilation is not executed under a test env (NODE_ENV === 'test')
 *
 * @param target - class object
 * @param propertyKey - method name
 * @param descriptor - method descriptor
 * @returns
 */
export const onlyForTestE2E = (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  if (process.env.NODE_ENV === 'test') {
    return descriptor.value;
  }
  const originalMethod = descriptor.value;

  if (originalMethod.constructor.name === 'AsyncFunction') {
    descriptor.value = async function () {
      throw new Error(
        `Method ${propertyKey} with the @onlyForTestE2E must not be called outside E2E testing`,
      );
    };
  } else {
    descriptor.value = function () {
      throw new Error(
        `Method ${propertyKey} with the @onlyForTestE2E must not be called outside E2E testing`,
      );
    };
  }
};
