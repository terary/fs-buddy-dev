// aka service worker

console.log("hello from background.js");
import { treeUtilities } from "../fs-goof/extension-interface";
import { TreeManager } from "../common/TreeManager";
// @ts-ignore 'oninstall' not on Window
// self.oninstall = () => {
//   // The imported script shouldn't do anything, but only declare a global function
//   // (someComplexScriptAsyncHandler) or use an analog of require() to register a module
//   tryImport("lib/extension-interface.js");
// };

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  console.log({ treeUtilities });
  console.log({ message, sender, senderResponse });
  const { apiKey, fetchFormId } = message;

  switch (message.type) {
    case "GetFormAsJson":
      TreeManager.getInstance()
        .getTree(apiKey, fetchFormId)
        .then((treeJson: any) => {
          senderResponse(treeJson);
        })
        .catch((e) => {
          console.log("Failed to GetFormAsJson");
          console.log(e);
          senderResponse(e);
        });
      break;
  }
  return true;
});
