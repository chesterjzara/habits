# Habit Tracking

A Node.js Express app that lets users enter their daily habits and track their completion of these habits. 

## Technologies Used

Main technologies used:
  * Node.js
    * Express - Server functionality
    * connect-flash, express-session, method-override - Express middleware
    * bcrypt - Password encrpytion
    * ejs - Page rendering
    * moment.js - Date parsing
    * mongoose - MongoDB management
    * node-cron - Server cron jobs
    * serve-favicon - Favicon support
    * Chart.js - Graph rendering
  * HTML/CSS - Page content
    * Bootstrap - CSS framework
  * Javascript/jQuery - Client-side display elements

## Approach

### 2 Models
User Model - stores user account info and keeps an updated array of their tracked Habits
Habit Model - stores info about the habit and the daily date data recorded by users 

These models are stored as collections of documents in MongoDB. The models are related by synchronized updates to both when changes are made. The User model contains an array of the user's current Habits. The Habit model contains a reference to the owning user's ID.

### Server vs Client
The dates are generated on the client side based on user input and stored in the DB in ISO 8601 format. When sent back to display on the client, these date/times are used by the client with the original time. Therefore, if a user was travelling between timezones they may have issues near the start or end of days. 

The graphs are generated with Chart.js on the client-side. Additionally, the scoring behind the grpahs is done on the client-side as well to minimize calls to the server. 

## Unsolved Problems / Additional Features
1. Styling - better clor scheme and animations on page elements
2. Improve weighting and frequency system to give more intelligent information on habit learning and adherence
3. Add support for OpenAuth with google
4. Public habit component
  * Opt-in for habits/categories to be shared
  * Suggest common Categories or Habits to users
  * Anonymous or named feedback and sharing mechanisms 
5. Adding modals for improved usability
  * Login modal
  * Confirmation on delete option
6. Add mass delete or archive functionality to USer Profile page
7. Ability to organize order of Categories or Habits
8. Ability to set color scheme for either habits or tags/categories
9. More frequency options - more fluid
  * Don't look strictly at a week or at a month but a more flexible algorithm
10. Monthly chart - make it account for your % of the month so far, not the total month
  
