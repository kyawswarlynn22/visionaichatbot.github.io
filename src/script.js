const SpeechRechgnition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const startb = document.getElementById("start"),
  stopb = document.getElementById("stop"),
  recognition = new SpeechRechgnition(),
  chatBox = document.getElementById("chatBox"),
  userinputbox = document.getElementById("userInput"),
  sendButton = document.getElementById("sendBut"),
  buttonIcon = document.getElementById("buttonChange"),
  microPhone = document.getElementById("micro"),
  micChange = document.getElementById("microChange"),
  usefulCommand = document.getElementById("usefulCom");
  voice = false;

  //to inform when the speech recogniton service has begun listening to incoming audio;
recognition.onstart = function () {
  console.log("Start");
};

//to inform when th speech recognition servicr has diconnected
recognition.onend = function () {
  console.log("Stop");
  micChange.classList.remove("text-blue-300","text-lg","fa-solid","fa-microphone","fa-beat-fade");
  micChange.classList.add("text-blue-300","text-lg","fa-solid","fa-microphone-slash");
};

//for icon change and speech recognition service start and stop
microPhone.addEventListener("click", () => {
  if (!voice) {
    recognition.start();
    micChange.classList.remove("text-blue-300","text-lg","fa-solid","fa-microphone-slash");
    micChange.classList.add("text-blue-300","text-lg","fa-solid","fa-microphone","fa-beat-fade");
  } else {
    recognition.stop();
    micChange.classList.remove("text-blue-300","text-lg","fa-solid","fa-microphone","fa-beat-fade");
    micChange.classList.add("text-blue-300","text-lg","fa-solid","fa-microphone-slash");
  }
  voice = !voice;
});

//to continuous results are returned for each recognition
recognition.continuous = true;

//while webpage run to get current time
window.onload = function () {
  setInterval(() => {
    let date = new Date();
    let hour = date.getHours();
    let mins = date.getMinutes();
    let second = date.getSeconds();

    document.getElementById("time").innerText = `${hour} : ${mins} : ${second}`;
  }, 1000);
};

//useful command to show for users
usefulCommand.addEventListener("click", () => {
  const commands =
    "1. Open Youtube, 2. Open Google, 3. Open Figma, 4. Open my school website, 5. Looking for `(your search keywords)`";
 addMessage(`user`, `Voice useful command`);
 addMessage(`bot`, commands);
  buttonIcon.classList.add("fa-regular", "fa-paper-plane");
  buttonIcon.classList.remove("fa-solid", "fa-circle-notch", "fa-spin-pulse");
});

//to covert text to speech
function speakOut(record) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = record;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}

recognition.onresult = function (e) {
  let now = e.resultIndex;
  let speechToText = e.results[now][0].transcript;
 addMessage("user", speechToText);
  speechToText = speechToText.toLowerCase();

  if (speechToText.includes("hello")) {
    speakOut("Hi how can i assist you");
   addMessage("bot", "Hi! how can i assist you?");
  }

  if (speechToText.includes("open youtube")) {
    speakOut("Opening Youtube");
   addMessage("bot", "Opening Youtube");
    window.open("https://www.youtube.com/");
  }

  if (speechToText.includes("open google")) {
    speakOut("Opening Google");
   addMessage("bot", "Opening Google");
    window.open("https://www.google.com/");
  }

  if (speechToText.includes("open figma")) {
    speakOut("Opening Figma");
   addMessage("bot", "Opening Figma");
    window.open("https://www.figma.com/");
  }

  if (speechToText.includes("my school")) {
    speakOut("Opening ExbraiN Education");
   addMessage("bot", "Opening Ex;braiN Education");
    window.open("https://exbrainedu.com");
  }

  if (speechToText.includes("looking for")) {
    let command = speechToText.substring(12).split(" ")
      .map((word) => encodeURIComponent(word))
      .join("+");
    window.open(`https://www.google.com/search?q=${command}`);
    const removePlus = command.replace(/\+/g, " ");//for remove plus sign in text
    speakOut("here result of " + removePlus);
   addMessage("bot", `here result of  ${removePlus}`);
  }
  buttonIcon.classList.add("fa-regular", "fa-paper-plane");
  buttonIcon.classList.remove("fa-solid", "fa-circle-notch", "fa-spin-pulse");
};

//when user click sendbutton messafe send
sendButton.addEventListener("click", messageSend);

//when user press Enter messafe send
userinputbox.addEventListener(
  "keydown",
  (event) => event.key === "Enter" && messageSend()
);

function messageSend() {
  const message = userinputbox.value.trim();
  if (message == "") {
    return;
  }

  // add users message to screen
 addMessage("user", message);
  userinputbox.value = "";

  //adding API
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "7d8f8fb3f1mshe5a63125d4fb7ccp19ce0cjsn12c8e18958af",
      "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com",
    },
    body: `{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"${message}"}]}`,
  };
  fetch("https://chatgpt53.p.rapidapi.com/", options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
     addMessage("bot", response.choices[0].message.content);

      buttonIcon.classList.add("fa-regular", "fa-paper-plane");
      buttonIcon.classList.remove(
        "fa-solid",
        "fa-circle-notch",
        "fa-spin-pulse"
      );
    })
    .catch((err) => {
      if (err.name === "TypeError") {
       addMessage("bot", "Error : Check Your Api Key!");
        buttonIcon.classList.add("fa-regular", "fa-paper-plane");
        buttonIcon.classList.remove(
          "fa-solid",
          "fa-circle-notch",
          "fa-spin-pulse"
        );
      }
    });
}

function addMessage(sender, message) {
  buttonIcon.classList.remove("fa-regular", "fa-paper-plane");
  buttonIcon.classList.add("fa-solid", "fa-circle-notch", "fa-spin-pulse");
  const toShowMessage = document.createElement("div");
  const iconShow = document.createElement("div");
  const chatBoxAdd = document.createElement("div");
  const icon = document.createElement("i");

  chatBoxAdd.classList.add("text-white");
  chatBoxAdd.classList.add("flex");
  chatBoxAdd.classList.add("my-5");
  icon.classList.add("mx-5");

  toShowMessage.classList.add(sender);
  toShowMessage.innerText = message;
  console.log(chatBoxAdd);

  // add icons depending bot or user
  if (sender === "user") {
    icon.classList.add("fa-solid", "fa-user");
  } else {
    icon.classList.add("fa-solid", "fa-robot");
    chatBoxAdd.classList.add("rounded-md");
  }

  iconShow.appendChild(icon);
  chatBoxAdd.appendChild(iconShow);
  chatBoxAdd.appendChild(toShowMessage);
  chatBox.appendChild(chatBoxAdd);
  chatBox.scrollTo = chatBox.scrollHeight;
}
