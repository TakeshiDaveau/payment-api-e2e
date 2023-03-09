import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

type ModuleDefinition = { path: string; fileName: string };

/**
 * Helper for E2E tests.
 *
 * @example
 * e2eHelper = await E2eHelper.createTestingModule();
 * paymentIntentService = e2eHelper.module.get<PaymentIntentService>(PaymentIntentService);
 *
 *
 */
export class E2eHelper {
  constructor(
    public readonly app: INestApplication,
    public readonly module: TestingModule,
  ) {}

  /**
   * This method instantiate the whole API for E2E testing.
   * It avoid to add the override / import all the stuff
   * required in each E2E testing file.
   *
   * @param metadata - Alow to add import or controller if required for a specific case
   *
   * @returns The testing module and the app
   */
  static async createTestingModule(): Promise<E2eHelper> {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    console.log(
      'modulesDefinition',
      await E2eHelper.retrieveServiceNames(E2eHelper.modulesDefinition),
    );

    return new E2eHelper(app, module);
  }

  /**
   * Clean all the created data during E2E test.
   *
   * It retrieves all the Repository and clean the associated
   * data
   *
   */
  async cleanup(): Promise<void> {
    const providers = await E2eHelper.retrieveServiceNames(
      E2eHelper.modulesDefinition,
    );
    await Promise.all(
      // Retrieve the provider
      await (
        await Promise.all(
          providers.map((provider) => this.app.resolve(provider)),
        )
      )
        // Execute deleteDataAfterTest if the methods exists
        .map((resolvedProvider) =>
          (
            resolvedProvider as unknown as {
              deleteDataAfterTest?: () => Promise<void>;
            }
          )?.deleteDataAfterTest(),
        ),
    );
  }

  /**
   * Retrieve the list of module imported. Here is an example of return
   * [
   *   {
   *     path: '/Users/me/meetup/15032023_meetup/payment-api/src/payment-intent/payment-intent.module.ts',
   *     fileName: 'payment-intent'
   *   }
   * ]
   *
   * @returns the path and the base filename of all module imported within AppModule
   */
  private static get modulesDefinition(): ModuleDefinition[] {
    // Return all the object imported defined in @Module({ imports: []})
    // from main.ts file
    const modules: any[] = Reflect.getMetadata('imports', AppModule);
    return modules
      .filter(({ name }) => name)
      .map(({ name }) => {
        const fileName = name
          // Transform PaymentIntentModule => PaymentIntent
          .replace('Module', '')
          // transform PaymentIntent => Payment-Intent
          .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
          // transform Payment-Intent => payment-intent
          .toLowerCase();
        return {
          path: `${process.cwd()}/src/${fileName}/${fileName}.module.ts`,
          fileName,
        };
      });
  }

  /**
   * Return all the service provided within a list of module definition.
   *
   * @returns the name of all services
   */
  private static async retrieveServiceNames(
    modulesDefinition: ModuleDefinition[],
  ): Promise<string[]> {
    // Importing modules is required to inspect his providers
    const modules = await Promise.all(
      modulesDefinition.map(({ path }) => import(path)),
    );

    return [
      ...new Set(
        modules
          .map((module) =>
            Reflect.getMetadata('providers', module[Object.keys(module)[0]]),
          )
          .flat()
          .map(({ name }) => name)
          .flat(),
      ),
    ];
  }
}
