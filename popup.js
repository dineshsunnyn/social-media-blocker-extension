document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blockForm");
  const blockedWebsitesList = document.getElementById("blockedWebsites");
  

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const websiteInput = form.elements["website"];
    const website = websiteInput.value.trim();

    if (website) {
      // Display the website on the popup UI
      const li = document.createElement("li");
      li.textContent = website;
      blockedWebsitesList.appendChild(li);

      // Clear the input field
      websiteInput.value = "";

      // Fetch existing blocked URLs from storage
      chrome.storage.local.get("blockedURLS", (result) => {
        const currentList = result.blockedURLS || [];

        // Add the new website
        currentList.push(website);

        // Update storage
        chrome.storage.local.set({ blockedURLS: currentList });
      });
    }
  });
});
