import { SessionProvider, useSession } from "./session/SessionContext";
import { BootSplash } from "./session/BootSplash";
import { LoginScreen, StartingSession } from "./session/LoginScreen";
import { Desktop } from "./desktop/Desktop";
import "./styles/xfce.css";
import "./styles/mobile.css";

function SessionRoot() {
  const { state } = useSession();

  switch (state.phase) {
    case "boot":
      return <BootSplash />;
    case "login":
      return <LoginScreen />;
    case "starting":
      return <StartingSession />;
    case "desktop":
      return <Desktop />;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <SessionRoot />
    </SessionProvider>
  );
}
