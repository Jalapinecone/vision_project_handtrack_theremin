import React from 'react';
import './App.css';
import './images/1.jpg'

function App() {
  return (
    <div className="App">
      <body class="bx--body p20">
          <div class="p20">
            Handtracked Theremin
          </div>
          <div class="sep_lines">
            <div>
              <button  id="trackbutton" class="bx--btn bx--btn--secondary" type="button" disabled>
                Toggle Video
              </button>
            </div>
            <div id="updatenote" class="updatenote mt10"> loading model ..</div>
          </div>
          <video class="videobox canvasbox" autoplay="autoplay" id="myvideo"></video>
          <canvas id="canvas" class="border canvasbox"></canvas>







          <script src="index.js"></script>
          <script>
            window.WebComponents = window.WebComponents || {};
            window.WebComponents.root = 'node_modules/@webcomponents/webcomponentsjs/';
          </script>
      </body>
    </div>
  );
}

export default App;
