// aka service worker


console.log('hello from background.js')


const importedScripts = [];

function tryImport(...fileNames) {
  try {
    const toRun = new Set(fileNames.filter(f => !importedScripts.includes(f)));
    if (toRun.size) {
      importedScripts.push(...toRun);
      importScripts(...toRun);
    }
    return true;
  } catch (e) {
    console.error(e);
  }
}

self.oninstall = () => {
  // The imported script shouldn't do anything, but only declare a global function
  // (someComplexScriptAsyncHandler) or use an analog of require() to register a module
  tryImport('lib/extension-interface.js');
};

const getFormJsonFromApi = async (message) => {
  return new Promise((resolve, reject)=>{

    console.log('Preparing request')
    const {apiKey, fetchFormId} = message;
    console.log({message})
    if(!apiKey || !fetchFormId) {
      throw new Error(`apiKey: '${apiKey}' or fetchFormId: '${fetchFormId}'.`)
    }
  
    const formGetUrl = `https://www.formstack.com/api/v2/form/${fetchFormId}`
  
    // ----
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${apiKey}`);
    myHeaders.append("Content-Type", "application/json");
  
    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
  
    fetch(formGetUrl, requestOptions)
    .then(response => {
      // console.log({rawResponse: response})
      return response.text()
    })
    .then(result => {
        try {
          resolve(JSON.parse(result))
        } catch( e) {
          reject(e)
        }
      } 
    )
    .catch(error => reject(error));
  })


} 


// background script
chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  console.log({message, sender, senderResponse})
  if (message.type === "RequestGetForm") {
    // ********************
    // if (tryImport('lib/extension-interface.js')) {
    //   console.log(treeExtensionInterface)
    //   console.log(treeExtensionInterface.sayHello())
    // }
    //******************** */

                console.log('Preparing request')
                const {apiKey, fetchFormId} = message;
                console.log({message})
                if(!apiKey || !fetchFormId) {
                  throw new Error(`apiKey: '${apiKey}' or fetchFormId: '${fetchFormId}'.`)
                }

                const formGetUrl = `https://www.formstack.com/api/v2/form/${fetchFormId}`

                // ----
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${apiKey}`);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };

                fetch(formGetUrl, requestOptions)
                .then(response => {
                  // console.log({rawResponse: response})
                  return response.text()
                })
                .then(result => {
                    try {
                      console.log(`api call result: '${result}'.`)
                      // console.log(JSON.parse(result))
                      senderResponse(JSON.parse(result));
                    } catch( e) {
                      console.log('Failed ot parse json');
                      console.log(e)
                      senderResponse({e});
                    }
                  } 
                )
                .catch(error => console.log('error', error));
  }
  return true
});

chrome.runtime.onMessage.addListener(async function (message, sender, senderResponse) {
  console.log({message, sender, senderResponse})
  if (message.type === "GetDependancyList") {
    // ********************
    // console.log(treeExtensionInterface)
    // console.log(treeExtensionInterface.sayHello())

    if (tryImport('lib/extension-interface.js')) {
      console.log(treeExtensionInterface)
      console.log(treeExtensionInterface.sayHello())
    } else {
      console.log('Failed to import extension interface');
      senderResponse({})
    }
    //******************** */


    const {apiKey, fetchFormId} = message;
    const treeJson = await getFormJsonFromApi({apiKey, fetchFormId}).catch(e=>senderResponse(e));
    senderResponse(treeJson)
  }
  return true
});