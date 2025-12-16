import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { UpdateLimitsDto } from './dto/update-limits.dto';

@Controller('admin/billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('projects/:projectId')
  overview(@Param('projectId') projectId: string) {
    return this.billing.getOverview(projectId);
  }

  @Post('projects/:projectId/limits')
  updateLimits(
    @Param('projectId') projectId: string,
    @Body() dto: UpdateLimitsDto,
  ) {
    return this.billing.updateLimits({ ...dto, projectId });
  }
}
