import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

type AppValidationMetatype = {
  validate?: (value: any) => void;
  sanitize?: (value: any) => any;
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

  transform(value: any, metadata: ArgumentMetadata): any {
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

  private applyWhitelist(value: any, meta: AppValidationMetatype): any {
    if (
      !this.options.whitelist ||
      !meta.allowedProps ||
      typeof value !== 'object' ||
      value === null
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

  private applyTransform(value: any, meta: AppValidationMetatype): any {
    if (!this.options.transform) {
      return value;
    }

    if (typeof meta.sanitize === 'function') {
      return meta.sanitize(value);
    }

    return value;
  }

  private isPrimitive(metatype: unknown): boolean {
    return [String, Boolean, Number, Array, Object].includes(
      metatype as any,
    );
  }
}
