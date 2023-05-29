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

On our news aggregator we offer several functionalities. 
You start at the main page when you will search for the site. There you will find all the genres we/newspapers provide. 
You will see 3 articles for each genre/topic and the order of the articles will be based on which sorting you choose at 
the top of the site. We provide time, popularity and recommended. Time is logically based on when the article is published.
Popularity is based on how many times an article is clicked and recommended is a sorting where you can see all the articles that are 
specifically recommended for you as a user with your certain search history. Besides, you can also sort on the language you want to 
read. We offer 5 languages: Dutch, English, German, Spanish and French. If nothing is selected just all the languages will be shown.
Then you can also search on words. If you enter a word, all articles are shown where the word is in the title or abstract. 
Beside this filtering on words, you can also filter on newspapers by clicking on the name of the newspaper under the image of an article.
Furthermore, there are some functionalities related to an article itself. You can share it on several platforms we provide.
We provide the url to share it everywhere, Facebook, Whatsapp, Twitter, Reddit and Tumblr. We've also calculated clusters of
articles that handle the same news and are thus related to each other. If you click the related button on an article card,
you will see all the related articles. The one we show on the main page is again decided by the sorting you chose. These are all 
features you get when you are just a visitor. However, we also provide the possibility to create an account. If you do this,
you can also capture your favorite articles you want to hold close by, so you can for example read them later again.
The only thing left on the home page are the show all buttons beside the genres. If you click these, you will go to a different 
page where you can see all the news our site has, related to a certain topic/genre. These separate pages per genre have the 
same features as the home page. 

Then we can look at the navbar. There we see certain words: Home, About Us, Topics and login if you're not logged in. 
Home, About Us, Topics and Profile if you're logged in but aren't an admin and Home, About Us, Topics, Dashboard and Profile 
if you are an admin. The first 3 words are pretty clear just from the name. Home leads you to our homepage, About Us leads you to 
information about our group and Topics gives a list of all topics we provide at our site. Then we have the login button to begin with.
If you click this you will be leaded to the login page logically, where you can also register if you don't have an account yet.
You can also log in/register with Google. If you're logged in you will see on the place where we previously had login, now there 
is a dropdown named profile. In this dropdown we have favorites, which will lead you to the page where all your favorite articles can be found.
These are the ones you've added via the heart button. Beside the favorites, there is also the settings, where you can clear all your favorites
and change your setting like your password and such. (just not your email). Lastly there is also a logout with which you can log out
of your account. 

Then there is only one thing left and that's the dashboard for the admins.

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
