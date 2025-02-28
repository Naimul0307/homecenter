        // Load contributions from XML
        function loadContributions() {
            fetch('/public/xml/contributions.xml')
                .then(response => response.text())
                .then(xmlText => {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(xmlText, "text/xml");
                    let contributions = xmlDoc.getElementsByTagName("contribution");

                    let buttonContainer = document.getElementById("button-container");

                    for (let i = 0; i < contributions.length; i++) {
                        let contribution = contributions[i].textContent;
                        let button = document.createElement("button");
                        button.textContent = contribution;
                        button.classList.add("contribution-btn");
                        button.setAttribute("data-value", contribution);

                        // Toggle selection
                        button.addEventListener("click", function (event) {
                            event.preventDefault();
                            this.classList.toggle("selected");
                        });

                        buttonContainer.appendChild(button);
                    }
                })
                .catch(error => console.error('Error loading XML:', error));
        }
        
        // Save selected contributions to local storage
        function saveSelection() {
            let selectedButtons = document.querySelectorAll(".contribution-btn.selected");
            let selectedValues = Array.from(selectedButtons).map(btn => btn.getAttribute("data-value"));

            let userName = localStorage.getItem("name"); // Retrieve stored name

            if (!userName) {
                alert("User name not found! Please set a name first.");
                return;
            }

            // Create user data object
            let userData = {
                name: userName,
                contributions: selectedValues
            };

            // Retrieve existing user data from localStorage, or initialize an empty array if no data exists
            let allUserData = JSON.parse(localStorage.getItem("allUserContributions")) || [];

            // Add the new user's data to the array
            allUserData.push(userData);

            // Save the updated array back to localStorage
            localStorage.setItem("allUserContributions", JSON.stringify(allUserData));

            // Redirect to contributionText.html after saving
            window.location.href = "review.html";  
        }

        // Load contributions on page load
        document.addEventListener("DOMContentLoaded", loadContributions);

        // Add event listener for submit button
        document.getElementById("submit-btn").addEventListener("click", saveSelection);