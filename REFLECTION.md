1. My process 
- Idea I had had from before. As soon as made up mind about commiting to building it for this assingment, created Google Form for collecting data with clear permission checkboxes and shared with friends. Specificaly got: PDF resume, Linkedin URL (for me, exported all my account data), personal website/portfolio site URL, personal blog URL, devpoost accont URL, Youtube URL among other things which not using this time around.
- Planned to use Google Collab for info extraction from pdfs (resumes and Linkedin profiles that that save as pdfs because scraping is not allowed) and agents on Antigravity to scrape data from the other sources. 
- Tested full process first on my own data
- Implement frontend
- Did the same for other 5 friends. After create json.

2. AI tools and strategies I used 
- Stitch to create UI mockups
- PyPDF2 for extraction of info from PDFs
- Gemini in Colab to debug my PyPDF2 and Github API code
- Antigravity agents for scraping data from personal website, blog, Devpost and Youtube 
- Antigravity to organize and structure jsons
- Gemini in Colab to vectorize and build RAG pipeline
- Antigravity to implement everthing together

3. Changes from pre-113
Did not know what RAG or backends, or deployment was.
Was too scared to download or use any agentic AI tools. Would just copy and paste from web-based LLMs. 
Now feel so much more confident and like have more otpions of ways to bring my many ideas to life, even if partially, before handing to engineers instead of trying to explain with words and terrible drawings. 

4. Had I had more time...
- Make the whole process more automated so that can realistically proecess thousands of accounts for hackathon next year probably by at least implementing NLP. Right now, need to name each json myself or after getting half of the output in Colab and then the other half from Antigravity agent, need to give to Gemini to combine them. 
- Play around with diff prompts and models. 
- Make synthetic data based on real CMU possible majors, clubs etc.