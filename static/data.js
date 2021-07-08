var language = "Both";

function cleanHTML(raw_html) {
  var result = raw_html.replace(/(<([^>]+)>)/gi, "");
  return result;
}

function remove_symbols(st) {
  st = st.replace("{פ}", "");
  st = st.replace("{ס}", "");
  // print(st)
  // traverse in the string
  // str1 = ""
  // for ele in st:
  //    str1 += ele + " "
  // print(str1)
  return st;
}


function combine_lists(arr1, arr2) {
  result = [arr1, arr2]
    .reduce((r, a) => (a.forEach((a, i) => (r[i] = r[i] || []).push(a)), r), [])
    .reduce((a, b) => a.concat(b));

  return result;
}

function format_hebrew(he_list) {
  var result = [];
  for (var i = 0; i < he_list.length; i++) {
    //data = replace_Name(he_list[i]);
    //data = remove_symbols(data);
    var x = `<voice name="he-IL-AvriNeural">` + he_list[i] + `</voice>`;
    x = x.replace("&nbsp", "");
    result.push(x);
  }
  return result;
}

function format_english(en_list) {
  var result = [];
  for (var i = 0; i < en_list.length; i++) {
    //data = replace_Name(he_list[i]);
    //data = remove_symbols(data);
    var x = `<voice name="en-US-JacobNeural">` + en_list[i] + `</voice>`;
    //x = x.replace("&nbsp", "");
    result.push(x);
  }
  return result;
}


function generate_xml(arr) {
  // add header
  var result = "";
  var header = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">`;
  result += header + "\n";
  // add content
  result += arr.join(" ");
  // add footer
  var footer = "</speak>";
  result += footer;
  return result;
}
//////////////////////////////////////////////////////////////////////////////////

var jdata;
var english_list = [];
var hebrew_list = [];
var english_list_clean = [];
var hebrew_list_clean = [];
var combined_list = [];
var combined_list_clean_formatted = [];
var final_both = "";
var final_he = "";
var final_en = "";
var xml_b = document.getElementById("xmltest");



function createXML(json) {
  console.log("IN createXML");
  jdata = json;
  //console.log(jdata);
    hebrew_list = jdata.he;
    english_list = jdata.text;
  //create clean versions
  for (const iterator of english_list) {
    english_list_clean.push(cleanHTML(iterator));
  }
  for (const iterator of hebrew_list) {
    hebrew_list_clean.push(cleanHTML(iterator));
  }
  //console.log(hebrew_list_clean);
  combined_list = combine_lists(hebrew_list, english_list);
  
  
  combined_list_clean_formatted = combine_lists(
    format_hebrew(hebrew_list_clean),
    format_english(english_list_clean)
    );
    console.log(combined_list_clean_formatted);
    //console.log(generate_xml(combined_list_clean_formatted));
  //combined_list_clean_formatted.forEach(remove_symbols);
  // citrus = fruits.slice(1, 3);
  final_both = generate_xml(combined_list_clean_formatted.slice(0, 50));
  final_he = generate_xml(format_hebrew(hebrew_list_clean.slice(0, 50)));
  final_en = generate_xml(format_english(english_list_clean.slice(0, 50)));

  create_html();
}

function create_html_list(lst) {
  var i = 1;
  lst.forEach(function(part, index) {
    if (i%2 == 0){
      var he_id_beg = `<div id="he_text">`;
      var he_id_end = `</div>`;
      this[index] = he_id_beg + this[index] + he_id_end;
  }
  else{
    var en_id_beg = `<div id="en_text">`;
      var en_id_end = `</div>`;
      this[index] = en_id_beg + this[index] + en_id_end;
  }
  i+=1;
  }, lst); 
}
