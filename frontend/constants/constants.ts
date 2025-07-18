export const DEFAULT_ICON = '🫘';
export const ICON_LIST = ['🫘', '🐋', '🪨', '💸'];
export const PLACEHOLDERS = [
  "Tim's game",
  "July's session",
  "Maxi's game",
  "Sophia's gathering",
  "Clemens's party",
  "Elena's game",
  "Hanna's party",
  "Linus's session",
  "Nina's gathering",
  "Lara's game",
  "Paula's session",
  "Pasis's party",
  "Tobi's gathering",
];

export enum loginViews {
  join = 0,
  create = 1,
  copy = 2,
}

export enum dashboardViews {
  loading = 0,
  home = 1,
  share = 2,
  settings = 3,
}

// ToDo: adjust values for production
// Beans per tick
export const DEFAULT_BEANS_PER_TICK = 1;
export const MIN_BEANS_PER_TICK = 1;
export const MAX_BEANS_PER_TICK = 50;
export const BEANS_PER_TICK_STEP_SIZE = 1;

// Seconds per tick
// TODO: 300
export const DEFAULT_SECONDS_PER_TICK = 3;
// TODO: 30
export const MIN_SECONDS_PER_TICK = 0;
export const MAX_SECONDS_PER_TICK = 600;
export const SECONDS_PER_TICK_STEP_SIZE = 30;

// Starting funds
export const DEFAULT_STARTING_FUNDS = 5;
export const MIN_STARTING_FUNDS = 0;
export const MAX_STARTING_FUNDS = 50;
export const STARTING_FUNDS_STEP_SIZE = 1;

// Child
export type workingState = 'working' | 'idle' | 'resting';
export type iconList = 'bean:play' | 'bean:stop';
