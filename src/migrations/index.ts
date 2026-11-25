import * as migration_20261125_135017_initial from './20261125_135017_initial';
import * as migration_20261125_143613_posts_legacy_order_category_filters from './20261125_143613_posts_legacy_order_category_filters';
import * as migration_20261125_194219_cms_polish from './20261125_194219_cms_polish';

export const migrations = [
  {
    up: migration_20261125_135017_initial.up,
    down: migration_20261125_135017_initial.down,
    name: '20261125_135017_initial',
  },
  {
    up: migration_20261125_143613_posts_legacy_order_category_filters.up,
    down: migration_20261125_143613_posts_legacy_order_category_filters.down,
    name: '20261125_143613_posts_legacy_order_category_filters',
  },
  {
    up: migration_20261125_194219_cms_polish.up,
    down: migration_20261125_194219_cms_polish.down,
    name: '20261125_194219_cms_polish'
  },
];
