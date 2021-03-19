// Create global variables through jQuery to hold the values of each value
$rest = $('#rest');
$session = $('#session');
$status = $('#status');

// Button controls for rest Length
$('#minus').click(function() {
  $status.text('Rest');
  if (+$rest.text() > 1) {
    $rest.text(+$rest.text() - 1);
  }
});

// The plus click function acts in the same way as the minus.
$('#plus').click(function() {
  $status.text('Rest');
  $rest.text(+$rest.text() + 1);
});

// Button controls for Session Length
$('#minus2').click(function() {
  $status.text('Work');
  if (+$session.text() > 1) {
      $session.text(+$session.text() - 1);
      }
});

$('#plus2').click(function() {
  $status.text('Work');
  $session.text(+$session.text() + 1);
});

// This sets up the audio...
var audio = new Audio('http://soundbible.com/grab.php?id=1852&type=mp3');

function alarm() {
  audio.play();
}

// This function keeps double digits for the user interface counter at all times 
function pad(val) {
  return ('00' + val).slice(-2);
}

// This function is used to update the display with the correct time. Since it updates, it will session side by side with the update function
var el = document.getElementById('timer');

// Next we create the function that will update the display with whatever the user defined it as.
function updateDisplay(t) {
  var hours = Math.floor(t / 3600); // There are 3600 seconds in an hour
  t -= hours * 3600; // t = t - hours * 3600
  var minutes = Math.floor(t / 60); // There are 60 seconds in a minute
  t -= minutes * 60;
  var seconds = Math.floor(t);
  el.innerHTML = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Now we set up some variables to use for a few upcoming functions
time = 0;
updateDisplay(time);
var running = true; // Boolean value to determine on/off
var tlast = (new Date()).getTime(); // We call the new Date() object as a container to hold the numeric value from getTime of the time it is called

// Now we make the update function
function update() {
  if(time <= 0.0) {
    return;
  }

  // We declare more global variables for use with upcoming functions
  var tnow = (new Date()).getTime();
  var dt = (tnow - tlast) / 1000.0;
  tlast = tnow;
  time -= dt;

  // These next two if statements determines the color of the timer running in the progress animation by making the conditionals match the status
  if ($status.text() === 'Work') { // The 3 equal signs mean "equality without type coercion". Using the triple equals, the values must be equal in type as well.
    totalTime = ($session.text() * 60); // text() method sets or returns the text content of the selected elements. We also have a arithmetic operator to multiply by 60
    water = 'rgba(25, 139, 201, 1)'; // determines the color of the water with rgba
  }

  if ($status.text() === 'Rest') {
    totalTime = ($rest.text() * 60);
    water = 'rgba(255, 0, 0, 1)';
  }

  // This takes the time and turns it into a value between 0 and 1 for the progress circle animation to reference
  fraction = 1 - (time / totalTime);

  // This calls the updated animation
  $('#progress').waterbubble({
    data: fraction,
    animation: false,
    waterColor: water,
  });

  // If the time has finished, then we need to switch to the opposite timer, as well as changing the label and sound the alarm
  if (time <= 0.0) {
    if ($status.text() === 'Work') {
      alarm();
      $status.text('Rest');
      time = $rest.text() * 60;
    } else {
      alarm();
      $status.text('Work');
      time = $session.text() * 60;
    }
  }

  // I call the function we made earlier to update
  updateDisplay(time);
  if (running) { 
    requestAnimationFrame(update); // The Window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
  }
}

// This run function is what's used to start things up. 
function run() {
  $status.text('Work');
  if (time <= 0.0) {
    time = $session.text() * 60;
  }
  
  tlast = (new Date()).getTime();
  running = true;
  requestAnimationFrame(update);
}

// This function pauses the timer
function pause() {
  running = false;
}

// This function acts to stop the timer
function stop() {
  running = false;
  time = 0;
  el.innerHTML = '00:00:00';
  $status.text('Work');
  $session.text(25);
  $rest.text(5);
  $('#progress').waterbubble({
    data: 0.0,
    animation: false,
    waterColor: 'rgba(25, 139, 201, 1)',
  });
}

// The variables below set up onclick events for the buttons
var buttonStart = document.getElementById('start');
var buttonPause = document.getElementById('pause');
var buttonReset = document.getElementById('reset');

buttonStart.onclick = run;
buttonPause.onclick = pause;
buttonReset.onclick = stop;

// Next is the progress bar animation. The first part was linking the files which we did on the html part, now we need the manual configuration
$('#progress').waterbubble(
  
  {
    
    // bubble size
    radius: 100,
    
    // border width
    lineWidth: undefined,
    
    // data to present
    data: 0.0,
    
    //color of the water bubble
    waterColor: 'rgba(25, 139, 201, 1)',
    
    // text color
    textColor: 'rgba(06, 85, 128, 0.8)',
    
    // custome font family
    font: '',
    
    // custom text displayed inside the water bubble
    txt: undefined,
    
    // enable water fill animation
    animation: false,
    
  });

// https://www.jqueryscript.net/chart-graph/Customizable-Liquid-Bubble-Chart-With-jQuery-Canvas.html
