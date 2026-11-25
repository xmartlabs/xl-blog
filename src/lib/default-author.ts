/**
 * Id of the author linked to a user (`users.author`), or undefined. The user may come with
 * the relation as an id or populated (`req.user` is read with the auth depth).
 * Posts use it to preselect the author of a new post.
 */
export const authorIdOfUser = (user: unknown): number | string | undefined => {
  if (!user || typeof user !== 'object' || !('author' in user))
    return undefined;
  const author = (user as { author?: unknown }).author;
  if (typeof author === 'number' || (typeof author === 'string' && author)) {
    return author;
  }
  if (author && typeof author === 'object' && 'id' in author) {
    const id = (author as { id?: unknown }).id;
    if (typeof id === 'number' || (typeof id === 'string' && id)) return id;
  }
  return undefined;
};
