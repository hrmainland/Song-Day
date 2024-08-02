# Song Day

## The Concept

The idea of this project is to build a website that allows users to create and listen to their own countdown style playlists.
It emulates countdowns such as [Tripple J Hottest 100](https://www.abc.net.au/triplej/hottest100/) but amongst a smaller group.

It works as follows:

- Each player signs in and joins the session
- Each player submits a set number of songs (ie. their top 10 songs of all time)
- Each player then votes all all submitted songs (except their own)
- Song day then tallies the votes and creates a playlist in the host's Spotify account with each song, rated from least votes to most votes

## The Implementation

This project uses [React](https://react.dev/) on the frontend and [Express](https://expressjs.com/) on the backend. It implements client side routing via [React Router](https://reactrouter.com/en/main).
For authentication [Passport.js](https://www.passportjs.org/) is used.
The [Spotify API](https://developer.spotify.com/documentation/web-api) (OAuth2) is used to search for songs and create the resulting playlist.

## What Now?

Currently the project is being developed and will likely be moved into beta in September.
