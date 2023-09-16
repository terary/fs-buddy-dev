import { FormstackBuddy } from "../FormstackBuddy/FormstackBuddy";
import { FieldLogicService } from "../FormstackBuddy/FieldLogicService";
import { FsTreeFieldCollection, TFsFieldAnyJson } from "../formstack";
import type { TStatusRecord } from "./type";

alert("Hello from content.js");
function getFormIdFromLocation({ pathname }: Location = location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}
let fieldLogicService: FieldLogicService | null = null;

type TFieldStatusMessages = {
  [fieldId: string]: TStatusRecord[];
};

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
  });
}

function buildIframe(iframeId: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.id = iframeId;
  iframe.style.width = "50%";
  iframe.style.height = "1500px";
  iframe.style.zIndex = "1001";
  iframe.style.top = "50px";
  iframe.style.right = "0px";
  iframe.style.position = "absolute";
  iframe.style.backgroundColor = "green";
  return iframe;
}
let currentFieldCollection: FsTreeFieldCollection;

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
        // is this await necessary?
        const childFrameHtml = await getChildFrameHtml();
        const iframe = buildIframe("theFrame");
        iframe.srcdoc = childFrameHtml + apiFormJson.html;
        const theBody = document.querySelector("body");
        theBody?.prepend(iframe);
        devDebugFieldIds = [];
        (apiFormJson?.fields || []).map((field: any) => {
          devDebugFieldIds.push(field.id);
        });
        currentFieldCollection = FsTreeFieldCollection.fromFieldJson(
          apiFormJson.fields
        );

        fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
          (apiFormJson.fields as TFsFieldAnyJson[]) || []
        );
      }
    );
  } else {
    console.log("Failed to fetchTree, could not get formId from url");
  }
}

function getSubmissionAsJson(caller: MessageEventSource, submissionId: string) {
  if (submissionId) {
    chrome.runtime.sendMessage(
      {
        type: "GetSubmissionFromApiRequest",
        submissionId,
        apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiSubmissionJson) => {
        const submissionUiDataItems =
          currentFieldCollection.getUiPopulateObject(apiSubmissionJson);

        // const mappedSubmissionData = apiSubmissionJson.data.reduce(
        //   (prev: any, cur: any) => {
        //     // this is TSubmission type, I think
        //     prev[cur.field] = cur.value;
        //     return prev;
        //   },
        //   {}
        // );
        // const submissionUiDataItems = currentFieldCollection
        //   .getAllFieldIds()
        //   .map((fieldId) => {
        //     const treeField = currentFieldCollection.getFieldById(fieldId);
        //     const evaluator = treeField.getSubmissionEvaluator();
        //     return evaluator.getUiPopulateObject(mappedSubmissionData);
        //   });

        caller.postMessage({
          messageType: "fetchSubmissionResponse",
          payload: {
            id: apiSubmissionJson.id,
            submissionData: submissionUiDataItems,
          },
        });
      }
    );
  } else {
    console.log(`Failed to fetch submission, submissionId: '${submissionId}'.`);
  }
}

function handleFetchSubmissionRequest(
  caller: MessageEventSource,
  payload: any
) {
  const { submissionId } = payload;
  const submissionJson = getSubmissionAsJson(caller, submissionId);
  console.log(
    `Send message response, fetch submission submissionId:'${submissionId}'`
  );

  caller.postMessage({
    // *tmc* called, some dev/debug stuff - remove it
    messageType: "fetchSubmissionResponse",
    payload: {
      id: submissionJson,
      submissionData: [
        {
          uiid: "field147738156-first",
          fieldId: "147738156",
          fieldType: "text",
          value: "Set by Content Script. " + Math.floor(Math.random() * 10000),
          statusMessages: [
            {
              severity: "warn",
              message:
                "This is a test.  This is only a test.  Had this been an actual message it would have said something useful.",
              relatedFieldIds: ["147738154", "148111228", "147738157"],
            } as TStatusRecord,
          ],
        },
        {
          uiid: "field147738157-state",
          fieldId: "147738157",
          fieldType: "select",
          value: "DE",
          statusMessages: [
            {
              severity: "warn",
              message:
                "This is a test.  This is only a test.  Had this been an actual message it would have said something useful.",
              relatedFieldIds: ["147738154", "148111228", "147738157"],
            } as TStatusRecord,
          ],
        },
      ],
    },
  });
}

