---
title: "From React Native to React JS: A Developer's Journey"
subtitle: " "
permalink: ReactNative-ReactJS-Guideline
featured: true
date: 2024-01-24
category: development
thumbnail: /images/react-native-to-react-js.png
tags:
  - ReactNative
  - ReactJS
  - MobileDevelopment
  - WebDevelopment
author: vir-rivedieu
---
After a year and a half of programming in React Native, the clients of the project we are working on proposed we create a web application in addition to the mobile app we already had. That proposal was really interesting because it implied a challenge for the team and the excitement of incurring into a new technology. However, none of the four people who made up the frontend team was a web developer, despite all of us being familiar with the language through our college experience.

Typically, web developers (React JS) eventually transition to mobile development (React Native). While researching for this assignment,  I came across numerous articles discussing this transition and highlighting the key differences between both technologies. Nevertheless, finding resources discussing the reverse journey (transitioning from mobile to web) was challenging. This personal experience and the lack of information on this topic amplify the value of sharing my insights on the subject.

In this blog, I'll share my experience of transitioning from RN to React JS, detailing the successes and challenges encountered during this transition. Additionally, you'll witness varied perspectives from other developers involved who are sharing their insights. We'll explore similarities and differences and share some practical advice, aiming to guide aspiring developers considering this less “straightforward” transition.

![](/images/from-mobile-to-web.png)

## How To Transition From React Native to React JS: First-Hand Experience

I found the transition from React Native to React to be quite smooth. Essentially, React Native utilizes React to work, hence sharing many paradigms. For instance, both are oriented toward creating reusable components, employing hooks, and using the same base language, primarily JavaScript (and, in this case, TypeScript).

However, there are noticeable differences. Some of the most basic distinctions I encountered were the **names of basic components**. In React, we use HTML tags like <div>, <h1>, <img>, whereas in React Native, we use <View>, <Text>, <Image>. This may seem uncomplicated, but it requires some adjustment when you've been employing the same RN components for a while. After programming extensively in RN, it's natural at first to attempt to write  <View> in React instead of <div>, which would result in an error.

Another significant difference was the **change in component styling**. In RN, we use the 'style' prop, whereas in web development, 'className' is more conventional, and while CSS has props similar to RN, they don't work in exactly the same way. This is crucial to consider; otherwise, styling can become quite challenging.

The **navigation between screens** was another fundamental difference (and challenge) due to the change in technology. This posed some difficulty and moments to think about how to configure it optimally since, in RN, we were used to using libraries like 'react-navigation' that guided us through this process.

A  positive aspect of this transition was the **ease and speed of setting up a web app** compared to the time required to set up Metro + Xcode + Android Studio along with their simulators or emulators for a mobile app. Along with this, it's worth mentioning that setting up a web app requires significantly fewer applications and libraries compared to a mobile app.

In summary, learning the technology isn't the most challenging aspect you'll encounter in this transition; knowing RN greatly eases this process. However, it can lead to confusion as both frameworks have many similarities, such as components and styles, but they aren't exactly the same and don't function identically. Therefore, careful attention is necessary in this regard.

![](/images/basic-component-comparison.png)

## The Importance of Keeping a Web Development Perspective

Additionally, alongside learning specific aspects like CSS, navigation, etc., it's crucial to study everything involved in web development, such as the web architecture, best practices, how JS runs in the browser, among others.

* **Web Architecture**: Transitioning from React Native to React JS involves grasping the fundamental structure of the web, especially comprehending the Document Object Model (DOM). Understanding how web elements are structured and interact in the browser differs significantly from the controlled environment of React Native.
* **Browser Interaction**: As I delve into React JS development, I'm noticing a significant shift in how JavaScript interacts within a web browser. Unlike React Native's confined environment, the browser presents a broader context that requires adaptation in code execution and handling.
* **CSS Styling**: Exploring web development has introduced me to the details of CSS for web design. While React Native and web development share similar concepts, the implementation of styles differs significantly. Understanding CSS in-depth has been pivotal for effective web component styling, diverging from the practices in React Native.
* **Responsive Design**: I've come to appreciate the importance of creating web applications that seamlessly adapt to various screen sizes. Unlike React Native's controlled environment, mastering responsive design has become a key aspect of ensuring a consistent and user-friendly experience across devices in web development.
* **Web Best Practices and Standards**: As I navigate through React JS for the web, diving into web development best practices, accessibility standards, and SEO considerations has been eye-opening. These aspects, crucial in the web development domain, are integral for creating robust and inclusive web applications, areas that might be less emphasized or unfamiliar in React Native development.

