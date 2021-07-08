# First try


import re
from pip._vendor import requests
import xml.etree.ElementTree as ET
from xml.dom import minidom

limit = 10


def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext


def removeHTMLCode(lst):
    result = []
    for i in lst:
        result.append(cleanhtml(i))

    return result


def combine_Lists(lst1, lst2):
    result = ""
    x = [sub[item] for item in range(len(lst2))
         for sub in [lst1, lst2]]
    # print(x)
    # print(x[0])
    # print(x[1])
    # for i in x:
    #    result += i + "\n"
    # print(result)
    return x


def combine_Lists_html(he, en):
    he = ["<span class= \"hebrew_css\">" + x + "</span>" for x in he]
    en = ["<span class= \"english_css\">" + x + "</span><br>" for x in en]
    x = [sub[item] for item in range(len(en)) for sub in [he, en]]
    # print(x[0])
    # print(x[1])
    # for i in x:
    #    result += i + "\n"
    # print(result)
    return x


def stripVowels(rawString):
    new_string = ""
    for i in rawString:
        if '֑֑ ' <= i <= 'ׇ ':
            pass
        else:
            new_string += i
    # print(rawString, new_string)
    return new_string


def replace_with_Hashem(st):
    word = "יהוה"
    word2 = "ליהוה"
    st = st.split(" ")
    for i in range(0, len(st)):
        # print(word,stripVowels2(i))
        if word == stripVowels(st[i]) or word2 == stripVowels(st[i]):
            # st[i] = "<phoneme alphabet=\"ipa\" ph=\"hɑɕɛm\">" + st[i] + "</phoneme>"
            st[i] = "<phoneme alphabet=\"ipa\" ph=\"ɑdoʊnɑj\">" + st[i] + "</phoneme>"
    # print(st)
    # traverse in the string
    str1 = ""
    for ele in st:
        str1 += ele + " "
    # print(str1)
    return str1


def replace_with_Elokecha(st):
    # TODO: It adds to XML but doesn't play
    word = "אלהיך"
    st = st.split(" ")
    for i in range(0, len(st)):
        # print(word, stripVowels(st[i]))
        if word == stripVowels(st[i]):
            # print("Match")
            # st[i] = "<phoneme alphabet=\"ipa\" ph=\"ɛloʊkɛʃə\">" + st[i] + "</phoneme>"
            st[i] = "<phoneme alphabet=\"ipa\" ph=\"ɛɛɛɛɛɛɛɛ\">" + "test" + "</phoneme>"

    # print(st)
    # traverse in the stringk
    str1 = ""
    for ele in st:
        str1 += ele + " "
    # print(str1)
    return str1


def replace_Name(st):
    #st = replace_with_Elokecha(st)
    st = replace_with_Hashem(st)
    return st


def remove_symbols(st):
    st = st.replace(" ", "")
    st = st.replace("{פ}", "")
    st = st.replace("{ס}", "")
    # print(st)
    # traverse in the string
    # str1 = ""
    # for ele in st:
    #    str1 += ele + " "
    # print(str1)
    return st


def format_hebrew(he_list):
    result = []
    for i in range(0, len(he_list)):
        data = replace_Name(he_list[i])
        data = remove_symbols(data)
        x = """<voice name="he-IL-AvriNeural">""" + data + """ּ</voice>"""
        x = x.replace("&nbsp", "")
        result.append(x)
    return result


def format_english(en_list):
    result = []
    for i in range(0, len(en_list)):
        data = en_list[i]
        # print("number of dots: " + str(data.count("\u05BC")))
        # data = data.replace("\u05BC", "")
        x = """<voice name="en-US-JacobNeural">""" + data + """ּ</voice>"""
        result.append(x)

    return result


def format_both(he_list, en_list):
    result = combine_Lists(format_hebrew(he_list), format_english(en_list))
    # remove random dot after english sentence (eg. Genesis 1 verse 3)
    en_count = 1
    for i in range(0, len(result)):
        if en_count % 2 == 0:
            result[i] = result[i].replace("\u05BC", "")
        en_count += 1
    return result


def list_to_str(lst):
    result = ""
    for i in lst:
        result += i + "\n"
    return result


def generate_xml(lst):
    result = ""
    # add header
    header = ""
    header = """<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">"""
    result += header + "\n"
    # add content
    result += list_to_str(lst)
    # add footer
    footer = "</speak>"
    result += footer
    return result


def xmlTest():
    # hebrew = removeHTMLCode(response.json()['he'])
    # english = removeHTMLCode(response.json()['text'])
    # generate_xml(format_both(hebrew, english))
    # generate_xml(format_both(hebrew, english))
    return []
