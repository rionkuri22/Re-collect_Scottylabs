# Overview
Create UI for Re:collect which is a smart AI layer for community directories and integrate with backend RAG which uses Pinecone db and Googl Gemini. 
See .env.local for API keys. 
Persistance is not expected for this MVP.

# Pages
It should have 2 pages. 
1. Landing page= chat. 
- See /docs/mockups/chat_mockup.png for general layout but make the following changes. Keep in mind the content is a filler.  
- Change logo in top right to /public/scotty-logo.png
- Change user logo used in top right corner and comes up next to user query to be /public/user_icoon.
- Change red text that is currently "CMU EDITION" under the title "Re:collect" to say "TartanHacks 2027"
- Delete "Map", "Alerts", search bar and bell icon on navigation bar at top. 
- Delete plus icon on the very left of the input bar at the very bottom
- Linkedin and resume icons are examples. That area should have clickable icons that jump to url or pdf of respective documents provided about person in json. Only create icons for the sources in that specific person's json.
- Should open blank with nothing in recent chats or pinned discovery. 
- When user sends first query, should create addition to "recent chats" with the chat title being first few words of the conversation. Clicking "new chat" button should also start new chat. 
- Hovering on a chat under "recent chat" should show menu with options to "rename", "pin" and "delete". "Pin" should move chat from "recent chats" to "pinned discoveries"
- Hovering on chat under "pinned discoveries" should show menu with options to "rename", "unpin" and "delete". "Unpin" should move chat from "pinned discoveries" to "recent chats"
- When answer requires recommending people, create profile card for each person. But otherwise, just give text output. 

2. Search page= semantic chat.
- See /docs/mockups/search_mockup.png for general layout but make the following changes. Keep in mind the content is a filler.  
- Maintain all changes to navigation bar from landing page= chat. 
- By default, should show cards for each person in RAG database in alphabetical order. 
- When type in search bar and hit search button should filter and only return cards of people whose name contains the query. The search should support not just names but keywords like majors, field names eg) ML etc.
- Keep open profile button but dont go anywhere or do anything. On its left should have icons. Linkedin and resume icons are examples. That area should have clickable icons that jump to url or pdf of respective documents provided about person in json. Only create icons for the sources in that specific person's json.

# Error handling
- Create error messages for different scenarios like when API quota hit, 0 information in database eg) question about the weather.