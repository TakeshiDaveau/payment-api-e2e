const getId = (
  result: unknown & { id?: string; _id?: string },
  idPath: string,
): string => {
  const id = result[idPath] ?? result.id ?? result._id;
  if (!id) {
    throw new Error(
      `Id not found during E2E test value=${id} for path=${idPath}`,
    );
  }
  return id;
};

/**
 * /!\ This is a typescript decorator not a NestJS
 *
 * This decorator will store the result of the method
 * in the InMemoryHelper which will be used in test deletion
 * method.
 *
 * @example
 * // Will use "id" key of the result to get the id
 * @creationalMethod('id)
 *
 * @param idPath
 * @returns
 */
export const creationalMethod = (idPath = 'id') => {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    if (process.env.NODE_ENV !== 'test') {
      return descriptor.value;
    }
    const originalMethod = descriptor.value;

    // Here we need to keep "function" instead of arrow otherwise we can't use "this"
    if (originalMethod.constructor.name === 'AsyncFunction') {
      descriptor.value = async function (...args) {
        const result = await originalMethod.apply(this, args);
        InMemoryHelper.getInstance().setValue(
          this.type,
          getId(result, idPath),
          result,
        );
        return result;
      };
    } else {
      descriptor.value = function (...args) {
        const result = originalMethod.apply(this, args);
        InMemoryHelper.getInstance().setValue(
          this.type,
          getId(result, idPath),
          result,
        );
        return result;
      };
    }
  };
};
