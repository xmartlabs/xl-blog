---
title: "Streamlining Information: Crafting an AI Assistant at Xmartlabs"
subtitle: " "
permalink: custom-AI-assistant
featured: true
date: 2024-01-18
category: development
thumbnail: /images/portada.png
tags:
  - DigitalTransformation
  - DataAccess
  - ChatBot
  - AIAssistant
author: nicolantean
---
These enhanced steps underscore the complexity and thoughtfulness behind the development of the AI assistant, highlighting the balance between technical robustness and practical usability, ensuring that the assistant is capable of processing vast amounts of information and efficiently delivering relevant and easily comprehensible answers.

<!-- notionvc: 409ad200-f705-477c-8d64-ed6374f6d47d -->Nowadays it's almost impossible for any business or enterprise, no matter its size, to generate mountains of digital information. From manuals, playbooks, or CRMs, the easyness of generating databases means that we are often overwhelmed with information and procedures. But while generating them is easy, now the challenge lies in how we access this data, making sure it is really useful and implemented on a daily basis.

At Xmartlabs we found ourselves in this situation. We had an extensive engineering playbook with key information for various procedures. However, many times it wasn't so easy to find specific information without having to read several pages to really get what we were looking for.

That's why we developed an AI assistant with the ability to respond by taking only the playbook as a source of information, so that users get answers to specific questions but making sure that it won't go with information outside the official source (it won't answer things that could potentially be wrong or outside the company's guidelines).

In conclusion, what we aimed at was to be able to access company information in a very simple and comfortable way for the user, saving a lot of time searching in long documentations. Throughout this blog post we are going to explain the process of creating this AI assistant and demonstrate the results we obtained as well as the uses of similar technologies in different industries.

## Overview of the AI Solution

Our quest to improve accessibility to our vast documentation led us to develop a user-friendly AI assistant. This tool is designed to navigate our extensive information databases, providing precise answers to user inquiries. Let's dive into how we achieved this:

1. **Collecting Documentation**: First, we collected all the documents the assistant would use to answer questions. This included everything our organization had written about different topics.
2. **Breaking Down Documents**: Next, we split these documents into smaller sections. Each section focused on a specific topic. This made the text shorter and more focused.
3. **Turning Text into Data**: We then converted these sections into something called "embeddings". This process changes the text into a form that the computer can understand better based on what the text is about. These embeddings were stored in a database.
4. **Updating Regularly**: We didn't just do this once. We do it periodically to ensure the assistant has the latest information.
5. **Answering Questions**: When someone asks the assistant a question, the assistant turns this question into an embedding too. This helps the assistant understand the question in the same way it understands the document sections.
6. **Finding the Right Information**: The assistant then calculates which sections from the documents relate the most to the question.
7. **Creating a Prompt for OpenAI**: We create a special prompt for OpenAI with the related sections identified. This prompt includes the question and the related sections as context. We also instruct the assistant to say it can't answer if the information in the context isn't enough.
8. **Presenting the Answer**: Finally, the answer from OpenAI, based on this process, is shown to the user.

This approach ensures that the answers are closely related to the user's question, making our extensive documentation more accessible and user-friendly.

## Breakdown of the AI Solution and Some Considerations

In creating our AI assistant, we went through a detailed process, ensuring each part was made carefully to be efficient and accurate. From collecting all the documents to finally showing the answers, we paid attention to the technical details and how easy it would be for users to interact with it.

This section details each step, showing the important choices and thoughts that went into making our AI assistant both trustworthy and easy to use. Let's look at these steps more closely

1. **Collecting and Segmenting Documentation**: The initial phase involved collecting relevant documents like manuals and digital files and segmenting them into logical sections. A critical task was determining what constitutes a 'section' – ensuring that sections made sense and did not truncate important information. We achieved this by identifying the main headings on each page and considering the text under a heading up to the next as one section. This approach helped in maintaining the coherence and relevance of each section.
2. **Converting Text to Data and Regular Updating**: In converting text to embeddings, we explored two approaches: OpenAI services and running a public model. The OpenAI option, while efficient, had cost implications based on the volume of text processed. Also, embedding sizes are larger, which could quickly increase the database size, especially with a vast amount of documentation. Running the public model, on the other hand, offered a cost-effective alternative but raised considerations like the execution time. Regular database updates were also integral to keeping the assistant's responses up-to-date and accurate. Ultimately, we opted for OpenAI due to its superior performance, which significantly reduced the assistant's response time.
3. **Processing Questions and Finding Relevant Information**: This step was about transforming user questions into embeddings and finding the most relevant documentation sections. Accuracy in this transformation and the matching process was critical, as it determined the precision of the answers provided by the AI assistant. It was a delicate balance between understanding the user's query and finding the most pertinent information from the database.
4. **Creating Prompts for OpenAI and Presenting Answers**: The final step involved creating efficient prompts for OpenAI based on extensive research to ensure their effectiveness for the task at hand. We also configured the OpenAI call to limit the model's creativity, focusing on responding based on the provided context. Experimenting with different OpenAI models was part of the process to find the one that delivered the most accurate results. The presentation of answers was specially made to be clear and user-friendly, facilitating easy understanding and application by the users.