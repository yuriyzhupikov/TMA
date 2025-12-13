import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrometheusService } from '../prometheus/prometheus.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly prometheus: PrometheusService) {}

  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    const metrics = await this.prometheus.getMetrics();
    res.setHeader('Content-Type', this.prometheus.getContentType());
    res.send(metrics);
  }
}
