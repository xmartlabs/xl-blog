import type { Payload, PayloadRequest } from 'payload';
import React from 'react';

const STEPS: { title: string; text: string }[] = [
  {
    title: 'Write',
    text: 'Posts → New post. Add a title, category, author, 1–5 tags and a 16:9 thumbnail. In the body, type “/” or click “+” to add images, videos, code or tables.',
  },
  {
    title: 'Preview',
    text: 'Drafts save automatically. Open the Live Preview tab to see the post next to the editor as you type. Only signed-in users can see drafts.',
  },
  {
    title: 'Publish or schedule',
    text: 'Publish makes the post live within seconds. To publish later, open the menu next to Publish and choose Schedule Publish.',
  },
  {
    title: 'Update',
    text: 'Edit a published post and click Publish again to update it. Unpublish takes it down.',
  },
];

/**
 * Welcome panel above the admin dashboard (admin.components.beforeDashboard): how a post goes
 * from draft to live, a "New post" button and a link to the blog.
 */
export const Welcome = ({
  payload,
  user,
}: {
  payload: Payload;
  user?: PayloadRequest['user'];
}) => {
  const adminRoute = payload.config.routes.admin;
  const name =
    user && 'name' in user && typeof user.name === 'string' && user.name.trim()
      ? user.name.trim().split(/\s+/)[0]
      : null;

  return (
    <section className="xl-welcome" aria-labelledby="xl-welcome-title">
      <div className="xl-welcome__header">
        <div>
          <h2 id="xl-welcome-title" className="xl-welcome__title">
            {name ? `Welcome, ${name}!` : 'Welcome to the Xmartlabs Blog'}
          </h2>
          <p className="xl-welcome__intro">
            From idea to published post in four steps.
          </p>
        </div>
        <div className="xl-welcome__actions">
          <a
            href={`${adminRoute}/collections/posts/create`}
            className="btn btn--style-primary btn--size-medium xl-welcome__new"
          >
            New post
          </a>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn--style-secondary btn--size-medium"
          >
            View the blog ↗
          </a>
        </div>
      </div>
      <ol className="xl-welcome__steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="xl-welcome__step">
            <span className="xl-welcome__number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3 className="xl-welcome__step-title">{step.title}</h3>
              <p className="xl-welcome__step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
