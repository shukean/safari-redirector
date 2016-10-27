
var defaultRules = "//ajax.googleapis.com,//ajax.useso.com\n//fonts.googleapis.com,//fonts.useso.com";
document.addEventListener("DOMContentLoaded", function(){
    var $rules = document.getElementById("rules");
    $rules.focus();
    $rules.innerText = localStorage.getItem("redirectorRules_text") || defaultRules;

    var rules = [];
    $rules.addEventListener("keyup", function(e){
         rules = [],
            w_arr = $rules.innerText.split("\n");
        for (var k in w_arr){
            var v = w_arr[k];
            if (v.trim() != ""){
                rules.push(v.trim().split(','));
            }
        }
        var _text = $rules.innerText,
            _json = JSON.stringify(rules);
        localStorage.setItem("redirectorRules_text", _text);
        localStorage.setItem("redirectorRules_json", _json);

        if (safari){
            safari.self.tab.dispatchMessage("saveRules", {
                'text' : _text,
                'json' : _json,
            });
        }
    });

    var linkOpenType = document.getElementById("linkOpenType");
    var val = localStorage.getItem("redirectorLinkOpenType") || 1;
    linkOpenType.checked = val ? true : false;
    linkOpenType.addEventListener("click", function(e){
        var _val = linkOpenType.checked;
        localStorage.setItem("redirectorLinkOpenType", _val ? 1 : -1);

        if (safari){
            safari.self.tab.dispatchMessage("saveLinkOpenType", {
                'val' : _val
            });
        }

    });

});