# Python Web Application with Tailwind CSS

This project is a Python web application using Tailwind CSS for styling.

## Project Structure

`.
├── app/
│   ├── routes/
│   │   ├── hello.py
│   │   └── home.py
│   └── templates/
│       ├── hello.html
│       └── home.html
├── src/
│   └── input.css
├── tests/
│   └── unit/
│       ├── test_hello.py
│       └── test_home.py
├── package.json
├── requirements.txt
├── tailwind.config.js
└── README.md`

## Setup

1. Clone the repository:
   `git clone https://github.com/your-username/your-repo-name.git`
   `cd your-repo-name`

2. Set up a virtual environment:
   `python -m venv venv`
   `source venv/bin/activate` # On Windows, use `venv\Scripts\activate`

3. Install Python dependencies:
   `pip install -r requirements.txt`

4. Install Node.js dependencies:
   `npm install`

5. Build the CSS:
   `npm run build:css`

## Running the Application

To run the application:

`python -m app.main` # Adjust this command based on your actual entry point

## Running Tests

To run the tests:

`pytest`

## Development

For development with live reloading of CSS:

`npm run watch:css`

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
