Track — a progress bar.

DOM CONTRACT
  <div class="container-sunken track pill tight">
    <i class="track-fill" data-fill="66"></i>
  </div>

  data-fill carries the number; js sets the width from it. The value is data,
  the bar is not styled in script.

WHY IT IS ITS OWN ELEMENT AND NOT A Slider WITHOUT A THUMB
  A slider is a control and must be reachable by keyboard. A track reports and
  must not be. Same material, opposite obligations.

KEYS
  value   0 to 100
  label   what is being measured, if the caller renders one
