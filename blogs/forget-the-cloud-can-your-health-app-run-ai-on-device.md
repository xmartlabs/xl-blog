---
title: "Forget the Cloud: Can Your Health App Run AI On-Device?"
subtitle: " "
permalink: /blog/on-device-ai-health-assistant-xlcare
featured: true
date: 2025-06-12
category: development
thumbnail: /images/mientras-tanto.jpg
tags:
  - On-device AI
  - Edge computing
  - Privacy-First AI
  - Mobile health apps
  - AI Assistants
author: belu
---
## Introduction

Traditionally, medicine has taken a reactive rather than a preventive approach, but that’s been gradually changing in recent years. With the rise of AI and LLMs (large language models), there are now many new opportunities to improve disease prevention and support healthy habits at home. Prevention not only enhances people’s quality of life but also helps reduce costs for hospitals.

However, while AI brings many benefits, it also presents some challenges. Hosting models in the cloud can be costly, especially when users have unrestricted access. On top of that, many people are understandably hesitant to let their health data leave their devices, even when assured that servers are secure. Also, offline access can sometimes be valuable, especially in remote areas with limited internet connectivity, something cloud-based models simply can’t provide.

Theoretically, these issues could be solved by running LLMs locally. But is that actually achievable in 2025? And more importantly, is it possible on everyday mobile devices?

In this article, we’ll explore the current state of small medical models in 2025 and introduce a proof of concept we’ve developed: a local, fully private, mobile health assistant.

## What Works In 2025

First, let’s take a look at the models currently available that are feasible to run locally on a mobile device. We based our evaluation on the research paper [\*\*Medicine on the Edge: Comparative Performance Analysis of On-Device LLMs for Clinical Reasoning](https://doi.org/10.48550/arXiv.2502.08954)\*\* which scored various models using the [AMEGA](https://github.com/DATEXIS/AMEGA-benchmark) benchmark, a benchmark designed to assess how well large language models adhere to medical guidelines. The study highlighted two standout models:

* **Aloe 8B**, a medical-specific model that achieved the highest score in the benchmark.
* **Phi-3.5**, a smaller and faster model that delivered a surprisingly strong performance given its size.

These models scored 491 and 465 out of 1000, respectively. This puts them among the best performers in their size category, according to the study. While those numbers might initially seem low, [another paper](https://doi.org/10.1038/s41746-024-01356-6) compares it to a recently graduated medical student who scored 25.8 out of 50 on the same benchmark.

## **XLCare: A Personalized Health Assistant**

We realized that, with the unmatched privacy benefits of local LLM execution, there was a unique opportunity to create a more personal experience by feeding the model the user's own health data. With HealthKit (iOS) and Health Connect (Android) integration, users could ask questions and learn things directly relevant to their health. This could be done privately and securely, with no data ever leaving the device.

In this section, we will be discussing the process of creating the application and the challenges that we faced.\
\
-﻿-------

### Technical Aspects

XLCare was built using React Native, the library `llama.rn` to run LLMs locally, and the library `react-native-health-link` to read the user’s health data stored on the device.

We chose the two standout models from the AMEGA benchmark: **Aloe**, the best-performing model, and **Phi 3.5**, the promising smaller alternative. Both are available as options in XLCare.

**Aloe** is approximately 4GB in size, which is relatively large for on-device storage, though some users may prefer it for its slightly better accuracy. **Phi**, on the other hand, is about half the size—around 2GB—and runs faster, with the trade-off of having performed slightly worse in the AMEGA benchmark.

### Health Data Integration

For the first version, we decided to go with five metrics: steps, heart rate, oxygen saturation, blood glucose and resting heart rate, as well as a questionnaire for the user to input other health-related information.

In our first iteration, we tried feeding the LLM all of the individual entries of user’s health data. For example:

* Heart rate of 79 bpm on 05/19/2025 at 11:03 AM.
* Heart rate of 88 bpm on 05/19/2025 at 02:55 PM.
* Steps count of 5987 steps on 05/19/2025.

That approach didn’t work very well. The model sometimes tended to average out the metrics and explained its reasoning for doing calculating the mean, getting confused in the process. Other times, it became overly fixated on a single measurement and analyzed it in excessive detail. Plus, passing in that much context made it noticeably slow.

_﻿\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\__

So, for now, we decided to provide just two summary metrics: the **mean** and the **standard deviation**. These give the model a bit more context about average values (mean) and variation (standard deviation) without overwhelming it with too much information.

Of course, this approach has its own limitations:

* It can’t evaluate trends over time.
* It applies calculations across the entire dataset, which may miss recent changes.

We’re currently working on a new version that takes these factors into account, so if that interests you, stay tuned!\
\
_﻿\_\_\_\_\_\_\_\__

### Prompting

One of the trickiest parts of building any AI assistant is crafting the right prompt for your specific use case. We went through many iterations and rounds of testing before landing on one that gave us the results we were looking for.

What we found was that, with these models, **simpler prompts work best**. Our final prompt tells the model to act as a friendly health assistant that has access to the user’s health metrics. Its job is to help users understand their data in a clear, approachable way, avoiding technical jargon and not explicitly referencing measurements like standard deviation.

At the end of the response, we also ask the model to suggest related follow-up questions. These are then added to the UI as one-tap options for a smoother user experience.

### Safety & Data Privacy

It’s crucial to make it clear that the advice provided by the assistant is not a substitute for professional medical guidance, and users should always consult a healthcare provider before making any decisions. That’s why we include clear warnings throughout the app and provide a feedback button that allows users to flag inappropriate or concerning responses and share them with the development team to help improve the experience.

It is important to note that this is the only situation in which any user data might be sent to the cloud, and only if the user explicitly chooses to submit the AI’s response for review. In all other cases, no user data ever leaves the device. This is the core advantage of running models locally, and it’s something we strongly believe in and fully stand by.

### Final Prototype

_﻿\_\_\_\_\_\_