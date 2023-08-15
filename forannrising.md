---
layout: page
title: For Ann (rising) by James Tenney
permalink: /far/
---

<style type="text/css">html{box-sizing:border-box;font-size:16px;font-family:sans-serif}*,:after,:before{box-sizing:inherit}.button{appearance:none;background-color:#2ea44f;border:1px solid rgba(27,31,35,.15);border-radius:.5rem;box-shadow:rgba(27,31,35,.1) 0 1px 0;color:#fff;cursor:pointer;display:inline-block;font-size:1.2rem;font-weight:700;line-height:2rem;padding:.5rem 1rem;position:relative;text-align:center;text-decoration:none;user-select:none;-webkit-user-select:none;touch-action:manipulation;vertical-align:middle;white-space:nowrap}.button:focus:not(:focus-visible):not(.focus-visible){box-shadow:none;outline:0}.button:hover{background-color:#2c974b}.button:focus{box-shadow:rgba(46,164,79,.4) 0 0 0 3px;outline:0}.button:active{background-color:#298e46;box-shadow:rgba(20,70,32,.2) 0 1px 0 inset}</style>
<script>
var context = null;
const octaveDuration = 4.2;
var cycleTime = 2.8;
const totalTones = 240;
const octaves = [27.5,55,110,220,440,880,1760,3520,7040,14080];
const toneVolume = 0.05;
var tonesStarted = 0;
var tonesPlaying = 0;
var startTime = null;
var endTime = null;
var pieceInterval = null;
var isPlaying = false;
var oscillators = [];
let playForAnnRising = () => {
	let farButton = document.getElementById( 'forannrising' );
	if ( ! isPlaying ) {
		showTimer(true);
        isPlaying = true;
		console.log("started "+startTime);
        setButtons( 'forannrising', true );
        tonesStarted = 1;
        playTone('tenney');
        console.log("Number of tones started: " + tonesStarted );
        console.log("Number of tones playing: " + tonesPlaying );
		pieceInterval = window.setInterval(function(){
			if ( tonesStarted === totalTones  ) {
				window.clearInterval( pieceInterval );
				setButtons( 'forannrising', false );
			} else {
				tonesStarted++;
				playTone('tenney');
				console.log("Number of tones started: " + tonesStarted );
				console.log("Number of tones playing: " + tonesPlaying );
			}
		}, ( cycleTime * 1000 ) );
	} else {
        window.clearInterval( pieceInterval );
        stopOscillators();
        showTimer(false);
		setButtons( 'forannrising', false );
	}
}
let playShepard = ascdesc => {
    let shepardID = ascdesc? 'shepardasc': 'shepardesc';
	if ( ! isPlaying ) {
		showTimer(true);
        setButtons( shepardID, true );
        isPlaying = true;
        tonesStarted = 1;
        playTone( shepardID );
        console.log("Number of tones started: " + tonesStarted );
        console.log("Number of tones playing: " + tonesPlaying );
		pieceInterval = window.setInterval(function(){
			if ( tonesStarted === totalTones  ) {
				window.clearInterval( pieceInterval );
                setButtons( shepardID, false );
			} else {
				tonesStarted++;
				playTone( shepardID );
				console.log("Number of tones started: " + tonesStarted );
				console.log("Number of tones playing: " + tonesPlaying );
			}
		}, ( octaveDuration * 1000 ) );
	} else {
		window.clearInterval( pieceInterval );
        stopOscillators();
        showTimer(false);
		setButtons( shepardID, false );
	}
}
let playTone = tonetype => {
    if ( context === null ) {
        context = new window.AudioContext();
    }
    const st = context.createOscillator();
    oscillators.push( st );
    st.type = "sine";
	let octs = octaves;
    if ( tonetype === 'shepardesc') {
        octs = octaves.toReversed();
    }
    st.frequency.setValueAtTime(octs[0], context.currentTime);
    for ( let i = 1; i < octs.length; i++ ) {
        st.frequency.linearRampToValueAtTime(
            octs[i],
            context.currentTime + ( i * octaveDuration )
        );
    }
    let intervalNo = ( octaves.length - 1 )
	var gainNode = context.createGain();
	gainNode.gain.setValueAtTime( 0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime( toneVolume, context.currentTime + ( 2 * octaveDuration ) );
    gainNode.gain.setValueAtTime( toneVolume, context.currentTime + ( ( intervalNo - 2 ) * octaveDuration ) );
    gainNode.gain.linearRampToValueAtTime( 0, context.currentTime + ( intervalNo * octaveDuration ) );
    st.connect( gainNode ).connect( context.destination );
    st.start();
	tonesPlaying++;
	st.addEventListener( 'ended', e => {
		tonesPlaying--;
		console.log("Number of tones playing: " + tonesPlaying );
        if ( tonesPlaying === 0 ) {
            showTimer(false);
            setButtons( '', false );
            isPlaying = false;
        }
	});
    st.stop( context.currentTime + ( intervalNo * octaveDuration ) );
};
var stopOscillators = () => {
    isPlaying = false;
    if ( oscillators.length ) {
        oscillators.forEach( osc => {
            if ( osc.stop ) {
                osc.stop();
            }
        });
    }
};
var setButtons = (button, isactive) => {
    let buttons = ['shepardasc', 'shepardesc', 'forannrising'];
    buttons.forEach( btn => {
        let btnObj = document.getElementById( btn );
        if ( isactive && button === btn ) {
            btnObj.textContent = 'stop';
        } else {
            btnObj.textContent = 'start';
        }
    });
};
window.addEventListener( 'DOMContentLoaded', e => {
    let farButton = document.getElementById( 'forannrising' );
    farButton.addEventListener("click", function() {
        playForAnnRising();
    });
    let saButton = document.getElementById( 'shepardasc' );
    saButton.addEventListener("click", function() {
        playShepard( true );
    });
    let sdButton = document.getElementById( 'shepardesc' );
    sdButton.addEventListener("click", function() {
        playShepard( false );
    });
});
var showTimer = startstop => {
    if ( startstop ) {
        startTime = new Date();
        console.log("started: "+startTime);
    } else {
        endTime = new Date();
        console.log("ended: "+endTime);
        let durationSeconds = Math.abs(endTime - startTime) / 1000;
        let durationMinutes = Math.floor(durationSeconds / 60) % 60;
        durationSeconds -= durationMinutes * 60;
        console.log("duration: "+durationMinutes+"minutes and "+durationSeconds+" seconds");
    }
};
</script>
<p><a href="https://www.youtube.com/watch?v=bbKbE8y95sg" target="_youtube">Listen to the real thing</a>.</p>
<p>From <em>The Music of James Tenney Volume 1: Contexts and Paradigms</em> by Robert Wannamaker (2021, University of Illinois Press, ISBN: <a href="https://www.press.uillinois.edu/books/?id=c043673" target="_wannamaker">978-0-252-04367-3</a>)</p>
<blockquote>
The final version comprises 240 identical sine wave sweeps. Each of these lasts 37.8 seconds and rises linearly in pich at a rate of 4.2 seconds per octave for a total of nine octaves from A<sub>0</sub> to A<sub>9</sub>. Each sweep has a trapezoidal amplitude envelope that rises from zero to full gain in the first two octaves, stays at full gain for the five middle octaves, and drops from full to zero gain over the course of the top two octaves of each sweep. A new sweep starts every 2.8 seconds. The resulting pitch interval between registraslly adjacent sweeps is a minor sixth in 12TET. Once a full compliment of glissandi has entered, the aggregate texture persists without any further objective evolution whatsoever, repeating periodically every 2.8 seconds for more than 10 minutes. At any one moment during this span, thirteen or fourteen glissandi are simultaneously present, and seven or eight of them are at full gain. At the conclusion of the piece the last sine tones implacably rise into the treble, vanishing as they finish their glissandi so as to retrograde-invert the opening
</blockquote>
<p><button id="forannrising" class="button">start</button></p>
<h3>Shepard Scales</h3>
<p>A Shepard tone, named after <a href="https://en.wikipedia.org/wiki/Roger_Shepard" target="_shepard">Roger Shepard</a>, is a sound consisting of a superposition of sine waves separated by octaves. When played with the bass pitch of the tone moving upward or downward, it is referred to as the Shepard scale. This creates the auditory illusion of a tone that seems to continually ascend or descend in pitch.</p>
<p> The following two buttons will play a Shepard scale using the same tone profile as the Tenney piece.</p>
<h4>Shepard scale (ascending)</h4>
<p><button id="shepardasc" class="button">start</button></p>
<h4>Shepard scale (descending)</h4>
<p><button id="shepardesc" class="button">start</button></p>

