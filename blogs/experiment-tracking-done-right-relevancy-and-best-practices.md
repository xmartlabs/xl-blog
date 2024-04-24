---
title: "Experiment Tracking Done Right: Relevancy and Best Practices"
subtitle: " "
permalink: experiment-tracking-machine-learning
featured: true
date: 2024-04-04
category: machine-learning
thumbnail: /images/portada-experiment-tracking.png
tags:
  - MachineLearning
  - ExperimentTracking
  - MLmodel
  - MLFlow
  - ClearML
author: gabriel-lema
---
## What is experiment tracking (and why is it important)

Experiment tracking (ET) in machine learning is the process we rely on to avoid getting lost as we navigate through the intricate landscape of parameters, datasets, and performance metrics. It entails systematically recording and organizing experiment details, ensuring reproducibility and efficiency in the iterative process of building models. It is a core component of any ML project applying the best MLOps practices.

This blog explores the vital role experiment tracking plays in machine learning projects, offering insights into its relevance for practitioners of all levels. We will dive into the goals of tracking, what should be tracked and how we are doing it at Xmartlabs, including some common pitfalls.

## The goals of experiment tracking

We can identify two main goals for experiment tracking:

1. **Reproducibility:** it refers to being able to reproduce what you ran at any point in the past. You might want to run a new experiment with the same set of dependencies, code, data, random seeds, and everything to get the same result, or you might want to tweak some parts of it, leaving the rest unchanged. These are some reasons why it is important to be able to reproduce experiments while developing a model:

   * Faster development: being able to reproduce the entire workflow accelerates the testing and refinement of models.
   * Collaboration: new team members should be able to effortlessly start working on someone else's experiments and contributing to model development.
   * Recovery: it's crucial to be able to go back in time and understand what was done, what parameters were used to create a model, and correct in case of any errors
2. **Model improvement**: A good experiment tracking tool should allow you to visualize the most important aspects of any training run so that you can analyze what can be done to improve the model. To accomplish this, the tracking tool should display:

   * Metrics
   * Intermediate results (for example, model outputs)
   * Model parameters and configuration

Finally, the tool should allow you to compare two sessions in terms of changes in both inputs, such as code/parameters/data, as well as the output, such as metrics/results.

Having a nice UI that lets you look at past experiments and compare metrics /parameters with a recent one will help you understand where your model is failing and what new possible experiments to try out.

![](/images/experimenttracking-asset1.jpg)

## What should be tracked?

To achieve the goals mentioned above, it is critical to track the following elements for each experiment:

* **Code:** the exact code that was used to run the experiment.
* **Parameters:** and configurations that can be tuned to improve a model.
* **Dataset**: the exact data that was used for training. Versioning datasets is important here. 
* **Metadata**: the reason you are experimenting. You can even include the expected output.
* **Environment:** Docker containers and libraries (with versions) that are installed.
* **Hardware**: which GPU or CPU, amount of RAM, etc., was used to run the experiment.
* **Model output:** and possibly some intermediate results.

All of these points are essential to **reproducing** any experiment you've done in the past.

## Choosing the right tool for experiment tracking

So, how do we accomplish all of this?

There are many tools out there that have been designed to help solve all these problems. But there are also ways to solve this without any specialized tool or library. In this section, we dive into some differences between using a specialized tool and manual tracking.

Most ET tools will offer an easy way to track experiments by assigning them a name, together with their parameters and training metrics. Some will also track your code and datasets. Some of the tools will allow you to do all of this automatically without you having to explicitly log anything unless you have some extremely custom use cases. Most tools will also offer nice-looking dashboards to compare experiments and review results.

