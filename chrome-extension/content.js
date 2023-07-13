alert('Hell from content.js')
// const inject = () => {
//     var r = document.createElement('script');
//     // r.setAttribute('src', 'chrome-extension://' + chrome.runtime.id + '/extension-interface');
//     r.setAttribute('src', 'extension-interface');
//     (document.head || document.documentElement).appendChild(r);
//   };
// inject();


// content script
chrome.runtime.sendMessage({ 
        type: 'RequestGetForm',
        fetchFormId: '5358471',
        apiKey: "cc17435f8800943cc1abd3063a8fe44f", 
    }, response => {
  console.log(response);
  const theBody = document.querySelector('body');

  const fsBodyControlPanelHead = document.createElement('h3');
  fsBodyControlPanelHead.innerHTML ='FS Buddy Control Panel';
  fsBodyControlPanelHead.style.color = 'black';


  const fsBodyControlPanelRefreshButton = document.createElement('button');
  fsBodyControlPanelRefreshButton.innerText = 'Refresh';
  fsBodyControlPanelRefreshButton.onclick = refreshFsFormGet;

  const fsBodyControlPanelDisplayLogicButton = document.createElement('button');
  fsBodyControlPanelDisplayLogicButton.innerText = 'Display Logic';
  fsBodyControlPanelDisplayLogicButton.onclick = displayLogicChain;

  const fsBodyControlPanelFetchTreeButton = document.createElement('button');
  fsBodyControlPanelFetchTreeButton.innerText = 'Fetch Tree';
  fsBodyControlPanelFetchTreeButton.onclick = fetchTree;

  const fsBodyControlPanel = document.createElement('div');
  fsBodyControlPanel.appendChild(fsBodyControlPanelHead)
  fsBodyControlPanel.appendChild(fsBodyControlPanelRefreshButton)
  fsBodyControlPanel.appendChild(fsBodyControlPanelDisplayLogicButton)
  fsBodyControlPanel.appendChild(fsBodyControlPanelFetchTreeButton)

  
  fsBodyControlPanel.style.backgroundColor = '#FFFFFF';
  fsBodyControlPanel.style.border = '1px black solid';

//   fsBodyControlPanel.style.height = '500px';
  fsBodyControlPanel.style.width = '500px';
  fsBodyControlPanel.style.zIndex = 1000;
  fsBodyControlPanel.style.top = '0px';
  fsBodyControlPanel.style.left = '0px';
  fsBodyControlPanel.style.position = 'absolute'
  
  theBody.appendChild(fsBodyControlPanel)
})


// chrome.runtime.sendMessage({ 
//         type: 'RequestGetForm',
//         fetchFormId: '5358471',
//         apiKey: "cc17435f8800943cc1abd3063a8fe44f", 
//     }, response => {
//   console.log(response);
//   const theBody = document.querySelector('body');

//   const fsBodyControlPanelHead = document.createElement('h3');
//   fsBodyControlPanelHead.innerHTML ='FS Buddy Control Panel';
//   fsBodyControlPanelHead.style.color = 'black';


//   const fsBodyControlPanelRefreshButton = document.createElement('button');
//   fsBodyControlPanelRefreshButton.innerText = 'Refresh';
//   fsBodyControlPanelRefreshButton.onclick = refreshFsFormGet;

//   const fsBodyControlPanelDisplayLogicButton = document.createElement('button');
//   fsBodyControlPanelDisplayLogicButton.innerText = 'Display Logic';
//   fsBodyControlPanelDisplayLogicButton.onclick = displayLogicChain;

//   const fsBodyControlPanel = document.createElement('div');
//   fsBodyControlPanel.appendChild(fsBodyControlPanelHead)
//   fsBodyControlPanel.appendChild(fsBodyControlPanelRefreshButton)
//   fsBodyControlPanel.appendChild(fsBodyControlPanelDisplayLogicButton)


//   fsBodyControlPanel.style.backgroundColor = '#FFFFFF';
//   fsBodyControlPanel.style.border = '1px black solid';

// //   fsBodyControlPanel.style.height = '500px';
//   fsBodyControlPanel.style.width = '500px';
//   fsBodyControlPanel.style.zIndex = 1000;
//   fsBodyControlPanel.style.top = '0px';
//   fsBodyControlPanel.style.left = '0px';
//   fsBodyControlPanel.style.position = 'absolute'
  
//   theBody.appendChild(fsBodyControlPanel)
// })

function getFieldBuildContainer(fieldId){
    const queryString = `fieldRequiredStatus-${fieldId}`
    const fieldRequreStatusButton = document.getElementById(queryString)
    return fieldRequreStatusButton?.parentElement?.parentElement;
}
  

