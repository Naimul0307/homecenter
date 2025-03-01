document.addEventListener("DOMContentLoaded", function () {
    const receiptContainer = document.getElementById("receipt-container");
    const overlay = document.getElementById("overlay");

    // Hide receipt popup initially
    receiptContainer.style.display = "none";
    overlay.style.display = "none";

    // Get all user contributions data from localStorage
    const storedAllUserContributions = localStorage.getItem("allUserContributions");

    let userName = "Dear User";
    let selectedContributions = [];

    // Parse the data from localStorage
    if (storedAllUserContributions) {
        try {
            const allUserContributionsData = JSON.parse(storedAllUserContributions);
            if (allUserContributionsData.length > 0) {
                // Get the last user's data
                const lastUserData = allUserContributionsData[allUserContributionsData.length - 1];
                userName = lastUserData.name || "Dear User";
                selectedContributions = lastUserData.contributions || [];
            }
        } catch (e) {
            console.error("Error parsing user contributions:", e);
            selectedContributions = [];
        }
    }

    // Debugging: Log the parsed data
    console.log("User Name:", userName);
    console.log("Contributions:", selectedContributions);

    // Update the greeting with the user's name
    document.querySelector(".greeting").textContent = `Dear ${userName}`;

    // Update the items list with selected contributions
    const itemsList = document.querySelector(".items-list");
    itemsList.innerHTML = ""; // Clear existing list

    if (selectedContributions.length > 0) {
        selectedContributions.forEach(contribution => {
            const listItem = document.createElement("li");
            listItem.textContent = contribution;
            itemsList.appendChild(listItem);
        });
    } else {
        // If no contributions found, show default text
        const listItem = document.createElement("li");
        listItem.textContent = "No contributions selected.";
        itemsList.appendChild(listItem);
    }

    // Show the receipt popup and overlay with animation
    document.getElementById("review-confirm-btn").addEventListener("click", function () {
        overlay.style.display = "block";
        receiptContainer.style.display = "block";

        // Remove hidden class to apply the fade-in animation
        setTimeout(() => {
            overlay.classList.remove("hidden");
            receiptContainer.classList.remove("hidden");
        }, 10);
    });

    // Close the receipt popup with animation
    document.getElementById("close-btn").addEventListener("click", function () {
        // Add hidden class to apply fade-out animation
        overlay.classList.add("hidden");
        receiptContainer.classList.add("hidden");

        // Wait for the animation to complete before hiding completely
        setTimeout(() => {
            overlay.style.display = "none";
            receiptContainer.style.display = "none";

            // Redirect to index.html after closing animation
            window.location.href = "index.html";
        }, 300); // Match the CSS animation duration (0.3s)
    });
});
