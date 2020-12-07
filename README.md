# web-dev-project

# About the project
This is a multiplayer chess game made for Dawson's college web development class. It was made by Guilherme Corrêa and Noah Labrecque in approxematly 30 days.  
Our goal for this project was to challenge ourselves in learning key concepts in networking and javascript.  
Because of certificate issues we aren't able to make our website interactive on our sonic acount, but you can try it out on this ip -> 70.26.238.78:8000.



# How to run locally
Requirements: Python 3.5+ <br/>
Python packages: <br/>
```
pip install psycopg2 websockets
```
## Starting the server
`python3 ss.py 70.26.238.78 34569`  
(In order to run it you need to be whitelisted in the database.)
 

## TODO
- [ ] Link buttons on homepage
- [X] Link github and sonic links in footer


## Chess engine
- [x] Piece movement
- [x] Black and White perspective
- [x] King validation
- [ ] Finish game
- [ ] Show taken pieces
- [ ] Clock

## Client-Server-API
- [x] Create a game
- [x] Join a game
- [x] Sync move pieces thorugh requests loop
- [x] Single request with server timeout.
- [X] Registration
- [X] Join / Create games
- [X] Board preview
- [ ] Reconnect with right turn


## Server
- [x] Accept POST requests
- [x] Handle multiple games at the same time
- [x] Reconnect system
- [x] stop password

## HTML / CSS
- [x] Lobby prototype
- [X] Main page
- [X] Login Page
- [X] Register Page
- [X] User page
- [ ] About Us 
- [ ] Lobby filtering/search

## Project Requirements



### General
- [ ] Test on several web browsers (Chrome, Firefox, IE, Safari) !!!!!
- [X] Upload to sonic server

### Technical Required Inclusions
- [X] Tables (For data/Images not layout)
- [X] Graphic title or logo on each page (Custom if possible)
- [X] Footer including (On each page):
    * Copyright/year
    * for each member:
        * Name (Clickable bringing user to current page on sonic account)
        * Student-Id
        * Sonic link to current page
- [X] Forms
    * logic/registration
    * Contact page (Email __AND__ Chat features in two seperate forms)
- [X] Menu Bar (home link must be first option, vertical or horozontal)
- [x] Must use icons beside text for menu bar options 
- [X] Each page must have favicon

### Layout and Positioning
- [X] Use html symantic elements +(Divs/Spans)
- [X] Use fluid layout (Flex...?)
    * (Structure, number of columns and exact layout is up to us)
- [X] Use (relative, absolute, sticky, and fixed) attributes to position different part of your layout

### Head Section
- [X] Minimum 3 meta tags (i.e. keyword , description, utf, ...)
- [X] Use any SEO/Search engine ranking tag
- [X] Titles for each page

### Content
- [X] Paragraph or heading on each page
- [X] Required Inclusion:
    - [X] At least one link to external site
    - [X] Simple rollover effects (:hover or image based)

### Styling/CSS
- [x] THREE external CSS files:
    * pagestyle.css to style the layout and structure of your pages.
        - [X] Font family/size for: body, paragraph, and heading text
        - [X] Attributes for link states I.E. visited, focus, hover, active
        - [X] Attributes for form element states (pseudo-classes) including different types of inputs.
        - [X] Table styling
        - [X] Background images/colors for containers   
    * menu.css to style all your menus (horizontal and vertical)
    * one css file called tabs.css to style the tabs (see tabs section) (?)

### JavaScript
On contact.html Page (last menu option) <b>(DONE)</b>
- [x] 4 tabs (adress, call, e-mail, chat)
- [x] adress and call tabs contain the adress and telephone numbers respectivly (no form)
- [x] e-mail tab: form appears where you can enter
    * Email adress
    * Topic of message
    * Type of text
    * Submit button
- [x] Chat tab:
    * message form
    * Send button

### Submission
* Once properly tested in your LOCAL DRIVE/420-120/, upload the whole project to your sonic account.
* Test the page remotely by pointing url to: https:// sonic.dawsoncollege.qc.ca/~YOUR_USER_NAME/420-120/Project/home.html
* Submit to LEA the entry (first) page only
* Put your name/id and the name/id of the other members
* Only one member must submit the page to LEA.
* However, all members must have the same copy of the project in their respective server account
* Deadline: DEC 1st

### Questions for teacher
* Can we use javascript for a simmilar but more advanced form system on another page instead of the contact.html page in the reqs

