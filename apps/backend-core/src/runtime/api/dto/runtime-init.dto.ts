export class RuntimeInitDto {
  static allowedProps = ['projectSlug', 'telegramId', 'initData'];

  projectSlug!: string;
  telegramId?: string;
  initData?: string;

  static sanitize(value: any): RuntimeInitDto {
    const dto = new RuntimeInitDto();
    dto.projectSlug = String(value.projectSlug ?? '').trim();
    dto.telegramId =
      value.telegramId !== undefined ? String(value.telegramId).trim() : undefined;
    dto.initData =
      value.initData !== undefined ? String(value.initData).trim() : undefined;
    return dto;
  }

  static validate(value: RuntimeInitDto): void {
    if (!value.projectSlug) {
      throw new Error('projectSlug is required');
    }

    if (!value.telegramId && !value.initData) {
      throw new Error('telegramId or initData is required');
    }
  }
}
