---
title: Bedtime (Cybersecurity) Stories
subtitle: " "
permalink: cyber-security-tips
featured: true
date: 2024-03-21
category: development
thumbnail: /images/portada-cybersecurity-stories.png
tags:
  - cybersecurity
  - phishing
  - Adware
  - Botnet
  - TaskScams
author: belu
---
Many of you probably grew up hearing adventure stories, letting your imagination run wild over the new worlds the protagonists discovered. Or maybe you preferred fantasy tales with fairies, flowers, and magic systems. Or even historical epics, where knights fight bravely in the name of honor and justice.



While it may sound odd, I spent my childhood listening to cybercrime stories. 



It’s not that weird if you think about it. Being the last child of a big, tech-savvy family, I was inevitably in contact with technology from a very early age. My father is a cybersecurity expert and a storyteller by heart, so he’d always tell us his day-to-day work adventures in a captivating way. I guess something about that stuck with me.

The stories I’m going to tell you are not for children. But I always found that when real-life events are narrated to me, they have a greater impact. Nobody is ever safe from cybercrime, not even those who think that they are not a sufficiently important target. These tales are real situations that happened to me, someone I know, or many people at the same time. 

I will also describe the type of cybersecurity issue and give you some context. This article is meant to be entertaining for everyone, whether you are an expert or just use the Internet to watch YouTube videos. And who knows, maybe you’ll learn something. Let’s get started!

## My grandma, her suggestive pictures, and Prince Harry

![](/images/story-1.png)

As expected for someone born in the 1930s, my grandmother was a very conservative, traditional woman. She hesitatingly adopted technology at a late stage of her life. However, aside from a few incidents and misconceptions—she always thought she was talking to Facebook himself—she seemed to be doing well. We even had some good laughs when she got mad at Facebook for what he “told” her.

![](/images/frame-47452.png)

You can imagine my father’s surprise when he saw in his inbox an email from my grandmother —his mother-in-law— whose subject read:

![](/images/group-7631.png)

Many questions arose. What did she mean by that? Had she been talking about hot food right out of the oven? Did she mean to send it to my grandfather? Was all her conservativeness a front? Was she trying to seduce her daughter’s husband?!?

Obviously, my father opened it. He suspected what it was, and he was right: the email showed a woman who very much wasn’t my grandmother. She probably had one-fourth of her age and one-fourth of the clothes my grandmother would have worn. The email body read:

**If you want to see more, click this link.**

The link redirected him to a site that looked like Adinet, the email provider that my grandmother used. But it wasn’t Adinet: it was a cloned site.

![](/images/untitled-53.png)

### The attack

#### Phishing

This attack was definitely phishing. Phishing is a form of social engineering where attackers deceive people into revealing sensitive information or installing malware. In particular, it involved credential harvesting.

With a high level of certainty, we can affirm that my grandmother received a similar email from one of her contacts. As a frontend developer, I can assure you that cloning a site (especially the styling and looks) is extremely easy, so the rest is history: the site was an Adinet copy that stole her credentials and replicated itself, sending a similar email to all of my grandmother’s contacts. My grandmother was nosy, that’s for sure, but she was not sending suggestive pictures to my father via email.

But what about Price Harry? Why was he mentioned in the title of this story?

Well, that’s another story, although a very similar one.

### Prince Harry

A friend's mother used to work at a bank. She had a very good friend with whom she occasionally gathered to dine and chat. My friend’s mother, let’s call her Carolina, noticed that her friend Amanda seemed very happy and gigglish. When asked about that, Amanda said she was happy because she had started talking to someone, but she couldn’t say who it was because he was famous.

Intrigued, Carolina wanted to know more. After promising and promising Amanda that she’d stay quiet, Amanda finally told her what she wanted to know.

She was talking to Prince Harry.

![](/images/princeharry.png)

Of course, Carolina was surprised. It seemed hard to believe, but Prince Harry first contacted Amanda, and it was love at first email. They had been talking all day for almost a week, and he had promised to bring her to his country soon so they could meet in person. Carolina had reasonable doubts about all this, but her friend seemed so joyful that she let those doubts slide and decided to believe.

