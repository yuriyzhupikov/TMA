import type { Screen, UiState } from "../../types";

export const renderBottomNav = (ui: UiState) => `
  <nav class="bottom-nav">
    <button class="nav-btn ${ui.screen === "home" ? "active" : ""}" data-screen="home">Home</button>
    <button class="nav-btn ${ui.screen === "leaderboard" ? "active" : ""}" data-screen="leaderboard">Leaderboard</button>
    <button class="nav-btn ${ui.screen === "invite" ? "active" : ""}" data-screen="invite">Invite</button>
    <button class="nav-btn ${ui.screen === "profile" ? "active" : ""}" data-screen="profile">Profile</button>
  </nav>
`;

export const getScreenFromButton = (button: HTMLButtonElement) =>
  button.getAttribute("data-screen") as Screen | null;
