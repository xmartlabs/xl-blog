import * as migration_20261125_135017_initial from './20261125_135017_initial';

export const migrations = [
  {
    up: migration_20261125_135017_initial.up,
    down: migration_20261125_135017_initial.down,
    name: '20261125_135017_initial'
  },
];