One important decision you will face is whether you want to use a paid service or an open-source solution and host it yourself. Some very powerful open-source libraries like [MLFlow](https://www.mlflow.org) and [ClearML](https://clear.ml) can be hosted for free. There are also many platforms offering a small free tier where you might be able to work on a single project for free before needing a paid subscription.

For most use cases, the existing tools have everything you need and are quite easy to use. However, there will be some costs associated with them, either hosting (and maintaining) an open-source solution or using a paid managed option. Therefore, for some projects, you might be tempted to use something like Excel sheets for experiment tracking, but we don’t recommend that unless it is a really small, short, and low-budget project.

If no existing tool matches your requirements, then you might be tempted to develop your own solution. Just be sure you research the existing options well before engaging in this, as current solutions are complete and still growing.

![](/images/experimentaltracking-asset2.jpg)

## How we are doing it

At Xmartlabs, we've been mainly working with [ClearML](http://clear.ml/). It allows you to start tracking your experiments by adding two lines of code.

```
from clearml import Task 
task = Task.init(project_name='your project name',							   
task_name='your task name')
```

It works out of the box with most common ML frameworks (PyTorch / Tensorflow / ScikitLearn / XGBoost), meaning you don't need to change your code to automatically start logging metrics, plots, and models. For cases that are not supported for automatic logging, you can still use some functionalities to manually log anything.

Additionally, it automatically stores all the information about:

* the code:

  * Git repository
  * Git branch and commit
  * Local workspace code changes on top of the latest commit
* the environment:

  * libraries (conda | pip )
  * docker container
  * environmental variables
* model parameters and configurations
* execution info:

  * hardware info (i.e., GPUs)
  * date
  * user

Even after having all this info available in your experiments' metadata, a couple of things could go wrong. Let's list a few of the most common here and the way we finally were able to avoid them.

### Common pitfalls

**Missing files in your repo**

* You designed and implemented an experiment. You wrote some functions and forgot to commit some new (untracked) files. If you run the experiment locally, this would go unnoticed.
* You locally created a branch and ran all your experiments successfully but never pushed it.
* You loaded a dataset that is only present on your computer, in some relative folder inside or outside your repo.

**Missing libraries in your metadata**\
You depend on a certain library installed in your machine, but since it is not a Python library, it wouldn't be tracked by ClearML. Or maybe a Python library that ClearML thinks can be installed via `pip install “ “` but it actually can't.

**Missing environmental variables**\
Your script may need to load some environmental variables to run that were available when the user ran the experiment locally but are unknown when running on a server.

**Missing data**\
You might have run a training script locally pointing to data on your disk that is not uploaded to the server. We strongly suggest creating a ClearML Dataset if you are working with datasets, or at least have your data remotely and load it from there. ClearML has several storage utils that work with the most common cloud service providers (AWS, GCP, AZURE).

### ClearML’s solution

To tackle all of these problems, ClearML provides a utility called `agent` that allows you to: 

* Reproduce experiments by recreating the environment specified in the task's metadata.
* Scale your workflow by running several jobs in parallel. This, combined with the ease of changing the parameters in the UI, has a major impact on your development speed.

When running a task through an agent, it will go through the following steps:

* Clone the repo
* Checkout commit
* Apply git diff patch
* Run your script with the parameters specified in the environment specified (docker container or local)

Basically, an agent will get all the information of the task that was stored in ClearML and try to run the task. Therefore, we make sure that if an agent is able to reproduce your experiment, any team member would be able to do so, too.

<aside>
💡 Pro tip: once you’re sure your task works properly in your local machine, you can set the task to run remotely, and if you're unable to run the task remotely, then you've caught a future headache early (a great win for your team!)

</aside>

On the other hand, if the agent is able to run the experiment, it means you have everything you need stored in the experiment metadata in ClearML.

Once you're sure your agent can run your experiment well, you can set up more agents in your system to expand your workflow. You can use the interface to copy a task, tweak its parameters, and start it. This makes development much quicker and easier.

One last thing to keep in mind is that if you rewrite or delete a git branch, this will break reproducibility. The way we avoid this in Xmartlabs is once we’re sure we’ve obtained a good baseline to start running some experiments, we merge our changes to one of the main branches (dev, main). Since these are never rewritten, we make sure that experiments will be reproducible at any point in time. If it is not possible to run the experiment on the develop/main branch for some reason, we tag the commit with the following format: `experiment/<identifier>`. This will ensure the commit is kept in the git history. One last dirty hack would be to run everything from one of the main branches, but making sure you’ve added all your new files to the index but never committing them, before running your main script.

![](/images/experimenttracking-asset3.jpg)

### Some best practices for each code, data, and metrics

Besides enabling us reproducibility, we want our ET tool to allow us to quickly identify quick wins and organize our experiments in a way that fosters quick development.

ClearML allows us to create Projects to separate groups of tasks that share one common goal. Whenever possible, you should define which is the metric that will guide your development and track this metric across all your experiments. At the same time, you have a handy mark-down editor to create an overview of your experiments where you can easily link plots / images from the experiments into this view, and it will serve you as a journal to keep track of what you’ve tested and why. A Report tool is also available so you can easily share results with the rest of the company.

To better organize your experiments, you can add a tag to them, for example if you started working with a new model architecture, you can use the tag `zephyr-7b` . Tags can be added from the UI, there is no need to define them in the script.

If you’ve created a new dataset, you should track the script that creates it and tag the experiment with `dataset_name:dataset_version.`

After creating the dataset, you should register it as a ClearML Dataset, and load it from there in your experiments.

## Conclusion

Model development is a hard task, but thanks to the experiment tracking tools readily available, it becomes much easier. As with any other software development task, it’s important to start developing good habits from the start:

* Make sure your experiments are reproducible by using a remote worker.
* Write down what experiments you are doing, and also those that you decided not to do and the reasons behind them.

Hopefully these tips will help your future self or some other team member be able to continue your work without a lot of friction, avoid repeating experiments, and have an idea of how the project is developing at any point in time.

> 💡 Learn the intricacies of AI and how to manage sensitive data responsibly to ensure safe AI innovation from leading experts!
>
> Register now to [secure your spot](https://lu.ma/wuajojk8)! ✅

![](/images/linkedin-google-forms-1.2.png)