import { getCategories, getPosts, paginate } from './posts';

/** One entry per page of every category that has posts. */
export const getCategoryPages = async () => {
  const posts = await getPosts();
  const categories = await getCategories();
  return categories.flatMap((category) => {
    const categoryPosts = posts.filter(
      (post) => post.data.category.id === category.id
    );
    if (categoryPosts.length === 0) return [];
    const pages = paginate(categoryPosts);
    return pages.map((pagePosts, i) => ({
      category: category.id,
      currentPage: i + 1,
      numPages: pages.length,
      posts: pagePosts,
    }));
  });
};
