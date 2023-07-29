import { FormstackBuddy } from "../FormstackBuddy/FormstackBuddy";
import { FieldLogicService } from "../FormstackBuddy/FieldLogicService";
import { TFsFieldAnyJson } from "../formstack";
alert("Hell from content.js");
function getFormIdFromLocation({ pathname }: Location = location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}
let fieldLogicService: FieldLogicService | null = null;

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

// function getFieldIdsWithLogic() {
//   const fetchTreeFormId = getFormIdFromLocation();
//   if (fetchTreeFormId) {
//     chrome.runtime.sendMessage(
//       {
//         type: "GetFieldIdsWithLogic",
//         fetchFormId: fetchTreeFormId,
//         apiKey: "cc17435f8800943cc1abd3063a8fe44f",
//       },
//       async (fieldIdsWithLogic) => {
//         console.log({ fieldIdsWithLogic });
//         loadFieldIdsWithLogic(fieldIdsWithLogic);
//       }
//     );
//   } else {
//     console.log("Failed to fetchTree, could not get formId from url");
//   }
// }

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

        fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
          (apiFormJson.fields as TFsFieldAnyJson[]) || []
        );

        // let fieldLogicService: FieldLogicService | null = null;
        // this._fieldLogicService =
        // FormstackBuddy.getInstance().getFieldLogicService(
        //   formJson.fields || []
        // );
      }
    );
  } else {
    console.log("Failed to fetchTree, could not get formId from url");
  }
}

function handleGetFieldStatusesRequest(
  caller: MessageEventSource,
  payload: any
) {
  /*
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
*/

  const fieldStatusMessage = devDebugFieldIds.reduce(
    (prev, current, cIdx, ary) => {
      return { ...factoryStatusMessage(current), ...prev };
    },
    {}
  );

  caller.postMessage({
    messageType: "getFieldStatusesResponse",
    payload: { statusMessages: fieldStatusMessage },
  });
}

function handleGetFieldLogicDependentsRequest(
  caller: MessageEventSource,
  payload: any
) {
  /// getFieldIdsExtendedLogicOf
  const { fieldId } = payload;
  const fieldIds = fieldLogicService?.getFieldIdsExtendedLogicOf(fieldId);
  caller.postMessage({
    messageType: "getFieldLogicDependentsResponse",
    payload: { fieldIds },
  });
}

function getFieldsWithLogicResponse(caller: MessageEventSource) {
  const fieldIds = fieldLogicService?.wrapFieldIdsIntoLabelOptionList(
    fieldLogicService?.getFieldIdsWithLogic()
  );
  caller.postMessage({
    messageType: "getFieldsWithLogicResponse",
    payload: { fieldIds },
  });
}

function removeFormHtml() {
  const theIFrame = document.getElementById("theFrame");
  if (theIFrame) {
    theIFrame.remove();
  }
}

window.onmessage = function (e) {
  console.log({ receivedMessage: e });
  switch (e.data.messageType) {
    case "ping":
      e.source?.postMessage({
        messageType: "ping",
        payload: "pong",
      });
      break;

    case "getFieldsWithLogicRequest":
      e.source && getFieldsWithLogicResponse(e.source);
      !e.source && console.log("No Source of message received.");
      break;
    case "getFieldLogicDependentsRequest":
      e.source &&
        handleGetFieldLogicDependentsRequest(e.source, e.data.payload);
      !e.source && console.log("No Source of message received.");
      break;
    case "removeFsBuddyRequest":
      removeFormHtml();
      break;
    case "getFieldStatusesRequest":
      e.source && handleGetFieldStatusesRequest(e.source, e.data.payload);
      break;
    //handleGetFieldStatusesRequest

    default:
      console.log(`message type not understood. ( '${e.data.messageType}')`);
  }
};

// function addCssClassFsBuddyBlue() {
//   const fieldIds = devDebugFieldIds;
//   const theIFrame = document.getElementById("theFrame");
//   const message = {
//     messageType: "addCssClassToFieldIdList",
//     payload: {
//       cssClassName: "fsBuddy_lightblue",
//       fieldIds,
//     },
//   };
//   // @ts-ignore - contentWindow not an element of...
//   theIFrame?.contentWindow?.postMessage(message, "*");
// }

// function addCssClass() {
//   const fieldIds = devDebugFieldIds;
//   const theIFrame = document.getElementById("theFrame");
//   const message = {
//     messageType: "addCssClassToFieldIdList",
//     payload: {
//       cssClassName: "fsHidden",
//       fieldIds,
//     },
//   };
//   // @ts-ignore - contentWindow not an element of...
//   theIFrame?.contentWindow?.postMessage(message, "*");
// }

// function removeAllCssClassFsHidden() {
//   removeAllCssClass("fsHidden");
// }

// function removeAllCssClass_allFsBuddy() {
//   removeAllCssClass("fsBuddy_obscure");
//   removeAllCssClass("fsBuddy_lightblue");
//   removeAllCssClass("fsBuddy_lightgreen");
// }

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

