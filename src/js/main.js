(function main() {
    par = getUrlParameter('story') || (document.getElementById('story') ? document.getElementById('story').textContent : '');
    if (!par && typeof story !== "undefined") par = story;

    //loadJSON('./stories.json', startStory, function(xhr) { console.error(xhr); });

    //errHandle('Error: no story data request', 'You can choose the story using a get parameter "story" (raccomended) or editing index.html file inserting a div with id "story" or setting a var "story" in <string> tag')
}());

var par;
/**
 * Starts the story importing it from System and passing storyData struct fino
 *
 * @param {*} data
 */
async function startStory(data) {
    var storyData;

    if (data && typeof data === 'object') {
        if (!Array.isArray(data)) storyData = data
        else if (data.length == 0) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter')
        else if(data.length == 1 && !par) storyData = data[0]
        else if(data.length == 1 && data[0].name != par) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter or story parameter')
        else storyData = data.find((d) => {return (d.name == par)})
    }

    if(!storyData) errHandle(`Error: story${par ? ` '${par}'` : ''} not defined`, 'Check stories.json file or startStory function parameter or story parameter');

    par = storyData.name || par;
    if(!(storyData.name && storyData.class && storyData.file && storyData.lang)) errHandle(`Error: story${par ? ` '${par}'` : ''} not correctly defined`, `You have to define all field in stories.json file or in startStory function parameter. Now is: {name: '${storyData.name}' class: '${storyData.class}', file: '${storyData.file}', lang: '${sotryData.lang}'}`);

    var verbs, messages, compass, story, step, m;

    try {
        step = 'verbs';
        m = await System.import(`lang/${storyData.lang}/pg-adv-lib-verbs_${storyData.lang}`);
        verbs = m['pgAdvLibDefaultVerbs'];  

        step = 'messages';
        m = await System.import(`lang/${storyData.lang}/pg-adv-lib-messages_${storyData.lang}`)
        messages = new m['pgAdvDefaultMessages']();

        step = 'compass';
        m = await System.import(`lang/${storyData.lang}/pg-adv-lib-compass_${storyData.lang}`)
        compass = new m['pgAdvDefaultCompass']();

        step = 'story';
        m = await System.import(storyData.file);
        story = new m[storyData.class](storyData.lang, messages, compass, verbs);

    } catch (error) {
        errHandle(`Error: ${step} loading error`, `{name: '${storyData.name}' class: '${storyData.class}', file: '${storyData.file}', lang: '${storyData.lang}', err: ${error}}`);
    }

    try {
        m = await System.import('app/pg-adv-app');
        new m.pgAdvApp(story);
    } catch (error) {
        errHandle(`Error: app starting error - ${error}`);
    }
    
}

var pgAdvParserHelperInstance;
/**
 * Import a pgAdvParserHelp class from System and create an its instance passing it a pgAdvParser class instance
 * The pgAdvParserHelperInstance is called from the PEGjs parser in the parsing rules
 *
 * @param  {pgAdvParser} parser
 */
async function createParserHelper(parser) {
    try {
        let m = await System.import('app/pg-adv-story/pg-adv-lib/pg-adv-engine/pg-adv-parser/pg-adv-parser-helper');
        pgAdvParserHelperInstance = new m.pgAdvParserHelper(parser);
    } catch (error) {
        errHandle(`Error: parser helper starting error`, error);
    }
}