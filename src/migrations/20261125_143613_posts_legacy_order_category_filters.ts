import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "legacy_source_file" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_source_file" varchar;
  ALTER TABLE "categories" ADD COLUMN "show_in_filters" boolean DEFAULT true;
  CREATE INDEX "posts_legacy_source_file_idx" ON "posts" USING btree ("legacy_source_file");
  CREATE INDEX "_posts_v_version_version_legacy_source_file_idx" ON "_posts_v" USING btree ("version_legacy_source_file");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "posts_legacy_source_file_idx";
  DROP INDEX "_posts_v_version_version_legacy_source_file_idx";
  ALTER TABLE "posts" DROP COLUMN "legacy_source_file";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_source_file";
  ALTER TABLE "categories" DROP COLUMN "show_in_filters";`)
}
