---
title: GitHub 2016 round up
date: 2017-01-30
tags: [GitHub, Data Analysis]
author: xl
category: business-agile
permalink: /Github-2016-roundup/
---

Almost a month into the new year, the yearly summaries and annual resolutions posts season is definitely over.

We have been working in Data Analysis for a while (in stealth mode for the most part, shame on us!) but we felt this was a good time to give you a sneak peek on what we have been up to. A bit late for a 2016 recap? Maybe! One thing is granted, the [Last Mover Advantage](https://techcrunch.com/2015/06/17/the-last-mover-advantage/) is on our side!

As you may already know, [we are really passionate](https://blog.xmartlabs.com/2015/04/16/OSS-Culture/) about all things Open Source. We have been working on many [open source tools](https://github.com/xmartlabs) to improve developers' life by providing well-tested, clean & extensible components, which are used by a thriving community of users and contributors.

[GitHub](https://github.com/) has been a great tool to share this passion as it enables seamless collaboration with fellow developers, so we thought it would be interesting to study the use of GitHub for open source projects during 2016. In this post we wanted to share our findings to give you insight about trends and fun facts in the OSS ecosystem, and pay a deserved tribute to some of the OSS heroes out there!

We will also discuss the tech stack and techniques we used and walk you through some of the challenges we faced – this may come in handy if you want to perform this type of Data Analysis. Hint: we played around with first-class Data Analysis tools such as [Apache Spark](http://spark.apache.org/), [Databricks](https://databricks.com/), [Apache Zeppelin](https://zeppelin.apache.org/) and [Google BigQuery](https://cloud.google.com/bigquery/).


## The Tech Stack

Before going deep into the data insights, let us walk you through the steps that got us there and the tools we tried out in the process. The [GitHub Archive] records all the public activity on GitHub and can be accessed for free. You can grab historical data of the activity registered on GitHub since 2/12/2011 on its website. For that purpose, it provides an endpoint that lets you request the historical data files by hour, each of which has an average size of over 80MB when unzipped. So for one year this is a lot of data provided you want to store it and process it yourself (700GB+)! This was a job for [Spark]!


Spark lets us process data in a computer cluster in a fast and efficient manner.
There are several ways to use it but we aimed at [Databricks] owing to the high level of abstraction it provides, by using web notebooks (very similar to [Jupyter Notebook]’s) and by exploiting Amazon EC2 instances with ease. It also lets you load files from S3 out of the box, so we crafted a script called [gh2s3](https://github.com/xmartlabs/gh2s3) to transfer the GitHub Archive’s 2016 data to S3. In order to get the users’ locations, we made use of [Scrapy](https://github.com/scrapy/scrapy) (a Python library to build crawlers) to extract this data from GitHub’s API. Scrapy allows to throttle the request rate to stay inside GitHub’s rate limits, among many other things. So our initial setup using Databricks is represented in the diagram below.

<div style="text-align:center;margin-bottom:20px"><img src="/images/github-roundup/databricks.png" alt="Databricks Architecture" /></div>


[Apache Zeppelin] is an amazing open source alternative to DataBricks. In spite of Databricks' simpler setup, Zeppelin is more flexible and allowed us to embed JavaScript code more easily in the notebook – which in our case ended up being the tiebreaker. So we switched gears and set it up to work on top of [Amazon EMR], with EC2 instances and with the same S3 data.

But then we found out that [the GitHub Archive is published on Google BigQuery](https://cloud.google.com/bigquery/public-data/github) as a public dataset, which made us realize that using Google BigQuery as an end-to-end solution for data storage, analysis and visualization was smarter.

So we got exposed to different top-tier tools but ended up finding a great shortcut that saved us time and effort. Epic win!

<div style="text-align:center;margin-bottom:20px"><img src="/images/github-roundup/ftw.gif" alt="for the win!" /></div>

## GitHub 2016 Topographical Depiction

We started off analyzing the commits based on their geographic location by mapping them to the location that the committers declare in their own profile.
This work was inspired by [a similar previous work by Ramiro Gómez](http://geeksta.net/visualizations/github-commit-map/).
We used a [script that is based on his work with some minor modifications](https://github.com/xmartlabs/gh-commit-locations).
This script reads JSON files with the user information from GitHub, takes the users location string and tries to map it to a country. Since the location field on GitHub is a regular string with no restrictions (for instance, it could be ‘Earth’, ‘localhost’ or ‘Milky Way’) it’s not always mappable to a country. The script tries to find the name of a country or city in the location string and can map this to a country in more than 96% of the cases where the location is not empty. This is a pretty impressive result but we need to take into account that the location string is a user generated data point so even in cases in which it's mappable, its accuracy is not granted. In this case we plotted the commits from the users by country, then compared them with their population. We also took a look at the amount of committers in addition to the commits. To plot the data into the map, we segmented it accordingly in 8 levels.


<select id="dropdownselect" onchange="selectedMapType();">
  <option value="commits">Commits</option>
  <option value="commitsPop">Commits per 100k inhabitants</option>
  <option value="devPerMil">Developers per Million inhabitants</option>
  <option value="commitsAndDevs">Commits per Developer</option>
</select>

<div id="container" style="width:100%;height:500px"></div>

### Commits: the usual suspects and a big surprise!

The first map shows the total amount of commits by country. It comes as no surprise that the **US** has the first place by a big margin – it has more commits than the rest of the countries in the top 8 combined! The second country with the most commits in 2016 is **Germany**, closely followed by **China** and the **United Kingdom**, with **Canada** completing the top 5. Congratulations to the 2016 winners!

<div id="commits-table-wrapper"></div>

**China**, **India** and the **US**, among other countries with huge populations have a clear advantage over the rest when talking about total amount of commits. When we consider their populations, we can have a better sense of the relative performance of different countries. What happens when we compare the number of commits per capita? Doubt no more! We went on and created a new map (use the dropdown next to the map above to switch among the different maps) that displays the commits per capita of every country. Here **Switzerland**, **Netherlands**, **Sweden** and **Canada** stand out among the rest – well done!

Not surprisingly, most of the countries leading the total commits and commits per capita charts are highly developed countries. These are countries with a big impact in the technology industry that also attract technical talent from abroad. Will the 2016 data reflect a relationship between the amount of commits per capita and a country HDI?

For that purpose we created yet another graph, that compares commits per capita against countries’ HDI (Human Development Index) from [the last report](http://hdr.undp.org/sites/default/files/2015_human_development_report.pdf). The data seem to confirm our initial perception but we also found out that countries such as **Greece**, **New Zealand** and **Finland** do very well on this one! Other remarkable data points in this graph include **Namibia**, **Uruguay**, **Ukraine**, **Bulgaria** and **Hungary**, who perform way better than expected when taking a deeper look at the numbers. At [Xmartlabs](https://xmartlabs.com) we are glad to contribute to this stats from our engineering HQ in Montevideo, Uruguay :D.

<div id="scatter-plot" style="width:100%;height:500px;"></div>

#### 2016 Biggest Surprise: Cocos Islands

<div style="text-align:center;margin-bottom:20px"><img src="/images/github-roundup/cocos.gif" alt="WHAT!?" /></div>

Yes! **Cocos Island**. This tiny country of only 14m2 and 600 inhabitants, located in the Indian Ocean has a HDI of 0.829 and 11,036 commits during 2016! Woah. Are we in presence of a programming heaven? We don't really know :) This and other outliers happen to be countries with very little population, in which very few data and the presence of errors in the users’ stated locations can explain the high deviation of their stats. More recognizable countries such as **Monaco** and **Vatican City** display a similar pattern.

<div style="text-align:center;margin-top:20px;margin-bottom:50px"><img src="/images/github-roundup/cocos-island-flag.png" alt="Cocos Island flag" /></div>

### Committers

Up to now we have seen the amount of commits, but how many committers do they have with respect to their population? By taking a look a the <a href="#dropdownselect" onclick="$('#dropdownselect').value = 'commitsAndDevs';">corresponding map</a> we see some differences. This time **Iceland**, **Norway**, **Denmark** and **Ireland** fare better – can you spot a trend?

#### Newcomers

Developers from African countries, such as **Guinea-Bissau**, **The Democratic Republic of the Congo**, **Botswana and Algeria**, have a significant number of commits. However, we have only found 1, 5, 6 and 6 committers respectively, so they are clearly few but good! Big shout-out to [ivandrofly](https://github.com/ivandrofly), [jniles](https://github.com/jniles), [tsetsiba](https://github.com/tsetsiba) and [assem-ch](https://github.com/assem-ch) who are great examples of this.

## Commit Messages Analysis

The dataset available included commit messages so we wanted to get some insights out of them. In that regards, we defined some metrics and compared the global values to those of some popular repositories.

The metrics we took were the following:

* **Messages with 'fix'**: Messages that include the string `fix`. This commits should be a representation of bug fixing commits and not commits that change documentation or add a new feature.
* **Messages with link to an issue or pull request**: These are messages containing references to GitHub's issues or pull request like `#xxx`.
* **Messages shorter than 15 characters**: Following the good practices for commit messages posted on several sites like [OpenStack](https://wiki.openstack.org/wiki/GitCommitMessages#Information_in_commit_messages) we searched the commit message length to see how many are too short. It is not easy to specify a number of characters for which we say this is too short but in general commit messages should be descriptive of the solved problem or the new feature so that a message with less then 15 characters should not be a good message. We could also have tried a higher number than 15.
* **Average message length**: The average length of commit messages. To get an insight to how messages are structured for a repo in general.

We then chose some repositories with a lot of stars, from different programming languages and communities.
So we chose Linux as one of the biggest repos as well as Bootstrap and JSON-Server which share a language but are maintained quite differently.
We also compared this to the results of all the commit messages with some interesting results:

|                                               | Linux  | Bootstrap  |  JSON-Server |   Global    |
| --------------------------------------------- | ------ | ---------- | ------------ | ----------- |
| Total messages                                | 12,192 | 4,928      | 136          | 262,414,932 |
| Messages with 'fix'                           | 42%    | 17%        | 8%           | 10%         |
| Messages with link to issue or pull request   | 2%     | 37%        | 16%          | 8%          |
| Messages shorter than 15 characters           | <1%    | 5%         | 26%          | 17%         |
| Average message length                        | 664.7  | 82.4       | 37.5         | 60.3        |

The first thing that caught our eye was the high standards Linux keep for their commit messages as not even 1 in 100 is shorter than 15 characters and that the average length exceeds 664 characters.
This completely contrasts with the relatively high percentage of short commits in JSON-Server, but also in general.

Not surprising is the fact that almost half of the commits in Linux do `fix` something and that `fix` appears in those long and complete commit messages.
This makes sense with the fact that Linux receives more bug fixes than new features.

There is also a great difference between Bootstrap and Linux in terms of linking to issues and pull request as the Linux repo has issue reporting disabled on GitHub and does merge commits that do not always come from GitHub pull request but SCM.
If that was not the case then low amount of links to issues or pull requests would mean a lot of direct pushes to master branch (as pull request merges would be caught by this rule).

## Stars Analysis

This is the top 20 repos in stars received in 2016:

|                   Repo                    |  Stars  |
| ----------------------------------------- | ------- |
| FreeCodeCamp/FreeCodeCamp                 | 181,529 |
| jwasham/google-interview-university       |  30,252 |
| vuejs/vue                                 |  28,231 |
| tensorflow/tensorflow                     |  27,857 |
| vhf/free-programming-books                |  27,239 |
| facebook/react                            |  25,814 |
| getify/You-Dont-Know-JS                   |  24,517 |
| sindresorhus/awesome                      |  24,441 |
| chrislgarry/Apollo-11                     |  23,553 |
| yarnpkg/yarn                              |  21,202 |
| facebook/react-native                     |  19,787 |
| twbs/bootstrap                            |  19,232 |
| airbnb/javascript                         |  19,008 |
| joshbuchea/HEAD                           |  18,804 |
| firehol/netdata                           |  18,562 |
| facebookincubator/create-react-app        |  17,738 |
| robbyrussell/oh-my-zsh                    |  17,200 |
| FallibleInc/security-guide-for-developers	|  15,843 |
| open-guides/og-aws                        |  15,512 |
| github/gitignore                          |  15,137 |

We can see that Free Code Camp still gains lots of attraction! It currently has 216,340 stars, so most of them (86%!) were achieved in 2016. I mean, that’s an average of 577 stars per day! However this outlier can be explained taking into account that the number of people interested in programming increase in large quantities every year, that Free Code Camp is the mainstream entry point for it and that one of their first tasks asks for starring the repo.


It's interesting to see how certain repos that have been around for some time are still among the most attracted, like **Twitter Bootstrap**, **gitignore from GitHub** and **free-programming-books**.
But incredibly the second place is for **google-interview-university** that reached this position even though it's way younger that the others. As a result, one can wonder how well new repos perform.

### Top Rookies

This is the Top 20 in stars for the repos created in 2016:

|                      Repo                      | Stars  |
| ---------------------------------------------- | ------ |
| jwasham/google-interview-university            | 30,252 |
| yarnpkg/yarn                                   | 21,202 |
| joshbuchea/HEAD                                | 18,804 |
| facebookincubator/create-react-app             | 17,738 |
| FallibleInc/security-guide-for-developers      | 15,843 |
| open-guides/og-aws                             | 15,512 |
| jgthms/bulma                                   | 12,141 |
| toddmotto/public-apis                          | 11,749 |
| tensorflow/models                              | 10,855 |
| songrotek/Deep-Learning-Papers-Reading-Roadmap | 8,640  |
| FormidableLabs/webpack-dashboard               | 8,124  |
| Blankj/AndroidUtilCode                         | 7,826  |
| dthree/cash                                    | 7,719  |
| gztchan/awesome-design                         | 7,681  |
| alexjc/neural-doodle                           | 7,470  |
| expressjs/express                              | 7,372  |
| FreeCodeCampChina/freecodecamp.cn              | 7,274  |
| NamPNQ/You-Dont-Need-Javascript                | 7,118  |
| huluoyang/freecodecamp.cn                      | 6,960  |
| angular/material2                              | 6,900  |

3 of them are in the Top 20 and the rest have a good amount of stars with respect to it.
There are several repos related to **JavaScript and Web Development**: yarn, create-react-app, bulma, public-apis, webpack-dashboard, cash, awesome-design, express, You-Dont-Need-Javascript and material2.
**Deep Learning** was one of the big themes in the development community during 2016, and this is reflected by the fact that TensorFlow models, Deep-Learning-Papers-Reading-Roadmap and neural-doodle made it to the top of the charts.

So 2016 let amazing repos appear such as the new dependency manager **yarn**, **public-apis** that has a list of open JSON APIs for web development and **neural-doodle** that generates masterpiece art images from very simple doodles!

### Top Languages

Analyzing the Top Repos again, they roughly fall into one of the following categories: they are related to **JavaScript or Web Development**, they **come from a big tech company** or they are **general guides**.
Regarding the first category, we have: vue, react, You-Dont-Know-JS, yarn, react-native, boostrap, a JavaScript style guide from Airbnb, HEAD and create-react-app.
So, is JavaScript the most popular language? Take a look at this table, that shows the stars received with respect to the language involved in each repo:

| Language   | Sum of stars |
| ---------- | ------------ |
|	JavaScript | 186,219      |
|	Shell      | 121,161      |
| HTML       | 120,659      |
| CSS        | 115,067      |
| Python     | 104,823      |
| Ruby       |  66,218      |
| Java       |  61,409      |
| C          |  60,201      |
| Makefile   |  54,238      |
| C++        |  53,854	    |

Yeah, **Javascript** is by far the most popular, as it has also been shown by the [Stack Overflow Developer Surveys](https://stackoverflow.com/research/developer-survey-2016#technology).
They really have a large community. **HTML** and **CSS** are among the top too. Notably, Shell takes the second place.
And it makes sense to see **C**, **Makefile** and **C++** next to each other, as they are commonly used together.
The rest of the table is not surprising except for the absence of **Swift** and **Objective-C**.
There's a more complete pie chart here:

<div id="languages-pie-wrapper"></div>

**Update (April 11, 2017):** Stackify posted an engaging analysis about the [Trendiest Programming Languages](https://stackify.com/trendiest-programming-languages-hottest-sought-programming-languages-2017/) which concludes pretty similar statements.

### Stars timeline

For example, take a look at the stars timeline of **google-interview-university**:

<div id="stars-timeline-wrapper"></div>

The repos' star events tend to happen with big spikes, as they spread virally like rumors in social media.
The day it reached the apex was the same day that [it was shared on HackerNews](https://news.ycombinator.com/item?id=12649740) and from there [shared on Reddit](https://www.reddit.com/r/cscareerquestions/comments/565ors/google_interview_university/).
And [according to the author](https://googleyasheck.com/my-github-project-is-trending/#backstory), it all started on October 4th when [Amit Agarwal shared it on Twitter](https://twitter.com/labnol/status/783203765113524224).

What we learn from this and from other cases?
There is nothing new under the sun: if you have something that's interesting for people in general or for a niche and you are able to make someone influential share it, you will surely get in the trending.
Chances are that your repo will stay among the top for some time because the GitHub trending repos are a showcase too :D

## Summary

2016 was a great year for GitHub. Even though **developed countries** are the ones that most contribute, there is a commitment with Open Source from all over the world, including **islands with very few population**!
And there are countries such as **Greece and Namibia** that exploit their potential at best.

Few **commits** seem to be **fixes** whereas in projects such as **The Linux Kernel** there are plenty of them.
Besides, **new projects** seem to be **less structured** but some of them take it to the other end, having **meaningless commit messages**.

New cool repos such as **yarn** appeared in 2016 as well as relics such as **Linux**, **Twitter Bootstrap** and the not-so-new **React** keep gaining attention. **JavaScript** still is the trending language.

Hope you liked this post! If you have any doubt, comment or complain, don't hesitate in leaving a comment below or dropping us a line at <a href="mailto:getintouch@xmartlabs.com">getintouch@xmartlabs.com</a>.

<script src="/githubdata/js/d3.min.js"></script>
<script src="/githubdata/js/topojson.min.js"></script>
<script src="/githubdata/js/datamaps.world.hires.min.js"></script>
<script src="/githubdata/js/main.js"></script>
<link rel="stylesheet" href="/githubdata/css/styles.css">

[Amazon EMR]: https://aws.amazon.com/es/emr/
[Apache Zeppelin]: https://zeppelin.apache.org/
[Databricks]: https://databricks.com/
[GitHub Archive]: https://www.githubarchive.org/
[Jupyter Notebook]: https://jupyter.org/
[Spark]: https://spark.apache.org/









```
npm run eject
```

Now that we have our blank canvas to work with, let's get our hands dirty.

### Boilerplate

We’ll need a couple of files to get started. First, we’ll need three different app entry points. The current one is `src/App.js`. Let's create a `src/apps` directory where to put all our entry points. These files will work as root files that start the corresponding React app. We'll need three since we don't want to mix the code of all three apps, and also you may want to configure some things differently. Think of three separate React apps living in the same repository.

Our first app will be located in `src/apps/products`. The directory structure could be as follows:

```
/src
  |- /apps
    |- /products
      |- app.js
      |- app.test.js
      |- app.css
      |- index.js
```

What I've done here is simply move the files that were on `src/` and renamed them (we don't use Pascal Case to name component files, but you can do it if you like). We'll have to adapt them down the line, but we'll cross that bridge when we get there.

You should create similar files for the other two apps (`checkout` and `static-pages`). In some cases you might want some configuration to work similarily across apps (for example, the router, debugging components). So what we usually do is create an `AppTemplate` component that serves that purpose, and then simply render that component in each `app.js` file. For simplicity, let's copy the code that's in the initial `App.js` file and paste it in `src/apps/app-template.js`.

```jsx
/* src/apps/app-template.js */
import React, { Component } from 'react';
import logo from './logo.svg';

class AppTemplate extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export { AppTemplate };
```

Then, in each of our `app.js` files we'll do something like this:

```jsx
/* src/apps/products/app.js */
import React from 'react';

import { AppTemplate } from '../app-template';
import './app.css';

const App = () => (
  <AppTemplate />
);

export default App;
```

**Note:** I've neglected to show a few updates you'll need to make in other files, but they should be pretty evident (for example updating imports in each of the apps `index.js` files).

This setup will allow you to centralize configuration of code that needs to go on every sub app, while also allowing us to override or add local configuration to a specific app. You can even pass props to `AppTemplate` if you want, to make this approach even more versatile. Right now all our `app.js` files are equal, but as apps grow, they'll start changing and becoming more complex.

If you try to start the project now, it will most certainly crash. That's because we haven't told Webpack we want it to process multiple entry points!

### Webpack Configuration

Take a look at webpack's main configuration file, located in `config/webpack.config.js`. If you don't have experience with Webpack there's a lot to take in (a **lot**), but let's focus on what's important. Take a look at the `entry` key on line 127. To Webpack, entry points are a way of specifying the different bundles you want to create. Each entry point will be processed individually. Therefore, what we want to do is specify three entry points, one for each of our sub apps. `Create React App` centralizes path configuration in a single `paths.js` file. We must edit this file to add information of all our apps. Add this code somewhere on the paths file:

#### Path Configuration

```js
/* config/paths.js */
const apps = {
  CHECKOUT: 'checkout',
  PRODUCTS: 'products',
  STATIC_PAGES: 'static-pages',
};

const appData = Object.values(apps).map((appName) => {
  return {
    js: {
      name: appName,
      path: resolveApp(`src/apps/${appName}/index.js`),
    },
    html: {
      chunks: [ appName ],
      filename: `${appName}.html`,
      template: resolveApp(`public/base-template.html`),
    }
  }
});
```

The idea is to export the configuration for each of our apps on the `appData` object. The `js` key should make sense, as we're specifying the name of the app (`products`) and where its entry point is located (`src/apps/products/index.js`). The `html` key might not make a lot of sense right now, so let's explain.

The `template` key specifies where the base template for the HTML of the app is located. You should already have an `index.html` in your public folder. I'd suggest renaming it to something like `base-template.html` to avoid confusions. The `filename` key specifies what the final name of the HTML should be (`products.html`). The `chunks` key is very important, as it tells Webpack to only include the chunks related to this app (`products.js`, `products.css` and all other assets).

Now, simply export this new object we've made. You can also remove unnecessary exports that were already there, since we won't use them:

```js
/* config/paths.js */
module.exports = {
  dotenv: resolveApp('.env'),
  appData, // <- New
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};
```

#### Entry point Configuration

On line 134 of the Webpack configuration file is the `entry` key. We must add our new entry points:

```js
/* config/webpack.config.js */
const entries = {};
paths.appData.forEach((entry) => {
  const entryJs = entry.js;
  entries[entryJs.name] = [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    isEnvDevelopment &&
      require.resolve('react-dev-utils/webpackHotDevClient'),
    // Finally, this is your app's code:
    entryJs.path,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ].filter(Boolean);
});

return {
  // ...
  entry: entries,
}
```

#### Output Configuration

Right now, Webpack expects you to only generate one final bundle. We're trying to split our app so this approach won't work. Head to the `output` key on the configuration object and look for the `filename` key inside. In development mode its value is `static/js/bundle.js`. We don't want it to have a static name, since we'll be creating three of them and they'll step on each other. The easy solution is to use Webpack's handy interpolation schemes: simply change the value to `static/js/[name].bundle.js`. This will make Webpack interpolate the name of the bundle in the file, so you'll end up creating three different main bundles.

And *voilà*, Webpack now knows where to look for our JS files and thus define the apps correctly. But there's a final task: configure the HTML Webpack generates for each app. We'll do this on the `plugins` key, creating one instance of `HtmlWebpackPlugin` for each of our apps.

```js
return {
  // ...
  plugins: [
    //...
    ...paths.appData.map(appData => new HtmlWebpackPlugin(Object.assign(
      {},
      appData,
      {
        inject: true,
      },
      isEnvProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : undefined
    ))),
  ],
}
```

Remember to maintain the relative order of the plugins. Also, keep in mind that you have to *replace* the instance of HtmlWebpackPlugin that is already being created.

Now are apps are correctly split. Sadly it isn't the end yet, but we're getting closer! The last thing we'll need to do is configure Webpack's development server to serve us the three different apps.

### Rewriting Development Routes

The development server that runs when you start the project in development is biased towards a single-entry-point implementation. We'll need to change a couple of things in order to make URL splitting work here. Essentially, the development server needs to know which app it needs to serve on which URL. We can do so with *rewrites*:

```js
/* config/paths.js */
const appRewrites = [
  { from: /products/, to: `/${apps.PRODUCTS}.html` },
  { from: /checkout/, to: `/${apps.CHECKOUT}.html` },
  { from: /static-pages/, to: `/${apps.STATIC_PAGES}.html` },
  { from: /.*/, to: `/${apps.PRODUCTS}.html` },
];
```

Now simply export `appRewrites` so that we can access it from the configuration file.

Rewrites work with regular expressions, so you won't necessarily need to specify *each* of your app's paths manually. Here I've given a naive example to get you going. It's also reasonable to put a catch-all rule at the end so that the user always gets an app served to them (maybe to show them a not found page).

Now, let's tell Webpack's development server to use these rewrites. The configuration resides in `config/webpackDevServer.config.js`.

```js
/* config/webpackDevServer.config.js */
{
  //...
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebook/create-react-app/issues/387.
    disableDotRule: true,
    rewrites: paths.appRewrites, // <--- Add this rule
  }
}
```

Great! Your app now supports URL splitting correctly! Let's do a recap. Stick around for the caveats section, since you'll probably need to do a few more touches here and there to start your development process smoothly.

## Recap

Here's what we've accomplished so far:

- Create individual entry points for our apps.
- Configure Webpack's bundler to support all our apps.
- Configure Webpack's development server to serve different HTML files depending on the URL.

If you try to start the server now, it'll crash. This is because the scripts that are bundled with CreateReactApp's code expect only one Javascript entry points. It should be extremely simple to fix this, simply check the start and build scripts on `scripts/`. Once you start the server, you should be met with something similar to this:

<img width="100%" src="/images/url-splitting/app-base-page.png" />

To convince ourselves that our apps are different, we can change the background to different colors. Go to each app's `app.css` file and edit the background color. I've used red, green and blue. Now navigate to `/products`, `/checkout` and `/static-pages` and you should be met by three different background colors. This means our server is serving them correctly!

## Caveats

### Code Sharing

The whole idea of URL splitting is to avoid serving the user code they probably won't need. On the other hand, we should have a way to share code between our apps, to make everything as DRY as possible. But beware, sharing code between apps can be tricky! Be sure to import only what you'll need on any specific app. You might end up loading every app with code that will never be visited.

Try structuring your code in a way that reusable code is correctly labeled and easy to identify (i.e. global styling files, helpers and generic components). This will make it easier for people who work with your code to know what they're looking at, and give you an idea of how much code you're sharing.

Much like a prepubescent teenager, your apps want to have a personality! If you find yourself sharing *everything* between apps, it might be a sign that you didn't split them in a sensible way. Also, sharing little to no code between them can also be signalling an issue. It's all a matter of balance.

### Service Workers and PWAs

The initial app we created is configured to be a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) out of the box. This is because it is assumed you'll always have a single bundle, and having your app be a PWA without configuration is sure useful!

The problem is, our app is now *three* different bundles. You can't have a PWA with multiple entry points that don't share all the code. What you can have is three different PWAs scoped by an internal path in your domain. I won't go into detail on how you could achieve this, since it isn't the scope of this article, and I personally don't find it very useful (but it could be for your use case).

If you've followed this blogpost's code to a tee, then probably all your apps' `index.js` file have these lines somewhere:

```js
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

This means that our app is not really a PWA yet. We'd need to explicitly enable the service worker on the client's browser by changing that line. So, essentially you're not in trouble if you leave all this code hanging around, but I always like to remove all the evidence to avoid confusing people who are not familiar with the code.

### Production Backend

One of the advantages of SPAs is that the backend that serves them can be as dumb as a second coat of paint. Meaning that, no matter the request, the backend will always serve the matching public file, or the HTML entry points for your SPA.

Sadly, with URL splitting you'll need to make your backend a little smarter. Much like we did with Webpack's development server, you'll need to specify what HTML file to serve on which URLs. This can be done extremely quickly using an Express backend (which is what I do).

### Frontend Routing

If you have experience with SPA's with React, you've probably used React Router to solve your routing needs. The issue is, React Router will solve routing *inside* each of your apps, but not *between* them. Perfect time to sell my next blog post!

Jokes aside, this is a somewhat deep topic, so I've decided to split it. Check out part two when it releases!

## Afterword

Yes, I know, configuring URL splitting is quite horrible, and you certainly shouldn't go through the hassle of doing it **unless** you really need it. Think of it as another tool in your toolbelt. And, believe me, I've run into mind-boggling issues while configuring the project myself. But in the end, it's a one-time thing that will help you get a more stable, more performant app in the end. And every time you configure it it gets easier.

So don't be afraid if you don't understand everything that's going on. With time, you will. And if there's something that wasn't clear, feel free to leave a comment or an issue on the repo! I'm always open for feedback.

Cheers!
