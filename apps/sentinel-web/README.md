# Python Web Application with Tailwind CSS

This project is a Python web application using Tailwind CSS for styling.

## Project Structure

`.
├── app/
│   ├── routes/
│   │   ├── hello.py
│   │   ├── home.py
│   │   └── members.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── hello.html
│   │   ├── home.html
│   │   └── members/
│   │       ├── list.html
│   │       └── member_row.html
│   ├── config.py
│   └── main.py
├── src/
│   └── input.css
├── tests/
│   └── unit/
│       ├── test_hello.py
│       └── test_home.py
├── config.json
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
   `npm run build-css`

## Running the Application

To run the application in development mode with live reloading:

`npm run dev`

This will start the FastAPI server on the port specified in `config.json` (default is 8001 if not specified).

## Running Tests

To run the tests:

`npm run test:unit`

## Development

For development with live reloading of CSS:

`npm run watch-css`

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Setup

1. Make sure you have Python 3.12 and Node.js installed.
2. Run `npm install` to set up the project and install dependencies.
3. Activate the virtual environment:
   `source sentinel-web/bin/activate`
4. Set the `PYTHONPATH`:
   `export PYTHONPATH=$PYTHONPATH:$(pwd)`

## Development

For development with live reloading of CSS:

`npm run dev`

## Configuration

The application can be configured using the `config.json` file in the root directory. Available options are:

- `port`: The port number on which the application will run (default: 8000)
- `db_path`: The path to the SQLite database file (default: "./sentinel.db")
