Setup:
- this will depend on you computer, but the general idea is to create a virtual environment, activate that environment, then install all the dependencies using
the activated enviroments pip (which the command pip will automatically link to after activating) to install all the dependencies. This will let you install the necessary libraries (and versions)
without worrying about afffecting your installations on the rest of your machine.



On OS X/Linux this looks like:
    python3 -m venv .env
    source ./.env/bin/activate
    pip3 install -r requirements.txt


On Windows you may want to first install virtualenv using:
    pip install virtualenv

Then use that to setup your custom environment using:
    virtualenv --python=python3.7.7 .env
    source ./.env/Script/activate
    pip3 install -r requirements.txt