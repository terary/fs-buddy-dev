alert("Hell from content.js");
function getFormIdFromLocation({ pathname }: Location = location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}

let devDebugFieldIds = [
  "148136237",
  "147462595",
  "147462596",
  "147462597",
  "147462598",
  "147462600",
  "148135962",
  "148136234",
];

function getChildFrameHtml() {
  const url = chrome.runtime.getURL("form-render-inject.html");

  return fetch(url).then((response) => {
    return response.text();
  }); //assuming file contains json
  // .then((text) => {
  //   console.log(text);
  // });
}

function getFormAsJson() {
  const fetchTreeFormId = getFormIdFromLocation();
  if (fetchTreeFormId) {
    chrome.runtime.sendMessage(
      {
        type: "GetFormAsJson",
        fetchFormId: fetchTreeFormId,
        apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiFormJson) => {
        const childFrameHtmlX = await getChildFrameHtml();
        console.log({ childFrameHtmlX });
        const iframe = document.createElement("iframe");
        iframe.id = "theFrame";
        iframe.style.width = "500px";
        iframe.style.height = "1500px";
        iframe.style.zIndex = "1001";
        iframe.style.top = "50px";
        iframe.style.right = "0px";
        // iframe.style.left = "0px";
        iframe.style.position = "absolute";
        iframe.style.backgroundColor = "green";

        iframe.srcdoc = childFrameHtmlX + apiFormJson.html;
        const theBody = document.querySelector("body");
        theBody?.prepend(iframe);
        devDebugFieldIds = [];
        (apiFormJson?.fields || []).map((field: any) => {
          devDebugFieldIds.push(field.id);
        });
      }
    );
  } else {
    console.log("Failed to fetchTree, could not get formId from url");
  }
}

