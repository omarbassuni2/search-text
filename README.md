# Search Text

**Description:** Search Text is an application that reads clinic JSON files and allows users to search for specific clinics based on their input.

## How to Install the App using Docker

1. Make sure you have Docker Desktop installed and running on your machine.
2. Open the desired folder where you want to place the project.
3. Clone the repository:
`$ git clone https://github.com/omarbassuni2/search-text.git`
4. Navigate to the project directory using the terminal and run:`$ docker-compose up`
5. The project is now running on port 3000.

## How to Install the App using npm and Run it

1. Install the required dependencies: `$ npm install`
2. Start the application: `$ npm run`
3. The project is now running on port 3000.

## How to Call the API

- Option 1: Call the API directly using the following URL format and modify the parameters as needed:
`localhost:3000/?clinicName=Hopkins Hospital Baltimore&stateName=Florida&availability=["10:00", "20:59"]`

- Option 2: Import the `search api.postman_collection.json` file into Postman and send requests from there.

## Assumptions

- The data is assumed to be stored locally on the machine rather than calling an API that returns JSON data.
- The application uses the AND operator to retrieve search results.

## Implemented Features

- Utilized Streams for efficient memory usage and improved handling of large data.
- Continuous Integration (CI) for linting, running test cases, and ensuring informative commit messages.
- Comprehensive test cases for thorough testing.
- Docker integration for easy deployment and containerization.
