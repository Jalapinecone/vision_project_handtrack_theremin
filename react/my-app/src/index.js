import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as handTrack from './handTrack';
import * as Tone from 'tone';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// UI objects
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");
let confidenceSlider = document.getElementById("confidencerange"); 
let confidenceDisp = document.getElementById("confidencethreshdisp");
let noteDisp = document.getElementById("notedisp");
let notelines = document.getElementById("notelines");
let notevalues = ['A0','A#0','B0','C0','C#0','D0','D#0','E0','F0','F#0','G0','Ab0','A1','A#1','B1','C1','C#1','D1','D#1','E1','F1','F#1','G1','Ab1']

let maxnotes = notevalues.length

let factor = 2^(1/12)

for (let i=0; i<notevalues.length; i++) {
	let note1 = document.createElement('hr');
	notelines.appendChild(note1)
	let t1 = document.createElement('p');
	let a1 = document.createAttribute('style');
	a1.value = "margin-top:6px; margin-bottom:6px;";
	t1.innerHTML = notevalues[i]
	t1.setAttributeNode(a1)
	notelines.appendChild(t1);
}
// handtracking model object
let model = null;


// #########################################
// ########## Event Listeners ##############

// click to enable both camera and audio (a requirement for many browsers)
trackButton.addEventListener("click", async () => {
    await Tone.start()
    console.log('audio is ready')
    toggleVideo();
});

confidenceSlider.addEventListener("mouseup", async () => {
    updateConfidence(confidenceSlider)
});

let isVideo = false;
function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
		synth.triggerAttack()
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
		synth.triggerRelease()
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
		
    }
}



// ######################################################
// ########### Model/Tensorflow Handling ################
var modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.7,    // confidence threshold for predictions.
}
// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});


function updateConfidence(e) {
    modelParams.scoreThreshold = e.value / 100
    console.log("threshold: ",modelParams.scoreThreshold)
    model.setModelParameters(modelParams)
    confidenceDisp.innerText = e.value + "%"
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);

        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function runDetection() {
    model.detect(video).then(predictions => {

        for (let i = 0; i < predictions.length; i++) {
            let x_center = predictions[i].bbox[0] + (predictions[i].bbox[2] / 2)
            let y_center =  predictions[i].bbox[1] + (predictions[i].bbox[3] / 2)

                if (x_center < 300) {           //left hand
                    predictToTone(y_center)
                } else {                        //righthand
                    predictToVol(y_center)
                }
        }

        // boilerplate code for using detected hands rather than left/right of screen
        // //lefthand
        // if (predictions[0]) {
        //     if (predictions[0].bbox[1]) {
        //         predictToTone(predictions[0].bbox[1])
        //     }
        // }
        // //righthand
        // if (predictions[1]) {
        //     if (predictions[1].bbox[1]) {
        //         predictToVol(predictions[1].bbox[1])
        //     }
        // }

        console.log("num predict: ", predictions.length)
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}




// ###########################################
// ########### Sound Handling ################


var octave = 4
var chords = [
  'ACE', // A minor
  'DFA', // D minor
  'FAC'  // F major
].map((chord) => {
  // make 'ACE' => ['A','C','E']
  chord = chord.split('')
  // make ['A','C','E'] => ['A4','C4','E4']
  return chord.map((c) => { return c + octave })
})

var notes = chords.map((chord) => {
    // randomly get a note from the chord
    return chord[Math.floor(Math.random() * chord.length)]
  })


function makeSynth() {
    let envelope = {
        attack: 0.4,
        release: 4,
        releaseCurve: 'linear'
    };
    let filterEnvelope = {
        baseFrequency: 200,
        octaves: 2,
        attack: 0,
        decay: 0,
        release: 1000
    };

    return new Tone.DuoSynth({
        harmonicity: 1,
        volume: -10,
        voice0: {
            oscillator: { type: 'sawtooth' },
            envelope,
            filterEnvelope
        },
        voice1: {
            oscillator: { type: 'sine' },
            envelope,
            filterEnvelope
        },
        vibratoRate: 0.5,
        vibratoAmount: 0.1
    });
}

let synth = makeSynth();
let echo = new Tone.FeedbackDelay('16n', 0.1);
let delay = Tone.context.createDelay(6.0); // Borrow the AudioContext from Tone.js
let gain = Tone.context.createGain();
let vol = new Tone.Volume(0);


delay.delayTime.value = 6.0;
gain.gain.value = 0.75;

synth.connect(gain);
synth.connect(vol)
vol.toMaster();

function boxToFreq(box) {
    let freq = box*(65-16)/480 + 16 //converts our 0-400 input to the freq range of the first 2 octaves
    return freq
}

function predictToTone(box) {
	let fact = 480/maxnotes
	let pos = Math.ceil(box / fact)
    //let freq = boxToFreq(box)
    let note = notevalues[pos]
    noteDisp.innerText ='Note: ' + note;
	let noteFreq = Tone.Frequency(note).transpose(24)
    synth.setNote(noteFreq)
}

function predictToVol(box) {
    console.log(vol)
	console.log("Setting volume to: ", box)
	if (box > 300) {
		vol.volume.value = 0
	}
	else {
		vol.volume.value = (box-300)/2
	}
}







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();