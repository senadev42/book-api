import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validateEnvironment<T extends object>(
  config: T,
  type: new (...args: unknown[]) => T,
): T {
  const configInstance = plainToInstance(type, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(configInstance, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = [];
    for (const error of errors) {
      formattedErrors.push(...Object.values(error.constraints));
    }

    throw new Error(`\n\n${formattedErrors.join('\n')}\n\n`, {});
  }
  return config;
}
