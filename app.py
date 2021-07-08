import os
import re

from flask import Flask, render_template, request, url_for
from pip._vendor import requests
from werkzeug.utils import redirect
import os.path
from os import path
from Model import Test
from Model.Test import combine_Lists, combine_Lists_html, generate_xml, format_both, removeHTMLCode, format_hebrew, \
    format_english
from Model.model import synth_audio_file

app = Flask(__name__)
language = ""
hebrew_text = ""
english_text = ""
both = ""
audio_filepath = ""
new_path = ""


# prime_categories = ['Tanakh', 'Mishnah', 'Talmud', 'Midrash', 'Halakhah', 'Kabbalah', 'Liturgy', 'Jewish Thought',
# 'Tosefta', 'Chasidut', 'Musar', 'Responsa', 'Second Temple', 'Reference']

def get_api_url(url):
    source = re.search(r"[^/]*/[^/]*/[^/]*/([^.]*.[^.]|[^?])", url)
    source = source.group(1)
    return source


@app.route('/', methods=['POST', 'GET'])
def index():
    global hebrew, english, language, hebrew_text, english_text, both, audio_filepath, new_path
    if request.method == 'POST':
        url = request.form["url_input"]
        print(url)
        voice = request.form["Voices"]
        print("Voice: " + voice)
        source = get_api_url(url)
        api_url = "https://www.sefaria.org/api/texts/" + source
        response = requests.get(api_url)
        hebrew_text = response.json()['he'][:50]
        english_text = response.json()['text'][:50]
        both = '<br>'.join(combine_Lists_html(hebrew_text, english_text)[:50])
        #############
        hebrew = removeHTMLCode(response.json()['he'][:50])
        english = removeHTMLCode(response.json()['text'][:50])
        # Check voice
        if voice == "English":
            xml = format_english(english)
        elif voice == "Hebrew":
            xml = format_hebrew(hebrew)
        else:
            xml = format_both(hebrew, english)
        # generate xml, create audio, and relocate audio to static\audio
        file_name = source + "+" + voice
        file_name = file_name.replace(".", "")
        file_name = file_name + ".wav"
        if path.exists(app.root_path + '\\static\\audio\\' + file_name):
            print("FILE ALREADY EXISTS", file_name)
            new_path = "static\\audio\\" + file_name
            generate_xml(format_both(hebrew, english))
        else:
            synth_audio_file(generate_xml(xml), file_name)
            print("CREATED NEW FILE:", app.root_path, '\\static\\audio\\', file_name)
            new_abs_path = app.root_path + '\\static\\audio\\' + file_name
            os.rename(app.root_path + '\\' + file_name, new_abs_path)
            new_path = "static\\audio\\" + file_name
    return render_template('index.html', language=language, text_he=hebrew_text, text_en=english_text, both=both,
                           audio_filepath=new_path)


if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
