import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { isAdminUser } from './access';
import { hasCronSecret } from './lib/cron-auth';
import { getGoogleAuthSettings, googleAuthPlugin } from './auth/google';
import { seedFirstAdmin } from './auth/seedFirstAdmin';
import { Authors } from './collections/Authors';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const googleAuth = getGoogleAuthSettings();

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' – Xmartlabs Blog',
      description: 'Write and publish posts for the Xmartlabs blog.',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon.png' }],
      openGraph: {
        siteName: 'Xmartlabs Blog',
        title: 'Xmartlabs Blog – Admin',
        description: 'Write and publish posts for the Xmartlabs blog.',
        images: [{ url: '/images/og-thumbnail.png' }],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
      // Google is the main way in, so its button goes above the email/password form (kept
      // for the break-glass admin). Always registered (so the import map doesn't depend on
      // env vars); it renders nothing unless Google sign-in is configured.
      beforeLogin: [
        {
          path: '/auth/GoogleLoginButton#GoogleLoginButton',
          clientProps: {
            enabled: googleAuth !== null,
            allowedDomain: googleAuth?.allowedDomain ?? '',
          },
        },
      ],
    },
  },
  collections: [Posts, Authors, Categories, Media, Users],
  jobs: {
    // Scheduled publishing (posts: versions.drafts.schedulePublish) queues jobs that
    // /api/payload-jobs/run executes. `autoRun` needs a long-running server, so on Vercel a
    // cron job (vercel.json, every 5 minutes) calls that endpoint with
    // `Authorization: Bearer $CRON_SECRET`, which Vercel adds when CRON_SECRET is set.
    access: {
      run: ({ req }) =>
        isAdminUser(req.user) ||
        hasCronSecret(req.headers.get('authorization')),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      // `next build` pre-renders pages in several workers, each with its own pool; keep them
      // small so the build stays under the server's connection limit (Postgres: 100).
      max: process.env.NEXT_PHASE === 'phase-production-build' ? 3 : 10,
    },
    // Dev: schema is pushed automatically. Production: `payload migrate` (npm run ci).
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      clientUploads: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    googleAuthPlugin(googleAuth),
  ],
  onInit: async (payload) => {
    try {
      await seedFirstAdmin(payload);
    } catch (error) {
      payload.logger.error(
        { err: error },
        'Could not seed the first admin user'
      );
    }
  },
});