Each of these aspects has contributed significantly to my understanding and growth while transitioning from React Native to React JS for web development.

## Perspectives From Other Developers

Interacting with my fellow teammates who went through this transition alongside me provided invaluable insights. Their diverse experiences ranged from seamlessly adapting due to React’s integrated ecosystem to emphasizing the significance of delving deeper into web-centric aspects. Their testimonials and guidance stand as valuable resources for professionals considering a similar transition in their careers.

The journey from React Native (RN) to React for web development brought forth an amalgamation of familiar terrain and unique challenges, resonating through the experiences of Belu, Emi, and Quico.

Belu found the transition remarkably smooth, attributing it to RN's groundwork, making the shift to web development notably easier. However, she encountered challenges in CSS, noting its differences and emphasizing the need for a fresh perspective when approaching web development. Belu's advice emphasized the need to explore new CSS possibilities rather than assuming familiarity, urging others to embrace the unique conventions and possibilities of the web.

Emi's transition from RN to React was comparably seamless due to the strikingly similar syntax between the two platforms. Yet, he highlighted the complexities faced by newcomers in understanding the broader web-related aspects such as the web platform API, browser functionalities, and the need for responsive design—areas where RN's framework-driven solutions contrasted with web development's diverse landscape. Emi emphasized RN's nature as a framework leveraging React, acknowledging the frameworks' differences in resolving native components and file system parsing.

Quico's perspective emphasized RN's foundation rooted in React, allowing for a seamless transfer of knowledge in app state management, networking, and language use (JS/TS). He highlighted the similarity in style properties between RN and CSS, emphasizing the need to delve deeper into the web paradigm encompassing HTML and remaining CSS aspects.

Collectively, their experiences underscored the benefits of RN's familiarity while revealing the need to navigate the distinct intricacies of web development, emphasizing CSS nuances, the broader web paradigm, and responsive design as pivotal areas demanding an adaptive approach.

![](/images/similarities-and-differences.png)

## Transition Tips

Drawing from personal experiences and insights shared by others, I can suggest some advice to developers (RN developers specifically) who want to make this technology transition.

Firstly, embrace prior React knowledge but devote time to understanding web-specific intricacies. Explore documentation, enroll in relevant courses if you need to, and engage with web development communities. This immersive approach acts as a catalyst, smoothing the transition and offering invaluable hands-on experience crucial for mastering React JS for the web.

* **Understand Web Fundamentals**: Start by grasping essential web concepts like HTML, CSS, and JavaScript. Learn about the Document Object Model (DOM), which defines how web pages are structured and manipulated.
* **Master CSS**: Dive into Cascading Style Sheets (CSS) to understand its syntax, properties, and how it styles web elements. It's crucial for creating appealing and responsive web interfaces.
* **Explore React's Unique Features**: While React Native and React share similarities, delve into React's web-specific features, such as handling browser events, routing, and state management within a web context.
* **Responsive Design**: Learn about responsive design principles to ensure your web applications adapt well to various devices and screen sizes.
* **Utilize Resources**: Leverage online courses, tutorials, and documentation. Platforms like React's official documentation offer comprehensive resources for learning web development and React.
* **Practice Regularly**: Build small web projects using React to reinforce your understanding. Start with simple components, gradually progressing to more complex applications.
* **Stay Updated**: Web development is dynamic; stay current with new trends, tools, and best practices by following relevant blogs and forums and attending web development meetups or conferences if you can.
* **Experiment and Seek Help**: Don't hesitate to experiment and ask for help. Online developer communities like Stack Overflow or Reddit's web development subreddits are great places to seek guidance and solutions to your queries.

Remember, transitioning to web development might feel overwhelming at first, but persistence and consistent learning will gradually solidify your skills in React JS and web development.

![](/images/transition-tips.png)

## Conclusion

In our experience, transitioning from React Native to React JS unraveled both familiarities and fresh challenges. This journey marked a new phase in our development careers, providing extensive room for learning and growth.

Reflecting on our insights and experiences, it became clear how crucial it is to embrace differences in CSS, responsive design, and leverage existing React knowledge.

Comparing mobile and web development in React brought to light shared fundamentals and distinctive features, emphasizing the need for a detailed approach. Understanding these commonalities and unique functionalities across both realms was the key to enabling a seamless transition.

Ultimately, this journey embodies a continual learning process, emphasizing adaptability, persistence, and an immersive learning curve in mastering React JS for web development. The combination of personal experiences and practical advice shared here aims to guide aspiring developers navigating this less-trodden yet rewarding transition path.