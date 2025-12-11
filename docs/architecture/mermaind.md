```
flowchart LR
  %% === Клиент и Telegram ===
  subgraph TG["Экосистема Telegram"]
    U[Пользователь\nTelegram клиент]
    MT["Telegram Mini App\n(Frontend: React/Vue)"]
    BOT["Telegram Bot API\n(webhook)"]
  end

  U --> MT
  U --> BOT

  %% === Вход в нашу инфраструктуру ===
  MT -->|HTTPS| GW["API Gateway / Ingress\n(Nginx / Traefik)"]
  BOT -->|Webhook| GW

  %% === BFF / Runtime для Mini Apps ===
  subgraph RUNTIME["MiniApp Runtime / BFF\n(горизонтально масштабируется)"]
    direction TB
    R1["Runtime Instance #1"]
    R2["Runtime Instance #2"]
    R3["Runtime Instance #N"]

    R1 <-..-> R2
    R2 <-..-> R3
  end

  GW --> RUNTIME

  %% === Сервисы ядра (MVP, но с запасом под масштаб) ===
  subgraph CORE["Backend-сервисы (MVP)"]
    direction TB

    AUTH["Auth Service\n(токены Telegram, сессии)"]
    TENANT["Tenant/Project Service\n(компании, проекты, лимиты)"]
    CONFIG["MiniApp Config Service\n(экраны, флоу, геймификация)"]
    GAME["Game/Logic Service\n(очки, уровни, реферальки)"]
    PAYMENT["Billing/Payments\n(внутр. валюта, Telegram Stars)"]
    ANALYTICS["Analytics/Events\n(события, метрики)"]
  end

  RUNTIME --> AUTH
  RUNTIME --> TENANT
  RUNTIME --> CONFIG
  RUNTIME --> GAME
  RUNTIME --> PAYMENT
  RUNTIME --> ANALYTICS

  %% === Конструктор (админка SaaS) ===
  subgraph ADMIN["Admin / Constructor Web App"]
    ADMIN_UI["Web UI\n(React Admin)"]
  end

  ADMIN_UI -->|HTTPS| GW
  GW --> CONFIG
  GW --> TENANT
  GW --> PAYMENT
  GW --> ANALYTICS

  %% === Хранилища ===
  subgraph DATA["Хранилища данных"]
    direction TB
    DB[("PostgreSQL\nосновные данные:\nпользователи, проекты,\nконфиги, биллинг")]
    REDIS[("Redis\nсессии, кэш, rate limit")]
    S3[("Object Storage (S3)\nassets, картинки, json-конфиги")]
    EVENTS[("ClickHouse / Timescale\nсобытия, аналитика")]
  end

  AUTH --> DB
  TENANT --> DB
  CONFIG --> DB
  GAME --> DB
  PAYMENT --> DB

  RUNTIME --> REDIS
  AUTH --> REDIS

  CONFIG --> S3
  GAME --> EVENTS
  ANALYTICS --> EVENTS

  %% === Очереди / фоновые задачи ===
  subgraph ASYNC["Очереди и воркеры"]
    direction TB
    MQ[("Kafka / RabbitMQ\nсобытия, задачи")]
    WORKERS["Background Workers\n(обработка событий,\nрассылки, интеграции)"]
  end

  RUNTIME --> MQ
  CORE --> MQ
  MQ --> WORKERS
  WORKERS --> DB
  WORKERS --> EVENTS

  %% === Мониторинг и логирование ===
  subgraph OBS["Мониторинг и логирование"]
    PROM["Prometheus / Grafana\nметрики, алерты"]
    LOGS["ELK / Loki\nлоги"]
  end

  RUNTIME --> PROM
  CORE --> PROM
  RUNTIME --> LOGS
  CORE --> LOGS
  GW --> LOGS
```