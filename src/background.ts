// aka service worker

console.log("hello from background.js");
import { treeUtilities } from "./fs-goof/extension-interface";

// @ts-ignore 'oninstall' not on Window
// self.oninstall = () => {
//   // The imported script shouldn't do anything, but only declare a global function
//   // (someComplexScriptAsyncHandler) or use an analog of require() to register a module
//   tryImport("lib/extension-interface.js");
// };

const getFormJsonFromApi = async (message: any) => {
  return new Promise((resolve, reject) => {
    console.log("Preparing request");
    const { apiKey, fetchFormId } = message;

    if (!apiKey || !fetchFormId) {
      throw new Error(`apiKey: '${apiKey}' or fetchFormId: '${fetchFormId}'.`);
    }

    const formGetUrl = `https://www.formstack.com/api/v2/form/${fetchFormId}`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${apiKey}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(formGetUrl, requestOptions)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(e);
        }
      })
      .catch((error) => reject(error));
  });
};

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  console.log({ treeUtilities });
  console.log({ message, sender, senderResponse });
  if (message.type === "GetDependancyList") {
    const { apiKey, fetchFormId } = message;
    const theFormId = "5350841";

    const treeJson = getFormJsonFromApi({
      apiKey,
      fetchFormId: theFormId,
    })
      .then((treeJson) => {
        try {
          const tree = treeUtilities(treeJson);
          console.log({ tree });
          console.log({ getDependacyStatuses: tree.getDependacyStatuses });
        } catch (e) {
          console.log("Failed to build tree from json");
          console.log(e);
        }
        senderResponse(treeJson);
      })
      .catch((e) => senderResponse(e));
  } else if (message.type === "RequestGetForm") {
    const { apiKey, fetchFormId } = message;
    getFormJsonFromApi({
      apiKey,
      fetchFormId,
    })
      .then((treeJson) => {
        senderResponse(treeJson);
      })
      .catch((e) => {
        console.log("Failed to RequestGetForm");
        console.log(e);
        senderResponse(e);
      });
  } else if (message.type === "GetFormHtml") {
    const { apiKey, fetchFormId } = message;
    getFormJsonFromApi({
      apiKey,
      fetchFormId,
    })
      .then((treeJson: any) => {
        senderResponse(treeJson.html);
      })
      .catch((e) => {
        console.log("Failed to RequestGetForm");
        console.log(e);
        senderResponse(e);
      });
  } else if (message.type === "GetFormAsJson") {
    const { apiKey, fetchFormId } = message;
    getFormJsonFromApi({
      apiKey,
      fetchFormId,
    })
      .then((treeJson: any) => {
        senderResponse(treeJson);
      })
      .catch((e) => {
        console.log("Failed to GetFormAsJson");
        console.log(e);
        senderResponse(e);
      });
  }

  return true;
});
