// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello again world :o");

const dreams = [];
const id = [];

// define variables that reference elements on our page
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements["dream"];
const dreamsList = document.getElementById("dreams");
const idList = document.getElementById("ids");
const clearButton = document.querySelector("#clear-dreams");

// request the dreams from our app's sqlite database
fetch("/getDreams", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewDream(row.dream);
      appendDreamId(row.id);
    });
  });

// a helper function that creates a list item for a given dream
const appendNewDream = dream => {
  const newDreamListItem = document.createElement("li");
  newDreamListItem.innerText = dream;
  dreamsList.appendChild(newDreamListItem);
};

//attempting to add ID after dream
const appendDreamId = id => {
  const newIdListItem = document.createElement("li");
  newIdListItem.innerText = id;
  idList.appendChild(newIdListItem);
};

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = async event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { dream: dreamInput.value };

  try {
    let res = await fetch("/addDream", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    let response = await res.json();
    console.log(JSON.stringify(response));
    let newId = response.lastAddedId;

    // get dream value and add it to the list
    dreams.push(dreamInput.value);
    appendNewDream(dreamInput.value);

    console.log("newId", newId);
    id.push(newId);
    appendDreamId(newId);

    // reset form
    dreamInput.value = "";
    dreamInput.focus();
  } catch (error) {
    console.log(error);
  }
};

clearButton.addEventListener("click", event => {
  fetch("/clearDreams", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared dreams");
    });
  dreamsList.innerHTML = "";
});
