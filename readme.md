# News Aggregator App

This is a web application project developed by a team for the course Programming Project Databases. The goal of the
project is to create a news aggregator app that collects and displays news from various sources, similar to Google News, Digg or The Factual.

## Table of Contents
1. [Introduction ](#introduction)
2. [Project Requirements](#project-requirements)
   3. [Client Background](#client-background)
   4. [Application Requirements](#application-requirements)
   5. [Technologies](#technologies)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
The project is a team effort to develop a software product that applies the principles of the "Introduction to Databases" course. The objectives of the project include converting theory into practice, working independently in teams, planning work and distributing tasks, problem-solving skills, clear reporting on progress and choices, and developing high-quality software with a focus on usability, efficiency, and expandability.

The project is extensive, and the final software product will be evaluated instead of a written exam. The evaluation will be based on the delivered product, taking into account the above objectives.

This document contains an introduction, a section on the client, a description of the project requirements, and a section on practical matters and evaluation.


## Project Requirements
### Client Background
The client for this project is Froomle, a spin-off from the University of Antwerp that uses artificial intelligence techniques to personalize online newspapers. Froomle's software predicts the articles that are most interesting to each reader based on their reading behavior. Froomle's SAAS product is used worldwide by, among others, Het Nieuwsblad (BE), De Standaard (BE), Gazet Van Antwerpen (BE), De Tijd/L'Echo (BE), The Boston Globe (USA), De Telegraaf (NL), La Reppublica (IT), and Independent Online (ZA). The Head of Product and Head of Engineering at Froomle will be involved in evaluating the final product.

### Application Requirements
The project requires a web application that collects news from various sources and displays it to users. Only titles, descriptions, and photos are displayed, and users can click on a link to read the full article in a new tab.

The articles are presented in a simple layout, such as a list with articles stacked vertically. The order in which articles are displayed to a user is determined by a recommender system API, which uses various techniques to determine article relevance. A simple recommender system ranks articles by publication timestamp, while a more advanced technique such as collaborative filtering determines the order based on articles that have already been read by similar users. The similarity of users is calculated based on the number of identical articles they read.

One of the main challenges is that multiple news sources often publish very similar (or sometimes identical) articles. Only one version of such similar articles can be displayed, with links to the different news sources. A simple classification algorithm can be used to determine if two articles are similar enough to be grouped together by counting the number of similar words in the title. **Extra: Think about which version should be displayed.**

### Technologies
The following technologies can be used for the project:
* Frontend: ...
* Backend: ...
* Framework: ...
* Database: ...

## Installation
To install the project, clone the repository from Github and install the required dependencies.
```
git clone https://github.com/Marcel-aka-Satum/ProgrammingProjectDatabases.git
cd ProgrammingProjectDatabases
```

## Usage
* Database: We use a postgres database, so make sure postgres is installed. In order to initialize simply navigate to Backend/Database/ and run ui_db.py This will make a connection to the database as the postgres user and initialize the database. Subsequently the database will be filled with some rss feeds and the scraper will scrape them. Finally the articles will be inserted into the database where they can be accesed directly via SQL or through the functionality provided by the DBConnection class found in ui_db.py.
## Contributing
Soon to be added.

## License
Soon to be added.