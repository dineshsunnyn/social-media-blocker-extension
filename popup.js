document.addEventListener("DOMContentLoaded",()=>{
  const blockedWebsitesList = document.getElementById("blockedSitesList");
    chrome.storage.local.get("blockedURLS",(result)=>{
        const currentList = result.blockedURLS||[];
        if(currentList.length>0)
            {
                const msg = document.getElementById("message");
                msg.textContent = "Blocked Websites !!!";
                msg.style.display = "block";
        for(let i=0;i<currentList.length;i++ )
            {
                    const li = document.createElement("li");
                    li.textContent = currentList[i].website;
                    blockedWebsitesList.appendChild(li);

            }
        }    
        else
        {
        //     const li = document.createElement("li");
        //     li.textContent = "No Websites blocked yet";
        //     blockedWebsitesList.appendChild(li);
            const msg=document.getElementById("message");
            msg.textContent="No Websited Blocked Yet !!!";
            msg.style.display="block";
            // setTimeout(()=>{
            //     msg.textContent = "";
            //     msg.style.display="none";   
            // },30000);

        }    
    })

})

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blockForm");
  const blockedWebsitesList = document.getElementById("blockedSitesList");
  const new_website = document.getElementById("websiteInput");

    let new_id_start = Math.floor(Date.now())%1000000;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const website = new_website.value.trim()
    .replace(/^https?:\/\//,'')
    .replace(/^www\./,'')
    .split('/')[0];
    
    if (website) {
      const new_rule = {
        id: new_id_start,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: `||${website}^`,
          resourceTypes: ["main_frame","sub_frame"],
        },
      };


    //   new_website.value="";

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [new_rule],
        removeRuleIds: [],
      });


      // Fetch existing blocked URLs from storage
      chrome.storage.local.get("blockedURLS", (result) => {
        const currentList = result.blockedURLS || [];
        const alreadyExists = currentList.some(entry=>entry.website===website);
        if(!(alreadyExists))
            {
              currentList.push({ website, id: new_rule.id });
              // Display the website on the popup UI
              const li = document.createElement("li");
              li.textContent = website;
              blockedWebsitesList.appendChild(li);

              // Clear the input field
              new_website.value = "";
            document.getElementById("message").textContent = "Blocked Websites !!!";
            document.getElementById("message").style.display="block";
            }
        else
        {
            
            const msg=document.getElementById("message");
            msg.textContent="Already Blocked!";
            msg.style.display="block";
            // setTimeout(()=>{
            //     msg.textContent = "";
            //     msg.style.display="none";   
            // },3000);

            
        }
            
        // Add the new website

        // Update storage
        chrome.storage.local.set({ blockedURLS: currentList });
      });
    }
  });
});
