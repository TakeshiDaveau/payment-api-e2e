/**
 * /!\ This is a typescript decorator not a NestJS
 *
 * This decorator add a "type" attribute to a class containing it's class name.
 *
 * You should use this decorator for Repository to clean created data. This
 * type information is required for the @creationalMethod decorator
 *
 * @example :
 *
 * @Injectable()
 * @cleanableRepository
 * export class CustomerRepository extends BaseChargebeeRepository<
 *  IChargebeeCustomerWrapper,
 *  Customer
 * > {
 *
 *
 * @param target class on which the decorator is apply
 * @returns the class
 */
export const cleanableProvider = (target: any) => {
  if (process.env.NODE_ENV !== 'test') {
    return target;
  }
  return class extends target {
    type = target.name;
  };
};
