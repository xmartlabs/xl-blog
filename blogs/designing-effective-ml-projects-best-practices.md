---
title: "Designing Effective ML Projects: Best Practices"
subtitle: " "
permalink: effective-ml-project-design
featured: true
date: 2023-11-20
category: machine-learning
thumbnail: /images/blogpost-cover.png
tags:
  - MachineLearning
  - MLEngineering
  - MLmodels
  - ProjectDesign
author: mathias
---
In the dynamic world of machine learning (ML), success relies on more than just advanced algorithms and vast datasets. Reaching time-constrained objectives requires a thoughtful process. At Xmartlabs, we've learned the importance of involving Machine Learning Engineers early in an ML project. This proactive approach ensures that the project's foundation is solid right from the start.

Imagine investing weeks or months in a complex ML model, only to discover later that it doesn't fit the real-world application. This can lead to frustration and wasted resources. ML model suitability depends heavily on the specific use case, making early ML Engineer involvement invaluable.

In this blog post, we’ll present the key steps in designing effective ML projects. We'll illustrate these principles through practical examples, showing their application in one of our projects, BingeWiz. BingeWiz is a movie recommender that you can check out [here](https://bingewiz.xmartlabs.com/). You can read more about its [system architecture](https://blog.xmartlabs.com/blog/deploying-a-recommendation-system-using-fastapi-tf-serving-and-feast/) or [](https://blog.xmartlabs.com/blog/deploying-a-recommendation-system-using-fastapi-tf-serving-and-feast/)[model design](https://blog.xmartlabs.com/blog/tf-recommenders-encode-user-watch-history-using-openai-embeddings/) in our blog.

## Frame of work: Project objectives and requirements

The first thing in an ML project is to **set the objectives and requirements clearly**. Objectives might be related to achieving one or multiple metric thresholds. Or maybe you want to test out some framework or library. If it’s the first iteration of a certain system, then you might not have a metric threshold as an objective, but you might target building a system that works reasonably well to deploy and which can be further improved later on. Whatever your objective is, it’s good to be clear about it from the beginning because it will influence your decisions from here on.

It’s also important to **know the requirements you are working with**. Requirements can include model size, inference time, or GPU (or other specialized hardware) support. For example, if you want to deploy the model in a mobile app, then model size is important as models of several hundreds of MB or even GB might drive users to uninstall your app. In that case, you will probably be able to set a loose maximum target model size from the beginning of your project, and you should consider that when choosing model architectures. Playing around with models that weigh many GBs might just be a waste of time.

**BingeWiz:** With BingeWiz, our main goal was to build an end-to-end recommendation system that worked reasonably well. We didn't set a metric threshold as a condition for a successful project. We had some additional requirements, though. There’s a considerable difference in the cost of running a live recommendation system on CPU vs. GPU in the cloud, so we wanted the system to be completely deployable on CPU. This doesn’t mean that it necessarily needs to run on CPU, but this possibility should be available. In combination with the selected hardware, we wanted live inference response times not to affect the user experience of the website. This meant that the system, even running on CPU, should return responses in under 400ms.

![](/images/frame-2608206.png)

## Data understanding and preparation

After defining objectives and requirements, the next step is to **know the data**. What data is available? We won’t be able to train a model without data. We need to analyze the data and understand correlations to see if it’s viable to build a model that accomplishes the objectives. We might reach the conclusion that it is not viable to reach them and stop the project or pivot in a different direction. During this step, we might reframe the problem we want to solve.

However, if we think that the data is good enough, we can process and format it into a dataset ready for model training. It’s important for the **dataset to be versioned and reproducible**. Modern dataset versioning tools can handle much of this automatically when used correctly. This is important so that we know on what data we ran each experiment later on.

**BingeWiz:** We used the MovieLens 25M dataset to get user-item interactions and complemented that with movie metadata from the TMDB website. This provided us with multiple features to build a model. Initially, we selected the ones that appeared most promising and later incorporated additional features once we had the model training pipeline operational.

## Metrics that correlate with objectives

Choosing metrics that align with the project's objectives is crucial. Otherwise, you may end up developing a model that excels in certain metrics but falls short of fulfilling its intended purpose.

It’s also good to conduct research relatively early in the project to determine the specific metric you're targeting. There might be a group of metrics that you care about, but make sure you know how you will evaluate your models to know exactly which experiment or optimization is useful or not. Having multiple metrics can make this ambiguous, so you might want to combine them into a single metric.

**BingeWiz:** We chose to optimize top_100_accuracy for the retrieval model and RMSE for the Ranking model even though we also measured NDCG and MRR for the latter and AUC for the retrieval model, among others.

## Research and evaluate a few model architectures

When building a new model, you’ll most likely start by researching the current state of the art. While doing this, you should keep in mind the requirements that were defined at the beginning of the project. It’s likely that you can discard several good models because they don’t fit your size or speed requirements. You can then **pick 1-3 pre-trained models or model architectures** to build upon.

It's important to **have your experimentation setup ready**. You should be able to quickly run some tests, probably in notebooks for interactive testing. Make sure the results look alright and evaluate if meeting the objectives looks viable. You might find that the data is not enough or a different dataset is needed.