function handleGetFieldStatusesRequest(
  caller: MessageEventSource,
  payload: any
) {
  const fieldStatusMessage = devDebugFieldIds.reduce(
    (prev, current, cIdx, ary) => {
      return { ...factoryStatusMessage(current), ...prev };
    },
    {}
  );

  const formStatusMessages = ["error", "warn", "info", "debug"].map(
    (severity) => {
      return {
        severity,
        message:
          `The ${severity} message. This message should be long enough to cause "wrap" effect if applicable. Now I am just added text to make sure it's long enough. ` +
          Math.random(),
        relatedFieldIds: ["147738154", "148111228", "147738157"],
      } as TStatusRecord;
    }
  );
  formStatusMessages.push({
    severity: "info",
    message: `Status Retrieved At: '${new Date().toUTCString()}'.`,
    // fieldId: null,
    relatedFieldIds: null,
  });
  caller.postMessage({
    messageType: "getFieldStatusesResponse",

    payload: {
      formStatusMessages: formStatusMessages as TStatusRecord[],
      fieldStatusMessages: fieldStatusMessage as TFieldStatusMessages,
    },
  });
}

function handleGetFieldLogicDependentsRequest(
  caller: MessageEventSource,
  payload: any
) {
  const { fieldId } = payload;
  const fieldIds = fieldLogicService?.getFieldIdsExtendedLogicOf(fieldId);
  const interdependentFieldIds =
    fieldLogicService?.getCircularReferenceFieldIds(fieldId);
  caller.postMessage({
    messageType: "getFieldLogicDependentsResponse",
    payload: {
      [fieldId]: {
        dependentFieldIds: fieldIds,
        interdependentFieldIds: interdependentFieldIds,
      },
    },
  });
}

function handleGetAllFieldInfoRequest(
  caller: MessageEventSource,
  payload: any
) {
  /// getFieldIdsExtendedLogicOf
  const fieldSummary = fieldLogicService?.getAllFieldSummary();

  /// .getFieldIdsExtendedLogicOf(fieldId);
  caller.postMessage({
    messageType: "getAllFieldInfoResponse",
    payload: { fieldSummary },
  });
}

function getFieldsWithLogicResponse(caller: MessageEventSource) {
  fieldLogicService?.getFieldIdsWithLogic;
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
    case "getAllFieldInfoRequest":
      e.source && handleGetAllFieldInfoRequest(e.source, e.data.payload);
      !e.source && console.log("No Source of message received.");
      break;
    case "removeFsBuddyRequest":
      removeFormHtml();
      break;
    case "getFieldStatusesRequest":
      e.source && handleGetFieldStatusesRequest(e.source, e.data.payload);
      break;
    case "fetchSubmissionRequest":
      console.log("receive message fetch submission");
      console.log({ payload: e.data.payload });

      e.source && handleFetchSubmissionRequest(e.source, e.data.payload);
      break;
    default:
    // console.log(`message type not understood. ( '${e.data.messageType}')`);
  }
};

const factoryStatusMessage = (fieldId: string) => {
  // dev/debug utility
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
    label: "Open FS Buddy",
    onclick: getFormAsJson,
  });

  const removeFormHtmlButton = createElementButton({
    label: "Close FS Buddy",
    onclick: removeFormHtml,
  });

  const fsBodyControlPanel = document.createElement("div");
  fsBodyControlPanel.appendChild(fsBodyControlPanelHead);
  fsBodyControlPanel.appendChild(fsBodyControlPanelGetFormHtmlButton);
  fsBodyControlPanel.appendChild(removeFormHtmlButton);
  fsBodyControlPanel.appendChild(document.createElement("hr"));

  fsBodyControlPanel.style.backgroundColor = "#FFFFFF";
  fsBodyControlPanel.style.border = "1px black solid";

  //   fsBodyControlPanel.style.height = '500px';
  // fsBodyControlPanel.style.width = "50%";
  // fsBodyControlPanel.style.width = "500px";
  fsBodyControlPanel.style.zIndex = "1000";
  fsBodyControlPanel.style.top = "0px";
  fsBodyControlPanel.style.left = "0px";
  fsBodyControlPanel.style.position = "absolute";

  theBody && theBody.appendChild(fsBodyControlPanel);
};
formId && initializeFsBuddyControlPanel();
