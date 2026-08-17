import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

export type SessionPhase = "boot" | "login" | "starting" | "desktop";

export type AppId =
  | "about"
  | "projects"
  | "contact"
  | "terminal"
  | "files"
  | "snake"
  | "firefox";

export type WindowState = {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: { x: number; y: number; width: number; height: number };
};

type SessionState = {
  phase: SessionPhase;
  windows: WindowState[];
  nextZ: number;
  menuOpen: boolean;
  focusedId: AppId | null;
};

type Action =
  | { type: "SET_PHASE"; phase: SessionPhase }
  | { type: "OPEN_APP"; id: AppId }
  | { type: "CLOSE_APP"; id: AppId }
  | { type: "FOCUS_APP"; id: AppId }
  | { type: "MINIMIZE_APP"; id: AppId }
  | { type: "TOGGLE_MAXIMIZE"; id: AppId }
  | { type: "MOVE_WINDOW"; id: AppId; x: number; y: number }
  | { type: "RESIZE_WINDOW"; id: AppId; width: number; height: number }
  | { type: "SET_MENU"; open: boolean }
  | { type: "LOGOUT" }
  | { type: "REBOOT" };

const APP_META: Record<
  AppId,
  { title: string; width: number; height: number; offset: number }
> = {
  about: { title: "About — Mousepad", width: 560, height: 500, offset: 0 },
  projects: { title: "Projects", width: 640, height: 480, offset: 1 },
  contact: { title: "Contact", width: 520, height: 400, offset: 2 },
  terminal: { title: "Terminal — xfce4-terminal", width: 640, height: 400, offset: 3 },
  files: { title: "Home — File Manager", width: 620, height: 440, offset: 4 },
  snake: { title: "Snake", width: 480, height: 460, offset: 5 },
  firefox: { title: "Firefox", width: 780, height: 560, offset: 1 },
};

const PANEL = 28;

function defaultWindow(id: AppId, z: number): WindowState {
  const meta = APP_META[id];
  const cascade = meta.offset * 28;
  return {
    id,
    title: meta.title,
    x: 100 + cascade,
    y: 16 + cascade,
    width: meta.width,
    height: meta.height,
    z,
    minimized: false,
    maximized: false,
  };
}

const initialState: SessionState = {
  phase: "boot",
  windows: [],
  nextZ: 1,
  menuOpen: false,
  focusedId: null,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase, menuOpen: false };
    case "SET_MENU":
      return { ...state, menuOpen: action.open };
    case "OPEN_APP": {
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        const z = state.nextZ;
        return {
          ...state,
          nextZ: z + 1,
          focusedId: action.id,
          menuOpen: false,
          windows: state.windows.map((w) =>
            w.id === action.id
              ? { ...w, minimized: false, z }
              : w,
          ),
        };
      }
      const z = state.nextZ;
      return {
        ...state,
        nextZ: z + 1,
        focusedId: action.id,
        menuOpen: false,
        windows: [...state.windows, defaultWindow(action.id, z)],
      };
    }
    case "CLOSE_APP": {
      const windows = state.windows.filter((w) => w.id !== action.id);
      const top = [...windows].sort((a, b) => b.z - a.z)[0];
      return {
        ...state,
        windows,
        focusedId: top && !top.minimized ? top.id : null,
      };
    }
    case "FOCUS_APP": {
      const z = state.nextZ;
      return {
        ...state,
        nextZ: z + 1,
        focusedId: action.id,
        menuOpen: false,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: false, z } : w,
        ),
      };
    }
    case "MINIMIZE_APP":
      return {
        ...state,
        focusedId: state.focusedId === action.id ? null : state.focusedId,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      };
    case "TOGGLE_MAXIMIZE": {
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized && w.restore) {
            return {
              ...w,
              maximized: false,
              x: w.restore.x,
              y: w.restore.y,
              width: w.restore.width,
              height: w.restore.height,
              restore: undefined,
            };
          }
          return {
            ...w,
            maximized: true,
            restore: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - PANEL,
          };
        }),
      };
    }
    case "MOVE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id && !w.maximized
            ? { ...w, x: action.x, y: action.y }
            : w,
        ),
      };
    case "RESIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id && !w.maximized
            ? {
                ...w,
                width: Math.max(320, action.width),
                height: Math.max(200, action.height),
              }
            : w,
        ),
      };
    case "LOGOUT":
      return {
        ...initialState,
        phase: "login",
      };
    case "REBOOT":
      return { ...initialState, phase: "boot" };
    default:
      return state;
  }
}

type SessionApi = {
  state: SessionState;
  setPhase: (phase: SessionPhase) => void;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, width: number, height: number) => void;
  setMenuOpen: (open: boolean) => void;
  logout: () => void;
  reboot: () => void;
  appMeta: typeof APP_META;
};

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setPhase = useCallback(
    (phase: SessionPhase) => dispatch({ type: "SET_PHASE", phase }),
    [],
  );
  const openApp = useCallback(
    (id: AppId) => dispatch({ type: "OPEN_APP", id }),
    [],
  );
  const closeApp = useCallback(
    (id: AppId) => dispatch({ type: "CLOSE_APP", id }),
    [],
  );
  const focusApp = useCallback(
    (id: AppId) => dispatch({ type: "FOCUS_APP", id }),
    [],
  );
  const minimizeApp = useCallback(
    (id: AppId) => dispatch({ type: "MINIMIZE_APP", id }),
    [],
  );
  const toggleMaximize = useCallback(
    (id: AppId) => dispatch({ type: "TOGGLE_MAXIMIZE", id }),
    [],
  );
  const moveWindow = useCallback(
    (id: AppId, x: number, y: number) =>
      dispatch({ type: "MOVE_WINDOW", id, x, y }),
    [],
  );
  const resizeWindow = useCallback(
    (id: AppId, width: number, height: number) =>
      dispatch({ type: "RESIZE_WINDOW", id, width, height }),
    [],
  );
  const setMenuOpen = useCallback(
    (open: boolean) => dispatch({ type: "SET_MENU", open }),
    [],
  );
  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);
  const reboot = useCallback(() => dispatch({ type: "REBOOT" }), []);

  const api = useMemo<SessionApi>(
    () => ({
      state,
      setPhase,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      setMenuOpen,
      logout,
      reboot,
      appMeta: APP_META,
    }),
    [
      state,
      setPhase,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      setMenuOpen,
      logout,
      reboot,
    ],
  );

  return (
    <SessionContext.Provider value={api}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