// function loadFieldIdsWithLogic(fieldIds: string[]) {
//   const theIFrame = document.getElementById("theFrame");
//   const message = {
//     messageType: "loadFieldIdsWithLogic",
//     payload: {
//       fieldIds,
//     },
//   };
//   // @ts-ignore - contentWindow not an element of...
//   theIFrame?.contentWindow?.postMessage(message, "*");
// }

// function removeCssClass() {
//   const fieldIds = devDebugFieldIds;
//   const theIFrame = document.getElementById("theFrame");
//   const message = {
//     messageType: "removeClassFromFieldIdList",
//     payload: {
//       cssClassName: "fsHidden",
//       fieldIds,
//     },
//   };
//   // @ts-ignore - contentWindow not an element of...
//   theIFrame?.contentWindow?.postMessage(message, "*");
// }

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

// function displayFieldStatuses() {
//   const theIFrame = document.getElementById("theFrame");
//   const fieldStatusMessage = devDebugFieldIds.reduce(
//     (prev, current, cIdx, ary) => {
//       return { ...factoryStatusMessage(current), ...prev };
//     },
//     {}
//   );
//   const message = {
//     messageType: "getFieldStatuses",
//     payload: {
//       statusMessages: fieldStatusMessage,
//     },
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

const createElementButton = ({
  label,
  onclick,
}: {
  label: string;
  onclick: (ev: MouseEvent) => void | null;
}) => {
  const button = document.createElement("button");
  button.innerHTML = label;
  button.onclick = onclick;
  return button;
};

const initializeFsBuddyControlPanel = () => {
  const theBody = document.querySelector("body");

  const fsBodyControlPanelHead = document.createElement("h3");
  fsBodyControlPanelHead.innerHTML = "FS Buddy Control Panel";
  fsBodyControlPanelHead.style.color = "black";

  const fsBodyControlPanelGetFormHtmlButton = createElementButton({
    label: "Get Form HTML",
    onclick: getFormAsJson,
  });

  // const fsBodyControlPanelGetFieldsWithLogicHtmlButton = createElementButton({
  //   label: "Get Field IDs With Logic",
  //   onclick: getFieldIdsWithLogic,
  // });

  const removeFormHtmlButton = createElementButton({
    label: "Remove Form HTML",
    onclick: removeFormHtml,
  });

  // const addCssClassButton = createElementButton({
  //   label: "Add Css",
  //   onclick: addCssClass,
  // });

  // const removeCssClassButton = createElementButton({
  //   label: "remove Css",
  //   onclick: removeCssClass,
  // });

  // const addCssClassFsBuddyBlueButton = createElementButton({
  //   label: "Add Css fsBuddyBlue",
  //   onclick: addCssClassFsBuddyBlue,
  // });

  // const removeAllCssClassFsBuddyButton = createElementButton({
  //   label: "Remove All FsBuddy",
  //   onclick: removeAllCssClass_allFsBuddy,
  // });

  // const removeAllCssClassFsHiddenButton = createElementButton({
  //   label: "Remove FsHidden",
  //   onclick: removeAllCssClassFsHidden,
  // });

  // const displayFieldStatusButton = createElementButton({
  //   label: "Display Field Status",
  //   onclick: displayFieldStatuses,
  // });

  const fsBodyControlPanel = document.createElement("div");
  fsBodyControlPanel.appendChild(fsBodyControlPanelHead);
  fsBodyControlPanel.appendChild(fsBodyControlPanelGetFormHtmlButton);
  fsBodyControlPanel.appendChild(removeFormHtmlButton);
  fsBodyControlPanel.appendChild(document.createElement("hr"));
  // fsBodyControlPanel.appendChild(addCssClassButton);
  // fsBodyControlPanel.appendChild(removeCssClassButton);
  // fsBodyControlPanel.appendChild(addCssClassFsBuddyBlueButton);
  // fsBodyControlPanel.appendChild(removeAllCssClassFsBuddyButton);
  // fsBodyControlPanel.appendChild(removeAllCssClassFsHiddenButton);
  // fsBodyControlPanel.appendChild(displayFieldStatusButton);
  // fsBodyControlPanel.appendChild(
  //   fsBodyControlPanelGetFieldsWithLogicHtmlButton
  // );

  fsBodyControlPanel.style.backgroundColor = "#FFFFFF";
  fsBodyControlPanel.style.border = "1px black solid";

  //   fsBodyControlPanel.style.height = '500px';
  fsBodyControlPanel.style.width = "50%";
  // fsBodyControlPanel.style.width = "500px";
  fsBodyControlPanel.style.zIndex = "1000";
  fsBodyControlPanel.style.top = "0px";
  fsBodyControlPanel.style.left = "0px";
  fsBodyControlPanel.style.position = "absolute";

  theBody && theBody.appendChild(fsBodyControlPanel);
};
formId && initializeFsBuddyControlPanel({});
