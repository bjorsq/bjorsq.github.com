---
layout: page
title: For Ann (rising) by James Tenney
permalink: /far/
---

<style type="text/css">html{box-sizing:border-box;font-size:16px;font-family:sans-serif}*,:after,:before{box-sizing:inherit}.button{appearance:none;background-color:#2ea44f;border:1px solid rgba(27,31,35,.15);border-radius:.5rem;box-shadow:rgba(27,31,35,.1) 0 1px 0;color:#fff;cursor:pointer;display:inline-block;font-size:1.2rem;font-weight:700;line-height:2rem;padding:.5rem 1rem;position:relative;text-align:center;text-decoration:none;user-select:none;-webkit-user-select:none;touch-action:manipulation;vertical-align:middle;white-space:nowrap}.button:focus:not(:focus-visible):not(.focus-visible){box-shadow:none;outline:0}.button:hover{background-color:#2c974b}.button:focus{box-shadow:rgba(46,164,79,.4) 0 0 0 3px;outline:0}.button:active{background-color:#298e46;box-shadow:rgba(20,70,32,.2) 0 1px 0 inset}</style>
<script>
const context = new window.AudioContext();

let playTone = () => {
    const st = context.createOscillator();
	st.frequency.setValueAtTime(20, context.currentTime);
    st.type = "sine";
    st.frequency.exponentialRampToValueAtTime(
        200,
        context.currentTime + 12
    );
    st.frequency.exponentialRampToValueAtTime(
        2000,
        context.currentTime + 24
    );
    st.frequency.exponentialRampToValueAtTime(
        20000,
        context.currentTime + 36
    );
	var gain = context.createGain();
	gain.gain.value = 0.1;
    st.connect(gain).connect(context.destination);
    st.start();
	updateToneCount(true);
	st.addEventListener( 'ended', e => {
		updateToneCount(false);
	});
    st.stop(context.currentTime + 36);
}
let updateToneCount = increment => {
	let tc = document.getElementById('tonecount');
	let count = parseInt(tc.textContent);
	count = increment? count + 1: count - 1;
	tc.textContent = count;
}

let farButton = document.querySelector("#forannrising");
farButton.addEventListener("click", function() {
  playTone();
})
</script>
<p><a href="https://www.youtube.com/watch?v=bbKbE8y95sg" target="_youtube">Listen to the real thing</a>.</p>
<p>Clicking on this button sets off a single rising sine tone</p>
<p>If you click on it roughly every couple of seconds<br>you should hear something similar to the original</p>
<p><button id="forannrising" class="button">start tone (<span id="tonecount">0</span>)</button></p>
This is the personal site of Peter Edwards. 

Want to go somewhere else?