A few days later, Amanda called Carolina to ask for help with a $5000 bank transfer. Carolina didn’t think much of it and helped her. Only after a few minutes of hanging up did her mind connect the $5000 to Prince Harry's story. Immediately, she started making calls, and she was able to cancel the transfer and save her friend.

![](/images/just5000.png)

This was another phishing attack, a very sick one. The perpetrators pretended to be someone they were not and to be in love just to get something out of the situation. Remember: Prince Harry will probably never end up in a situation where he’ll need you to personally send him 5000 dollars.

### Tips to avoid being scammed by a celebrity

* Always check the URLs of sites you are redirected to, even if the page looks trustworthy.
* Beware of people you don’t know communicating with you, especially if they ask for money.

## Your Download Is Here…

![](/images/story-2.png)

I have always downloaded things from the internet. I knew about malware from a very young age, and I was always very careful. Especially because I didn’t always have my own computer and I used my brother’s.

I was successful with most of the things I tried to download. But there was this one program that I couldn’t find anywhere. It was a game I had played when I was little, a 101 Dalmatians game. I wanted to play it again very badly. But it was nowhere to be found without downloading a Windows XP emulator, something I didn’t want to do. I looked pretty hard, and pages and pages of Google searches led nowhere.

That was until I stumbled upon a site that promised everything I wanted:

**Disney 102 Dalmatians Puppies To The Rescue Windows 7 Download 1 Link ES ROM**

And when I pressed download, the name of the file it actually downloaded was:

![](/images/image-7.png)

To be honest, it sounded sketchy to me even then, but I was eleven and desperate. I lowered my security standards to the ground, hoping it would be my precious game. But, as you can probably guess, it wasn’t. It didn’t work—or so I thought.

I continued using the internet normally, but I began noticing that there were suspiciously many ads on every page I visited. I gave myself the benefit of the doubt, thinking those ads were built on every web page I visited. I refused to believe I had infected my brother’s computer with malware, as he would be very mad. But when there were “Sarah wants to meet you” ads on my school website, I couldn’t deny it anymore.

![](/images/untitled-58.png)

### The attack

#### Adware

Adware is a type of malware that specifically displays ads in places where there wouldn’t normally be ads. I downloaded a suspicious program and then I gave it access to my computer, there’s not much more to it.

### Tips to avoid this

* On the internet, if it seems too good to be true, it probably is.
* Try to avoid installing programs on your computer that you don’t trust, and if you do, give it as little privileges over your system as possible.

## Minecraft and smart fridges

![](/images/story-3.png)

This didn’t happen to me or to someone I know—that I know of, at least. The thing is that it could potentially be happening to anyone and they wouldn’t know.

![](/images/frame-47453.png)

 

Imagine you are playing Minecraft, the popular sandbox game. You’re on a server with your best friends, having a good time. Then, all of a sudden, the game starts lagging, and you get disconnected. You wouldn’t think much of it, right? 

![](/images/connectionlost.png)

And the truth is that it could have happened for many reasons. But I’m here to tell you about one that I found particularly interesting: Mirai. 

Many IoT devices are connected to the network, such as surveillance cameras, smart fridges, and kettles, among others. Some of the owners of those devices leave the username and password that comes in by default.

![](/images/frame-47454.png)

There is a malware called Mirai that is designed to scan the internet for IP addresses of IoT devices. Then, it tries different username/password combinations from a list of common ones. If it succeeds, it installs itself on that device and starts scanning the internet for new devices from there, too. Most of the device owners wouldn’t know that their devices were running malware because the IoT device still fulfills its purpose.

In this case, all this devices were used to overload Minecraft servers and companies that advertised protecting Minecraft servers, asking for payments in exchange for not being attacked —protection racket—.

### The attack

#### Botnet

A botnet is a group of devices that are infected by malware and can attack coordinately. While a botnet is not an attack in itself, it is almost always used to do harm: DDoS attacks, spam distribution, and Ridge polls, among other things.

