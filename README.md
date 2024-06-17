# Visa_Climate_Tech_Hackathon

### Getting Started (for entire project)
1. Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/)
- If you are on windows install [nvm]first, otherwise install [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Choose one of them) as main package manager

2. Install dependencies

```bash/zsh
npm install
```

3. Runs the app in the development mode.

```bash/zsh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any logs, warnings, errors in the console.

Builds the app for production to the `build` folder.<br>

```bash
npm build
```

Vite + React build

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

- In this section lets actually run the flask application from `main.py`. We will first have to navigate to our app `backend` Assuming you are at the root of the project

```
flask --app main run or python3 main.py
```

After running you should see this link `Running on http://127.0.0.1:8080` or `http://localhost:8080` click on it and you should see how the site is now being displayed. You can hit `ctrl +  c` to end the program

Remember to type `deactivate` to end the virtual environment