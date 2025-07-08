document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blockForm");
  const blockedWebsitesList = document.getElementById("blockedSitesList");
  const new_website = document.getElementById("websiteInput");

    let new_id_start = Math.floor(Date.now())%1000000;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const website = new_website.value.trim();

    
    if (website) {
      const new_rule = {
        id: new_id_start,
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: website,
          resourceTypes: ["main_frame"],
        },
      };

    //   new_website.value="";

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [new_rule],
        removeRuleIds: [],
      });

      // Display the website on the popup UI
      const li = document.createElement("li");
      li.textContent = website;
      blockedWebsitesList.appendChild(li);

      // Clear the input field
      new_website.value = "";

      // Fetch existing blocked URLs from storage
      chrome.storage.local.get("blockedURLS", (result) => {
        const currentList = result.blockedURLS || [];

        // Add the new website
        currentList.push({ website, id: new_rule.id });

        // Update storage
        chrome.storage.local.set({ blockedURLS: currentList });
      });
    }
  });
});
