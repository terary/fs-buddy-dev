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
        const childFrameHtml = await getChildFrameHtml();
        const iframe = document.createElement("iframe");
        iframe.id = "theFrame";
        iframe.style.width = "500px";
        iframe.style.height = "1500px";
        iframe.style.zIndex = "1001";
        iframe.style.top = "50px";
        iframe.style.right = "0px";
        iframe.style.position = "absolute";
        iframe.style.backgroundColor = "green";

        iframe.srcdoc = childFrameHtml + apiFormJson.html;
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
