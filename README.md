# Visa_Climate_Tech_Hackathon

### Getting Started (for entire project)

1. Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) or [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Choose one of them) as main package manager

2. Install dependencies

```bash
yarn install
```

3. Runs the app in the development mode.

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any logs, warnings, errors in the console.

Builds the app for production to the `build` folder.<br>

```bash
yarn build
```

It bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### Backend dev setup (Only for Flask)

- In this section we will install Flask and any dependencies required for the project

Create a virtual enviroment (What it does is make a isolatied "container" for you to put your dependencies). This folder will have over a thousand items so make sure you create it at the root

```
python3 -m venv .venv
```

Activate the env so that we can install dependencies. After you do this it will append a string at your prompt `(.venv)`. **When done you can type** `deactivate` to leave the environment

```
. .venv/bin/activate
```

You can check all the dependencies you have already with. Just so you can double check what you are missing

```
pip3 list
```

Install flask, openai and dontenv which allows us to use enviroment variables

```
pip3 install flask openai python-dotenv
```

- In this section lets actually run the flask application from `main.py`. We will first have to navigate to our app `backend/app` Assuming you are at the root of the project

```
flask --app main run
```

After running you should see this link `Running on http://127.0.0.1:5000` click on it and you should see how the site is now being displayed. You can hit `ctrl +  c` to end the program

Remember to type `deactivate` to end the virtual environment

### Backend dev setup (Only for Database)

- This section will walk you through how you would connect to the database

1. Have docker installed
2. Have the proper sql server container installed
3. Have the `HackVisa` database in your docker contianer [My profs docker installation guides](https://www.dropbox.com/scl/fo/c70guq1vwaihbagdgep75/ADkux_qTvqdrSG-dk9v5snM?rlkey=oaoakm6vgt2svlryia4m5id3c&e=1&dl=0). Via the backup file `*.bak`
4. Install the following libraries for python

The following is used for having the driver for connecting to the database the library `pyodbc` depends on this

```
brew install unixodbc
```

This is the actual python library responsible for connecting to the database in this case via a docker container.

```
pip3 install pyodbc
```

We now need to install the driver to connect to the database [Microsoft guide to install the driver](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos?view=sql-server-ver16). I downloaded the version 18 `Microsoft ODBC 18` Therfore in the enviroment variables the driver is defined as such ` DB_DRIVER = '{ODBC Driver 18 for SQL Server}'`. In the guide make sure to run each code snippet one by one your command prompt may not register all in one go.

One way to test that the driver is installed or if you forgot which one you installed you can run this simple script in python

```python
import pyodbc

for driver in pyodbc.drivers()
    print(driver)
```

As a side note 17 should work you will see a lot of guides used this version but 18 should work for our needs.

Based on the specification in the docker container you need to fill out the following fields in the `.env` file` DB_DOMAIN, DB_PORT,DB_NAME, DB_USERNAME, 
DB_PASSWORD, DB_DRIVER`. Once these are congifured the database feature can be met.

You can use [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio?tabs=win-install%2Cwin-user-install%2Credhat-install%2Cwindows-uninstall%2Credhat-uninstall) as a debugging tool, for making sure you can connect to the container before applying the fields for the python program. As well as running queries for additional features.
