1. My process 
- This was an idea I had already been thinking about developing for a while. As soon as I decided to fully commit to building it for this assignment, I created a Google Form to collect data from my friendsand included clear permission checkboxes. I specifically collected PDF resumes, LinkedIn URLs which I used to downlod pdfs of their profiles (for my own profile, I exported all of my LinkedIn account data), personal website or portfolio URLs, personal blog URLs, Devpost account URLs, and YouTube URLs, along with a few other sources that I did not use this time around.
- Reserched rules around scraping different platforms and tools to assist said process
- Used Google Collab for extracting information from PDFs: resumes and LinkedIn profiles saved as PDFs. For the other sources, used Antigravity agents to scrape data directly from websites like personal portfolios, blogs, Devpost, and YouTube.
- Tested full process first on my own data: extracting, json making, vectorizing, then chat.
- Implemented frontend
- Repeated for Sergio (+ plan to do for at least the 4 other friends)

2. AI tools and strategies I used + why
- Stitch to create UI mockups
- PyPDF2 for extraction of info from PDFs
- Gemini in Colab to debug my PyPDF2 and Github API code
- Antigravity agents for scraping data from personal website, blog, Devpost and Youtube 
- Antigravity to organize and structure jsons
- Gemini in Colab to vectorize and build RAG pipeline
- Antigravity to implement everthing together

Overall, this project was a major step up for me.
Because I was working with personal data that my friends trusted me with, and because I plan to eventually work with engineers to fully develop this project, I intentionally chose not to rely entirely on full agentic development.

Instead, I worked step by step and kept many parts manual. I personally handled file creation, folder organization, and naming conventions. I also chose to build the backend inside Google Colab because it kept the environment simpler, avoided overwhelming file structures, and gave me access to free GPU resources.

It definitely took much longer this way. It took more than 8 hours just to finish testing everything in Google Colab using only my own data. Then it took at least another 4 hours to build the frontend and connect it with the backend, plus another 4 hours to create JSON files for five additional people.

In total, the project took well over 16 hours. It was difficult, but absolutely worth it.

3. Changes from pre-113
Before this course, I did not know what RAG was, and I had very little understanding of backends or deployment.

I was also too intimidated to download or use agentic AI tools. I mostly relied on copying and pasting prompts into browser-based LLMs and hoping for the best.

Now, I feel significantly more confident and like I have more options for bringing my ideas to life, even if only partially, before handing them off to engineers. Instead of trying to explain ideas through words or terrible sketches, I can now build functional prototypes that communicate the vision much more clearly. 

4. Had I had more time...
- Make the entire pipeline far more automated so it could realistically process thousands of participant profiles for next year’s hackathon, likely by implementing stronger NLP workflows
- Improve the current JSON generation process, since right now I still need to manually name files or combine partial outputs from Colab and Antigravity using Gemini
- Experiment with different prompts and models so the output matches exactly the structure and tone I want
- Create synthetic participant data based on real CMU majors, clubs, and student organizations for better testing
- Implement chat history by storing conversation details in a database and passing that context into future queries so the assistant remembers previous conversations
- Build an account login system so the platform understands who the user is and can personalize recommendations accordingly
- Add stronger guardrails, such as character limits for user queries or preventing users from pasting external links directly into the chat input