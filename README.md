
<h2 align ='center'>Simple Full Stack Movie Web</h2>

<!-- TABLE OF CONTENTS -->
<summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#built-with">Built With</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
  </li>
  <li>
    <a href="#screenshot">Screenshot</a>
  </li>
  <li>
    <a href="#todo">Note/Todo</a>
  </li>
</ol>

#
<h2 id='about-the-project'> About the Project: </h2>

  This is a basic movie-browsing website to get myself familiar with front-end and back-end development. This web allows client to search movies based on keyword, login, sign up, and add/remove movies to client's list with authentication.


- <h3 id='built-with'>Built with</h3>

  Client side:
  - React and React router

  Server side:
  - express
  - mysql2 (connecter for mySQL)

  Dev/Other:
  - webpack 
  - nodeman
  - Movie data are obtained from [The Open Movie Database](http://www.omdbapi.com/)
  - Started with boiler plate [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack), which provides a more detailed dependency list.

#
<h2 id='getting-started'>Getting Started</h2>

  - Installation: 

    ```sh
     git clone https://github.com/zchen665/MovieWeb.git
    ```


  - Acquire dependencies: 
    ```sh
    npm install
    ```
 
  - Dev mode ( will create 2 port connections for both server and client dev):
    ```sh
    npm run dev 
    ```

  - Build: 
    ```sh
    npm run build 
    ```

  - production mode:
    ```sh
    npm run start 
    ```

note:  mySQL database model locates in [DB_options.js](https://github.com/zchen665/MovieWeb/blob/main/src/server/DB_options.js),
manually setting up mysql to start the server.
#
<h2 id='screenshot'>Sample Screenshot:</h2>

![alt web demo](https://github.com/zchen665/MovieWeb/blob/main/Screenshot/search_1.png?raw=true)


![alt web demo](https://github.com/zchen665/MovieWeb/blob/main/Screenshot/user_page.png?raw=true)
  
#
<h2 id='todo'>Note / Todo:</h2>

- <h3>Note:</h3>
  
  - still not familiar with packages and modules provided in [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack) , for example: webpack and babel.

  - Most react components are class components but 2 functional components using hooks. Trying to learn React's mechanism first. Started with classes and then transitioned to hooks in later phase (UserPage.js, MovieRow.js).

- <h3>TODO:</h3>

  - Web bundle.js sizing around 300 kb, need to learn more about webpack and optimization to shrink the initial render size.

  - there is no security consideration/protection on server. 

  - improving css structuring and naming: need to adopt BEM for more efficient css coding. 
  
  - standard testing with Jest etc.

  - and more coming.

  




