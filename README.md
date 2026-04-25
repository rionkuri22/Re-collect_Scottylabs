# Overview
I’ve often signed up for hackathons solo, posted desperate last-minute messages in Discord, and somehow managed to find a team just before the deadline. Most of the time, I wasn’t able to choose based on skillsets and interests the way I should have, and instead just ended up teaming with whoever responded.
This became especially frustrating when I worked on a project I was genuinely passionate about continuing after the competition, but my teammates were not interested in pursuing it further.

Based on such experiences, I built Re:collect to put the power back in the hands of people like myself: a platform where you can directly query a directory of participants, discover people with aligned interests and goals, and reach out to them intentionally.

This MVP was built with the goal of making it ready for real use at next year’s TartanHacks.

# Favorite feature
- Contact Cards: They still need significant improvement, but they are one of the key differentiators from general LLM-based tools. They are intended to give personalized and relevant summaries of the person, explain how they are linked to the user (went to the same high school etc.) and even suggest icebreakers for starting conversations. 

# How to run it 
1. Clone this repo
2. Install Dependencies
3. Configure Environment Variables: Create a file named .env.local in the root directory. Reference .env.example.
4. Run the development server and go to localhost:3000 

# How secrets are handled
- All private data, such as exported LinkedIn data and participant JSON files, are stored in separate folders that are gitignored
- ll JSON files are gitignored as an additional safety measure
- Pinecone and Google API keys are stored using Google Colab Secrets and .env.local, which is also gitignored
