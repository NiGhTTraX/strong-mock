export enum Mode {
  EXPECT,
  CALL,
}

let currentMode: Mode = Mode.CALL;

export const setMode = (mode: Mode) => {
  currentMode = mode;
};

export const getMode = () => currentMode;
