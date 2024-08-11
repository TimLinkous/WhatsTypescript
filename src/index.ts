document.addEventListener('DOMContentLoaded', () => {

//references to the lists
const form = document.querySelector('#defineform') as HTMLFormElement;
const definitionList = document.querySelector('#definition-list') as HTMLElement;
const definedWordElement = document.querySelector('#defined-word') as HTMLElement;

// check if both exist
if (form && definitionList && definedWordElement) {
  console.log('Form, definition list, and defined word element found');

  form.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    console.log('Form submitted');

     // Get the form data and extract the word to be defined
    const formData = new FormData(form);
    const text = formData.get('defineword') as string;

    console.log(`Word submitted: ${text}`);

    definedWordElement.textContent = text;

    try {
      // API request to get the definition
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
      console.log(`API response status: ${response.status}`);
      
      //Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // JSON response
      const data = await response.json();
      console.log('API response data:', data);

      definitionList.innerHTML = ''; // Clear content

      // Check if valid data to display
      if (Array.isArray(data) && data.length > 0 && data[0].meanings) {
        console.log('Meanings found:', data[0].meanings);

        let definitionCount = 0;
        
        // Iterate through each meaning and definition
        for (const meaning of data[0].meanings) {
          for(const definition of meaning.definitions) {
            if (definitionCount < 3) {
            // Create a new list item for each definition
              const listItem = document.createElement('li');
              let content = `${meaning.partOfSpeech}: ${definition.definition}`;

              //Synonyms
              if (definition.synonyms && definition.synonyms.length > 0) {
                content += `<br>Synonyms: ${definition.synonyms.slice(0,3).join(', ')}`;
              }

              listItem.innerHTML = content;

            // Add the list item to the definition list
              definitionList.appendChild(listItem);
              definitionCount++;
            } else {
              // Exit both loops if two definitions are added
              break;
            }
          }
          if (definitionCount >= 3) break;
        }
        // If no definitions were found, display a message
        if (definitionCount === 0) {
          definitionList.innerHTML = '<li>No definitions found for the word.</li>';
        }
      } else {
        // Display message if no definitions were found
        console.log('No meanings found.');
        definitionList.innerHTML = '<li>No definitions found for the word.</li>';
      }

    } catch (error) {
      console.error('Error retrieving definition:', error);
      definitionList.innerHTML = '<li>Sorry, could not find the word</li>';
    }
  });
} else {
  console.error('Form or definition list not found.');
}
});