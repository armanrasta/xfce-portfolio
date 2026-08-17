import { useSession } from "../session/SessionContext";
import type { WallpaperId, ThemeId } from "../session/SessionContext";
import "./apps.css";

export function SettingsApp() {
  const {
    state,
    setTheme,
    setWallpaper,
    setWidgetVisible,
    setAutostart,
  } = useSession();

  return (
    <div className="app settings-app">
      <h2>Appearance</h2>

      <label className="settings-row">
        <span>Panel theme</span>
        <select
          value={state.theme}
          onChange={(e) => setTheme(e.target.value as ThemeId)}
        >
          <option value="light">Greybird light</option>
          <option value="dark">Greybird dark</option>
        </select>
      </label>

      <label className="settings-row">
        <span>Wallpaper</span>
        <select
          value={state.wallpaper}
          onChange={(e) => setWallpaper(e.target.value as WallpaperId)}
        >
          <option value="swirl">Debian swirl</option>
          <option value="dusk">Dusk</option>
          <option value="slate">Slate</option>
        </select>
      </label>

      <label className="settings-check">
        <input
          type="checkbox"
          checked={state.widgetVisible}
          onChange={(e) => setWidgetVisible(e.target.checked)}
        />
        Show extra notes (bottom-right)
      </label>

      <label className="settings-check">
        <input
          type="checkbox"
          checked={state.autostart}
          onChange={(e) => setAutostart(e.target.checked)}
        />
        Open About and Firefox on login
      </label>

      <p className="muted">
        Preferences stay for this browser tab. Right-click the wallpaper to
        change it quickly.
      </p>
    </div>
  );
}
