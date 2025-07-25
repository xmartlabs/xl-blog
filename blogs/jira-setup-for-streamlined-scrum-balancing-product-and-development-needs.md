---
title: 'Jira Setup for Streamlined Scrum: Balancing Product and Development Needs'
subtitle: ' '
permalink: jira-setup-streamlined-scrum-product-development
featured: true
date: 2024-10-30
category: strategy
thumbnail: /images/jira-setup-for-streamlined-scrum.jpg
tags:
  - Jira
  - ProjectManagement
  - Product
  - Development
  - Agile
author: sante
---

As a former software developer turned project manager, I’ve experienced firsthand the need for clarity and simplicity when managing both the product vision and the day-to-day work of the development team.

One of the most effective setups I’ve implemented in Jira balances the strategic needs of the product team with the tactical requirements of developers. This setup revolves around maintaining two distinct boards: one for **user stories** and another for **tasks**, ensuring transparency and focus across teams.

One of the most effective setups I’ve implemented in Jira balances the strategic needs of the product team with the tactical requirements of developers. This setup revolves around maintaining two distinct boards: one for **user stories** and another for **tasks**, ensuring transparency and focus across teams.

## Why Two Boards?

The goal of splitting the work between a **Product Board** and a **Development Board** is to keep things organized and simple. The product team is focused on what the customer needs and the overall product direction, while the development team is focused on delivering value efficiently. Mixing user stories and development tasks on the same board can quickly become overwhelming and muddy each team’s priorities.

### 1. The Product Board: Where User Stories Live

![](/images/jirablog1.png)

This board is owned by the product team and serves as the **source of truth for features**. Here’s how it works:

- **User Stories**: These are high-level descriptions of features or functionality that the product team wants to build. They capture the _what_ and the _why_ of the product and are focused on delivering value to the customer. Eventually, we could have technical stories enveloping a set of related tasks, that's owned by the engineering team.
- **Acceptance Criteria**: Every user story includes detailed acceptance criteria, clearly outlining the conditions that must be met for the feature to be considered complete.
- **Prioritization**: The product team is responsible for prioritizing these user stories, ensuring that the most valuable features are addressed first.

This board allows the product team to manage features in a way that’s flexible and adaptive. It also provides transparency to the development team regarding what’s coming next and why.

### 2. The Development Board: Breaking Down the Work

![](/images/jirablog2.png)

Once a user story is ready for development, it gets broken down into tasks, and that’s where the **Development Board** comes into play:

- **Tasks**: These are smaller, actionable items that the development team can estimate, assign, and work on. Each task is related to a specific user story, providing traceability from feature request to implementation.
- **Task Estimation**: Our team uses poker planning sessions to assign story point values to each task, in which every team member gives their two cents about all the tasks in scope, assuring the criteria for estimation remains consistent even though we are working with multiple components and technologies.
- **Sprint Planning**: After the tasks are estimated, they are pulled into sprints, allowing the team to commit to achievable goals. This board helps developers focus on the _how_ of implementing features, without being overwhelmed by the broader product vision.

### Workflow Between the Boards

The flow between these two boards is essential for smooth collaboration between the product and development teams:

1. **Product Team Defines User Stories**: The product team creates and refines user stories on the Product Board, ensuring each story is ready with clear acceptance criteria before it moves forward.
2. **Grooming Sessions**: During backlog grooming, the development team reviews these user stories and asks clarifying questions. Once a story is well understood, it is accepted by the engineering team to move on to the next phase.
3. **Breaking Down Stories**: The development team takes user stories and breaks them down into manageable tasks on the Development Board. Each task is linked to the original user story to maintain traceability.
4. **Sprint Planning**: A sprint preplanning is done in collaboration between project management and the leaders of the engineering team. During the sprint’s kickoff, the planning goes through a final verification step with the product team, ensuring its scope correlates with the product vision and priorities.
5. **Feature Testing:** After the tasks in a story are done, it enters the testing stage where QA and the product team review the developed product from a user’s perspective and can provide feedback as separate tasks related to the story. This ensures development issues are well documented and responsibilities are clear, as well as preventing user stories with pending feedback from being released to a production environment.

![](/images/jirablog3.png)

### Maintaining Simplicity for Developers

One of the primary reasons this Jira setup works so well is its focus on keeping things simple for developers. By having a separate board for tasks:

- The day-to-day development board contains only four columns, which lessens the burden on the team to keep every status up to date, they only need to go and modify it when they pick up a task and when they are either done or blocked.
- Developers only need to interact with the Development Board on a day-to-day basis, where they see a clear breakdown of what’s expected of them in the sprint.
- The team isn’t bogged down with high-level product discussions or features that are not ready for development.
- It’s easy to see who is working on what, and dependencies between tasks are clearer, due to the granularity of the tasks.

### Managing Dependencies and Communication

Jira’s **linking feature** plays a crucial role in this setup. Each task on the Development Board is linked back to its parent user story on the Product Board. This ensures:

- **Traceability**: Every task completed is tied back to a specific feature, providing a clear view of progress.
- **Alignment**: The development team can always look at the user story if they need to understand the broader context of a task.

We also use **automation rules** in Jira to notify the product team when all tasks related to a user story are completed. This keeps the product team in the loop without interrupting the development flow.

### Conclusion

This two-board Jira setup has been key to maintaining both product vision and development simplicity. By separating user stories and tasks, the product team can focus on defining what needs to be built, while the development team can focus on how to build it—without getting lost in unnecessary complexity.

If you’re looking for a Jira setup that keeps things simple yet powerful for both product and development teams, this two-board approach is worth considering. It balances the needs of both sides, ensuring transparency and efficiency throughout the development lifecycle.
