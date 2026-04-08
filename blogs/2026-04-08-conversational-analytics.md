# From Dashboard to Dialogue: How We Brought Conversational Analytics to Our Client's Data

For years, our client's stakeholders navigated a familiar ritual: open the dashboard, locate the right chart, cross-reference a few filters, and piece together an answer to a question that had been on their mind since the morning standup. For straightforward queries like total sales by region, inventory levels at a glance then the dashboard did its job.
But the moment a business analyst needed something more specific like comparing inventory levels across two different periods then the workflow broke down entirely. And if the user needed to go one step further such as building a summary table by slicing the data with multiple filters the process quickly became time-consuming and impractical.

## The Challenge: When the Dashboard Isn't Enough

Our client is a global operation, with business analysts spread across markets worldwide each focused on their own specialty. Their Looker dashboard is well-built and serves its purpose. But it was designed around a fixed set of views, and that's the core constraint: the teams responsible for maintaining it can't keep up with every ad-hoc need a business analyst has. Adding a new view, filter or metric for each request isn't sustainable.
So when analysts needed data that fell outside what the dashboard exposed, the natural fallback was to go to the source, which meant filing a request with the data engineering team. This often led to additional requests for new data breakdowns tailored to specific analytical needs, further increasing the complexity of the system. Over time, the dashboard evolved into a much larger and harder-to-manage product, especially for new users, who had to navigate an increasing number of filters and configurations just to reach the specific data they needed.


This created a misalignment that everyone felt.  Data Engineers whose core value is building robust, reliable data pipelines shouldn't be spending time running ad-hoc queries for business analysts. And business analysts  whose core value is turning data into insight, should spend time doing analysis of the data, and not figuring out where data lived and how to access it.


## What We Built: Conversational Analytics, Grounded in Real Data

We created a Looker's Conversational Analytics Agent that was powered by the client's existing LookML models which already powered the dashboard business analysts used. They were now able to ask questions in plain language and get precise, data-grounded answers, without needing to understand the underlying data structure, table relationships, or filtering logic. This significantly reduced the dependency on both data engineering and BI teams for day-to-day analytical needs.


Before: A fixed set of supported queries, limited to what the dashboard already exposed. If the answer wasn't in an existing view, it wasn't accessible. If the user needed to combine different metrics into a table, it had to be done manually.  Additionally, navigating multiple filters and views to reconstruct a specific analysis made the process slow, error-prone, and highly dependent on each user's familiarity with the dashboard.


After: Full coverage across every metric and dimension in the data model. Exploratory, specific, cross-dimensional questions. We were also able to join with other tables (like date related) to get more relevant data directly to the user such  as different periods (seasons, quarters, etc). Instead of the user needing to select all the weeks for current year and look at the sales value in the dashboard, it would just ask "What's the total sell out value this year?" And if the user needs the sellout value of each of the last three years, it will show a table with all the relevant metrics (sell out, growth, etc) discriminated by year. 

This approach not only accelerated time-to-insight but also standardized how metrics were calculated and interpreted across the organization, reducing inconsistencies between teams. It empowered business analysts to focus on decision-making rather than data extraction, while ensuring that all answers remained fully aligned with the governed data model defined in LookML.

The Before and After in Practice

Capability
	Before
	After

Query coverage
	Fixed dashboard views only

Limited to predefined dashboard views
	All metrics and dimensions in the data model

Full access to all metrics and dimensions in the data model

How analysts get answers

User Interaction
	Dashboard navigation or a request to data engineering

Manual navigation through dashboards and filters
	Plain-language conversation

Natural language queries via conversational interface

Time to insight
	Hours to days (if routed through engineering)
	Seconds

Real-time responses in seconds

Data Accessibility
	Requires knowledge of dashboard structure and data organization
	Abstracted complexity; no need to understand underlying data models

Operational Impact on data engineers
	Pulled into ad-hoc query work

Data engineers frequently involved in ad-hoc query requests
	Free to focus on pipeline work

Data engineers focused on scalable data pipelines and core infrastructure

Flexibility
Analytical Flexibility
	Rigid, view-bound

Rigid and constrained to existing views
	Open-ended and exploratory analysis across dimensions



## The Hardest Part: Adapting the LookML Model

