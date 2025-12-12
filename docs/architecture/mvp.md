.
├─ package.json                       # корневые зависимости монорепы, скрипты
├─ pnpm-workspace.yaml                # описание workspace-пакетов (apps/, libs/)
├─ tsconfig.base.json                 # базовый TS-конфиг для всех пакетов
├─ .editorconfig                      # единый стиль форматирования в IDE
├─ .eslintrc.cjs                      # общая конфигурация ESLint
├─ .prettierrc                        # настройки Prettier
├─ docker-compose.yml                 # локальный стенд: pg, redis, kafka, clickhouse, nginx
├─ .env.example                       # шаблон переменных окружения
│
├─ apps
│  ├─ admin-web/                         # админка/конструктор SaaS (панель для компаний)
│  │  ├─ package.json                    # зависимости и скрипты фронта админки
│  │  └─ src/
│  │     ├─ pages/                       # роуты (Next.js / React Router-страницы)
│  │     │  ├─ _app.tsx                  # корневой компонент, провайдеры, layout
│  │     │  ├─ index.tsx                 # корневая страница: редирект на /projects или /analytics
│  │     │  ├─ login.tsx                 # страница логина администратора/менеджера
│  │     │  │
│  │     │  ├─ tenants/
│  │     │  │  ├─ index.tsx              # список тенантов (компаний/клиентов SaaS)
│  │     │  │  └─ [tenantId].tsx         # страница конкретного тенанта (детали, настройки)
│  │     │  │
│  │     │  ├─ projects/
│  │     │  │  ├─ index.tsx              # список TMA-проектов для выбранного тенанта
│  │     │  │  └─ [projectId].tsx        # карточка проекта, быстрые действия, ссылки
│  │     │  │
│  │     │  ├─ configs/
│  │     │  │  ├─ index.tsx              # список конфигов/проектов с их состоянием
│  │     │  │  └─ [projectId].tsx        # страница конструктора конфига выбранного проекта
│  │     │  │
│  │     │  ├─ analytics/
│  │     │  │  └─ index.tsx              # общий дашборд аналитики по проектам/тенантам
│  │     │  │
│  │     │  └─ settings/
│  │     │     └─ index.tsx              # настройки профиля, API-ключей и прочего
│  │     │
│  │     ├─ components/                  # общие контейнерные компоненты админки
│  │     │  ├─ AdminGuard.tsx            # HOC/компонент защиты роутов (проверка логина)
│  │     │  ├─ PageHeader.tsx            # шапка страницы (заголовок, actions)
│  │     │  ├─ PageContent.tsx           # обёртка для содержимого страницы
│  │     │  ├─ ConfirmDialog.tsx         # диалог подтверждения действий
│  │     │  └─ ToastProvider.tsx         # контекст/провайдер всплывающих уведомлений
│  │     │
│  │     ├─ tenants/                     # доменная логика и UI для тенантов
│  │     │  ├─ api/
│  │     │  │  └─ tenants.api.ts         # функции HTTP-запросов к /admin/tenants/*
│  │     │  │
│  │     │  ├─ hooks/
│  │     │  │  ├─ useTenantsList.ts      # хук загрузки списка тенантов (фильтры, пагинация)
│  │     │  │  └─ useTenantDetail.ts     # хук загрузки и обновления одного тенанта
│  │     │  │
│  │     │  ├─ ui/
│  │     │  │  ├─ TenantsTable.tsx       # таблица со списком тенантов
│  │     │  │  ├─ TenantForm.tsx         # форма создания/редактирования тенанта
│  │     │  │  └─ TenantBadge.tsx        # компактное отображение тенанта (бейдж)
│  │     │  │
│  │     │  └─ types.ts                  # типы данных тенантов для фронта
│  │     │
│  │     ├─ projects/                    # доменная логика и UI для TMA-проектов
│  │     │  ├─ api/
│  │     │  │  └─ projects.api.ts        # HTTP вызовы к /admin/projects/*
│  │     │  │
│  │     │  ├─ hooks/
│  │     │  │  ├─ useProjectsList.ts     # загрузка списка проектов (фильтр по тенанту и т.п.)
│  │     │  │  └─ useProjectDetail.ts    # загрузка/обновление одного проекта
│  │     │  │
│  │     │  ├─ ui/
│  │     │  │  ├─ ProjectsTable.tsx      # таблица проектов
│  │     │  │  ├─ ProjectForm.tsx        # форма создания/редактирования проекта
│  │     │  │  ├─ ProjectStatusBadge.tsx # индикатор статуса проекта (draft/active)
│  │     │  │  └─ ProjectActions.tsx     # блок кнопок: открыть TMA, конструктор, аналитику
│  │     │  │
│  │     │  └─ types.ts                  # типы Project, ProjectStatus для фронта
│  │     │
│  │     ├─ configs/                     # UI и логика редактора конфигов TMA
│  │     │  ├─ api/
│  │     │  │  └─ configs.api.ts         # HTTP к /admin/configs, /admin/projects/:id/config
│  │     │  │
│  │     │  ├─ hooks/
│  │     │  │  ├─ useConfigEditor.ts     # загрузка/сохранение конфига, локальное состояние
│  │     │  │  └─ useConfigVersions.ts   # получение списка версий конфига (если нужно)
│  │     │  │
│  │     │  ├─ editor/
│  │     │  │  ├─ ConfigEditor.tsx       # основной компонент конструктора конфигов
│  │     │  │  ├─ ConfigSidebar.tsx      # список экранов/шагов/элементов слева
│  │     │  │  ├─ ConfigProperties.tsx   # правая панель свойств выбранного элемента
│  │     │  │  ├─ ConfigPreview.tsx      # превью экрана/игры по текущему конфигу
│  │     │  │  └─ configSchema.ts        # схема/описание структуры JSON-конфига
│  │     │  │
│  │     │  ├─ ui/
│  │     │  │  ├─ ConfigList.tsx         # список конфигов/проектов в админке
│  │     │  │  └─ ConfigVersionTag.tsx   # бейдж версии конфига (v1, v2 и т.п.)
│  │     │  │
│  │     │  └─ types.ts                  # типы Config, Screen, Element, Event для фронта
│  │     │
│  │     ├─ analytics/                   # модуль аналитики на фронте
│  │     │  ├─ api/
│  │     │  │  └─ analytics.api.ts       # HTTP к /admin/analytics/*
│  │     │  │
│  │     │  ├─ hooks/
│  │     │  │  ├─ useAnalyticsOverview.ts# загрузка общих метрик (DAU, WAU, retention)
│  │     │  │  ├─ useProjectAnalytics.ts # метрики по конкретному проекту
│  │     │  │  └─ useFunnelAnalytics.ts  # данные воронок, если будут
│  │     │  │
│  │     │  ├─ ui/
│  │     │  │  ├─ AnalyticsDashboard.tsx # дашборд из нескольких графиков + метрик
│  │     │  │  ├─ ChartCard.tsx          # карточка с одним графиком
│  │     │  │  ├─ MetricCard.tsx         # карточка с одной метрикой-числом
│  │     │  │  └─ DateRangePicker.tsx    # выбор диапазона дат
│  │     │  │
│  │     │  └─ types.ts                  # типы для запросов/ответов аналитики на фронте
│  │     │
│  │     ├─ api-client/                  # общий HTTP-клиент к backend-core (/admin/*)
│  │     │  ├─ http.ts                   # базовый инстанс fetch/axios, baseURL, interceptors
│  │     │  ├─ auth.ts                   # login/logout/refresh токена
│  │     │  ├─ tenants.ts                # обёртки запросов к /admin/tenants/*
│  │     │  ├─ projects.ts               # обёртки запросов к /admin/projects/*
│  │     │  ├─ configs.ts                # обёртки запросов к /admin/configs/*
│  │     │  └─ analytics.ts              # обёртки запросов к /admin/analytics/*
│  │     │
│  │     └─ shared-ui/                   # переиспользуемые UI-компоненты админки
│  │        ├─ layout/
│  │        │  ├─ AdminLayout.tsx        # общий layout (sidebar, header, контент)
│  │        │  ├─ Sidebar.tsx            # боковое меню навигации
│  │        │  └─ Topbar.tsx             # верхняя панель (юзер, поиск, actions)
│  │        │
│  │        ├─ table/
│  │        │  ├─ DataTable.tsx          # универсальная таблица с сортировкой/пагинацией
│  │        │  └─ TablePagination.tsx    # компонент пагинации для таблиц
│  │        │
│  │        ├─ form/
│  │        │  ├─ Form.tsx               # обёртка над react-hook-form/формами
│  │        │  ├─ TextField.tsx          # инпут текста
│  │        │  ├─ Select.tsx             # селект
│  │        │  └─ Switch.tsx             # переключатель (on/off)
│  │        │
│  │        ├─ feedback/
│  │        │  ├─ Loader.tsx             # индикатор загрузки
│  │        │  ├─ ErrorState.tsx         # отображение ошибки
│  │        │  └─ EmptyState.tsx         # состояние "ничего не найдено"
│  │        │
│  │        ├─ navigation/
│  │        │  ├─ Breadcrumbs.tsx        # хлебные крошки
│  │        │  └─ Tabs.tsx               # вкладки
│  │        │
│  │        └─ misc/
│  │           ├─ Tag.tsx                # теги
│  │           ├─ Badge.tsx              # бейджи
│  │           └─ Card.tsx               # карточки
│  │
│  ├─ tma-frontend/                      # фронт Telegram Mini App (игровой клиент)
│  │  ├─ package.json                    # зависимости и скрипты TMA-фронта
│  │  └─ src/
│  │     ├─ main.tsx                     # точка входа SPA, монтирование в DOM
│  │     ├─ vite-env.d.ts                # типы окружения Vite/TS
│  │     │
│  │     ├─ screens/                     # "экраны" внутри мини-приложения
│  │     │  ├─ HomeScreen.tsx            # стартовый экран, приветствие, выбор действия
│  │     │  ├─ GameScreen.tsx            # основной игровой экран (клики, действия, UI)
│  │     │  ├─ OnboardingScreen.tsx      # обучающий/онбординг-экран (если нужен)
│  │     │  ├─ RewardScreen.tsx          # экран наград, достижений, claim призов
│  │     │  └─ ErrorScreen.tsx           # отображение ошибок init/event (fallback)
│  │     │
│  │     ├─ components/                  # UI-компоненты, специфичные для TMA
│  │     │  ├─ layout/
│  │     │  │  ├─ AppLayout.tsx          # общий layout TMA (контейнер, фон, компенсация inset)
│  │     │  │  ├─ Header.tsx             # верхняя панель (название игры/проекта, аватар)
│  │     │  │  └─ BottomBar.tsx          # нижнее меню/кнопки (если нужно)
│  │     │  │
│  │     │  ├─ game/
│  │     │  │  ├─ ClickButton.tsx        # главный элемент для кликов/действий
│  │     │  │  ├─ ProgressBar.tsx        # прогресс (уровень, xp, прогресс задания)
│  │     │  │  ├─ CooldownTimer.tsx      # таймер до следующей награды/действия
│  │     │  │  └─ RewardList.tsx         # список квестов/наград
│  │     │  │
│  │     │  └─ common/
│  │     │     ├─ Button.tsx             # базовая кнопка TMA-стиля
│  │     │     ├─ Icon.tsx               # компонент иконки
│  │     │     ├─ Card.tsx               # карточки контента
│  │     │     └─ Modal.tsx              # модальное окно
│  │     │
│  │     ├─ hooks/                        # хуки бизнес-логики фронта TMA
│  │     │  ├─ useTelegramInit.ts        # инициализация Telegram WebApp, theme, viewport
│  │     │  ├─ useRuntimeInit.ts         # вызов /runtime/init, загрузка игрока и конфига
│  │     │  ├─ useRuntimeEvent.ts        # вызовы /runtime/event (click, claim, etc.)
│  │     │  ├─ usePlayerState.ts         # локальный стейт игрока (balance, level, cooldown)
│  │     │  └─ useScreenNavigation.ts    # переключение экранов внутри TMA
│  │     │
│  │     ├─ runtime-api/                 # HTTP-клиент к backend-core (/runtime/*)
│  │     │  ├─ client.ts                 # базовый клиент с baseURL, initData в заголовках
│  │     │  ├─ runtime.types.ts          # типы: RuntimeInitResponse, RuntimeEventResponse
│  │     │  ├─ runtime.init.ts           # функция runtimeInit(payload) → init-ответ
│  │     │  └─ runtime.events.ts         # функции отправки событий: sendEvent({ type, payload })
│  │     │
│  │     └─ telegram/                    # взаимодействие с Telegram WebApp API
│  │        ├─ telegram-webapp.ts        # обёртка над window.Telegram.WebApp (init, ready, close)
│  │        ├─ telegram-context.tsx      # React Context/Provider для initData, theme и т.п.
│  │        └─ types.ts                  # TS-типы Telegram WebApp, initData, themeParams
│  │
│  ├─ backend-core/                      # backend NestJS: /admin/* и /runtime/*
│  │  ├─ package.json                    # скрипты сборки и запуска backend-core
│  │  └─ src/
│  │     ├─ main.ts                      # вход в Nest-приложение, создание AppModule
│  │     ├─ app.ts                       # AppModule: собирает admin, runtime, infra-модули
│  │     │
│  │     ├─ admin/                       # зона /admin/* (SaaS панель и API)
│  │     │  ├─ auth/                     # авторизация админки
│  │     │  │  ├─ auth.controller.ts     # эндпоинты /admin/auth/*
│  │     │  │  ├─ auth.service.ts        # логика логина, проверки пользователя
│  │     │  │  ├─ auth.module.ts         # Nest-модуль авторизации
│  │     │  │  └─ dto/
│  │     │  │     ├─ login.dto.ts        # DTO входа по логину/паролю/коду
│  │     │  │     └─ me.dto.ts           # DTO ответа для /me
│  │     │  │
│  │     │  ├─ users/                    # управление пользователями SaaS
│  │     │  │  ├─ users.controller.ts    # эндпоинты /admin/users/*
│  │     │  │  ├─ users.service.ts       # CRUD пользователей
│  │     │  │  ├─ users.module.ts        # Nest-модуль пользователей
│  │     │  │  └─ dto/
│  │     │  │     ├─ create-user.dto.ts  # DTO создания пользователя
│  │     │  │     └─ update-user.dto.ts  # DTO обновления пользователя
│  │     │  │
│  │     │  ├─ tenants/                  # управление компаниями/тенантами
│  │     │  │  ├─ tenants.controller.ts  # эндпоинты /admin/tenants/*
│  │     │  │  ├─ tenants.service.ts     # логика создания/обновления тенантов
│  │     │  │  ├─ tenants.module.ts      # Nest-модуль тенантов
│  │     │  │  └─ dto/
│  │     │  │     ├─ create-tenant.dto.ts# DTO создания тенанта
│  │     │  │     └─ update-tenant.dto.ts# DTO обновления тенанта
│  │     │  │
│  │     │  ├─ projects/                 # управление TMA-проектами
│  │     │  │  ├─ projects.controller.ts # эндпоинты /admin/projects/*
│  │     │  │  ├─ projects.service.ts    # логика CRUD проектов
│  │     │  │  ├─ projects.module.ts     # Nest-модуль проектов
│  │     │  │  └─ dto/
│  │     │  │     ├─ create-project.dto.ts # DTO создания проекта
│  │     │  │     └─ update-project.dto.ts # DTO обновления проекта
│  │     │  │
│  │     │  ├─ configs/                  # управление конфигами игр
│  │     │  │  ├─ configs.controller.ts  # эндпоинты /admin/configs/*
│  │     │  │  ├─ configs.service.ts     # CRUD и публикация конфигов
│  │     │  │  ├─ configs.module.ts      # Nest-модуль конфигов
│  │     │  │  └─ dto/
│  │     │  │     ├─ upsert-config.dto.ts# DTO сохранения/обновления конфига
│  │     │  │     └─ publish-config.dto.ts # DTO публикации конфига
│  │     │  │
│  │     │  ├─ billing/                  # лимиты, тарифы (MVP-версия может быть простым stub)
│  │     │  │  ├─ billing.controller.ts  # эндпоинты /admin/billing/*
│  │     │  │  ├─ billing.service.ts     # проверка лимитов, расчёт использования
│  │     │  │  ├─ billing.module.ts      # Nest-модуль биллинга
│  │     │  │  └─ dto/
│  │     │  │     └─ update-limits.dto.ts# DTO изменения лимитов
│  │     │  │
│  │     │  └─ analytics/                # агрегированная аналитика для админки
│  │     │     ├─ analytics.controller.ts# эндпоинты /admin/analytics/*
│  │     │     ├─ analytics.service.ts   # запросы к ClickHouse/PG, сбор статистики
│  │     │     └─ analytics.module.ts    # Nest-модуль аналитики
│  │     │
│  │     ├─ runtime/                     # зона /runtime/* + интеграция с ботом
│  │     │  ├─ api/                      # внешний HTTP API для TMA: init/event
│  │     │  │  ├─ runtime.controller.ts  # эндпоинты /runtime/init, /runtime/event
│  │     │  │  ├─ runtime.service.ts     # оркестрация: игрок, конфиг, игра, события
│  │     │  │  ├─ runtime.module.ts      # Nest-модуль runtime API
│  │     │  │  └─ dto/
│  │     │  │     ├─ runtime-init.dto.ts # DTO запроса init (initData, projectSlug, etc.)
│  │     │  │     └─ runtime-event.dto.ts# DTO событий (eventType, payload)
│  │     │  │
│  │     │  ├─ projects/                 # чтение конфигов проекта для runtime
│  │     │  │  ├─ runtime-projects.service.ts # загрузка проекта и конфига (PG + Redis)
│  │     │  │  ├─ runtime-projects.module.ts  # Nest-модуль runtime-проектов
│  │     │  │  └─ mappers.ts             # маппинг БД-сущностей в runtime-модели
│  │     │  │
│  │     │  ├─ players/                  # игроки и их прогресс
│  │     │  │  ├─ players.service.ts     # поиск/создание игрока, обновление прогресса
│  │     │  │  ├─ players.module.ts      # Nest-модуль игроков
│  │     │  │  └─ mappers.ts             # маппинг сущностей Player, PlayerProgress
│  │     │  │
│  │     │  ├─ game/                     # игровая логика
│  │     │  │  ├─ game.service.ts        # основной движок: handleEvent, расчёт награды
│  │     │  │  ├─ game.module.ts         # Nest-модуль игрового движка
│  │     │  │  ├─ rules/
│  │     │  │  │  ├─ click-rule.ts       # правило обработки кликов (кликер)
│  │     │  │  │  └─ daily-reward-rule.ts# правило ежедневных наград
│  │     │  │  └─ types.ts               # контексты игры, типы событий и стейта
│  │     │  │
│  │     │  ├─ analytics/                # отправка событий в Kafka
│  │     │  │  ├─ runtime-analytics.service.ts # формирование событий runtime (click, reward)
│  │     │  │  └─ runtime-analytics.module.ts  # модуль отправки событий в Kafka
│  │     │  │
│  │     │  └─ bot/                      # Webhook Telegram-бота
│  │     │     ├─ bot.controller.ts      # обработчик /telegram/webhook
│  │     │     ├─ bot.service.ts         # логика обработки обновлений, web_app_data и т.п.
│  │     │     └─ bot.module.ts          # Nest-модуль бота
│  │     │
│  │     ├─ health/                      # health-check сервиса
│  │     │  ├─ health.controller.ts      # эндпоинт /health (liveness/readiness)
│  │     │  └─ health.module.ts          # модуль health для подключения в AppModule
│  │     │
│  │     ├─ metrics/                     # метрики Prometheus
│  │     │  ├─ metrics.controller.ts     # /metrics (если отдаём метрики из backend-core)
│  │     │  └─ metrics.module.ts         # модуль интеграции с libs/prometheus
│  │     │
│  │     ├─ flags/                       # feature flags для backend-core
│  │     │  ├─ flags.service.ts          # чтение флагов (env, in-memory)
│  │     │  └─ flags.module.ts           # модуль флагов
│  │     │
│  │     ├─ postgres/                    # обвязка над libs/postgres в контексте backend-core
│  │     │  ├─ postgres.module.ts        # импорт модуля из libs/postgres, конфигурация
│  │     │  └─ postgres.config.ts        # чтение и сбор параметров подключения к PG
│  │     │
│  │     ├─ redis/                       # обвязка над libs/redis
│  │     │  ├─ redis.module.ts           # импорт RedisModule, регистрация в Nest
│  │     │  └─ redis.config.ts           # конфига подключения к Redis
│  │     │
│  │     ├─ kafka/                       # обвязка над libs/kafka
│  │     │  ├─ kafka.module.ts           # импорт KafkaModule, настройка продьюсеров
│  │     │  └─ kafka-topics.ts           # константы Kafka-топиков (tma.events.analytics, ...)
│  │     │
│  │     └─ common/                      # utility-слой Nest: guards, interceptors, filters
│  │        ├─ guards/
│  │        │  ├─ admin-auth.guard.ts    # guard авторизации для /admin/*
│  │        │  └─ roles.guard.ts         # guard ролей/прав
│  │        │
│  │        ├─ interceptors/
│  │        │  ├─ logging.interceptor.ts # логирование запросов/ответов
│  │        │  └─ timeout.interceptor.ts # таймауты обработки запросов
│  │        │
│  │        ├─ filters/
│  │        │  ├─ http-exception.filter.ts       # форматирование ошибок HTTP
│  │        │  └─ validation-exception.filter.ts # формат ошибок валидации DTO
│  │        │
│  │        ├─ decorators/
│  │        │  ├─ current-user.decorator.ts      # получение юзера из контекста
│  │        │  └─ tenant.decorator.ts            # получение текущего тенанта
│  │        │
│  │        └─ utils/
│  │           ├─ pagination.util.ts     # хелперы для пагинации
│  │           └─ tracing.util.ts        # хелперы для трейсинга/логов
│  │
│  ├─ worker-jobs/                      # сервис асинхронной обработки событий (Kafka-воркер)
│  │  ├─ package.json                   # зависимости воркера
│  │  └─ src/
│  │     ├─ main.ts                     # запуск приложения воркера (Nest/Node)
│  │     ├─ jobs-bootstrap.ts           # регистрация Kafka-консьюмеров, старт обработки
│  │     │
│  │     ├─ analytics-events/           # обработка аналитических событий из Kafka
│  │     │  ├─ analytics-events.consumer.ts # подписка на tma.events.analytics
│  │     │  ├─ analytics-events.handler.ts   # доменная логика сохранения/агрегаций
│  │     │  └─ analytics-events.mapper.ts    # преобразование event → модель ClickHouse/PG
│  │     │
│  │     ├─ player-events/              # (опционально) обработка событий по игрокам
│  │     │  ├─ player-events.consumer.ts# подписка на tma.events.player.*
│  │     │  ├─ player-events.handler.ts # логика реакций на события игрока
│  │     │  └─ player-events.mapper.ts  # маппинг событий в модели хранения
│  │     │
│  │     ├─ postgres/                   # использование libs/postgres в воркере
│  │     │  ├─ postgres.module.ts       # подключение PG-модуля к воркеру
│  │     │  └─ postgres.config.ts       # конфиг подключения к PG
│  │     │
│  │     ├─ kafka/                      # использование libs/kafka как consumer
│  │     │  ├─ kafka.module.ts          # конфигурация Kafka-консьюмеров
│  │     │  └─ kafka-topics.ts          # константы Kafka-топиков для воркера
│  │     │
│  │     ├─ clickhouse/                 # клиент ClickHouse
│  │     │  ├─ clickhouse.module.ts     # регистрация клиента ClickHouse
│  │     │  └─ clickhouse.client.ts     # wrapper над драйвером ClickHouse, batch insert
│  │     │
│  │     ├─ metrics/                    # метрики производительности воркера
│  │     │  ├─ metrics.module.ts        # модуль интеграции с libs/prometheus
│  │     │  └─ metrics.service.ts       # инкремент метрик при обработке событий
│  │     │
│  │     ├─ health/                     # health-check воркера
│  │     │  ├─ health.controller.ts     # /health, если поднят HTTP-сервер
│  │     │  └─ health.module.ts         # модуль health
│  │     │
│  │     └─ logging/                    # логирование в воркере
│  │        ├─ logging.module.ts        # подключение общего логгера
│  │        └─ logging.interceptor.ts   # интерсептор для логирования обработки
│  │
│  └─ telegram-bot-cli/                 # CLI-утилиты для управления Telegram-ботом
│     ├─ package.json                   # зависимости CLI, bin-скрипт
│     └─ src/
│        ├─ index.ts                    # вход CLI, регистрация команд (commander/yargs)
│        │
│        ├─ commands/                   # конкретные команды CLI
│        │  ├─ set-webhook.command.ts   # команда установки webhook URL
│        │  ├─ delete-webhook.command.ts# команда удаления webhook
│        │  ├─ get-webhook-info.command.ts # просмотр текущего webhook у бота
│        │  └─ send-test-message.command.ts # отправка тестового сообщения в чат
│        │
│        ├─ telegram-api/               # простой HTTP-клиент к Telegram Bot API
│        │  ├─ telegram-api.client.ts   # вызовы setWebhook, getWebhookInfo, sendMessage
│        │  └─ telegram-api.types.ts    # TS-типы ответов Bot API
│        │
│        └─ config/                     # конфигурация CLI
│           ├─ env.ts                   # чтение BOT_TOKEN и прочих переменных окружения
│           └─ cli-config.ts            # дефолтные значения (например, дефолтный webhook URL)
│
└─ docs
   ├─ architecture/
   │  └─ mvp.md                        # текстовое описание архитектуры + mermaid-схемы
   └─ api/
      ├─ openapi-admin.yaml            # OpenAPI-спека для /admin/*
      └─ openapi-runtime.yaml          # OpenAPI-спека для /runtime/*
