Tool: Antigravity
Model: mainly Gemini 3 Flash 

# Build UI (*used Stich)
Design UI mockups for each possible page of my new product called Re:collect. While it is a typical AI wrapper product, make sure to not make it look like just another chat-based LLM like Gemini or ChatGPT. Take simple, minimalistic but stylish notes from Google or Apple. Re:collect is an AI-powered active intelligence layer that transforms static directories into dynamic discovery engines. By synthesizing fragmented data from LinkedIn, GitHub, and research repositories into a RAG-based chat interface, and providing recommendations paired with transparent logic, personalized outreach templates, and proactive recommendations, we enable people to move beyond "networking by fate". Some key features organized in rough userflow order: Log in with Terrier credentials Data importing Users give explicit consent  Upload resumes, Linkedin export data, social media account links etc.  Land on main page= chat page OPtion to open saved or pinned chats or start new one For each chat, has the ability to turn on proactive alerts eg) 3 days before the hackathon, one of the participants newly posted update to Linkedin about new ML internship -> gives new recommendation In a chat, type in question. Get detailed output from model in mostly text form but with interactive contact cards and easy to copy and paste 1liners.  Every output needs to include the following A list of best candidates in order of likelihood of match Explanation of the logic behind the candidate selection Copy-paste ready + personalized “warm intro” drafts to reach out to them  Clickable links that look like cute icons to their public data eg) Linkedin or portfolio, resume etc. When click on contact card should open popup or sidebar of their actual contact card (the same thing a user would see had they typed up their name in the directory) Other pages  A semantic search directory page Simple search bar and filters that pull up differentg contact cards Can take not only names but field of expertise “medicine”, job position eg) “software engineer” etc. but nothing too long An interactive map type visuals that shows how people are similar or connected Use case: What fields do participants (of a Hackathon) have most expertise A page that records and allows revisiting of details of proactive alerts

# In colab notebook, handle PDFs (resumes + Linkedin resumes) and Github
*** coded myself with tutorials and reference websites eg) https://www.geeksforgeeks.org/python/introduction-to-python-pypdf2-library/ and 

What are some tools and strategies I could use to automatically detect the person's full name from their resume? It is usually the first few words on a resume but it can also be different.

How to update a json file without recreating a new file?

# Use Antigravity agent to scrape data from other site + my Linkedin exported data folder
I have exported my own Linkedin account data and stored all csvs in a folder called Rion_LinkedInDataExport_02-20-2026/. Extract all relevant text from it and add that information at the bottom of rion_kurihara_resume.json. 

Now go to the following 2 urls and extract text information.
https://rionkuri22.github.io/
https://www.youtube.com/channel/UCa3vbcjEPU0uZpjXmRS2UfA
Add info at the bottom of rion_kurihara_resume.json. 

Retry going to https://rionkuri22.github.io. You should also getting info like speaks, loves, thinking about and the number of cities that have travelled to.

# Combine output into 1 json
See rion_kurihara_resume.json. Right now the json is split into sections like resume then GitHub etc. and has data from each stuck under those speicif sections without having a joint projecvts section for example.
Create jpoint sections split by content if/when applicable. Do not delete any information even if similasr or dupliocate information. Make sure each line/section lists its exact source eg) github, youtube. 

# Vectorize
I have a json file and a pinecome instance already ready to go. Use gemini-embedding-001 on it with my Gemini API key.

# Test as LLM
I just queried What is Rion's experience with deploying working projects? based on my json and am let down by the output
Based on the current records, Rion Kurihara has experience building and working on projects such as the "Python CLI Quiz App," which was specifically designed to test a Two-Agent Workflow, and "rionkuri22.github.io."
However, the provided records do not explicitly detail their experience or track record regarding the deployment of these projects. Therefore, I don't know the specifics of their deployment experience based on the current records.
I wanted it to at least list my personal website as having been deployed because there is a url. It should have also noticed "shipped" and "in development" tags in the projects section of my personal website. Another hint would have been my resume where it says the user count after launch for CollegeCart which I am a founder for.

# Implement frontend
Read SPEC.md in this project and create all necessary files to achieve the goal. After creating the files, run the site to verify it works without errors.

Open http://localhost:3000 and Go through SPEC.md and check that each request is matched. Return a summary of any errors or visual discrepancies.
Especially make sure the following:
1. Landing page (Chat) loads correctly with new Scotty logo and user icon that renders correctly. It should have design that replicates /docs/mockups/chat_mockup.png.
2. Go to search and check if Rion Kurihara's card is visible in the search page (as it is the only user json provided.

Make more changes to the UI. 
- Make colors used in the column on the very left use a combination of white adn the grey of the query input bar instead of the navy which is a color that is not used anywhere else in the website.
- Make the navigation bar stretch all the way across the screen even to the top of the vertical bar on the left and above its upmost "new chat" button. The mockup does a great job of this. Reference the chat_mockup.png.
- The scotty icon should be used to replace the red square with three white lines next to the logo.
- Use the dark red color used on the site already for text lie "TARTANHACKS 2027" to more clearly signify if on chat or search tab.
- Also reconsider positioning of the chat and search tab buttons across navigation bar as make the other changes. 

# Other
Help me understand the strucure of this whole repo. Clearly the UI is managed here but what about the vectorization, RAG and hidden prompts? I origianially did all that in Google Colab and pushed a copy of that notebook here but if I want to make a change where do I go?