//<!-- Speech SDK Authorization token -->

      // Note: Replace the URL with a valid endpoint to retrieve
      //       authorization tokens for your subscription.
      var authorizationEndpoint = "token.php";

      function RequestAuthorizationToken() {
        if (authorizationEndpoint) {
          var a = new XMLHttpRequest();
          a.open("GET", authorizationEndpoint);
          a.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          a.send("");
          a.onload = function () {
            var token = JSON.parse(atob(this.responseText.split(".")[1]));
            regionOptions.value = token.region;
            authorizationToken = this.responseText;
            subscriptionKey.disabled = true;
            subscriptionKey.value =
              "using authorization token (hit F5 to refresh)";
            console.log("Got an authorization token: " + token);
          };
        }
      }


//    <!-- Speech SDK USAGE -->

      // On document load resolve the Speech SDK dependency
      function Initialize(onComplete) {
        if (!!window.SpeechSDK) {
          document.getElementById("content").style.display = "block";
          document.getElementById("warning").style.display = "none";
          onComplete(window.SpeechSDK);
        }
      }


//   <!-- Browser Hooks -->

      // status fields and start button in UI
      var talkingHeadDiv, highlightDiv;
      var startSynthesisAsyncButton, pauseButton, resumeButton;
      //var downloadButton;

      // subscription key and region for speech services.
      var subscriptionKey, regionOptions;
      subscriptionKey = "7cfbb0338ef045bc824ade056a7282f9";
      regionOptions = "eastus";
      var authorizationToken;
      var voiceOptions;
      var SpeechSDK;
      var synthesisText;
      var synthesizer;
      var player;
      var wordBoundaryList = [];


      var xmlstring_test = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>`;
    var xmlstring;


      document.addEventListener("DOMContentLoaded", function () {
        startSynthesisAsyncButton = document.getElementById(
          "startSynthesisAsyncButton"
        );
        pauseButton = document.getElementById("pauseButton");
        resumeButton = document.getElementById("resumeButton");
       // downloadButton = document.getElementById("downloadButton");
        voiceOptions = "en-US-JacobNeural";
        highlightDiv = document.getElementById("highlightDiv");

        setInterval(function () {
          if (player !== undefined) {
            const currentTime = player.currentTime;
            var wordBoundary;
            for (const e of wordBoundaryList) {
              if (currentTime * 1000 > e.audioOffset / 10000) {
                wordBoundary = e;
              } else {
                break;
              }
            }
            //console.log(wordBoundary == undefined);
            //var text = document.getElementById("Sefaria_text").innerHTML; //for highlighting/
            ///////text highlight
            //if (wordBoundary !== undefined) {
//
            //  document.getElementById("Sefaria_text").innerHTML =
            //  text.substr(0, wordBoundary.textOffset) +
            //  "<span class='highlight'>" +
            //  wordBoundary.text +
            //  "</span>" +
            //  text.substr(wordBoundary.textOffset + wordBoundary.wordLength, text.length);
//
            //    //console.log(text)
            //  //console.log("wb+" + ( wordBoundary.wordLength))
//
            //
            //} else {
            //  //document.getElementById("Sefaria_text").innerHTML = "";
            //}
          }
        }, 50);

        pauseButton.addEventListener("click", function () {
          player.pause();
          pauseButton.disabled = true;
          resumeButton.disabled = false;
        });

        resumeButton.addEventListener("click", function () {
          player.resume();
          pauseButton.disabled = false;
          resumeButton.disabled = true;
        });

        startSynthesisAsyncButton.addEventListener("click", function () {
          //resultsDiv.innerHTML = "";
          //eventsDiv.innerHTML = "";
          wordBoundaryList = [];
          synthesisText = document.getElementById("synthesisText");

          // if we got an authorization token, use the token. Otherwise use the provided subscription key
          var speechConfig;
          if (authorizationToken) {
            speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
              authorizationToken,
              "eastus"
            );
          } else {
            //if (subscriptionKey.value === "" || //subscriptionKey.value === "subscription") {
            //  alert("Please enter your Microsoft Cognitive //Services Speech subscription key!");
            //  return;
            //}
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
              subscriptionKey,
              regionOptions
            );
          }

          speechConfig.speechSynthesisVoiceName = voiceOptions;
          speechConfig.speechSynthesisOutputFormat = "webm";

          player = new SpeechSDK.SpeakerAudioDestination();
          player.onAudioStart = function (_) {
            window.console.log("playback started");
            setTimeout(function () {
              $("svg path :first-child").each(function (i) {
                this.beginElement();
              });
            }, 0.5);
          };
          player.onAudioEnd = function (_) {
            window.console.log("playback finished");
            //eventsDiv.innerHTML += "playback finished" + "\r\n";
            startSynthesisAsyncButton.disabled = false;
           // downloadButton.disabled = true;
            pauseButton.disabled = true;
            resumeButton.disabled = true;
            wordBoundaryList = [];
          };

          var audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player);

          synthesizer = new SpeechSDK.SpeechSynthesizer(
            speechConfig,
            audioConfig
          );

          // The event synthesizing signals that a synthesized audio chunk is received.
          // You will receive one or more synthesizing events as a speech phrase is synthesized.
          // You can use this callback to streaming receive the synthesized audio.
          synthesizer.synthesizing = function (s, e) {
            window.console.log(e);
            //console.log((synthesizing)  + "Reason: " + SpeechSDK.ResultReason[e.result.reason] +
            //"Audio chunk length: " + e.result.audioData.byteLength);
          };

          // The synthesis started event signals that the synthesis is started.
          synthesizer.synthesisStarted = function (s, e) {
            window.console.log(e);
            pauseButton.disabled = false;
          };

          // The event synthesis completed signals that the synthesis is completed.
          synthesizer.synthesisCompleted = function (s, e) {
            console.log(e);
          };

          // The event signals that the service has stopped processing speech.
          // This can happen when an error is encountered.
          synthesizer.SynthesisCanceled = function (s, e) {
            const cancellationDetails =
              SpeechSDK.CancellationDetails.fromResult(e.result);
            let str =
              "(cancel) Reason: " +
              SpeechSDK.CancellationReason[cancellationDetails.reason];
            if (
              cancellationDetails.reason === SpeechSDK.CancellationReason.Error
            ) {
              str += ": " + e.result.errorDetails;
            }
            window.console.log(e);
            startSynthesisAsyncButton.disabled = false;
           // downloadButton.disabled = true;
            pauseButton.disabled = true;
            resumeButton.disabled = true;
          };

          // This event signals that word boundary is received. This indicates the audio boundary of each word.
          // The unit of e.audioOffset is tick (1 tick = 100 nanoseconds), divide by 10,000 to convert to milliseconds.
          synthesizer.wordBoundary = function (s, e) {
            window.console.log(e);
            wordBoundaryList.push(e);
          };

          synthesizer.visemeReceived = function (s, e) {
            //window.console.log(e);
            talkingHeadDiv.innerHTML = e.animation.replaceAll(
              'begin="0.5s"',
              'begin="indefinite"'
            );
            $("svg").width("500px").height("500px");
          };

          synthesizer.bookmarkReached = function (s, e) {
            window.console.log(e);
            //eventsDiv.innerHTML +=  "(Bookmark reached), Audio offset: " + e.audioOffset / 10000 + "ms. Bookmark text: " + e.text + '\n';
          };

          const complete_cb = function (result) {
            if (
              result.reason ===
              SpeechSDK.ResultReason.SynthesizingAudioCompleted
            ) {
              console.log("synthesis finished");
            } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
              console.log(
                "synthesis failed. Error detail: " + result.errorDetails
              );
            }
            window.console.log(result);
            synthesizer.close();
            synthesizer = undefined;
          };
          const err_cb = function (err) {
            startSynthesisAsyncButton.disabled = false;
            //downloadButton.disabled = true;
            phraseDiv.innerHTML += err;
            window.console.log(err);
            synthesizer.close();
            synthesizer = undefined;
          };

          startSynthesisAsyncButton.disabled = true;
          //downloadButton.disabled = true;
          //me
          var x = jQuery.parseXML(xmlstring);
          var y = new XMLSerializer().serializeToString(x);
          //me
          synthesizer.speakSsmlAsync(y, complete_cb, err_cb);
        });

      // downloadButton.addEventListener("click", function () {
      //   //resultsDiv.innerHTML = "";
      //   eventsDiv.innerHTML = "";
      //   synthesisText = document.getElementById("synthesisText");

      //   var speechConfig;

      //   // if we got an authorization token, use the token. Otherwise use the provided subscription key
      //   if (authorizationToken) {
      //     speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
      //       authorizationToken,
      //       regionOptions.value
      //     );
      //   } else {
      //     if (
      //       subscriptionKey.value === "" ||
      //       subscriptionKey.value === "subscription"
      //     ) {
      //       alert(
      //         "Please enter your Microsoft Cognitive Services Speech subscription key!"
      //       );
      //       return;
      //     }
      //     speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      //       subscriptionKey.value,
      //       regionOptions.value
      //     );
      //   }

      //   speechConfig.speechSynthesisVoiceName = voiceOptions.value;
      //   speechConfig.speechSynthesisOutputFormat = formatOptions.value;

      //   synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

      //   synthesizer.SynthesisCanceled = function (s, e) {
      //     const cancellationDetails =
      //       SpeechSDK.CancellationDetails.fromResult(e.result);
      //     let str =
      //       "(cancel) Reason: " +
      //       SpeechSDK.CancellationReason[cancellationDetails.reason];
      //     if (
      //       cancellationDetails.reason === SpeechSDK.CancellationReason.Error
      //     ) {
      //       str += ": " + e.result.errorDetails;
      //     }
      //     window.console.log(e);
      //     eventsDiv.innerHTML += str + "\r\n";
      //     //resultsDiv.innerHTML = str;
      //     startSynthesisAsyncButton.disabled = false;
      //     //downloadButton.disabled = true;
      //     pauseButton.disabled = true;
      //     resumeButton.disabled = true;
      //   };

      //   synthesizer.synthesisCompleted = function (s, e) {
      //     console.log("synthesis finished");
      //     synthesizer.close();
      //     a = document.createElement("a");
      //     url = window.URL.createObjectURL(new Blob([e.result.audioData]));
      //     a.href = url;
      //     //a.download =
      //     //  "synth." +
      //     //  getExtensionFromFormat(
      //     //    formatOptions.options[formatOptions.//selectedIndex].text
      //     //  )
      //     ;
      //     document.body.appendChild(a);
      //     a.click();
      //     setTimeout(function () {
      //       document.body.removeChild(a);
      //       window.URL.revokeObjectURL(url);
      //     }, 0);
      //     startSynthesisAsyncButton.disabled = false;
      //     //downloadButton.disabled = true;
      //   };

      //   startSynthesisAsyncButton.disabled = true;
      //   //downloadButton.disabled = true;

      //   synthesizer.speakSsmlAsync(y, complete_cb, err_cb);
      // });

        Initialize(function (speechSdk) {
          SpeechSDK = speechSdk;
          startSynthesisAsyncButton.disabled = false;
          //downloadButton.disabled = true;
          pauseButton.disabled = true;
          resumeButton.disabled = true;

          //formatOptions.innerHTML = "";
          Object.keys(SpeechSDK.SpeechSynthesisOutputFormat).forEach(
            (format) => {
              if (isNaN(format) && !format.includes("Siren")) {
                formatOptions.innerHTML +=
                  '<option value="' +
                  SpeechSDK.SpeechSynthesisOutputFormat[format] +
                  '">' +
                  format +
                  "</option>";
              }
            }
          );
          formatOptions.selectedIndex =
            SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

          // in case we have a function for getting an authorization token, call it.
          if (typeof RequestAuthorizationToken === "function") {
            RequestAuthorizationToken();
          }
        });
      });

      ////////////////////synth endpoint





