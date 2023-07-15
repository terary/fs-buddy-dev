alert("Hell from content.js");
function getFormIdFromLocation({ pathname }: Location = location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}

function getFormHtml() {
  const fetchTreeFormId = getFormIdFromLocation();
  if (fetchTreeFormId) {
    chrome.runtime.sendMessage(
      {
        type: "GetFormHtml",
        fetchFormId: fetchTreeFormId,
        apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      (apiFormHtml) => {
        // let frame = document.getElementById("theFrame");
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

        // @ts-ignore
        // iframe.contentDocument.addEventListener("DOMContentLoaded", () => {
        //   alert("IFrame Loaded");
        // });
        // @ts-ignore
        // iframe.contentWindow?.onmessage = (e) => {
        //   console.log({ receivedMessage: e });
        // };
        // iframe.srcdoc = childFrameHtml;
        iframe.srcdoc = childFrameHtml + apiFormHtml;
        // iframe.src =
        //   "https://www.formstack.com/forms/?form=5358471&viewkey=S1K62mLR6o";
        //          "https://www.formstack.com/forms/?form=5358471&viewkey=S1K62mLR6o";
        //
        //          "https://www.formstack.com/forms/?form=5350841&viewkey=uAsNGfWScT";
        //          "https://terarychambers.formstack.com/forms/predicate_tree_take1";

        // const childContentDiv = document.createElement("div");
        // childContentDiv.innerHTML = childFrameHtml;
        // iframe.innerHTML = childContentDiv + iframe.innerHTML;

        const theBody = document.querySelector("body");
        theBody?.prepend(iframe);
      }
    );
  } else {
    console.log("Failed to fetchTree, could not get formId from url");
  }
}
window.onmessage = function (e) {
  console.log({ receivedMessage: e });
};

function addCssClassFsBuddyBlue() {
  const fieldIds = [
    "148136237",
    "147462595",
    "147462596",
    "147462597",
    "147462598",
    "147462600",
    "148135962",
    "148136234",
  ];
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
  const fieldIds = [
    "148136237",
    "147462595",
    "147462596",
    "147462597",
    "147462598",
    "147462600",
    "148135962",
    "148136234",
  ];
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
  const fieldIds = [
    "148136237",
    "147462595",
    "147462596",
    "147462597",
    "147462598",
    "147462600",
    "148135962",
    "148136234",
  ];
  const theIFrame = document.getElementById("theFrame");
  const message = {
    messageType: "removeClassFromFieldIdList",
    payload: {
      // cssClassName: "fsBuddy_lightblue",
      cssClassName: "fsHidden",
      fieldIds,
    },
  };

  // @ts-ignore - contentWindow not an element of...
  theIFrame?.contentWindow?.postMessage(message, "*");
}

// function pingChildFrame() {
//   const theIFrame = document.getElementById("theFrame");
//   const message = {
//     messageTarget: "theFunctionToCall",
//     someOtherValue: "goes here",
//   };
//   // @ts-ignore - contentWindow not an element of...
//   theIFrame?.contentWindow?.postMessage(message, "*");
// }

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

      // const fsBodyControlPanelRefreshButton = document.createElement("button");
      // fsBodyControlPanelRefreshButton.innerText = "Refresh";
      // fsBodyControlPanelRefreshButton.onclick = refreshFsFormGet;

      const fsBodyControlPanelGetFormHtmlButton =
        document.createElement("button");
      fsBodyControlPanelGetFormHtmlButton.innerText = "Get Form HTML";
      fsBodyControlPanelGetFormHtmlButton.onclick = getFormHtml;

      // const pingChildFrameButton = document.createElement("button");
      // pingChildFrameButton.innerText = "Ping Child Frame";
      // pingChildFrameButton.onclick = pingChildFrame;

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

      const fsBodyControlPanel = document.createElement("div");
      fsBodyControlPanel.appendChild(fsBodyControlPanelHead);
      // fsBodyControlPanel.appendChild(fsBodyControlPanelRefreshButton);
      fsBodyControlPanel.appendChild(fsBodyControlPanelGetFormHtmlButton);
      // fsBodyControlPanel.appendChild(pingChildFrameButton);
      fsBodyControlPanel.appendChild(addCssClassButton);
      fsBodyControlPanel.appendChild(removeCssClassButton);
      fsBodyControlPanel.appendChild(addCssClassFsBuddyBlueButton);
      fsBodyControlPanel.appendChild(removeAllCssClassFsBuddyButton);
      fsBodyControlPanel.appendChild(removeAllCssClassFsHiddenButton);

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

function getFieldBuildContainer(fieldId: string) {
  const queryString = `${fieldId}-editButton`;
  const fieldEditButton = document.getElementById(queryString);
  if (fieldEditButton?.parentElement?.parentElement) {
    return fieldEditButton?.parentElement?.parentElement;
  }

  if (fieldEditButton?.parentElement) {
    return fieldEditButton?.parentElement;
  }

  return fieldEditButton;
}

// statusMessages: {fieldId, statusMessage, priority}[]
//   priority: 'debug' | 'info' | 'warn' | 'error'
function wrapFieldStatusMessage(statusMessages: any[]) {
  const table = document.createElement("table");
  statusMessages
    .map((message: any) => {
      const tr = document.createElement("tr");
      ["fieldId", "statusMessage", "priority"].forEach((messageProp) => {
        const td = document.createElement("td");
        td.innerHTML = message[messageProp];
        tr.appendChild(td);
      });
      return tr;
    })
    .forEach((row) => [table.appendChild(row)]);

  return table;
}

// function refreshFsFormGet() {
//   const refreshFormId = getFormIdFromLocation();
//   if (refreshFormId) {
//     chrome.runtime.sendMessage(
//       {
//         type: "RequestGetForm",
//         fetchFormId: refreshFormId,
//         apiKey: "cc17435f8800943cc1abd3063a8fe44f",
//       },
//       (response) => {
//         console.log("refresh response:");
//         // console.log(response);
//         processFsBuddyFormDescription(response);
//       }
//     );
//   } else {
//     console.log("Failed to refresh, could not get formId from url");
//   }
// }

function appendFieldStatusMessage({ fieldId }: { fieldId: string }) {
  const targetFieldBuilderContainer = getFieldBuildContainer(fieldId);
  if (!targetFieldBuilderContainer) {
    console.log(`Failed to get parent for fieldId: '${fieldId}'`);
    return;
  }
  const fsBuddyFieldMessageContainer = document.createElement("div");
  fsBuddyFieldMessageContainer.style.width = "100%";

  const h3 = document.createElement("h3");
  h3.innerHTML = "FS Buddy Field Messages";
  h3.style.color = "black";
  fsBuddyFieldMessageContainer.append(h3);

  const statusMessageAsHtmlTable = wrapFieldStatusMessage([
    {
      fieldId: "xxxx",
      priority: "info",
      statusMessage: "This is a message",
    },
    {
      fieldId: "y",
      priority: "warn",
      statusMessage: "This is a different message",
    },
  ]);
  fsBuddyFieldMessageContainer.append(statusMessageAsHtmlTable);
  targetFieldBuilderContainer?.parentElement?.parentElement?.prepend(
    fsBuddyFieldMessageContainer
  );
}

function processFsBuddyFormDescription(formAsJson: any) {
  console.log({ formAsJson });
  formAsJson.fields.forEach((field: any) => {
    console.log({ field });
    appendFieldStatusMessage({ fieldId: field.id });
  });
}

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
