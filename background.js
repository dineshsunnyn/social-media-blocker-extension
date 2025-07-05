// chrome.webRequest.onBeforeRequest.addListener(
//   (details) => {
//     chrome.storage.local.get("blockedSites", (data) => {
//     for(let site of data.blockedSites)
//         {
//             if(details.url.includes(site)){
//                 return {redirectUrl:"blocked.html"};
//             }
//         }
//     });
//   },
//   { urls: ["<all_urls>"], types: ["main_frame"] },
//   ["blocking"]
// );



let cachedBlockedURLS=[];

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.blockedURLS) {
    (async () => {
      const result= await new Promise((resolve) => {
        chrome.storage.local.get("blockedURLS", resolve);
      });
      
      cachedBlockedURLS=result.blockedURLS||[];
      console.log(cachedBlockedURLS.blockedURLS);
    })();
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    for (let site of cachedBlockedURLS) {
      if (details.url.includes(site)) {
        return { redirectUrl: "blocked.html" };
      }
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);

chrome.runtime.onStartup.addListener(()=>{
    chrome.storage.local.get("blockedURLS",(result)=>{
        cachedBlockedURLS=result.blockedURLS||[];
    })
})


chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.local.set({blockedURLS:["facebook.com","youtube.com","instagram.com"]})
})