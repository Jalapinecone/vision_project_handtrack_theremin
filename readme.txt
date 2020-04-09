Setup:
- this will depend on you computer, but the general idea is to create a virtual environment, activate that environment, then install all the dependencies using
the activated enviroments pip (which the command pip will automatically link to after activating) to install all the dependencies.

On OS X/Linux this looks like:
    python3 -m venv .env
    source ./.env/bin/activate

    pip3 install -r requirements.txt