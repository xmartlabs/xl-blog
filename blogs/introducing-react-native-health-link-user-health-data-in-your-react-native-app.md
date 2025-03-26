---
title: "Introducing react-native-health-link: User Health Data In Your React
  Native App"
subtitle: " "
permalink: react-native-health-link
featured: true
date: 2025-03-26
category: development
thumbnail: /images/react-native-health-link-front.jpg
tags:
  - mobile development
  - react native
  - healthtech
  - wearables
  - health link
author: belu
---
In a [previous blog post](https://blog.xmartlabs.com/blog/wereables-react-native-integration/), we looked into the benefits of using Health Kit and Health Connect to use wearable data on your React Native app. By combining two distinct libraries with separate interfaces, we managed to unlock real-time health insights. But did you know these tools can do much more than just handle wearable-recorded data? Enter react-native-health-link, a developer-friendly library that simplifies health data integration by providing a unified interface for both HealthKit and Health Connect.

## Why react-native-health-link?

While developing health-related applications in React Native, working with health data can be tricky. While platform-specific libraries like HealthKit (iOS) and Health Connect (Android) are powerful, they each have their own APIs and data structures. This often results in duplicated efforts and a fragmented codebase.

react-native-health-link eliminates these headaches by bridging the gap, offering:

* A single API for both platforms.
* Simplified permission handling.
* Reduced maintenance of platform-specific codebases.

No more juggling separate implementations—this library keeps everything streamlined and developer-friendly.

### Key Features

With this library you can manage permissions for HealthKit and Health Connect for its supported data types, namely:

* Blood glucose (read/write)
* Weight (read/write)
* Height (read/write)
* Heart rate (read/write)
* Resting heart rate (read)
* Blood pressure (read)
* Oxygen saturation (read)
* Steps (read/write)

This open-source library is actively developed, and the list of supported data types will grow based on community needs. This first integration covers the most commonly used health metrics supported by the `react-native-health` and `react-native-health-link` libraries. We eventually plan to extend support to any data types compatible with HealthKit and Health Connect.

The library lets your app read and write supported data types, making it easy to access and update them. It also includes a utility to check whether the native SDKs (HealthKit/Health Connect) are available on the user’s device.

### How It Works

Getting started with react-native-health-link is a breeze. You can initialize health data access in just a few lines of code. To initialize, simply use the `initializeHealth` function and provide an object specifying the permissions you want to request from the user.



> `import {`
>
> `  initializeHealth,`
>
> `  HealthLinkPermissions,`
>
> `} from 'react-native-health-link';`
>
> ````
>
> `initializeHealth({`
>
> `  read: [HealthLinkPermissions.BloodGlucose],`
>
> `  write: [HealthLinkPermissions.BloodGlucose],`
>
> `});`
>
> ``