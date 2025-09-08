# Song Day

A collaborative music voting platform that enables groups to create countdown-style playlists through democratic song selection and voting.

## Overview

Song Day is a web application that allows users to create and participate in music countdown sessions, similar to popular radio countdowns like [Triple J Hottest 100](https://www.abc.net.au/triplej/hottest100/), but tailored for smaller, personalized groups.

### How It Works

1. **Session Creation**: A host creates a voting session and invites participants
2. **Song Submission**: Each participant submits their top songs (configurable number)
3. **Voting Phase**: Participants vote on all submitted songs except their own
4. **Playlist Generation**: The system tallies votes and automatically creates a ranked Spotify playlist

## Features

- **User Authentication**: Secure login system with Spotify integration
- **Real-time Voting**: Interactive voting interface for submitted songs
- **Automatic Playlist Creation**: Direct integration with Spotify API for seamless playlist generation
- **Customizable Sessions**: Configurable number of songs per participant
- **Vote Tallying**: Automated ranking system based on participant votes

## Technology Stack

### Frontend
- **React** - Modern UI framework
- **React Router** - Client-side routing and navigation

### Backend
- **Express.js** - Node.js web application framework
- **Passport.js** - Authentication middleware

### External APIs
- **Spotify Web API** - OAuth2 authentication, song search, and playlist creation

## Project Status

This project is currently in active development. The initial release is planned for late April 2025.

## Getting Started

### Prerequisites
- Node.js (version requirements TBD)
- Spotify Developer Account for API access

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd Song-Day

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your Spotify API credentials in .env

# Start the development server
npm run dev
```

## Contributing

We welcome contributions to Song Day. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[License information to be added]

## Contact

For questions or support, please [contact information to be added].
