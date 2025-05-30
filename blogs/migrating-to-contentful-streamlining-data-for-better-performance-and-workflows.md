---
title: "Migrating to Contentful: Streamlining Data for Better Performance and
  Workflows"
subtitle: " "
permalink: /contentful-migration-data-performance
featured: true
date: 2025-05-29
category: development
thumbnail: /images/migrating-to-contentful-portada.jpg
tags:
  - Migration  Contentful  WordPress  SEO  Workflows
author: facu
---
## **Migrating to Contentful: Streamlining Data for Better Performance and Workflows**

Migrating from WordPress to a modern CMS like Contentful can supercharge your website’s performance, streamline content creation, and make life easier for everyone involved. In this guide, we'll walk you through our process, highlight key considerations, and share tips to ensure a smooth transition.

Using our client Robinson & Henry as an example, we’ll explore key steps and decisions that led to a seamless migration, without losing a single byte of data.

### Why Migrate to Contentful?

WordPress is a reliable CMS, but it does come with its challenges, like performance issues, dependence on heavy plugins, and some SEO constraints. Switching to Contentful offers you the chance to unlock:

* Faster site performance
* Cleaner workflows for content creators
* A modern, flexible data model

### Understanding Relationships Between Content Types

Before diving into migration tools, it’s essential to understand how your data is structured as this is key to ensuring smooth migration and accurate data mapping.  The first step is building a conceptual model using the Entity-Relationship (ER) diagram. This step will help map out your existing WordPress content types and their relationships. With this visual reference, it becomes easier for everyone—from developers to stakeholders—to understand how the data will flow in the new system.

Pro tip: Focus on the big picture. We kept the diagram simple by leaving out details like the SEO content type, which had a straightforward 1:1 relationship with every other type.

I﻿MAGEN

Conceptual model before migration

### Streamlining Your Data Model

Once you’ve mapped your content, it’s time to optimize for better performance. Here’s what worked for us:

* **Simplifying Tags:** In WordPress, Tags were a separate content type but lacked reusability. We streamlined this by implementing them as a multivalued field within Articles and Case Results.
* **Simplifying “Ask Our Attorney”:** To declutter the model, we opted for a single-question, single-answer structure, ensuring simplicity for both users and developers.
* **Unifying Articles:** Instead of maintaining two distinct content types for articles, we merged them into one.
* **Merging Categories and Services:** We identified that these two content types were actually referring to the same concept. However, a few of their entries were written different like "Sex Crimes" and "Sex Crimes Defense.". In this process, we also unified them, eliminating redundancy and creating a more consistent and streamlined structure.

These adjustments simplify the model, and make it easier for content creators to work efficiently without worrying about data inconsistencies or overly complicated workflows.

I﻿MAGEN

Conceptual model after migration

### Pre-Migration Considerations

A key step to avoid future headaches is ensuring your pre-migration data is in order. In this case, some data had already been manually migrated. Sounds good, right? Less content to move should mean less work… Well, sort of. While it reduced the amount of content needing migration, it introduced a challenge: mismatched database IDs.

Why does that matter? In modern CMSs, every new entity gets a unique database ID, which acts as the anchor  for linking up related content. Without these unique identifiers, linking pre-migrated entries with new ones often depends on fields like  names, which can lead to mismatches. For instance, a service named "Car Accident" in WordPress might appear as "Car Accidents" in Contentful, causing discrepancies. Additionally, some pre-migrated entries were incomplete, such as missing SEO data. Addressing these issues required updating existing entries instead of creating new ones.\
\
Migration is also a great moment to improve your content structure. If you’ve restructured your site for SEO, implement redirects to preserve traffic. Take the time to validate fields like meta descriptions, setting a consistent max length, for instance, to ensure SEO consistency across your site.

## Key Migration Functions and Their Purpose

Several tools facilitated the migration process:

### WPGraphQL

This WordPress plugin allowed us to fetch data via structured queries, providing the input for functions that imported data into Contentful.

### Contentful Management

* getEntry: This function fetches an existing entry to ensure related items exist before linking. For example, when creating an article, it checks if the connected service exists. If not, the article could link to an undefined entity, causing issues later. This function prevents such problems.
* createEntryWithId: This function lets you create an entry with a custom ID which is crucial to create relationships later from other content types. Once the entry is created, it’s saved as a draft in Contentful. Depending on what you need, you can also run: entry.publish to publish it right away.\
  entry.archive, in cases it was archived in WordPress.
* createAsset: This function is used to create an asset. After it’s created, you’ll need to run either asset.processForLocale or asset.processForAllLocales to start asset processing.

### Contentful Migration

* transformEntries: This function was useful for updating existing entries and linking them to new content-types created after migration. For example, we used it to update attorneys with their IDs, as they would be referenced by other content types. Additionally, it allowed us to update the attorneys’ SEO since the SEO entities had been migrated, and the attorneys initially had none.

## Migration Strategies

Here are some approaches that can be taken to address the different issues we named during this process.

### Migration order

Consider a bottom-up approach when migrating content. Start with simpler content types, such as SEO entries, which don’t rely on external references. Then, proceed to content types like services and offices that depend on the SEO data. Finally, tackle more complex content types, like articles, which are often linked to multiple other content pieces.

This method allows you to test the migration in smaller chunks before moving on to the more complex relationships.

### Entity Mapping

Before starting the migration process, data related to Attorney, Office and Service & Subareas had already been migrated manually. To address mismatched IDs, we developed custom mapping functions for:

* Matching service names between WordPress and Contentful.
* Aligning category and service names (often representing the same concept with different labels).
* Linking attorney and office names across platforms.

Testing these mappings was important, as missed matches could lead to unlinked entities, causing significant issues later. Our QA team meticulously reviewed these connections to ensure accuracy.

## Results of Proper Planning

By following a structured migration process, you can significantly reduce the time spent on manual data entry. While some simpler entities might take a minute each, more complex items like detailed articles, can require up to 30 minutes or more to migrate due to the volume of information involved. A well-planned migration can save you weeks, even months of work, time that’s far better spent enhancing your site’s functionality and user experience. After running the migration script, we achieved the following: