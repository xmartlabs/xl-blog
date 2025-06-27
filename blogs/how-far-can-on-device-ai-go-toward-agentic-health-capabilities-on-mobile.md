---
title: How Far Can On-Device AI Go? Toward Agentic Health Capabilities on Mobile
subtitle: " "
permalink: /blog/building-a-local-health-ai-agent
featured: true
date: 2025-06-27
category: machine-learning
thumbnail: /images/mientras-tanto.jpg
tags:
  - AI Agents
  - On-Device AI
  - Privacy-Preserving AI
  - LLM Tool Use
  - Health Tech
author: belu
---
# Introduction

In our last blog post, we talked about running Large Language Models (LLMs) locally on your phone to power a privacy-first health assistant. The idea was simple: let your wearable data stay on your device and still get smart, personalized answers about your health, no cloud required. It mostly worked… but it was not perfect. The biggest issues were that the assistant couldn’t really understand trends or tell when your data was collected, which made certain questions hard to answer.

In this post, we’re back with a new idea to fix those problems. We’ll walk you through how we built a smarter, more capable prototype: a local AI agent that doesn’t just respond, but actually thinks (a little) before answering.

# Outlining The Solution: Why An Agent?

For the solution we were envisioning, a chatbot just wasn’t enough. There was no way to compress all the user’s health data into a simple prompt, and that made it impossible to ask about a specific date, predict trends, or make very context-specific queries without losing precision.

