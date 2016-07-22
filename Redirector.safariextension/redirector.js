function getTarget(element) {
    if (element.nodeName == 'LINK' && element.type == 'text/css'){
        return 'style';
    }else{
        return element.nodeName.toLowerCase();
    }
}

var protocol = window.location.protocol;
document.addEventListener("beforeload", function(event){
    var element = event.target;
    if (!element.nodeName) return;
    var target = getTarget(element);
    //check url
    if (target == 'style' || target == 'script') {
        var url = event.url;
        if (url.indexOf("http") !== 0){
            url = protocol + url;
        }

        response = safari.self.tab.canLoad(event, {
            name : "checkUrl",
            url : url,
            type : target,
        });
        console.log(response)
        if (response.type == 'redirect'){
            console.warn(target + ":" + event.url + " is redirected to " + response.to);
            if (target == 'style') {
                element.href = response.to;
                event.preventDefault();
            }else if (target == 'script'){
                var script = document.createElement('script')
                script.innerHTML = response.data;
                document.head.insertBefore(script, document.head.firstChild);
                event.preventDefault();
            }
        }
    }
    return;
}, true);