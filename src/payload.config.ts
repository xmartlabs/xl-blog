import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import sharp from 'sharp';

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
      titleSuffix: ' | Xmartlabs Blog',
    },
    components: {
      // Always registered (so the import map doesn't depend on env vars); it renders
      // nothing unless Google sign-in is configured.
      afterLogin: [
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
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