[Google Cloud](https://cloud.google.com/discover/what-are-ai-agents) defines AI Agents as “software systems that use AI to pursue goals and complete tasks on behalf of users. They show reasoning, planning, and memory and have a level of autonomy to make decisions, learn, and adapt”.

That’s exactly what we needed. A system that, instead of getting all the data upfront, was smart enough to fetch only what it needed to answer a question. For example, if a user asked: “Has my oxygen saturation improved in the last few weeks?”, the old approach wouldn’t give a clear answer. That’s because it relied on the mean and standard deviation, which doesn’t show whether a metric is going up or down.

An agentic model, on the other hand, could look at just the right slice of data, figure out the trend, and give a clear, useful answer. It’s a big step forward: shifting from a basic chatbot to something more like a smart assistant that understands what it’s doing. This kind of intelligence is what makes the future of local health apps really exciting.

# Models & Tool Calling

Previously, we used two local LLMs that received relatively high scores in the [AMEGA](https://github.com/DATEXIS/AMEGA-benchmark) benchmark: Phi 3.5 and Aloe. Both models fulfilled the purpose of powering a health chatbot that could answer health-related queries using basic context. However, if we want to step up and build an agent, there’s a feature that we need that not all models provide: Tool Calling.

## Tool Calling

Tool calling refers to the ability of AI models to interact with external tools. For example, if you asked ChatGPT to plot some data, it could call a charting tool or a Python script to generate the graph for you. In our use case, this ability was crucial, because the model needs to query HealthKit or Health Connect for specific pieces of data, and also request the right statistical operation to apply. Without tool calling, the model would be limited to whatever information was passed in the prompt, making it far less flexible and useful.

For our prototype, we wanted to equip the model with access to basic statistical operations like mean, standard deviation, and linear regression. This would theoretically allow it to go beyond just reading raw numbers and make a much more interesting analysis.

For example, when a user asks, “Is my heart rate improving?”, the model could call a tool to fetch the relevant data from the past few weeks and then calculate whether the trend is decreasing. This kind of analysis simply wouldn’t be possible with a static prompt.

## Models That Suit Our Needs

Unfortunately, Phi 3.5 mini, the lightweight, performant model with a surprisingly good AMEGA score does not support Tool Calling. However, Microsoft has released a new model in the Phi family: Phi 4 mini, which does support Tool Calling.

Aloe, the other model that scored very well, also supports Tool Calling. That’s why, for this proof of concept, we’ve chosen to work with **Aloe** and **Phi 4 Mini:** two models that combine strong medical reasoning with the ability to interact with external tools.

# **XLCare v2: From Assistant to Agent**

We started experimenting with agentic capabilities: giving the model tools, memory, and the ability to decide what it needed. But getting that to work on-device, with small models, was far from straightforward. Mind you, this section gets a bit into the weeds on the technical side. If that’s not your thing, feel free to jump ahead to the next part.

## Different Iterations We Went Through

Our strategy changed a lot during the earliest stages of this new agentic version, because what works with big models (such as ChatGPT) does not always works with these much smaller ones.

### No. 1: Simple approach

At first, we thought that a simple approach would work best. Simple prompt, letting the model know what tools it could use.

This is an example of the type of prompts that we used at this stage:

```
`'You are a helpful assistant that interprets user health-related questions and returns structured queries for health data retrieval. Your job is to translate user requests into well-formed JSON objects that can be used to call external health services such as Apple HealthKit.'`
```

However, we could not get a conversational response using this technique. The model either chose to respond in natural language or call a tool; never both. Some disastrous outputs below:

![](/images/how-far-can-on-device-ai-go-1-2.png)

## No. 2: Triple prompt

Since it wasn't responding in the conversational way that we intended, we tried a different strategy: breaking down the message in three parts. That way, we could customize each part of the prompt specifically. This is the structure we thought of:

grafico meramente ilustrativo jaja hacerlo bien

![Screenshot 2025-06-05 at 9.05.35 PM.png](attachment:d8202308-eab9-4bb2-9422-460d683db465:Screenshot_2025-06-05_at_9.05.35_PM.png)

For that purpose, we designed three separate prompts that would be used in each part of the message. That way, the context could be much smaller and leave less room for mistakes or confusion. Also, we provided the model with a simple grammar—a set of rules and examples—to guide it in formatting its responses as JSON.

This were the first three prompts that we tested:

```jsx
  const initialPrompt = {
    role: 'system',
    content:
      'You are a health agent. Greet the user warmly and supportively when they ask about their health. Inform the user that you are going to check some metrics to provide a better response for their query.',
  };
  const toolPrompt = {
    role: 'system',
    content:
      'Convert the user health question into a structured health query using queryHealthData.',
  };
  const answerPrompt = {
    role: 'system',
    content:
      'Answer the users health question based on the tool result. Be helpful and concise.',
```



![](/images/how-far-can-on-device-ai-go-3.png)

At this point we were still dealing with some formatting issues such as all the output being in JSON format due to the grammar provided. And of course, we forgot we needed to call the tool and actually pass the results as context for the model to be able to arrive at a conclusion. But this was definitely a step in the right direction!

## No. 3: Prompt Maturation

We continued iterating over the three prompt approach, in search for better results. Our prompts started looking like this:

Initial

```jsx
      'You are a supportive health assistant. When a user asks a question about their health, choose one of the following two actions:\n\n' +
      "1. If the question clearly requires personal health metrics that you don't have (e.g. heart rate, sleep, steps), greet the user warmly, inform them that you'll check that information, and include <tool> at the end of your message to request the data. Do not ask the user to provide data manually." +
      '2. If the question can be answered generally without personal data, respond directly and concisely. In this case, instead of <tool>, use <end> at the end of your message.\n\n' +
      'You must pick only one path. Never include both <tool> and any direct health advice in the same response.'
```

In this version of the initial prompt, we added simple logic to help the model decide whether to call a tool or just respond directly. If no tool was needed, the message would end there; otherwise, it would continue with the appropriate tool call.

Tool

```jsx
      `Convert the user's health question into a structured health query using the queryHealthData tool. Today is ${new Date().toISOString()}.\n` +
      'Choose the correct statistic based on the intent:\n' +
      '- If the user asks about "improvement", "change", or "trend", use: "lineartrend"\n' +
      '- If the user asks "how is", use: "mean"\n' +
      '- If the user asks "does it vary" or "is it consistent", use: "stdDev"\n\n'
```

For the tool prompt, we decided to include the current date—since the model seemed to think it was still 2023—and a clear explanation of the statistics it could request, depending on the user's question.

Final:

```jsx
"Answer the user's health question based on the tool result. Be supportive, clear, and concise.\n\n" +
      'Avoid using technical or statistical terms that the user may not understand (e.g. standard deviation, slope, intercept).\n' +
      "Instead, explain the result in everyday language (e.g. 'your heart rate has been going down', 'it's been fairly steady')."
```

The final prompt turned out to be the simplest of all. The only thing we had to emphasize was avoiding technical or statistical terms that users might find confusing.

We limited tool usage to a specific part of the conversation: only the tool message followed the defined grammar and was allowed to use tools. This way, the initial and final messages always stay in natural language, keeping the interaction more natural.

As a result of combining the three prompts, we finally had the first working agent version of XLCare!

[Screen Recording 2025-05-16 at 2.09.05 PM.mov](attachment:c155a910-8581-477f-9832-c361c21d9fc4:Screen_Recording_2025-05-16_at_2.09.05_PM.mov)

## No. 4: Health Charts

We really wanted to test the limits, so we decided to give the model another tool to play with. We added another tool to let the model create a chart of the user’s health data if requested. We had to modify the tool prompt to induce the model to use the chart tool whenever the user asks for a visual representation.

```jsx
`Convert the user's health question into a structured call using the correct tool: queryHealthData or createHealthChart. Today is ${new Date().toISOString()}.\n\n` +
      'Follow these rules:\n\n' +
      '**For queryHealthData:**\n' +
      '- Always request data from the **past 2–3 weeks**.\n' +
      '- Choose a single `statistic` based on the question:\n' +
      '  - "how is my [metric]" → `mean`\n' +
      '  - "does it vary" / "is it consistent" → `stdDev`\n' +
      '  - "has it improved"/"changed"/"trended" → `linearTrend`\n\n' +
      '**For createHealthChart:**\n' +
      '- Choose aggregation:\n' +
      '  - Past 1–2 weeks → `daily`\n' +
      '  - Past 3+ weeks → `weekly`\n' +
      '- Always include `start_date` and `end_date`.\n\n' +
      'Only generate one tool call per request.'
```

Then, using `react-native-gifted-chart`, we were able to create the chart that the LLM requested.

[Screen Recording 2025-06-06 at 3.18.55 PM.mov](attachment:465e26ec-1853-4a28-aa97-cbf3f0c79307:Screen_Recording_2025-06-06_at_3.18.55_PM.mov)

# Testing

Even though we can evaluate the models' medical accuracy using the AMEGA benchmark, we still need to test our agent to make sure it's correctly interpreting instructions and using the appropriate tools.

We created our own set of 60 questions to evaluate the agent’s ability to use the correct tools in different scenarios. It’s important to note that this test doesn’t measure medical accuracy, it only checks whether the agent calls the right tools based on the prompt.

Here are a few examples of the types of questions we used:

* *“What is my average heart rate over the past week?”* — the agent should call a tool to get a statistic.
* *“Show me a visual representation of my steps from last month.”* — the agent should call a tool to generate a chart.
* *“Is walking better than running for heart health?”* — no tool needed; the agent should just respond in natural language.

![Screenshot 2025-06-09 at 4.43.51 PM.png](attachment:51a67090-b364-4eb2-817f-a6d092526bda:Screenshot_2025-06-09_at_4.43.51_PM.png)

The test results showed that the agent made the correct tool call in 50 out of the 60 scenarios, giving it a success rate of about 83%. While there's still room for improvement, especially in edge cases or more ambiguous prompts, this is a strong starting point for an on-device health agent.

# Conclusions

So, is it possible to create a fully local AI agent? We’ve discovered that the answer is yes. Is it practical for the average user? Not quite.

Surprising no one, the fully on-device agent approach comes with limitations. It shares all the tradeoffs we discussed in the last blog—system requirements, long download times, and the large storage space models need—and adds a few new ones. Small models handle simple tasks quite well, but things get tricky when they're faced with too many instructions or options, like choosing between multiple tools.

But if privacy concerns outweigh the less-than-ideal user experience, going fully local is definitely an option worth exploring.

What’s more, small models are improving almost daily: getting smaller, faster, and more capable. Start building a local agent now, and in a month, the tech might already be better suited for it. Then again, no one really knows where things will land. But that is part of the fun.