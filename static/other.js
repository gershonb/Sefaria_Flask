var high_radio = document.getElementsByClassName("high_radio");

function voiceSelect() {
  var avatar = document.getElementById("avatar");
  var avatar2 = document.getElementById("avatar2");
  var select = document.getElementById("Voices");
  if (select.value == "Hebrew") {
    avatar.src = "static/images/Yaron.png";
    avatar2.style.visibility = "hidden";
    language = "Hebrew";
    create_html();

  }
  if (select.value == "English") {
    avatar.src = "static/images/Yehuda.png";
    avatar2.style.visibility = "hidden";
    language = "English";
    create_html();
  }
  if (select.value == "Both") {
    avatar.src = "static/images/Yaron.png";
    avatar2.style.visibility = "visible";
    language = "Both";
    create_html();

  }
}