function x_getFormHtml() {
  const fetchTreeFormId = getFormIdFromLocation();
  if (fetchTreeFormId) {
    chrome.runtime.sendMessage(
      {
        type: "GetFormHtml",
        fetchFormId: fetchTreeFormId,
        apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      (apiFormHtml) => {
        const iframe = document.createElement("iframe");
        iframe.id = "theFrame";
        iframe.style.width = "500px";
        iframe.style.height = "1500px";
        iframe.style.zIndex = "1001";
        iframe.style.top = "50px";
        iframe.style.right = "0px";
        // iframe.style.left = "0px";
        iframe.style.position = "absolute";
        iframe.style.backgroundColor = "green";

        iframe.srcdoc = childFrameHtml + apiFormHtml;
        const theBody = document.querySelector("body");
        theBody?.prepend(iframe);
        devDebugFieldIds = [];
        (apiFormHtml?.fields || []).map((field: any) => {
          devDebugFieldIds.push(field.id);
        });
      }
    );
  } else {
    console.log("Failed to fetchTree, could not get formId from url");
  }
}

function removeFormHtml() {
  const theIFrame = document.getElementById("theFrame");
  if (theIFrame) {
    theIFrame.remove();
  }
}

window.onmessage = function (e) {
  console.log({ receivedMessage: e });
};

function addCssClassFsBuddyBlue() {
  const fieldIds = devDebugFieldIds;
  const theIFrame = document.getElementById("theFrame");
  const message = {
    messageType: "addCssClassToFieldIdList",
    payload: {
      // cssClassName: "fsHidden",
      cssClassName: "fsBuddy_lightblue",
      fieldIds,
    },
  };
  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

function addCssClass() {
  const fieldIds = devDebugFieldIds;
  const theIFrame = document.getElementById("theFrame");
  const message = {
    messageType: "addCssClassToFieldIdList",
    payload: {
      cssClassName: "fsHidden",
      // cssClassName: "fsBuddy_lightblue",
      fieldIds,
    },
  };
  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

function removeAllCssClassFsHidden() {
  removeAllCssClass("fsHidden");
}

function removeAllCssClass_allFsBuddy() {
  removeAllCssClass("fsBuddy_obscure");
  removeAllCssClass("fsBuddy_lightblue");
  removeAllCssClass("fsBuddy_lightgreen");
}

function removeAllCssClass(cssClassName: string) {
  const theIFrame = document.getElementById("theFrame");
  const message = {
    messageType: "removeAllClassName",
    payload: {
      cssClassName: cssClassName,
    },
  };

  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

function removeCssClass() {
  const fieldIds = devDebugFieldIds;
  const theIFrame = document.getElementById("theFrame");
  const message = {
    messageType: "removeClassFromFieldIdList",
    payload: {
      cssClassName: "fsHidden",
      fieldIds,
    },
  };

  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

const factoryStatusMessage = (fieldId: string) => {
  const statusMessages = ["error", "warn", "info", "debug"].map((severity) => {
    return {
      severity: severity,
      message: `The ${severity} message`,
      fieldId: fieldId,
      relatedFieldIds: ["147738154", "148111228", "147738157"],
    };
  });

  return {
    [fieldId]: {
      statusMessages,
    },
  };
};

function displayFieldStatuses() {
  /**
 *  [fieldId]:{
     statusMessages[]
 }
 
 statusMessages:{
  'severity', 'message', 'fieldId', 'relatedFieldIds'   
 }
 
 * 
 */

  const fieldStatusMessages = {
    "126381023": [
      {
        severity: "debug",
        message: "The debug message",
        fieldId: "126381023",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "debug",
        message: "The info message",
        fieldId: "126381023",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "debug",
        message: "The warn message",
        fieldId: "126381023",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "debug",
        message: "The error message",
        fieldId: "126381023",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
    ],

    "126384418": [
      {
        severity: "debug",
        message: "The debug message",
        fieldId: "126384418",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "info",
        message: "The info message",
        fieldId: "126384418",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "warn",
        message: "The warn message",
        fieldId: "126384418",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
      {
        severity: "error",
        message: "The error message",
        fieldId: "126384418",
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      },
    ],
  };

  const theIFrame = document.getElementById("theFrame");
  const fieldStatusMessage = devDebugFieldIds.reduce(
    (prev, current, cIdx, ary) => {
      return { ...factoryStatusMessage(current), ...prev };
    },
    {}
  );

  const message = {
    messageType: "getFieldStatuses",
    payload: {
      statusMessages: fieldStatusMessage,
      // fieldStatusResponse: fieldStatusMessages,
    },
  };

  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

const formId = getFormIdFromLocation();
if (!formId) {
  console.log("Failed to get formId from url.");
} else {
  console.log(`Working with formId; '${formId}'.`);
}

// content script
formId &&
  chrome.runtime.sendMessage(
    {
      type: "RequestGetForm",
      fetchFormId: formId,
      apiKey: "cc17435f8800943cc1abd3063a8fe44f",
    },
    (response) => {
      // initializeFieldContainers();
      console.log(response);
      const theBody = document.querySelector("body");

      const fsBodyControlPanelHead = document.createElement("h3");
      fsBodyControlPanelHead.innerHTML = "FS Buddy Control Panel";
      fsBodyControlPanelHead.style.color = "black";

      const fsBodyControlPanelGetFormHtmlButton =
        document.createElement("button");
      fsBodyControlPanelGetFormHtmlButton.innerText = "Get Form HTML";
      fsBodyControlPanelGetFormHtmlButton.onclick = getFormAsJson;

      const removeFormHtmlButton = document.createElement("button");
      removeFormHtmlButton.innerText = "Remove Form HTML";
      removeFormHtmlButton.onclick = removeFormHtml;

      const addCssClassButton = document.createElement("button");
      addCssClassButton.innerText = "Add Css";
      addCssClassButton.onclick = addCssClass;

      const removeCssClassButton = document.createElement("button");
      removeCssClassButton.innerText = "remove Css";
      removeCssClassButton.onclick = removeCssClass;

      const addCssClassFsBuddyBlueButton = document.createElement("button");
      addCssClassFsBuddyBlueButton.innerText = "Add Css fsBuddyBlue";
      addCssClassFsBuddyBlueButton.onclick = addCssClassFsBuddyBlue;

      const removeAllCssClassFsBuddyButton = document.createElement("button");
      removeAllCssClassFsBuddyButton.innerText = "Remove All FsBuddy";
      removeAllCssClassFsBuddyButton.onclick = removeAllCssClass_allFsBuddy;

      const removeAllCssClassFsHiddenButton = document.createElement("button");
      removeAllCssClassFsHiddenButton.innerText = "Remove FsHidden";
      removeAllCssClassFsHiddenButton.onclick = removeAllCssClassFsHidden;

      const displayFieldStatusButton = document.createElement("button");
      displayFieldStatusButton.innerText = "Display Field Status";
      displayFieldStatusButton.onclick = displayFieldStatuses;

      const fsBodyControlPanel = document.createElement("div");
      fsBodyControlPanel.appendChild(fsBodyControlPanelHead);
      fsBodyControlPanel.appendChild(fsBodyControlPanelGetFormHtmlButton);
      fsBodyControlPanel.appendChild(removeFormHtmlButton);
      fsBodyControlPanel.appendChild(addCssClassButton);
      fsBodyControlPanel.appendChild(removeCssClassButton);
      fsBodyControlPanel.appendChild(addCssClassFsBuddyBlueButton);
      fsBodyControlPanel.appendChild(removeAllCssClassFsBuddyButton);
      fsBodyControlPanel.appendChild(removeAllCssClassFsHiddenButton);
      fsBodyControlPanel.appendChild(displayFieldStatusButton);

      fsBodyControlPanel.style.backgroundColor = "#FFFFFF";
      fsBodyControlPanel.style.border = "1px black solid";

      //   fsBodyControlPanel.style.height = '500px';
      fsBodyControlPanel.style.width = "500px";
      fsBodyControlPanel.style.zIndex = "1000";
      fsBodyControlPanel.style.top = "0px";
      fsBodyControlPanel.style.left = "0px";
      fsBodyControlPanel.style.position = "absolute";

      theBody && theBody.appendChild(fsBodyControlPanel);
    }
  );

const childFrameHtml = `
<html>
	<head>
    <style>
      .fsBuddy_obscure {
          opacity: 0.5;
      }
      .fsBuddy_lightblue {
          opacity: 0.5;
          background-color: lightblue;
      }
      .fsBuddy_lightgreen {
          opacity: 0.5;
          background-color: lightgreen;
      }
      /* ----------------------------------------------------- */

      .fsBuddy_statusContainer {
          opacity: 0.5;
      }
  
  
      .fsBuddy_statusRowHeader
      {
          /*padding-left: 2em;*/
      }
  
      .fsBuddy_statusRow
      {
          padding-left: 1em;
      }
  
      .fsBuddy_statusRow_hidden
      {
          display: none;
      }
  
      .fsBuddy_statusMessateCell_
      {}
      .fsBuddy_statusMessateCell_severity,
      .fsBuddy_statusMessateCell_message {
          display: inline
      }
  
      .fsBuddy_statusMessateCell_fieldId, 
      .fsBuddy_statusMessateCell_relatedFieldIds {
          display: none;
      }
  
      .fsBuddy_statusMessate_severity_debug {
          background-color: pink;
      }
  
      .fsBuddy_statusMessate_severity_info{
          background-color: lightblue;
      }
  
      .fsBuddy_statusMessate_severity_warn{
          background-color: yellow;
      }
  
      .fsBuddy_statusMessate_severity_error {
          background-color: red;
      }
  
      .fsBuddy_statusMessate_link {
          color: blue;
          /*background-color: red;*/
          text-decoration: underline;
      }
  
    </style>
  <script>

      const addCssClassToFields = (cssClassName, fieldIds) => {
        console.log({function:'addCssClassToFields', cssClassName, fieldIds})
          fieldIds.forEach(fieldId=>{
              const containerId =\`fsCell\${fieldId}\`;
              const fieldContainer = document.getElementById(containerId);
              fieldContainer.parentElement.classList.add(cssClassName);        
          });
      }

      const removeCssClassFromFields = (cssClassName, fieldIds) => {
        console.log({function:'removeCssClassFromFields', cssClassName, fieldIds})
          fieldIds.forEach(fieldId=>{
              const containerId =\`fsCell\${fieldId}\`;
              const fieldContainer = document.getElementById(containerId);
              fieldContainer.parentElement.classList.remove(cssClassName);        
              fieldContainer.classList.remove(cssClassName);        
          });
      }
      const removeAllCssName = (cssClassName) => {
        document.querySelectorAll(\`.\${cssClassName}\`).forEach(el=>{
            el.classList.remove(cssClassName);
        })    
      }
// -----------------------------------
      const SEVERITIES = {
        error: 0,
        warn: 50,
        info: 100,
        debug: 500,
        0: 'error',
        50: 'warn',
        100: 'info',
        500: 'debug',
      }

      const collapseAllFsBuddyStatusItems = ()=>{
        const statusContainers = document.querySelectorAll('.fsBuddy_statusRow')
        statusContainers.forEach(container=>container.classList.add('fsBuddy_statusRow_hidden'))
      }
    
      const expandAllFsBuddyStatusItems = ()=>{
          const statusContainers = document.querySelectorAll('.fsBuddy_statusRow')
          statusContainers.forEach(container=>container.classList.remove('fsBuddy_statusRow_hidden'))
      }
    
      const toggleExpandCollapseStatusItems  = (fieldId)=>{
        const containerId = \`fsBuddy_statusContainer_\${fieldId}\`;
        const fieldContainer = document.getElementById(containerId);
        const hiddenRows = fieldContainer.querySelectorAll('.fsBuddy_statusRow_hidden');

        if(hiddenRows.length===0){
            fieldContainer.querySelectorAll('.fsBuddy_statusRow').forEach(row=>{
                row.classList.add('fsBuddy_statusRow_hidden')
            })
        } else {
            hiddenRows.forEach(row=>{
                row.classList.remove('fsBuddy_statusRow_hidden')
            })
        }
      }

      const getMessageCollectionSeverity = (statusMessages) => {
        let collectionSeverity = SEVERITIES['debug'];
        (statusMessages || []).forEach(message=>{
            if(SEVERITIES[message.severity] <  collectionSeverity) {
                collectionSeverity = SEVERITIES[message.severity];
            }
        })
        return SEVERITIES[collectionSeverity];
      }
  
      const removeFsBuddyStatusContainers = ()=>{
        const statusContainers = document.querySelectorAll('.fsBuddy_statusContainer')
        statusContainers.forEach(container=>container.remove())
      }

      const getFieldContainer = (fieldId)=>{
        // I think all fields are in a section, 
        // but a section does not always contain fields - maybe
        const containerId =\`fsCell\${fieldId}\`;
        const sectionId =\`fsSection\${fieldId}\`;
        
        return document.getElementById(containerId) || document.getElementById(sectionId);
        //fsSection126381010

      }
      
      const appendFieldStatusContainer = (fieldId, statusMessages)=>{
        const containerId =\`fsCell\${fieldId}\`;
        const fieldContainer = getFieldContainer(fieldId);

        // document.getElementById(containerId);

        const collectionSeverity = getMessageCollectionSeverity(statusMessages);




        const statusContainer = document.createElement('div');
        statusContainer.id = \`fsBuddy_statusContainer_\${fieldId}\`;
        statusContainer.classList.add('fsBuddy_statusContainer');

        const divStatusHeadRow = document.createElement('div');
        divStatusHeadRow.classList.add(\`fsBuddy_statusRowHeader\`);
        divStatusHeadRow.classList.add(\`fsBuddy_statusMessate_severity_\${collectionSeverity}\`);
        
        
        const aExpandCollapseItemsLink = document.createElement('a');
        aExpandCollapseItemsLink.innerHTML = \`<a>expand/collapse</a> fieldId: \${fieldId} FS Buddy (\${statusMessages.length})\`;
        aExpandCollapseItemsLink.onclick = ()=>{toggleExpandCollapseStatusItems(fieldId)}
        aExpandCollapseItemsLink.classList.add('fsBuddy_statusMessate_link');

        divStatusHeadRow.appendChild(aExpandCollapseItemsLink)
        statusContainer.appendChild(divStatusHeadRow)
        
      //        {severity:'debug', message: 'The debug message', fieldId: '148111228',  relatedFieldIds:['147738154', '148111228', '147738157']},
        statusMessages.forEach(message=>{
            const divStatusRow = document.createElement('div');
            divStatusRow.classList.add(\`fsBuddy_statusRow\`);
            divStatusRow.classList.add(\`fsBuddy_statusMessate_severity_\${message['severity']}\`);
            ['severity', 'message', 'fieldId', 'relatedFieldIds'].forEach(messagePart=>{
                const divMessagePart = document.createElement('div');
                switch(messagePart){
                    case "severity":
                        divMessagePart.classList.add(\`fsBuddy_statusMessateCell_severity\`);
                        divMessagePart.innerHTML = \`<span>(\${message[messagePart]})</span>\`;
                    break;
                    default:
                        divMessagePart.classList.add(\`fsBuddy_statusMessateCell_\${messagePart}\`);
                        divMessagePart.innerHTML = \`<span>\${message[messagePart]}</span>\`;
                    break; // <-- never stops being funny
                    
                }
                divStatusRow.appendChild(divMessagePart);
            })
            statusContainer.appendChild(divStatusRow)
        })
        
        if(statusContainer.querySelector('.fsRow')) {
          // its not a section
          if (fieldContainer.parentElement) {
            fieldContainer.parentElement.prepend(statusContainer)
          } else {
              fieldContainer.prepend(statusContainer)
          }
  
        } else {
          // its a section         
          fieldContainer.appendChild(statusContainer)
        }
        
        

      }

// -----------------------------------
      const processFieldStatuses = (statusMessages)=>{
        document.getElementById('fsBuddyFieldStatusesContainer') && document.getElementById('fsBuddyFieldStatusesContainer').remove()

        const theBody = document.querySelector('body');

        const fsBuddyFieldStatusesContainer = document.createElement('div');
        fsBuddyFieldStatusesContainer.id='fsBuddyFieldStatusesContainer'
        theBody.prepend(fsBuddyFieldStatusesContainer);

        const removeFsBuddyFieldStatusContainersButton = document.createElement('button');
        removeFsBuddyFieldStatusContainersButton.innerText = 'Remove Status Containers';
        removeFsBuddyFieldStatusContainersButton.onclick = (e)=>{
          e.stopPropagation();
          removeFsBuddyStatusContainers();
          return false;
        };
        fsBuddyFieldStatusesContainer.prepend(removeFsBuddyFieldStatusContainersButton);

        const expandFsBuddyFieldStatusItemsButton = document.createElement('button');
        expandFsBuddyFieldStatusItemsButton.innerText = 'Expand Field Status Items';
        expandFsBuddyFieldStatusItemsButton.onclick = (e)=>{
                e.stopPropagation();
                expandAllFsBuddyStatusItems();
                return false;
        };
        fsBuddyFieldStatusesContainer.prepend(expandFsBuddyFieldStatusItemsButton);

        const collapseFsBuddyFieldStatusItemsButton = document.createElement('button');
        collapseFsBuddyFieldStatusItemsButton.innerText = 'Collapse Field Status Items';
        collapseFsBuddyFieldStatusItemsButton.onclick = (e)=>{
                e.stopPropagation();
                collapseAllFsBuddyStatusItems();
                return false;
        };
        fsBuddyFieldStatusesContainer.prepend(collapseFsBuddyFieldStatusItemsButton);



        Object.entries(statusMessages).forEach(([fieldId, statusMessages])=>{
          appendFieldStatusContainer(fieldId, statusMessages.statusMessages)
        })
     }
    
      window.onmessage = function(e) {
        switch(e.data.messageType) {
          case 'addCssClassToFieldIdList':
            addCssClassToFields(e.data.payload.cssClassName, e.data.payload.fieldIds)
            break;
          case 'removeClassFromFieldIdList':
            removeCssClassFromFields(e.data.payload.cssClassName, e.data.payload.fieldIds)
            break;
          case 'removeAllClassName':
            removeAllCssName(e.data.payload.cssClassName)
            break;
          case 'getFieldStatuses':
            processFieldStatuses(e.data.payload.statusMessages)
            break;
        }
			  console.log({'messageReceived': e})
  		};

    function sendMessageToParent(){
			const response={
				thePayload: 'goes here',
				anything: 'will do'
			}
			window.top.postMessage(response, '*')
		}
		</script>
	</head>
	<body>The Child	
		<button onclick="sendMessageToParent()">Send Message to Parent</button>
	</body>
</html>

`;
