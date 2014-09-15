function update_storage()
{
    var name = document.getElementById('fileInput').value;
    var new_value = document.getElementById('bytes').innerHTML
    localStorage.setItem(name + "_", localStorage.getItem(name));
    localStorage.setItem(name, new_value);
}
function cancel()
{
    var name = document.getElementById('fileInput').value;
    var new_value = document.getElementById('bytes').innerHTML;
    var old_value = localStorage.getItem(name + "_");
    localStorage.setItem(name, old_value);
    localStorage.setItem(name + "_", new_value);
    document.getElementById('bytes').innerHTML = old_value;
}
function remove_anchors(node)
{
    console.log(node);
    var anchors = node.querySelectorAll('a');
    for(var i = 0; i < anchors.length; i++)
        anchors[i].setAttribute("class", 'none')
}
function highlight()
{
    if(document.getElementById('disabled').checked) return;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var fragment = range.extractContents();//.textContent;
    var node = document.createElement('a');
    var class_name = document.getElementById('current').className;
    var old_node = fragment.cloneNode(true);
    if(class_name == 'none') remove_anchors(old_node);
    node.appendChild(old_node);
    node.setAttribute("class", class_name)
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
function fill_data(shorts, bytes, floats, start, stop)
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
    var addresses_str = "";
    var floats_str = "";
    var bytes_str = "";
    var chars_str = "";
    var shorts_str = "";

        var i = start;
        var end = start + 2048;
        if(end > stop) end = stop;
        for(; i < end; i++) {
            if(i % 16 == 0) addresses_str += i.toString(16) + "<br/>";
            if(i % 2 == 0) shorts_str += shorts[i/2] + " ";
            if(i % 4 == 0) floats_str += floats[i / 4] + " ";
            var b = bytes[i].toString(16)
                while(b.length < 2) b = "0" + b
                    bytes_str += b + " ";
            if(32 < bytes[i] && bytes[i] < 127)
                chars_str += String.fromCharCode(bytes[i]);
            else chars_str += '.'
                if(i % 16 == 15)
                {
                    floats_str += "<br/>"
                        bytes_str += "<br/>"
                        chars_str += "<br/>"
                        shorts_str += "<br/>"
                }
                else if(i % 4 == 3) bytes_str += " "
        }
        addresses_str.innerHTML += floats_str;
        floatsDiv.innerHTML += floats_str;
        bytesDiv.innerHTML += bytes_str;
        charsDiv.innerHTML += chars_str;
        shortsDiv.innerHTML += shorts_str;
        if(i >= (stop - 1))
        {
              var item = localStorage.getItem(fileInput.value);
              if(item != null)
                  bytesDiv.innerHTML = item;
              document.getElementById('status').innerHTML = '';
        }
        else
        {
            document.getElementById('status').innerHTML = "" + Math.floor(i * 100.0 / stop) + "%";
            setTimeout(function() { fill_data(shorts, bytes, floats, i, stop) }, 1000);
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
              var stop = bytes.length;
              //if(stop > 10240) stop = 10240;
              fill_data(shorts, bytes, floats, undefined, stop);
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
