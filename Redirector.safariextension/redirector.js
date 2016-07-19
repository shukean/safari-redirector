function getTarget(element) {
    if (element.nodeName == 'LINK' && element.type == 'text/css'){
        return 'style';
    }else{
        return element.nodeName.toLowerCase();
    }
}

function getScript(url) {
    var data = localStorage.getItem(url) || '';
    if (!data){
        try{
            var req = new XMLHttpRequest();
            req.open('get', url, false);
            req.send();
            if (req.status == 200){
                data = req.responseText;
                localStorage.setItem(url, data);
            }
        }catch(e){}
    }
    return data;
}

function checkCanLoad(url) {
    var urllist = [
        ['s?://ajax.googleapis.com', '://ajax.useso.com'],
        ['s?://fonts.googleapis.com', '://fonts.useso.com']
    ];

    //compatible ellipsis
    if (url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0){
        url = 'http:' + url;
    }

    for (var k in urllist) {
        try{
            // alert(url);
            // alert(urllist[k][0]);
            var re = new RegExp(urllist[k][0])
            isMatch = re.test(url)
            if (isMatch){
                var replace_str = url.match(re);
                return {
                    type : 'redirect',
                    to : url.replace(replace_str, urllist[k][1])
                }
            }
        }catch (e){
            console.error(e.getMessage())
        }
    }

    return {
        type : 'ok'
    }
}

document.addEventListener("beforeload", function(event){
    var element = event.target;
    var target = getTarget(element);
    
    //check url
    if (target == 'style' || target == 'script') {
        response = checkCanLoad(event.url);
        if (response.type == 'redirect'){
            console.warn(target + ":" + event.url + " is redirected to " + response.to);
            if (target == 'style') {
                element.href = response.to;
                event.preventDefault();
            }else if (target == 'script'){
                var script = document.createElement('script')
                script.innerHTML = getScript(response.to);
                document.head.insertBefore(script, document.head.firstChild);
                event.preventDefault();
            }
        }
    }
    return;
}, true);