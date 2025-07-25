# Flexible Image Components

This module provides two flexible image components for the XL Blog: `FlexibleImage` and `ImageRow`.

## FlexibleImage

A highly customizable image component that handles both static images and Gatsby image data objects.

### Props

| Prop              | Type               | Default                    | Description                                                                             |
| ----------------- | ------------------ | -------------------------- | --------------------------------------------------------------------------------------- |
| `src`             | `string \| object` | Required                   | Image source (static path or Gatsby image data)                                         |
| `alt`             | `string`           | Required                   | Alt text for accessibility                                                              |
| `size`            | `string`           | `'medium'`                 | Predefined size: `'xs'`, `'small'`, `'medium'`, `'large'`, `'xl'`, `'full'`, `'custom'` |
| `aspectRatio`     | `string \| number` | `'auto'`                   | Force aspect ratio (e.g., `'16/9'`, `1.5`)                                              |
| `layout`          | `string`           | `'constrained'`            | Gatsby layout: `'constrained'`, `'fixed'`, `'fullWidth'`, `'constrainedToParent'`       |
| `className`       | `string`           | `undefined`                | Additional CSS classes                                                                  |
| `caption`         | `string`           | `undefined`                | Image caption                                                                           |
| `loading`         | `string`           | `'lazy'`                   | Loading strategy: `'lazy'`, `'eager'`                                                   |
| `quality`         | `number`           | `95`                       | Image quality (1-100)                                                                   |
| `formats`         | `array`            | `['auto', 'webp', 'avif']` | Image formats to generate                                                               |
| `placeholder`     | `string`           | `'blurred'`                | Placeholder type: `'blurred'`, `'none'`                                                 |
| `backgroundColor` | `string`           | `'transparent'`            | Background color                                                                        |

### Basic Usage

```jsx
import { FlexibleImage } from '../components/flexible-image';

// Static image
<FlexibleImage
  src="/images/my-image.jpg"
  alt="Description of the image"
  size="large"
  caption="This is a caption"
/>

// With Gatsby image data
<FlexibleImage
  src={data.image.childImageSharp.gatsbyImageData}
  alt="Dynamic image"
  size="medium"
/>

// Custom sizing
<FlexibleImage
  src="/images/hero.jpg"
  alt="Hero image"
  size="custom"
  className="my-custom-hero-class"
  aspectRatio="21/9"
/>
```

### Size Reference

- **xs**: 200px max-width
- **small**: 300px max-width
- **medium**: 500px max-width
- **large**: 700px max-width
- **xl**: 900px max-width
- **full**: 100% width
- **custom**: Use with className for custom styling

## ImageRow

A component for displaying multiple images in a horizontal row with flexible layout options.

### Props

| Prop        | Type      | Default     | Description                                                       |
| ----------- | --------- | ----------- | ----------------------------------------------------------------- |
| `images`    | `array`   | Required    | Array of image configurations                                     |
| `spacing`   | `string`  | `'medium'`  | Space between images: `'tight'`, `'small'`, `'medium'`, `'large'` |
| `alignment` | `string`  | `'center'`  | Row alignment: `'left'`, `'center'`, `'right'`                    |
| `wrap`      | `boolean` | `true`      | Whether images can wrap to new lines                              |
| `className` | `string`  | `undefined` | Additional CSS classes                                            |
| `caption`   | `string`  | `undefined` | Caption for the entire row                                        |

### Image Configuration Object

Each image in the `images` array should have:

```javascript
{
  src: string | object,     // Required: Image source
  alt: string,              // Required: Alt text
  size?: string,            // Optional: Size override
  caption?: string,         // Optional: Individual image caption
  // ...any other FlexibleImage props
}
```

### Basic Usage

```jsx
import { ImageRow } from '../components/flexible-image';

// Two images side by side
<ImageRow
  images={[
    {
      src: "/images/before.jpg",
      alt: "Before transformation",
      size: "medium"
    },
    {
      src: "/images/after.jpg",
      alt: "After transformation",
      size: "medium"
    }
  ]}
  spacing="large"
  caption="Before and after comparison"
/>

// Three small images with tight spacing
<ImageRow
  images={[
    { src: "/images/step1.jpg", alt: "Step 1", size: "small" },
    { src: "/images/step2.jpg", alt: "Step 2", size: "small" },
    { src: "/images/step3.jpg", alt: "Step 3", size: "small" }
  ]}
  spacing="tight"
  alignment="center"
  caption="Three-step process"
/>

// No-wrap horizontal scroll on mobile
<ImageRow
  images={galleryImages}
  spacing="medium"
  wrap={false}
  caption="Gallery (scroll horizontally on mobile)"
/>
```

## Advanced Examples

### Blog Post with Mixed Image Layouts

```jsx
import { FlexibleImage, ImageRow } from '../components/flexible-image';

const BlogPost = () => (
  <article>
    {/* Hero image */}
    <FlexibleImage
      src="/images/blog-hero.jpg"
      alt="Blog post hero"
      size="full"
      aspectRatio="21/9"
    />

    {/* Content with inline image */}
    <p>Some content...</p>

    <FlexibleImage
      src="/images/inline-diagram.png"
      alt="Process diagram"
      size="large"
      caption="Figure 1: Our development process"
    />

    {/* Comparison images */}
    <ImageRow
      images={[
        {
          src: '/images/old-ui.jpg',
          alt: 'Old interface',
          caption: 'Previous design',
        },
        {
          src: '/images/new-ui.jpg',
          alt: 'New interface',
          caption: 'Updated design',
        },
      ]}
      spacing="large"
      caption="UI comparison: before and after redesign"
    />
  </article>
);
```

### Responsive Gallery

```jsx
const Gallery = ({ images }) => (
  <div>
    {/* Main featured image */}
    <FlexibleImage
      src={images[0].src}
      alt={images[0].alt}
      size="xl"
      caption={images[0].caption}
    />

    {/* Thumbnail row */}
    <ImageRow
      images={images.slice(1).map((img) => ({
        ...img,
        size: 'small',
      }))}
      spacing="small"
      wrap={true}
      caption="Additional gallery images"
    />
  </div>
);
```

## Styling Customization

Both components support custom styling through the `className` prop. The base styles provide a good foundation but can be overridden:

```scss
// Custom styles
.my-custom-image {
  border: 3px solid #007acc;
  border-radius: 1rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 122, 204, 0.3);
  }
}

.my-gallery-row {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 0.5rem;
}
```

## Accessibility Features

- Proper `alt` text is required for all images
- Semantic HTML with `<figure>` and `<figcaption>` elements
- Keyboard navigation support
- Screen reader friendly captions
- Respects user's motion preferences

## Performance Features

- Lazy loading by default
- Modern image formats (WebP, AVIF) with fallbacks
- Responsive image sizing
- Optimized image compression
- Blurred placeholders while loading
