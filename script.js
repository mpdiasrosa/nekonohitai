document.addEventListener('DOMContentLoaded', async () => {
    const menuItems = document.querySelectorAll('#menu_items a');
    const sections = document.querySelectorAll('.main_items section');
    const postsList = document.getElementById('posts_items');
    const postsSection = document.getElementById('posts');
    const backButton = document.getElementById('backButton');

    // Function to fetch text from file
    async function fetchTextFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error('There was a problem fetching the file:', error);
            return null;
        }
    }

    // Function to read and save text content
    async function readAndSaveText(filePath, variableName) {
        const text = await fetchTextFile(filePath);
        if (text !== null) {
            window[variableName] = text;
            return text;
        } else {
            return ''; // Return an empty string if text is null
        }
    }

    // Function to insert text into an element
    function insertTextIntoElement(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = text;
        }
    }

    // Load initial text content for home and about me sections
    const homeText = await readAndSaveText('./text/home_text.txt', 'textHome');
    insertTextIntoElement('home_text', homeText);

    const aboutMeText = await readAndSaveText('./text/about_me_text.txt', 'textAboutMe');
    insertTextIntoElement('about_me_text', aboutMeText);

    // Event listener for menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', async function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Get the section id without '#'

            // Toggle visibility of sections
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden'); // Show the clicked section
                    if (section.id === 'posts') {
                        postsList.style.display = 'block'; // Show posts list when posts section is shown
                        postsSection.querySelector('h2').style.display = 'block'; // Show posts title
                        backButton.style.display = 'none'; // Hide back button initially
                    } else {
                        backButton.style.display = 'none'; // Hide back button for other sections
                        insertTextIntoElement('posts_text', ''); // Clear posts text content
                    }
                } else {
                    section.classList.add('hidden'); // Hide other sections
                }
            });

            // Mark selected menu item
            menuItems.forEach(menuItem => {
                if (menuItem === item) {
                    menuItem.classList.add('selected'); // Add 'selected' class to clicked item
                } else {
                    menuItem.classList.remove('selected'); // Remove 'selected' class from other items
                }
            });

            // Clear posts list and title if not on posts section
            if (targetId !== 'posts') {
                postsList.style.display = 'none';
                postsSection.querySelector('h2').style.display = 'none';
            }
        });
    });

    // Event listener for posts list clicks
    postsList.addEventListener('click', async function(event) {
        if (event.target.tagName === 'SPAN') {
            const fileId = event.target.id; // Get the id of the clicked <span>
            const filePath = `./text/${fileId}.txt`; // Construct file path based on id

            // Fetch text content from file
            const textContent = await fetchTextFile(filePath);

            // Update HTML content
            const sectionToUpdate = document.getElementById('posts_text');
            if (sectionToUpdate) {
                sectionToUpdate.innerHTML = textContent;
            }

            // Show back button
            backButton.style.display = 'block';
            postsList.style.display = 'none'; // Hide posts list
            postsSection.querySelector('h2').style.display = 'none'; // Hide posts title
        }
    });

    // Event listener for back button
    backButton.addEventListener('click', function() {
        postsList.style.display = 'block'; // Show posts list
        postsSection.querySelector('h2').style.display = 'block'; // Show posts title
        backButton.style.display = 'none'; // Hide back button
        insertTextIntoElement('posts_text', ''); // Clear posts text content
    });
});
