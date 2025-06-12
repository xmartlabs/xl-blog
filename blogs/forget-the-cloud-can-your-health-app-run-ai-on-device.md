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

In this section, we will be discussing the process of creating the application and the challenges that we faced.

### Technical Aspects

XLCare was built using React Native, the library `llama.rn` to run LLMs locally, and the library `react-native-health-link` to read the user’s health data stored on the device.

We chose the two standout models from the AMEGA benchmark: **Aloe**, the best-performing model, and **Phi 3.5**, the promising smaller alternative. Both are available as options in XLCare.

**Aloe** is approximately 4GB in size, which is relatively large for on-device storage, though some users may prefer it for its slightly better accuracy. **Phi**, on the other hand, is about half the size—around 2GB—and runs faster, with the trade-off of having performed slightly worse in the AMEGA benchmark.

<!-- notionvc: 5da58d28-2146-4e68-a661-44a4e2bd10ea -->

<!--EndFragment-->