import type { DemoState } from "../types";
import type { GameConfig } from "../config.types";

export const renderInvite = (state: DemoState, config: GameConfig) => {
  const link = `https://t.me/${config.botName}?startapp=ref_${state.myCode}`;
  return `
    <section class="hero">
      <div class="hero-title">Пригласи друзей</div>
      <div class="hero-sub">${config.invite.description}</div>
    </section>

    <section class="card">
      <h3>Твоя ссылка</h3>
      <p>${link}</p>
      <div class="card-actions">
        <button class="button" data-action="share">Поделиться</button>
      </div>
    </section>

    <section class="card">
      <h3>Подсказка</h3>
      <p>Если приложение открыто по чужой ссылке и код ещё не принят — сундук появится автоматически.</p>
    </section>
  `;
};
