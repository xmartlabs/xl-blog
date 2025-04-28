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

![](/images/react-native-health-link1.png)

### How It Works

Getting started with react-native-health-link is a breeze. You can initialize health data access in just a few lines of code. To initialize, simply use the `initializeHealth` function and provide an object specifying the permissions you want to request from the user.

> ``
>
> ```javascript
> import {
>  initializeHealth,
>  HealthLinkPermissions,
> } from 'react-native-health-link';
>
> initializeHealth({
>   read: [HealthLinkPermissions.BloodGlucose],
>   write: [HealthLinkPermissions.BloodGlucose],
> });
>
> ```

### read Function

To read data, use the read function along with the `HealthLinkDataType` enum to specify the desired data type. You can also pass additional options, such as `startDate`, `endDate,` `limit`, or `ascending`, to customize your query.

> `read(HealthLinkDataType.BloodGlucose, {`
>
> `startDate: new Date('2025-01-01').toISOString(),`
>
> `})`

### write Function

Similarly, to use the write function and select a data type from the `WriteDataType` enum. Then, pass any necessary options as the second argument to configure the data input.

> `write(HealthLinkDataType.BloodGlucose, {`
>
> `value: 4,`
>
> `unit: BloodGlucoseUnit.MmolPerL,`
>
> `});`

## Looking ahead

The library is currently at the beginning of its development, and we have big plans for its future. Here’s what you can expect: 

* We aim to support all data types compatible with HealthKit and Health Connect, giving you unparalleled flexibility.
* Enhanced querying options to provide developers with more control over data access.
* We'll work on improving documentation with more detailed examples for each data type.
* Community input will mean a lot for the roadmap of this library. We’re committed to solving real problems faced by developers.

## Who Should Use react-native-health-link?

Whether you're building a fitness tracker, a wellness app, or a personalized health assistant, this library is perfect for saving time and providing a unified interface. To get started today, follow the installation guide available in [react-native-health-link’s documentation](https://github.com/xmartlabs/react-native-health-link?tab=readme-ov-file).

If you're looking for a partner to help you streamline your healthcare app, we could be just what you’re looking for. Feel free to reach out and thanks for reading!