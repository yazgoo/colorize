function highlight()
{
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var contents = range.extractContents().textContent;
    console.log(contents);
    var node = document.createElement('a');
    node.innerHTML = contents;
    node.setAttribute("class", document.getElementById('current').className)
    range.insertNode(node);
    selection.removeAllRanges();
    localStorage.setItem(document.getElementById('fileInput').value, document.getElementById('bytes').innerHTML);
}
function clear_bytes()
{
    localStorage.removeItem(document.getElementById('fileInput').value);
    document.getElementById('bytes').innerHTML = ""
}

function select_class(_style) 
{
    document.getElementById('current').className = _style;
}
function fill_caption()
{
    var what = document.getElementById('caption')
    var classes = colors;
    for(i in classes) {
        what.innerHTML += " <a class="+i+" onclick=\"select_class('"+i+"')\">"+classes[i]+"</a>"
    }
}
function setup_file_input()
{
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
              var shorts = new Int16Array(reader.result);
              var addressesDiv = document.getElementById('addresses');
              var shortsDiv = document.getElementById('shorts');
              var floatsDiv = document.getElementById('floats');
              var bytesDiv = document.getElementById('bytes');
              var charsDiv = document.getElementById('chars');

              for(i in shorts) {
                  if(i % 8 == 0) addressesDiv.innerHTML += i.toString(16) + "<br/>";
                  shortsDiv.innerHTML += shorts[i] + " ";
                  if(i % 8 == 7) shortsDiv.innerHTML += "<br/>"
              }
              var floats = new Float32Array(reader.result);
              for(i in floats) {
                  floatsDiv.innerHTML += floats[i] + " ";
                  if(i % 4 == 3) floatsDiv.innerHTML += "<br/>"
              }
              var bytes = new Uint8Array(reader.result);
              for(i in bytes) {
                  var b = bytes[i].toString(16)
                  while(b.length < 2) b = "0" + b
                  bytesDiv.innerHTML += b + " ";
                  if(32 < bytes[i] && bytes[i] < 127)
                      charsDiv.innerHTML += String.fromCharCode(bytes[i]);
                  else charsDiv.innerHTML += '.'
                  if(i % 16 == 15)
                  {
                      bytesDiv.innerHTML += "<br/>"
                      charsDiv.innerHTML += "<br/>"
                  }
              }
              document.title = "Colorize - " + fileInput.value
              var item = localStorage.getItem(fileInput.value);
              if(item != null)
                  bytesDiv.innerHTML = item;
              }
            reader.readAsArrayBuffer(file);    
            });
}
