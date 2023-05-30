# News Aggregator App

This is a web application project developed by a team for the course Programming Project Databases. The goal of the
project is to create a news aggregator app that collects and displays news from various sources, similar to Google News, Digg or The Factual.

## Table of Contents
1. [Introduction ](#introduction)
2. [Project Requirements](#project-requirements)<br>
   * [Client Background](#client-background)<br>
   * [Application Requirements](#application-requirements)<br>
   * [Technologies](#technologies)<br>
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)

## Introduction
The project is a team effort to develop a software product that applies the principles of the "Introduction to Databases" course. The objectives of the project include converting theory into practice, working independently in teams, planning work and distributing tasks, problem-solving skills, clear reporting on progress and choices, and developing high-quality software with a focus on usability, efficiency, and expandability.

The project is extensive, and the final software product will be evaluated instead of a written exam. The evaluation will be based on the delivered product, taking into account the above objectives.

This document contains an introduction, a section on the client, a description of the project requirements, and a section on practical matters and evaluation.


## Project Requirements
### Client Background
The client for this project is Froomle, a spin-off from the University of Antwerp that uses artificial intelligence techniques to personalize online newspapers. Froomle's software predicts the articles that are most interesting to each reader based on their reading behavior. Froomle's SAAS product is used worldwide by, among others, Het Nieuwsblad (BE), De Standaard (BE), Gazet Van Antwerpen (BE), De Tijd/L'Echo (BE), The Boston Globe (USA), De Telegraaf (NL), La Reppublica (IT), and Independent Online (ZA). The Head of Product and Head of Engineering at Froomle will be involved in evaluating the final product.

### Application Requirements
The project requires a web application that collects news from various sources and displays it to users. Only titles, descriptions, and photos are displayed, and users can click on a link to read the full article in a new tab on the site of the newspaper of the article itself.

The articles are presented in a simple layout, such as a list with articles stacked vertically. The order in which articles are displayed to a user is determined by a recommender system API, which uses various techniques to determine article relevance. A simple recommender system ranks articles by publication timestamp, while a more advanced technique such as collaborative filtering determines the order based on articles that have already been read by similar users. The similarity of users is calculated based on the number of identical articles they read.

One of the main challenges is that multiple news sources often publish very similar (or sometimes identical) articles. Only one version of such similar articles can be displayed, with links to the different news sources. A simple classification algorithm can be used to determine if two articles are similar enough to be grouped together by counting the number of similar words in the title.

### Our Application 

Welcome to our comprehensive news aggregator, where a world of information is at your fingertips. 
Begin your journey on our home page, your gateway to a vast array of news genres that we offer. 
At a glance, you will be presented with three articles per genre/topic, neatly ordered based on your selected sorting criterion. 
We offer three intuitive sorting methods: time, popularity, and recommended.

Time-based sorting displays articles chronologically, according to their publishing date. 
Popularity sorting is determined by the frequency of article clicks, providing a glimpse into trending news. 
The recommended sort curates articles based on your search history, tailoring content specifically to your interests.

Moreover, we provide language filtering for a more personalized browsing experience. 
Choose from five languages - Dutch, English, German, Spanish, and French. 
If no language is selected, all articles will be available for browsing.

To further refine your search, keyword filters can be applied. 
Simply enter a keyword and all articles containing that keyword in the title or abstract will appear. 
Additionally, you can filter by newspapers, clicking on their name beneath the article image.

Each article hosts a wealth of functionalities. 
Share articles on a multitude of platforms including Facebook, Whatsapp, Twitter, Reddit, and Tumblr via easily accessible URLs. 
Dive deeper into a topic with our article clusters, which group together related news. 
Simply click on the 'related' button on an article card to reveal its cluster. 
The primary article displayed on the home page from each cluster is selected based on your chosen sorting method.

As a guest user, you have unrestricted access to these features. 
However, we encourage creating an account to unlock additional features such as saving your favorite articles for quick future reference.

The 'show all' buttons beside the genres direct you to a dedicated page for each genre, offering a view of all the news related to that topic. 
These genre-specific pages retain all the features of the home page.

Navigation is straightforward with our intuitive navbar. 
'Home', 'About Us', and 'Topics' are self-explanatory, directing you to the homepage, our background information, and a comprehensive list of topics available on our site respectively. 
The login button opens up a form, where you can also register if you're a new user. 
For ease of access, we also allow login/registration via Google.

Upon logging in, the profile dropdown menu replaces the login button, granting access to 'favorites', a repository of articles saved via the heart button, and 'settings', where you can modify preferences, change your password (email change is not permitted), or clear your favorites. 
An easy logout option ensures secure termination of your browsing session.

For admin users, an additional 'Dashboard' option appears, allowing easy access to administrative functions. 
It is your central command hub for overseeing and managing our news aggregator. 
Five key functionalities reside within this panel: 'Articles', 'Users', 'RSS', 'Settings', and 'Statistics'.

The 'Articles' section offers a comprehensive list of all the articles currently available in our database, allowing for swift and easy perusal of all available content.

The 'Users' tab is where you can exercise administrative control over user accounts. 
From creating, updating, to deleting users, this panel allows for seamless user management. 
Moreover, you can grant admin permissions, either to a new user or by elevating the status of an existing user. 
A search functionality is embedded for quick identification of specific users or admins.

The 'RSS' section is designed to manage RSS feeds. 
Like the 'Users' section, it enables creating, updating, or deleting RSS feeds. 
Additionally, it allows for quick health checks on specific RSS feeds to ensure their proper functioning. 
For quick access to feeds related to a specific topic, simply click on the topic of interest, or utilize the search box.

Next is the 'Settings' panel, where you can fine-tune the frequency of content scraping. 
The current default is set to update articles every two hours. 
Additionally, a debug mode can be enabled or disabled for your account, providing additional insights on the home and genre pages. 
It displays the current quantity of filtered articles, adjusting this figure in real-time when a keyword is added in the search box. 
Moreover, it provides the number of clicks per article.
With all these features at your disposal, we invite you to explore, engage and enjoy the world of news on our aggregator site.

The final section of the Dashboard, the 'Statistics' panel, offers a bird's-eye view of the site's overall engagement and content diversity.

Here, you'll be able to monitor the 'Total Users', which represents the number of registered users on our platform. 
This insight aids in understanding the size and growth of the active community.

The 'Total Visitors' counter tracks the number of individual visitors to the site, providing a measure of our reach and popularity.

'Total Articles' quantifies the breadth of content we offer, giving an account of all the articles available for perusal on our platform.

Our 'Total RSS Feeds' metric keeps track of the number of different RSS feeds our site is integrated with. 
This demonstrates the variety of sources from which we gather our content.

In the 'Total Favorites' field, you'll see the cumulative number of articles favorited by our users. 

Lastly, 'Total Topics' gives an account of the number of distinct topics covered on our site, showcasing the diversity and breadth of news genres we cater to.

Through this 'Statistics' panel, we aim to provide you with a clear understanding of the engagement and expansive content offering on our platform.

With all these features at your disposal, we invite you to explore, engage and enjoy the world of news on our news aggregator site.

### Technologies
The following technologies are used for the project:
* Frontend: React
* Backend: Flask
* Database: Postgresql

## Installation
To install the project, clone the repository from Github and install the required dependencies.

## Technical Documentation
* [Link to Backend API References README](./Backend/readme.md) Here you can find more about our backend architecture.<br>
* [Link to Backend Database README](./Backend/Database/readme.md) Here you can find more about our database engineering.<br>
* [Link to Frontend Login/Register README](./Frontend/my-app/src/components/readme.md) This contains information about Login/Register, used on the Frontend side.<br>
* [Link to Frontend Admin README](./Frontend/my-app/src/components/Admin/readme.md) This contains all the information about admin pages.<br>

```
git clone https://github.com/Marcel-aka-Satum/ProgrammingProjectDatabases.git
cd ProgrammingProjectDatabases/Frontend/my-app
npm install
cd ProgrammingProjectDatabases
pip install -r requirements.txt
python run.py 


## Usage
* Database: Please find the extended documentation within the README at Backend/Database/
* Frontend: Please find the extended documentation within the README at Frontend 

## Contributing
Nabil El Ouaamari, Marceli Wilczynski, Pim Van den Bosch, Simon Olivier, Robbe Teughels.