The client already had a LookML model that was powering the existing dashboard. But our first tests returned poor results. The agent didn't understand terms that the company used in their day-to-day. 

Making the necessary changes to the LookML model so that the agent could use it effectively was one of the biggest technical challenges of the project. The model had to be structured in a way that let the agent understand relationships between dimensions and metrics, navigate explores correctly, and return meaningful results for open-ended, unpredictable questions and not just the queries the dashboard was designed to answer.
Since users weren't going to change the way they communicated, our mission was to get the agent to talk the way they did. That meant adding the dimensions in terms that users understood, instead of making them adjust to how the values are stored in the database. Additionally, we were able to bring all sorts of date related dimensions into the LookML model, because they knew about seasons, and quarters, and the data was stored on a week level. This way users didn't have to specify which weeks they were interested in, and just say, I want the data for Q1 2025 and compare it with Q1 2026.
What helped:
Bringing into the descriptions some of the possible values (1)
[1] Although in the latest changes introduced they added an exploratory step to be able to retrieve possible values a field might have.  They've also introduced the field suggestions for this. https://discuss.google.dev/t/what-s-new-in-conversational-analytics-in-looker/343075

### First Impressions (v1)

Accuracy held steady, but analysts flagged a significant workflow issue: they must repeatedly instruct the agent to consider only a specific subset of the data (e.g., 'Product X in Location Y'). Since the agent does not automatically retain this context across different conversations, the constant need to insert those filters became tedious and slowed them down.

Another issue was that users needed to copy the data into a spreadsheet to be able to further analyze it, and it wasn't as easy as it should be, just selecting the data and copying it to the clipboard. So they had to go to the explore and download the data as a CSV, to then be able to import it into a spreadsheet.

For those cases were the agent failed, our users would post a message to our Messaging app, and someone from the team would review it. The problem is that sometimes we didn't have the full context (for example if the question was the 3rd in the session, users wouldn't generally post their first questions.) This made the process sloppy, and we had to manually ask the user to fill the whole context.

### How it ended up: fully automated and monitored

We ditched Looker's Conversational Analytics UI and built our own. The main reason was that it didn't provide with the level of observability and tracing we needed. To accomplish this we used as backend Gemini Data Analytics SDK.
In the UI, we added the possibility to add specific user instructions in plain text as well as a check box list of possible generic filters that could be selected and that the agent would automatically incorporate into the context. These options were saved in a table so that next time the user didn't have to specify their needs. This way we solved the issue of the agent not automatically retaining this context across different conversations.
Every question was tracked as well as its answer. The user could also submit a feedback, and all the traces would be stored in a table.
We created a Pub/Sub to automatically pull new feedbacks from the table, and send a message to our Messaging app as well as create a ticket in Jira. In the ticket it would log the query, answer, feedback, and trace id. We would then go to our table and get all the relevant context. Users didn't have to create tickets, and they didn't have to specify what the context was. Everything was automatic.

Another huge improvement for the users, was that they no longer had to go through the hassle of downloading the data as a CSV, and then importing it into a spreadsheet. They were able to simply select the data and copy and paste it directly from the web interface into their spreadsheet.

We also incorporated [Prism](https://github.com/looker-open-source/ca-demos-and-tools/tree/main/ca-agent-ops-prism) into our workflow, allowing us to create automated tests for the agent. For a set of 100 questions we would let the tool know what are the expected dimensions and filters that need to be selected, and compute the accuracy.

## What's next
The agent was only released for a selected group of users and therefore we were able to manually inspect what was failing. As we get more confident with the performance of the agent, we will target more users, and at some point it will be impossible to keep up with all the feedback manually. 
We are interested in creating an agent that is able to pull the feedback (with the relevant context) and see if it can modify code/instructions and be able to test the changes using the Prism framework. **A pure self evolving agent.**.


We would then be reviewing those failing cases were the agent wasn't able to create the proper adjustments to the code/instructions.


## Conclusion

Conversational analytics isn't a replacement for dashboards but a complement to them. Analysts who want to explore data deeply still have the full power of Looker available. But now, when someone needs a specific answer the dashboard doesn't expose, they don't need to know who to ask or how the data is stored. They just ask.
