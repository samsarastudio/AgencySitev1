import * as migration_20260928_011736_initial_cms from './20260928_011736_initial_cms';

export const migrations = [
  {
    up: migration_20260928_011736_initial_cms.up,
    down: migration_20260928_011736_initial_cms.down,
    name: '20260928_011736_initial_cms'
  },
];
