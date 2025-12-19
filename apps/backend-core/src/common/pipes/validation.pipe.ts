import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

type AppValidationMetatype = {
  validate?: (value: unknown) => void;
  sanitize?: (value: unknown) => unknown;
  allowedProps?: string[];
};

export interface AppValidationPipeOptions {
  whitelist?: boolean;
  transform?: boolean;
}

@Injectable()
export class AppValidationPipe implements PipeTransform {
  constructor(
    private readonly options: AppValidationPipeOptions = {
      whitelist: false,
      transform: false,
    },
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const { metatype, type } = metadata;
    if (!metatype || this.isPrimitive(metatype) || type === 'custom') {
      return value;
    }

    const meta = metatype as unknown as AppValidationMetatype;
    const sanitized = this.applyWhitelist(value, meta);
    const transformed = this.applyTransform(sanitized, meta);

    if (typeof meta.validate === 'function') {
      try {
        meta.validate(transformed);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Validation failed';
        throw new BadRequestException(message);
      }
    }

    return transformed;
  }

  private applyWhitelist(value: unknown, meta: AppValidationMetatype): unknown {
    if (
      !this.options.whitelist ||
      !meta.allowedProps ||
      !this.isRecord(value)
    ) {
      return value;
    }

    return Object.entries(value).reduce<Record<string, unknown>>(
      (acc, [key, val]) => {
        if (meta.allowedProps?.includes(key)) {
          acc[key] = val;
        }
        return acc;
      },
      {},
    );
  }

  private applyTransform(value: unknown, meta: AppValidationMetatype): unknown {
    if (!this.options.transform) {
      return value;
    }

    if (typeof meta.sanitize === 'function') {
      return meta.sanitize(value);
    }

    return value;
  }

  private isPrimitive(metatype: unknown): boolean {
    return (
      metatype === String ||
      metatype === Boolean ||
      metatype === Number ||
      metatype === Array ||
      metatype === Object
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
