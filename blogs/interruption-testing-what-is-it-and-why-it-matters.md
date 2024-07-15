---
title: "Interruption Testing: What Is it and why it matters"
subtitle: " "
permalink: interruption-testing-QA
featured: true
date: 2024-07-15
category: qa
thumbnail: /images/interruption-testing-cover.png
tags:
  - QA
  - Testing
  - InterruptionTesting
  - Mobile
author: nat-nobre
---
Have you ever considered what happens when your app faces unexpected disruptions? Picture this: you're deeply immersed in a mobile game, just about to beat that difficult level you've been struggling with for days. Suddenly, your phone rings. Frustrating, right? Or imagine you're in the middle of a critical payment transaction, and your battery dies. Though seemingly minor, these disruptions can significantly affect how users perceive and interact with your app. Luckily, there's a way to ensure these mishaps don't hurt user experience: interruption testing.

## What is interruption testing?

Interruption testing is the process of checking how well a mobile application handles and recovers from unplanned interruptions, ensuring its robustness under real-world conditions.

![](/images/interruption-testing-1.png)

Think of popular apps that handle interruptions exceptionally well. For example, YouTube pauses your video when you receive a call and resumes it once the call ends. Or consider WhatsApp, which seamlessly manages network changes, ensuring your messages are sent when the connection is restored. These, of course, are big apps that work thoroughly on their interruption testing, but however big or small the app might be, these steps shouldn't be overlooked. 

## The importance of interrupting our application

An example that comes from personal experience is when I was working on an application for video recording. One of the major challenges we encountered was managing interruptions like phone calls, messages, and alarms while recording videos. It was crucial for us to ensure that these interruptions didn't disrupt the recording process or lead to data loss. Our focus was on implementing a solution that allowed the recording to continue seamlessly while silencing (as much as the system allows it) any alerts to maintain the integrity of the video capture. 

To come up with the best approach, we looked at other popular apps like Instagram and TikTok (aka benchmarking). These apps are great examples because people are already familiar with how they work. It is better when users have a sense of familiarity with the expected behavior and start improving the ideas from there.

![](/images/interruption-testing-3.png)

Here's another scenario I often encounter as a user: Imagine you're in the middle of a crucial action on an app, like making a payment, and you accidentally lock your phone.

This scenario of blocking your phone becomes even more significant when financial transactions are involved, as any mishap could potentially undermine users' trust and credibility in the system. In such cases, I expect the app to either seamlessly resume the purchase process once the phone is unlocked or, at the very least, provide clear instructions on how to rectify the issue to ensure a smooth and secure transaction flow.

Those scenarios are a clear example of interruption testing and why paying attention to those details is important. Typically, as users, we expect applications to behave a certain way, and to help that, mobile operating systems already take care of some interruptions in a standardized way. But how can we incorporate it into our own mobile projects?

## How to begin interrupting our system

Ideally, at the beginning of a mobile project, it is important to define the scope of the app under some scenarios. For example, how do we want to handle offline mode, is it an important requirement for the application?

Understanding our users and their devices is crucial for effectively focusing our testing efforts. For instance, do we know who our users are and what kind of phones they use? Keeping statistics on this helps us prioritize where to direct our attention. If, for example, 70% of our users are on Android phones, it makes sense to pay extra attention to testing on that platform. If we don't have specific user data, we can research the dominant phones in our app's market. This way, we can tailor our testing strategies to ensure our app performs well where it matters most to our users.

![](/images/interruption-testing-2.png)

Once we have the scope clear, creating a checklist of scenarios we want to consider in our interruption tests is a good idea. A few ideas to begin with are the following, but you can get creative depending on the app's needs.

* Incoming phone calls and messages
* Using the app while you are on a phone call
* Alarms
* Low battery
* No internet connection or slow connection
* Blocking the phone while an action is processing
* Sending app to background
* Closing the app
* Redirection to an external link
* Silencing the phone

## I﻿n conclusion

Interruption testing is a critical aspect of mobile app development that ensures a seamless and robust user experience, even when unforeseen disruptions occur. By thoroughly testing how your application handles interruptions, you not only improve its reliability but also enhance user satisfaction and trust. Implementing interruption testing from the early stages of development and creating a comprehensive checklist tailored to your app's unique requirements can significantly mitigate potential issues. Remember, a well-prepared app is one that gracefully manages the unexpected, keeping users engaged and confident in its performance.