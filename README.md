## System Dependencies:
To run this app, you'll need npm to manage your packages and yarn, a package manager built by facebook with deterministic dependency handling and the default way of launching react apps.
- npm, the node.js package manager can be installed from: [https://nodejs.org/en/](https://nodejs.org/en/)
- yarn can be installed using npm through:
```code
npm install -g yarn
```

Once those packages are installed, if you haven't yet, cd into the /react/my-app folder located inside the downloaded project. Inside this folder, you'll want to install all the necessary dependencies located inside package.json by using the command: 

```code
yarn install
```

### Starting the app:
Use:
```code
yarn start
```
to start the app in the development mode.<br />

By default, the server should open at: [https://localhost:3000](https://localhost:3000).

Note the page will reload if you make any edits to the code as yarn start by fault wil be a developer mode.<br />
You will also see any lint errors in the console.

One thing to note is that our app uses webrtc apis to access the camera in the browser. By default, most browsers disable access to camera if the connection insn't encrypted. Even though our app fuly uploads the files necessary to your computer from the server you will be launching, and there is no communication bewteen the server and browser instance (either than initally sending the files which requires back/forth to load in the files) after everything is loaded, this means we need to force our connection through https. We do have node modules included for propper SSL, but you will need to add the the certificates manually in order for the browser to not complain. 

If you wish to go this route, look at: [https://www.npmjs.com/package/greenlock-cli](https://www.npmjs.com/package/greenlock-cli) for more information.

To more simply just run test without the need for proper certificates, launch chrome using 

```code
chrome –ignore-certificate-errors
```
using the run command in windows, or
```code
 /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors &> /dev/null &
 ```
 in OS X.

 This will allow you to bypass the insecure errors and not cause a crash when attempting to activate the camera.
