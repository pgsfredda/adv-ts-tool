function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    
    xhr.open("GET", path, true);
    xhr.send();
}

function errHandle(err, msg) {
    document.getElementById('result').innerHTML = '<h3>' + err + '</h3><h4>' + msg + '</h4>';
    throw err + '.\n' + msg;
}

var par;

(function main(){
    par = getUrlParameter('story') || (document.getElementById('story')?document.getElementById('story').textContent : '');
    if(!par && typeof story !== "undefined") par = story;    

    //loadJSON('./stories.json', startStory, function(xhr) { console.error(xhr); });

    //errHandle('Error: no story data request', 'You can choose the story using a get parameter "story" (raccomended) or editing index.html file inserting a div with id "story" or setting a var "story" in <string> tag')
}());

function isArray(data) {
    return (data && typeof data === 'object' && data.length && data.length >=0);
}

function startStory(data) {
    var storyData;

    if(data && typeof data === 'object') { 
        if(!isArray(data)) storyData = data
        else if(data.length == 0) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter')
        else if(data.length == 1 && !par) storyData = data[0]
        else if(data.length == 1 && data[0].name != par) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter or story parameter')
        else storyData = data.find((d) => {return (d.name == par)})
    }

    if(!storyData) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter or story parameter');

    par = storyData.name || par;
    if(!(storyData.name && storyData.class && storyData.file)) errHandle(`Error: story${par ? ` '${par}'` : ''} not correctly defined`, `You have to define all field in stories.json file or in startStory function parameter. Now is: {name: '${storyData.name}' class: '${storyData.class}', file: '${storyData.file}'}`);

    System.import(storyData.file)
        .then(function(m){ 
            var tmp = new m[storyData.class]();
            System.import('app/pg-adv-app')
                .then(function(m){ new m.pgAdvApp(tmp); })
                .catch(function(error) { 
                    errHandle(`Error: app starting error`, error);
                })
        })
        .catch(function(error) { 
            errHandle(`Error: story starting error`, `{name: '${storyData.name}' class: '${storyData.class}', file: '${storyData.file}'}`);
        })
}