[Here](https://www.notion.so/Bedtime-Cybersecurity-Stories-23a46342e04a482ca4b22c1b185560b5?pvs=21) is the source code for Mirai, if you’re interested.

![](/images/smartattack.png)



### Tips to avoid this

* To avoid your IoT device being taken by a botnet, make sure to use a secure password if it is connected to the internet.
* Try to buy devices that offer security updates and are not easily vulnerable. Some cheap surveillance cameras, for example, have vulnerabilities that allow malicious agents to see what the camera is capturing. Remember that attackers having access to your IoT device is NOT something you’d want since you probably have it in your home in the real world, and you don’t know the attacker’s intentions.

## Antiya, the odd employer

![](/images/story-4.png)

I tend to receive a lot of scammy-looking texts and emails. I have always been very curious as to how the scam works, so when I received:

![](/images/bubble-friend.png)

I obviously clicked the link.

It led me to a WhatsApp chat. The phone number was from the UK, and the profile picture was of a beautiful girl. The name displayed was Antiya.

So I sent the following:

![](/images/messages.png)

I decided to keep going to see where this would lead. She asked for my name. Of course, I wouldn’t give her my real name. So I decided to test her, and I gave her the name of one of the main characters of the movie High School Musical, Gabriella Montez. She didn’t notice.

She told me that “the salary in the GR platform oscillates between 10 USDT and 100 USDT” and that “I should be more than 23 years old”, which I wasn’t. So I told her I just turned 32, and she didn’t ask for proof.

She made me create a user in a platform called Grandern. The platform was only made for mobile devices—if you accessed it from a computer, everything looked awful, and there were many spelling errors across the page.

![](/images/group-7633.png)

Antiya told me to give her the mobile number associated with my account. I didn’t want to give her my number —although it wasn’t a very rational concern, as I was talking to her from my real number—, so I gave her a free US phone website that we sometimes use for testing purposes. I needed the phone to be able to receive messages because I wanted to see if she’d sent me something. 

But it was pointless because after that, Antiya disappeared forever.

![](/images/group-7632.png)

### The attack

#### Task scams

This one was ticker than the others to unravel because, at some point, the scammer realized my intentions and stopped the attack before I could fully understand what was happening. However, I did a bit of research, and I can be almost certain of what the scam was.

It was a task scam: the scammers offer you a job. It is a really promising, easy job with good pay. They assign you tasks —like reviewing a product on Amazon, liking a YouTube video, etc—and pay you after you complete a bunch of them. Most of the time, they pay you in a virtual coin system that their platform provides, which you can allegedly withdraw after reaching a certain amount of funds. What I found really interesting is that they sometimes pay you in real money. But where does that money come from?

Well, let’s not get ahead of ourselves. You go and complete the tasks, you receive the payment, and then you trust them because, well, they’ve paid you. 

Then, they’ll ask you to invest in a cryptocurrency for some of the tasks. It always promises great returns on the investment, and most victims see this as a plus from the “job” they already have. This is the part of the scam where they get you because what you are asked to invest in is always higher than what they have already paid you. They use part of what you “invested” to pay the new “employees” and keep the rest while also getting revenue from selling engagement on different platforms, such as Instagram. Personally, I think it’s brilliant; I wish the person who came up with this model used their intelligence to do good.

### Tips to avoid this

* I cannot stress this enough: if it looks too good to be true, it probably is.
* Never use your money in an online job. Your employers are supposed to pay you, not the other way around.

## Conclusion: no one is safe!

You may think that you wouldn’t fall for anything like this. I like to think that about myself, too. But the truth is, you never know. Someday you could be distracted or in a hurry and ignore the red flags. I created a game to prove this point and invited all Xmartlabs employees to play.

The game will last for two weeks. I created a Google Forms link called 'This form is a trap.' The goal is to make others 'fall' for the link. If they click it, they have to fill out the form with the name of the person who deceived them into clicking it.

Take into account that Xmartlabs is a software development company, so the ones playing the game are highly technical, well-informed individuals. However, two days have passed since I presented the game, and 40 different people have already fallen victim to the form, with a total of 66 individual responses. Remember that clicking a link is different from falling for a scam, but this was an interesting way to show that we can be deceived, even if we are actively trying not to.

From hiding the link in other links to XSS attacks and even simulating the 'responses' button in a Slack thread, the ways in which we’re trying to deceive our teammates are beyond creative. We are having a lot of fun and experimenting in a safe and controlled environment to discover how vulnerable we are to falling for something. I recommend trying it out; it's a fun game to play with friends, family, or coworkers: trying to trick each other into clicking the link.

I hope you liked my stories and that they've made you more cautious about cybersecurity. Stay alert, stay curious, and above all, stay safe!