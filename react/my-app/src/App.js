import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
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
          <div class="slidecontainer flexfull  ">
            <p><b>Detection Threshold</b></p>
            <input type="range" val="70" min="1" max="100" class="slider" id="confidencerange"></input>
            <output id="confidencethreshdisp">70%</output>
          </div>
          <div id="freq flexfull">
            <p id="notedisp"></p>
          </div>
		  <div class="wrapper">
			<div id="notelines"></div>
		    <video class="videobox canvasbox" autoPlay="autoplay" id="myvideo"></video>
		  </div>
          <canvas id="canvas" class="border canvasbox"></canvas>
          <script src="index.js"></script>
    </div>
  );
}

export default App;
