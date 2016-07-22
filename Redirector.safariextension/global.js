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

function checkCanLoad(event) {
    var urllist = JSON.parse(localStorage.getItem("redirectorRules_json"));
    var url = event.message.url,
        type = event.message.type;

    for (var k in urllist) {
        try{
            var str = urllist[k][0],
                str_replace = urllist[k][1];

            if (str == "" || str_replace == ""){
                console.log("rule text is fail");
                console.error(urllist[k]);
                continue;
            }

            var re = new RegExp(str);
            isMatch = re.test(url)
            if (isMatch){
                var replace_str = url.match(re);
                var to = url.replace(replace_str, str_replace);
                if (type == "script"){
                    event.message = {
                        type : 'redirect',
                        to : to,
                        data : getScript(to)
                    }
                }else{
                    event.message = {
                        type : 'redirect',
                        to : to
                    }
                }
                return;
            }
        }catch (e){
            console.error(e.getMessage())
        }
    }

    event.message = {
        type : 'ok'
    }
    return;
}

function openTab(url) {
    var tab;
    if (safari.application.activeBrowserWindow){
        tab = safari.application.activeBrowserWindow.openTab('foreground');
    }else{
        tab = safari.application.openBrowserWindow().activeTab;
    }
    tab.url = safari.extension.baseURI + url;
}

safari.application.addEventListener('message', function(event){
    switch (event.name){
        case "canLoad":
            if (event.message.name == "checkUrl"){
                checkCanLoad(event);
            }
            break;
        case "saveRules":
            var message = event.message;
            localStorage.setItem('redirectorRules_json', message.json);
            localStorage.setItem('redirectorRules_text', message.text);
            break;
    }
    return;
}, false)


safari.extension.settings.addEventListener("change", function(e) {
    if (e.key == 'openRedirectorAddRules'){
        openTab("setting.html");
    }
        
}, false);