import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlayerProgressTable } from '../../postgres/database.types';
import { RuntimeProjectsService } from '../projects/runtime-projects.service';
import { PlayersService } from '../players/players.service';
import { GameService } from '../game/game.service';
import { RuntimeAnalyticsService } from '../analytics/runtime-analytics.service';
import { RuntimeInitDto } from './dto/runtime-init.dto';
import { RuntimeEventDto } from './dto/runtime-event.dto';
import { PlayerProgressState, RuntimeEventPayload } from '../game/types';
import { RuntimeRepository } from './runtime.repository';
import type { Kysely, Selectable } from 'kysely';
import { RuntimeProjectsRepository } from '../projects/runtime-projects.repository';
import { PlayersRepository } from '../players/players.repository';
import { RuntimeAnalyticsRepository } from '../analytics/runtime-analytics.repository';
import type { DatabaseSchema } from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class RuntimeService {
  constructor(
    private readonly projectsService: RuntimeProjectsService,
    private readonly playersService: PlayersService,
    private readonly gameService: GameService,
    private readonly analyticsService: RuntimeAnalyticsService,
    private readonly runtimeRepo: RuntimeRepository,
  ) {}

  async init(dto: RuntimeInitDto) {
    const project = await this.projectsService.findBySlug(dto.projectSlug);
    const telegramId = this.resolveTelegramId(dto);

    if (!telegramId) {
      throw new BadRequestException('Unable to resolve telegramId');
    }

    const player = await this.playersService.findOrCreatePlayer(
      project.id,
      telegramId,
    );
    const progress = await this.playersService.findOrCreateProgress(player.id);

    return {
      project,
      player,
      progress: this.normalizeProgress(progress),
      config: project.config,
    };
  }

  async handleEvent(dto: RuntimeEventDto) {
    const result = await this.runtimeRepo.runInTransaction(async (trx) => {
      const scopedDb = trx as DbClient;
      const projectsSvc = new RuntimeProjectsService(
        new RuntimeProjectsRepository(scopedDb),
        this.projectsService.redisService,
        this.projectsService.cacheTtlSeconds,
      );
      const playersSvc = new PlayersService(new PlayersRepository(scopedDb));
      const analyticsSvc = new RuntimeAnalyticsService(
        new RuntimeAnalyticsRepository(scopedDb),
        this.analyticsService.kafka,
      );

      const player = await playersSvc.getPlayerById(dto.playerId);
      if (!player) {
        throw new NotFoundException('Player not found');
      }

      const project = await projectsSvc.findById(player.project_id);

      const progress =
        (await playersSvc.loadProgressForUpdate(dto.playerId)) ??
        (await playersSvc.findOrCreateProgress(dto.playerId));

      const runtimeEvent: RuntimeEventPayload = {
        eventType: dto.eventType,
        payload: dto.payload ?? {},
      };

      const { progress: newProgress, delta } = this.gameService.handleEvent(
        project.config,
        this.normalizeProgress(progress),
        runtimeEvent,
      );

      await playersSvc.updateProgress(
        dto.playerId,
        newProgress.balance,
        newProgress.level,
      );

      await analyticsSvc.recordEvent({
        companyId: project.companyId,
        projectId: project.id,
        playerId: dto.playerId,
        type: dto.eventType,
        payload: dto.payload ?? {},
        delta,
      });

      return {
        progress: newProgress,
        delta,
        serverTs: new Date().toISOString(),
      };
    });

    return result;
  }

  private normalizeProgress(
    progress: Selectable<PlayerProgressTable>,
  ): PlayerProgressState {
    return {
      balance: Number(progress.balance),
      level: Number(progress.level),
    };
  }

  private resolveTelegramId(dto: RuntimeInitDto): string | null {
    if (dto.telegramId) return dto.telegramId;
    if (!dto.initData) return null;

    try {
      const parsed = JSON.parse(dto.initData) as unknown;
      if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>;
        const candidate =
          (obj.user as Record<string, unknown> | undefined)?.id ??
          obj.id ??
          obj.telegramId;
        if (
          typeof candidate === 'string' ||
          typeof candidate === 'number' ||
          typeof candidate === 'boolean'
        ) {
          return String(candidate);
        }
      }
    } catch {
      // Fallback to raw initData when JSON parsing fails.
      return dto.initData;
    }

    return null;
  }
}
