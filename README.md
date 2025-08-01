## XL Blog

This project is a static blog built with Gatsby, leveraging Netlify as a CMS and continuous deployment service, integrated with GitHub for version control. The process is automated from the moment content is edited in the CMS or code is pushed to GitHub, triggering builds and deployments to production.

### Key elements

- [Gatsby](https://www.gatsbyjs.com/): Static site generator that powers the UI of the blog, offering fast, optimized web experiences. We use Gatsby to create the blog's frontend, while the build process is handled by Netlify, which integrates seamlessly with Gatsby to automatically generate and deploy the static site.

- [Netlify](https://www.netlify.com/) CMS: A git-based content management system integrated directly with GitHub repository, allowing easy content creation and updates.

- Netlify instance: Handles the deployment pipeline. Every change pushed to GitHub triggers a build on Netlify, deploying the updated site to production seamlessly.

- GitHub: Manages the version control of the blog's code and content.

### Key considerations

Every time a new blog entry is created, it generates a pull request towards the main branch, which is maintained throughout the workflow from draft to publish, when it is merged into the branch and published.

The entire deployment process is managed automatically by Netlify using the Netlify+GitHub integration, which requires configuring access permissions in advance. See [Netlify & GitHub](https://docs.netlify.com/git/repo-permissions-linking/) for details. <br>
The owner of this instance is associated with the account engineering@xmartlabs.com, which is responsible for creating the PR on behalf of the user who creates a new entry.

It is important to ensure that the Cloudflare domain for blog.xmartlabs.com is associated with the Netlify instance.

| **Url**                                                            | **Description**                                                                                                                     |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| https://app.netlify.com/sites/blog-xl/overview                     | It is the back-office of the XL blog instance in Netlify. Necessary for configuring integrations, domains, permissions, users, etc. |
| https://blog.xmartlabs.com/admin                                   | It is the CMS provided by Netlify to manage the blog posts.                                                                         |
| https://app.netlify.com/sites/blog-xl/configuration/identity#users | CMS access user list.                                                                                                               |
| https://app.netlify.com/sites/blog-xl/deploys                      | Deploys                                                                                                                             |

### React components in MDX

First, to use a React Component while creating a new blog we need to use the extension `mdx` while creating a blog.

Second, we need to make it globally available in the app and for that we need to inject it the `MDXProvider` and you can find it in the `main-layout.jsx` file.

Here you'll modify the following line

```
const shortCodes = { [ComponentName]: [ActualReactComponent] };
```

Here `ComponentName` is the name that the user will have to use when creating the blog.
Example:

```
const shortCodes = { YouTube: YoutubePlayer };
```

Then while creating the blog, this is how it's going to be used

```
# Title
This is my new blog using React Components

<YouTube id="dsCiJIhfM5E" width="100%"/>
```

If the React Component name matches the name to use in the template, then you can just simplify it like this

```
const shortCodes = { Youtube };
```

## Available Components

### Image Component

The Image component is a flexible React component that can display either a single image or multiple images in a row. It supports various styling options and maintains consistent aspect ratios.

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `src` | `string \| string[]` | - | Yes | Image URL for single image or array of URLs for multiple images |
| `alt` | `string` | `"Xmartlabs"` | No | Alt text for accessibility |
| `width` | `string` | `"100%"` | No | Width of the image(s) |
| `height` | `string` | `"315px"` | No | Height of the image(s) |
| `aspectRatio` | `string` | `"16/9"` | No | CSS aspect ratio property |

#### Usage Examples

**Single Image:**
```mdx
<Image
  src="https://example.com/image.jpg"
  alt="Example image"
  width="80%"
  height="400px"
/>
```

**Multiple Images:**
```mdx
<Image
  src={[
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]}
  alt="Gallery images"
  height="250px"
/>
```

**Custom Aspect Ratio:**
```mdx
<Image
  src="https://example.com/square-image.jpg"
  alt="Square image"
  aspectRatio="1/1"
  width="300px"
/>
```

#### Features

- **Single or Multiple Images**: Pass a string for one image or an array for multiple images
- **Even Distribution**: Multiple images are automatically distributed evenly across the container width
- **Responsive Design**: Supports percentage-based widths for responsive layouts
- **Aspect Ratio Control**: Maintains consistent aspect ratios using CSS
- **Object Fit Cover**: Images maintain their aspect ratio and cover the container
- **Flexible Layout**: Multiple images wrap to new rows on smaller screens
- **Accessibility**: Proper alt text support with automatic numbering for multiple images

### YouTube Component

The YouTube component allows you to embed YouTube videos in your blog posts.

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | YouTube video ID |
| `width` | `string` | `"100%"` | No | Width of the video player |
| `height` | `string` | `"560px"` | No | Height of the video player |
| `title` | `string` | `"Xmartlabs"` | No | Title for the iframe |

#### Usage Example

```mdx
<YouTube id="dsCiJIhfM5E" width="100%" height="400px" />
```

### Documenting the new Component

It's very important to document **how** we can use the components for non-developers that create blogs, this can be documented in the Blog's Notion page, the [Snippet Section](https://www.notion.so/xmartlabs/Blog-Snippets-238fbac623cd80fbb43ffabb3ff38ef2).
```