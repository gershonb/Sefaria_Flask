# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE.md file in the project root for full license information.

# <code>
import random

import azure.cognitiveservices.speech as speechsdk

# Creates an instance of a speech config with specified subscription key and service region.
# Replace with your own subscription key and service region (e.g., "westus").
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer
from azure.cognitiveservices.speech.audio import AudioOutputConfig
from azure.cognitiveservices.speech import AudioDataStream, SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat
from azure.cognitiveservices.speech.audio import AudioOutputConfig

# Set connection
speech_key, service_region = "7cfbb0338ef045bc824ade056a7282f9", "eastus"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

# Creates a speech synthesizer using the default speaker as audio output.
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)


##############
def synth_audio_file(xml_string, file_name):
    print("in sync audio")
    # create audio file
    audio_config = speechsdk.audio.AudioOutputConfig(filename=file_name)
    synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    synthesizer.speak_ssml_async(xml_string)
    # print("done sync audio")

# response = requests.get("https://www.sefaria.org/api/texts/Mishnah_Berakhot.1")
# hebrew = removeHTMLCode(response.json()['he'][:2])
# english = removeHTMLCode(response.json()['text'][:2])
# synth_audio_return_path(generate_xml(format_both(hebrew, english)), "x")


# synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)
# ssml_string = open("ssml.xml", "r", encoding="utf8").read()
# result = speech_synthesizer.speak_ssml_async(ssml_string).get()
## Checks result.
# if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#    print("Speech synthesized to speaker for text [{}]".format(ssml_string))
# elif result.reason == speechsdk.ResultReason.Canceled:
#    cancellation_details = result.cancellation_details
#    print("Speech synthesis canceled: {}".format(cancellation_details.reason))
#    if cancellation_details.reason == speechsdk.CancellationReason.Error:
#        if cancellation_details.error_details:
#            print("Error details: {}".format(cancellation_details.error_details))
#    print("Did you update the subscription info?")
