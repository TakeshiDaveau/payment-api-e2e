/**
 * Class used during E2E test to store
 * the data created during test execution
 *
 * We add the notion of "type" to distinguishe the
 * data type, for exemple : Subscription
 *
 */
export class InMemoryHelper {
  private static database: Record<string, Record<string, unknown>> = {};
  private static instance: InMemoryHelper;
  public static getInstance(): InMemoryHelper {
    if (!InMemoryHelper.instance) {
      InMemoryHelper.instance = new InMemoryHelper();
    }

    return InMemoryHelper.instance;
  }

  /**
   * Add a value in the in memory store
   *
   * @param type - Type of the data to add
   * @param id - Id of the added data
   * @param value - Payload of the data
   */
  public setValue(type: string, id: string, value: unknown): void {
    if (!InMemoryHelper.database[type]) {
      InMemoryHelper.database[type] = {};
    }
    InMemoryHelper.database[type][id] = value;
  }

  /**
   * Return a value in the in memory store
   *
   * @param type - Type of the data to retrieve
   * @param id - Id of the retrieved data
   */
  public getValue(type: string, id: string): unknown {
    return InMemoryHelper.database?.[type]?.[id];
  }

  /**
   * Retrieve all data ID of a type
   *
   * @param type - Type of the data to return
   *
   * @returns the whole ids
   */
  public getAllIdByType(type: string): string[] {
    const entities = InMemoryHelper.database[type] || {};
    return Object.keys(entities);
  }

  /**
   * Remove a value from the store
   *
   * @param type - Type of the data to remove
   * @param id - Id of the data to remove
   */
  public removeValue(type: string, id: string): void {
    delete InMemoryHelper.database?.[type]?.[id];
  }

  /**
   * Remove all value from in memory database
   */
  public removeAll(): void {
    InMemoryHelper.database = {};
  }
}