// statusMessages: {fieldId, statusMessage, priority}[]
//   priority: 'debug' | 'info' | 'warn' | 'error'
function wrapFieldStatusMessage(statusMessages){
    const table = document.createElement('table');
    statusMessages.map(message=>{
        const tr = document.createElement('tr');
        ['fieldId', 'statusMessage', 'priority'].forEach(messageProp=>{
            const td = document.createElement('td');
            td.innerHTML = message[messageProp]
            tr.appendChild(td)
        })
        return tr    
    }).forEach(row=>[
        table.appendChild(row)
    ]);

    return table;
}


function fetchTree(){
    chrome.runtime.sendMessage({ 
        type: 'GetDependancyList',
        fetchFormId: '5358471',
        apiKey: "cc17435f8800943cc1abd3063a8fe44f", 
    }, response => {
        console.log('fetch tree response')
        console.log(response);
//   const theBody = document.querySelector('body');

//   const fsBodyControlPanelHead = document.createElement('h3');
//   fsBodyControlPanelHead.innerHTML ='FS Buddy Control Panel';
//   fsBodyControlPanelHead.style.color = 'black';


//   const fsBodyControlPanelRefreshButton = document.createElement('button');
//   fsBodyControlPanelRefreshButton.innerText = 'Refresh';
//   fsBodyControlPanelRefreshButton.onclick = refreshFsFormGet;

//   const fsBodyControlPanelDisplayLogicButton = document.createElement('button');
//   fsBodyControlPanelDisplayLogicButton.innerText = 'Display Logic';
//   fsBodyControlPanelDisplayLogicButton.onclick = displayLogicChain;

//   const fsBodyControlPanel = document.createElement('div');
//   fsBodyControlPanel.appendChild(fsBodyControlPanelHead)
//   fsBodyControlPanel.appendChild(fsBodyControlPanelRefreshButton)
//   fsBodyControlPanel.appendChild(fsBodyControlPanelDisplayLogicButton)


//   fsBodyControlPanel.style.backgroundColor = '#FFFFFF';
//   fsBodyControlPanel.style.border = '1px black solid';

// //   fsBodyControlPanel.style.height = '500px';
//   fsBodyControlPanel.style.width = '500px';
//   fsBodyControlPanel.style.zIndex = 1000;
//   fsBodyControlPanel.style.top = '0px';
//   fsBodyControlPanel.style.left = '0px';
//   fsBodyControlPanel.style.position = 'absolute'
  
//   theBody.appendChild(fsBodyControlPanel)
})

}

/**
 * 
 * @param {fieldId: string, dependencies: string{}} logicChain 
 */
function displayLogicChain(logicChain){
    const targetFieldBuilderContainer = getFieldBuildContainer('147738222');
    if(!targetFieldBuilderContainer) {
        console.log('Failed to get parent')
        return;
    }
    const {fieldId, dependencyFields} = logicChain;

    const rootFieldDiv = document.createElement('div')

    rootFieldDiv.style.backgroundColor = '#FFFFFF';
    rootFieldDiv.style.border = '1px black solid';
  
    rootFieldDiv.style.width = '100%';
    rootFieldDiv.style.zIndex = 1000;
    rootFieldDiv.style.position = 'absolute';

    [
        'Show if "The field name" is', 
        'The "other field name" is any of:...',
        '1) The "another field name" is all of:...',
        '2) The "another field name" is all of:...',
        '3) The "another field name" is all of:...',
        '4) The "another field name" is all of:...'
    ]
    .forEach(logicTerm=>{
        const div = document.createElement('div');
        div.innerText = logicTerm
        rootFieldDiv.appendChild(div);
    })



    targetFieldBuilderContainer.prepend(rootFieldDiv)
}





function processFsBuddyFormDescription(formAsJson){
    const targetFieldBuilderContainer = getFieldBuildContainer('147738222');
    if(!targetFieldBuilderContainer){
        console.log('Failed to get parent processFsBuddyFormDescription')
        return;
    }
    const fsBuddyFieldMessageContainer = document.createElement('div');
    fsBuddyFieldMessageContainer.style.width = '100%';


    const h3 = document.createElement('h3');
    h3.innerHTML ='FS Buddy Field Messages';
    h3.style.color = 'black';
    fsBuddyFieldMessageContainer.append(h3)

    const statusMessageAsHtmlTable = wrapFieldStatusMessage([{
        fieldId: 'xxxx',
        priority: 'info',
        statusMessage: 'This is a message'
    }, {
        fieldId: 'y',
        priority: 'warn',
        statusMessage: 'This is a different message'
    }])
    fsBuddyFieldMessageContainer.append(statusMessageAsHtmlTable)
    targetFieldBuilderContainer.parentElement.parentElement.prepend(fsBuddyFieldMessageContainer)
}

function refreshFsFormGet(){
    chrome.runtime.sendMessage({ 
        type: 'RequestGetForm',
        fetchFormId: '5358471',
        apiKey: "cc17435f8800943cc1abd3063a8fe44f", 
    }, response => {
        console.log('refresh response:')
        console.log(response);
        processFsBuddyFormDescription(response)
    })   
}