---
title: "Scaling RAG Systems: Challenges, Bottlenecks, and Real Solutions."
subtitle: " "
date: 2025-07-14
category: development
permalink: /scaling-rag-system
tags:
  - LLM
  - OpenAI
  - RAG
thumbnail: images/scaling-rag-system/thumbnail.png
author: nicoh, nico-fripp, gastonv
---

# Scaling RAG Systems: Challenges, Bottlenecks, and Real Solutions.

# 🧠 Introduction

In our last GenAI project, we faced some problems that we feel may be of help to many of you. The project was to build a RAG*(Retrieval-Augmented Generation*) system that worked on existing official documents, technical reports and product descriptions. The objective was, from this information, to generate new product proposals optimized according to the country, the profile of the person within the country and other relevant variables.

# ⚙️ Initial system architecture

## Tools used

- Language: Python
- Frameworks: LangGraph, LangChain, LangFuse
- Infrastructure: Azure App Service
- Vector storage: PGVector
- LLM: OpenAI

# 🎨 Context and modeling

We decided to model the solution as a graph because it allowed us to clearly represent information processing flow. In a RAG system with multiple data sources, different types of transformations and variable conditions (such as country, user profile, etc.), the logic can become complex. Using a graph allowed us to divide that logic into independent nodes, where each node represented a well-defined unit of work, and the connections between nodes explicitly defined the dependencies between tasks.

## Graph composition

![](/images/scaling-rag-system/graph.png)

**Retriever Node**

In order to better understand the network without going too much into the business  logic, the *Retriever* node  was responsible for obtaining the relevant information for the execution of the flow. For that we used an Asynchronous PGVector retriever, which consulted a vector base previously built from documents. These documents were previously processed and *embedded* using OpenAI embedding models. 

**Nodes A, B, C, D and E**

- Node A generated **9 different outputs**, each of which served as input for nodes B, C, D and E.
- These nodes performed further processing and, for each input received, produced a variable number of outputs - on average, about 9.

Finally, the *Final Result* node processed the final results.

## 🤖 Interaction with OpenAI.

Each node made requests to OpenAI using a *system prompt* accompanied by multiple inputs. These inputs could come from different data sources, people's profiles, etc. The amount of information could be very large, depending on the information the user wanted to process.

## Pseudocode of the initial graph generation

```python
add_edge(START, "retriever_node")
add_edge("retriever_node", "node_a")
add_edge(
    "node_a",
    ["node_b", "node_c", "node_d", "node_e"]
)

add_edge(
    [
        "node_b",
        "node_c",
        "node_d",
        "node_e",
    ],
    "final_result_node",
)

add_edge("final_result_node", END)
```

## 📈 Scaling the solution: First drawbacks

In simple scenarios, the system worked smoothly, even in the first releases of the system, where there were few country profiles, and little information to process, we had no problems.

However, as the volume of data grew, we ran into two problems that, combined, made the system unusable: on the one hand, the entire processing exceeded the time limit defined by Azure (we use Azure app Service, and for HTTPS requests, the connection is maintained for 4 minutes 20 seconds approximately); on the other hand, the size of the requests to OpenAI exceeded the limit of tokens of the *context window* (32k tokens), which made it directly impossible to process certain requests.

These two bottlenecks were related: the more data included, the greater the amount of processing required and the larger the size of the *prompt*, and therefore of the output. In other words, the greater the input, the worse the performance and the greater the risk that the request could not even be processed.

Faced with this situation, we decided to redesign the graph incorporating parallelization in certain edges (represented in blue). 

![](/images/scaling-rag-system/parallel-graph.png)

## Pseudocode of the graph generation after parallelizing.

```python
add_edge(START, "retriever_node")
add_edge("retriever_node", "node_a")
add_conditional_edges(
    "node_a",
    parallel_node_a_to_b,
    ["node_b"],
)

add_conditional_edges(
    "node_a",
    parallel_node_a_to_c,
    ["node_c"],
)

add_conditional_edges(
    "node_a",
    parallel_node_a_to_d,
    ["node_d"],
)

add_conditional_edges(
    "node_a",
    parallel_node_a_to_e,
    ["node_e"],
)

add_edge(
    [
        "node_b",
        "node_c",
        "node_d",
        "node_e",
    ],
    "final_result_node",
)

add_edge("final_result_node", END)
```

