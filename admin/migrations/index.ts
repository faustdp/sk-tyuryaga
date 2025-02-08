import * as migration_20250207_203543_initial from './20250207_203543_initial';

export const migrations = [
  {
    up: migration_20250207_203543_initial.up,
    down: migration_20250207_203543_initial.down,
    name: '20250207_203543_initial'
  },
];
