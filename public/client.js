// client-side js
// run by the browser each time your view template referencing it is loaded

// define variables that reference elements on our page
const booksForm = document.forms[0];
const bookInput = document.getElementById("bookTitle");
const otherAuthorInput = document.getElementById("addAuthorInputField");
const authorIdInput = document.getElementById("authorId");
const addAuthorDiv = document.getElementById("addAuthor");
//const authorNameDropdown = document.getElementById("authorName");
const authorList = document.getElementById("authors");
const idList = document.getElementById("ids");
const clearButton = document.querySelector("#clear-books");
let selectedAuthorId;
let selectedAuthorFirstName;
let selectedAuthorLastName;
let select = document.getElementById("authorName");
let option;
let authorDetails = {};
let authorFirstName;
let authorLastName;
let authorId;

try {
  fetch("/getAuthors")
    .then(res => res.json())
    .then(function(response) {
      response.forEach(function(item) {
        //example of how to create an array with dynamic data
        authorDetails[item.id] = item;
        option = document.createElement("option");
        option.value = `${item.id}`;
        option.text = `${item.first_name} ${item.last_name}`;
        select.appendChild(option);

        let authorSelectDropDown = document.getElementById("authorName");

        authorSelectDropDown.onchange = function() {
          selectedAuthorId = document.getElementById("authorName").value;
          let selectedAuthor = authorDetails[selectedAuthorId];
          if (selectedAuthor) {
            console.log("selectedAuthor$$:", selectedAuthor);
            authorId = selectedAuthor.id;
            authorFirstName = selectedAuthor.first_name;
            authorLastName = selectedAuthor.last_name;
            console.log("authorFirstName2", authorFirstName);
            console.log("authorLastName2", authorLastName);
          } else {
            let splitAuthorName = selectedAuthorId.split(" ");
            authorFirstName = splitAuthorName[0];
            authorLastName = splitAuthorName[1];
            console.log("authorFirstName2", authorFirstName);
            console.log("authorLastName2", authorLastName);
          }
        };
      });
      //console.log('stuff', authorDetails['31'].first_name);
    });
} catch (e) {
  console.log("ERROR", e);
}

booksForm.onsubmit = async event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  let data;
  //can remove references to first and last name, split the selectedAuthorId by ''
  console.log("authorId", authorId);
  console.log("authorNameValue", authorId);
  console.log("authorFirstName", authorFirstName);
  console.log("authorLastName", authorLastName);

  if (!/\d+/.test(authorId)) {
    // NEW AUTHOR
    console.log("OTHER");
    const numOfAuthorIdOptions = document.querySelectorAll(
      "#authorName option"
    );

    data = {
      bookTitle: bookInput.value,
      authorId: authorId,
      authorFirstName: authorFirstName,
      authorLastName: authorLastName
    };
    console.log(
      "data:",
      data.bookTitle,
      "||",
      data.authorFirstName,
      "||",
      data.authorLastName,
      "||",
      data.authorId
    );
  } else {
    data = {
      bookTitle: bookInput.value,
      authorId: authorId,
      authorFirstName: authorFirstName,
      authorLastName: authorLastName
    };
    console.log(
      "data:",
      data.bookTitle,
      "||",
      data.authorId,
      "||",
      data.authorFirstName,
      "||",
      data.authorLastName
    );
  }
  try {
    let res = await fetch("/addBookAndAuthor", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    let response = await res.json();
    console.log("RESPONSE:", response);
    console.log("RESPONSE", JSON.stringify(response));
    let newId = response.lastAddedId;
    // reset form
    bookInput.value = "";
    bookInput.focus();
  } catch (error) {
    console.log(error);
  }
  window.location.reload();
};

$(document).ready(function() {
  $("#authorName").select2({
    tags: true
  });
});