**BingeWiz:** For BingeWiz we researched common architectures for candidate retrieval and Ranking models. We ended up choosing a two-tower architecture for the retrieval model, which is also very flexible to try out many experiments. We chose a DCN (Deep & Cross Network) for the ranking part. Many of the first experiments were done in Jupyter notebooks, but we converted the code for model training to Python files, which we could call from the command line prior to starting with the heavy business of model tuning.

## Building the modeling pipeline end-to-end before diving into hyperparameter tuning

Before diving into model tuning, which, if not time-boxed and oriented towards specific ideas, can take virtually forever, it’s convenient to **build the whole model building pipelines end-to-end**. This means training a baseline model and evaluating it on the validation/test dataset. Do the metrics return reasonable results? If not, there might be a bug somewhere.

Depending on which platform you want to deploy your system, it’s suggested to test optimizations and conversion to some specific format like TensorRT or TFlite, if required. Validate that its inference time and final model size fit within your requirements. Size optimization techniques such as quantization or pruning can be tested. If you cannot get into the required limits, you might have to switch model architecture, and you should know this before spending time tuning the model’s hyperparameters.

**BingeWiz:** As mentioned before, we wanted our system to run well on CPU. This was one of the reasons why we ditched NVIDIA Merlin in favor of TF Recommenders. Not that Merlin doesn’t support CPU inference, but it required some compromises which we didn’t want to make. The retrieval model needed to be exported with an index of movie embeddings. We could test model size and inference time on CPU before tuning the model to validate that the solution was viable.

## Model hyperparameter or dataset tuning

After defining objectives, metrics, and model architecture(s) and implementing the entire framework needed to evaluate and deploy the models, it’s time to tune the model’s hyperparameters. All experiments should be properly tracked in an experiment tracking tool that allows reproducing results. It’s also important to version the training dataset and the code used to produce it, even more so if you are planning to experiment with different ways of preprocessing or formatting data. Sometimes, **tuning how you preprocess your dataset has a greater influence on the model results** than tuning the hyperparameters.

As hyperparameter tuning and model changes can go on indefinitely, it’s advisable to plan beforehand which ideas you want to try out, even though some ideas might appear as experiments are being made. It’s important to ditch an idea that is not working at the right time and not try to make it work at all costs. On the one hand, you must make sure that you implement it without bugs, but if the result does not improve, then it is time to move on.

**BingeWiz:** In our experience, we found that decisions we made regarding how we grouped and preprocessed data had a big influence on the results. So, we went back to the preprocessing step a few times to make changes that influenced our models. Keeping the model fixed and tweaking the data has gained traction as a data-centric model building. This increases the importance of data versioning. We also tweaked our model’s architectures, adding layers, which sometimes increased the model size considerably. As we had the whole model pipeline built, we could quickly check whether such a change was still viable with respect to the deployment requirements.

## Model deployment

After a model has passed validation and is good enough to be deployed, you want to see it in action. If you followed the previous sections, you might have already decided and tested how you will serve the model. It’s important to find a compromise between **cost and speed** when choosing where to deploy a model. Some models might run just fine on CPU and you can save a lot of money. However, it’s necessary to plan for when the user base scales up, and the ML system needs to be scaled up. While for some systems, automatic **scalability** might not be necessary from day 1, it should still be thought about to avoid having to hurry to a solution when the workload increases too much.

Another crucial aspect is **model monitoring**. To know that your model effectively works in production, you need to monitor it. A good monitoring should show you that your model works in production just like when you experimented with it and that it is returning results in a timely manner. It should also tell you when it would be good to retrain your model on newer data. Check out our more in-depth look at [model monitoring](https://blog.xmartlabs.com/blog/ml-model-monitoring-boosting-performance-and-reliability/) for more about this.

Integrating the ML model or system into an existing application is also part of the deployment step. No matter the deployment platform, you must properly document the inputs and outputs your system requires. But other aspects of the integration will depend on the chosen platform. For example, when deploying to a mobile app, special care has to be placed on the model inputs preprocessing because that will have to be done in different programming languages and possibly by developers not used to such data manipulations.

On the other hand, when deploying to the cloud, you might choose to build a Python component that connects the components of your ML system and offers a single interface to whatever service will make use of your system.

**BingeWiz:** We deployed BingeWiz to the cloud and added a small Python FastAPI service that handles the interaction between all the components of our recommendation system. This allows the backend, managed by a different group of developers, to have an easy and small interface to this system.

As mentioned earlier, we chose to go with a CPU deployment as that saves a lot in costs and works fine (in that the latency is low) for a relatively small user base.

![](/images/frame-2608211.png)

## Conclusion

It is good to think ahead when planning an ML project. In this blog, you can see that over and over again. This will save a lot of lost time and produce better solutions. From our experience, it is also greatly beneficial when people in different roles (like people who build and train a model and those who are responsible for deploying it) work together on designing of a solution.

You can witness the results of BingeWiz by heading to [bingewiz.xmartlabs.com](http://bingewiz.xmartlabs.com), where our ML experts did a fantastic job. If you want them on your team, don't hesitate to [reach out](https://form.typeform.com/to/D1PhDJIR), and we'll become part of your team from day one!