each of the functions `parallel_node_a_to_*`, is in charge of dividing the inputs coming from node A into chunks and distributing them in parallel to the corresponding nodes (B, C, D or E). An example of implementation of this function is shown below.

```python
async def parallel_concept_node_a_to_b(state: GraphState) -> list[Send]:
    send_list: list[Send] = []
    for elem in state.results_from_node_a:
        for country in state.countries:
            send_list.append(
                Send(
                    "node_b",
                    {
                        elem=elem,
                        country=country,
                    }
                )
            )

    return send_list
```

For this purpose, we used [Send](https://langchain-ai.github.io/langgraph/concepts/low_level/?h=reducer#send) from LangGraph.

Parallelization not only allowed us to distribute the processing load and reduce processing times, but also enabled us to divide the inputs into smaller *chunks*, avoiding exceeding the token limit of the *context window* without sacrificing the text quality generated by the LLM. In other words, we were able to allow the system to process large volumes of information without breaking down in terms of time or input size (in principle).

This led to more than 400 tasks running concurrently for certain graph inputs. This parallelization not only significantly reduced processing times, but also allowed solving one of the main bottlenecks of the system: the token limit of the OpenAI *context window.* By dividing the inputs into smaller *chunks* and distributing them in parallel executions, we avoided exceeding the maximum allowed per request.

However, despite that improvement, in cases with heavy processing we still exceeded the Azure limit mentioned above. To definitively solve this problem, we implemented data streams from Langgraph, which were then sent to a websocket, allowing us to maintain persistent communication between client and server, and avoid timeout errors. This solution involved backend and frontend adjustments to adapt to the new communication model.

# ❌🧵 **Limitations when scaling parallelization.**

At the time of performing a more exhaustive testing, we noticed that we had a new bug in the system. This time it was not related to `Azure`. The problem was that the logic defined in each node of the graph used `Langchain` to build chains, and those chains, in turn, invoked OpenAI models through the `langchain-openai` and `openAI` packages, which internally use `httpx` to make requests.

When we implemented parallelization, the number of asynchronous executions grew considerably -in some cases exceeding 400 concurrent tasks-. It was in this context that we started to experience ConnectionError errors.

This error was related to an `httpx` issue, which apparently fails when many requests are made simultaneously.

We were then faced with the following dilemma: 

- If we parallelized to the maximum, we would get errors.
- If we avoided parallelization, we exceeded the *context window* limit.

# ⚖️ Final solution: Find a balance when parallelizing.

Instead of taking parallelization to the maximum level, we decided to parallelize by grouping a certain number of elements in such a way that there is parallelization but it does not exceed the limits of the context window.

We went from 400 concurrent tasks to approximately 50. The *tradeoff* of this decision was that the complete execution of the graph increased by a few seconds. However, thanks to the fact that we had already implemented data streaming from LangGraph combined with WebSockets, this increase in time did not imply new errors and did not worsen the user experience.

Below you can see a complete execution of the final graph. 

- 812774 input tokens
- 187176 output tokens.

So we are looking at approximately 1M tokens per graph run.

![Screenshot 2025-07-08 at 3.33.35 PM.png](LEARNINGS%20(eng)%20230fbac623cd80818593f48514623cb1/Screenshot_2025-07-08_at_3.33.35_PM.png)

# ✅ Conclusions

Throughout the development of this system, we faced several technical challenges that forced us to rethink our architecture. Initially, the system worked well with little information, but as the data volume scaled, two critical limitations appeared: the time limit imposed by Azure for HTTP requests and the *context window* token limit in OpenAI models.

Network parallelization was the first major improvement. It allowed us not only to reduce processing times, but also to split the inputs into smaller parts, thus avoiding exceeding the maximum number of tokens allowed. However, pushing this strategy to the extreme - with more than 400 concurrent tasks - brought up new bugs related to  `httpx` .

This put us in a dilemma: if we didn't parallelize, the system would fail due to too many tokens or timeout; if we parallelized too much, it would fail due to connection errors. The solution was to find a break-even point. We clustered the data and reduced parallelization to approximately 50 simultaneous tasks, which allowed us to maintain good performance without system failure.