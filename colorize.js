function update_storage()
{
    localStorage.setItem(document.getElementById('fileInput').value, document.getElementById('bytes').innerHTML);
}
function highlight()
{
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var fragment = range.extractContents();//.textContent;
    var node = document.createElement('a');
    node.appendChild(fragment.cloneNode(true));
    node.setAttribute("class", document.getElementById('current').className)
    range.insertNode(node);
    selection.removeAllRanges();
    update_storage();
}
function clear_bytes()
{
    localStorage.removeItem(document.getElementById('fileInput').value);
    document.getElementById('bytes').innerHTML = ""
}
function save_file()
{
    var a = window.document.createElement('a');
    var content = document.getElementById('bytes').innerHTML;
    a.href = window.URL.createObjectURL(new Blob([content], {type: 'text/html'}));
    a.download = document.getElementById('fileInput').value + '.html';
    document.body.appendChild(a)
        a.click();
    document.body.removeChild(a)
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
function fill_data(shorts, bytes, floats, start)
{
    var addressesDiv = document.getElementById('addresses');
    var shortsDiv = document.getElementById('shorts');
    var floatsDiv = document.getElementById('floats');
    var charsDiv = document.getElementById('chars');
    var bytesDiv = document.getElementById('bytes');
    if(start == undefined) {
        start = 0;
        charsDiv.innerHTML = ""
            bytesDiv.innerHTML = ""
            shortsDiv.innerHTML = ""
            addressesDiv.innerHTML = ""
            floatsDiv.innerHTML = ""
    }
        var i = start;
        var end = start + 512;
        if(end > bytes.length) end = bytes.length;
        for(; i < end; i++) {
            if(i % 16 == 0) addressesDiv.innerHTML += i.toString(16) + "<br/>";
            if(i % 2 == 0) shortsDiv.innerHTML += shorts[i/2] + " ";
            if(i % 4 == 0) floatsDiv.innerHTML += floats[i / 4] + " ";
            var b = bytes[i].toString(16)
                while(b.length < 2) b = "0" + b
                    bytesDiv.innerHTML += b + " ";
            if(32 < bytes[i] && bytes[i] < 127)
                charsDiv.innerHTML += String.fromCharCode(bytes[i]);
            else charsDiv.innerHTML += '.'
                if(i % 16 == 15)
                {
                    floatsDiv.innerHTML += "<br/>"
                        bytesDiv.innerHTML += "<br/>"
                        charsDiv.innerHTML += "<br/>"
                        shortsDiv.innerHTML += "<br/>"
                }
                else if(i % 4 == 3) bytesDiv.innerHTML += " "
        }
        if(i >= (bytes.length - 1))
        {
              var item = localStorage.getItem(fileInput.value);
              if(item != null)
                  bytesDiv.innerHTML = item;
              document.getElementById('status').innerHTML = '';
        }
        else
        {
            document.getElementById('status').innerHTML = "" + Math.floor(i * 100.0 / bytes.length) + "%";
            setTimeout(function() { fill_data(shorts, bytes, floats, i) }, 1000);
        }
}
function setup_file_input()
{
    var bytesDiv = document.getElementById('bytes');
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
              var start = new Date().getTime();
              document.title = "Colorize - " + fileInput.value
              var shorts = new Int16Array(reader.result);
              var bytes = new Uint8Array(reader.result);
              var floats = new Float32Array(reader.result);
              fill_data(shorts, bytes, floats);
              var end = new Date().getTime();
              console.log(end - start);
              }
            reader.readAsArrayBuffer(file);    
            });
    var hexaFileInput = document.getElementById('hexaFileInput');
    hexaFileInput.addEventListener('change', function(e) {
            var file = hexaFileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                bytesDiv.innerHTML = reader.result;
                update_storage();
            }
            reader.readAsText(file);
    });
}
