// client-side js
// run by the browser each time your view template referencing it is loaded

const bookTitles = [];
const id = [];
let authorNames = {};

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
let select = document.getElementById("authorName");
let option;

try {
  fetch("/getAuthors")
    .then(res => res.json())
    .then(function(response) {
      response.forEach(function(item) {
        option = document.createElement("option");
        option.value = `${item.id}`;
        option.text = `${item.first_name} ${item.last_name}`;
        select.appendChild(option);

        let authorSelectDropDown = document.getElementById("authorName");

        authorSelectDropDown.onchange = function() {
          selectedAuthorId = document.getElementById("authorName").value;
          console.log("selectedAuthor:", selectedAuthorId);
          if (selectedAuthorId === "Other") {
            console.log("Other selected");
            let authorNameDiv = document.createElement("div");
            // let authorInputField = document.createElement("input");
            // authorInputField.setAttribute("type", "file");
            // authorInputField.setAttribute("name", "file");
            let authorFirstNameInput = document.createElement("input");
            authorFirstNameInput.setAttribute(
              "id",
              "authorFirstNameInputField"
            );
            authorFirstNameInput.setAttribute("type", "text");
            authorFirstNameInput.setAttribute("name", "addAuthorFirstName");
            authorFirstNameInput.setAttribute(
              "placeholder",
              "Author First Name*"
            );
            authorFirstNameInput.setAttribute("required", "");
            addAuthorDiv.appendChild(authorFirstNameInput);
            document
              .getElementById("authorFirstNameInputField")
              .appendChild(authorNameDiv);
            //
            let authorLastNameInput = document.createElement("input");
            authorLastNameInput.setAttribute("id", "authorLastNameInputField");
            authorLastNameInput.setAttribute("type", "text");
            authorLastNameInput.setAttribute("name", "addAuthorLastName");
            authorLastNameInput.setAttribute(
              "placeholder",
              "Author Last Name*"
            );
            authorLastNameInput.setAttribute("required", "");
            addAuthorDiv.appendChild(authorLastNameInput);
            document
              .getElementById("authorLastNameInputField")
              .appendChild(authorNameDiv);
          } else {
            if (
              document.contains(
                document.getElementById("authorFirstNameInputField")
              ) &&
              document.contains(
                document.getElementById("authorLastNameInputField")
              )
            ) {
              document.getElementById("authorFirstNameInputField").remove();
              document.getElementById("authorLastNameInputField").remove();
            }
            console.log("Selected option:", selectedAuthorId);
          }
        };
      });
    });
} catch (e) {
  console.log("ERROR", e);
}

booksForm.onsubmit = async event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  let data;
  //can remove references to first and last name, split the selectedAuthorId by ''
  const otherAuthorFirstNameValue = document.getElementById(
    "authorFirstNameInputField"
  );
  const otherAuthorLastNameValue = document.getElementById(
    "authorLastNameInputField"
  );
  // if (selectedAuthorId === "Other") {
  if(! /\d+/.test(selectedAuthorId)){
    console.log("OTHER");
    const numOfAuthorIdOptions = document.querySelectorAll(
      "#authorName option"
    );
    // const newAuthorId = numOfAuthorIdOptions.length - 1
    // console.log('newAuthorId', newAuthorId);
    data = {
      bookTitle: bookInput.value,
      authorFirstName: otherAuthorFirstNameValue.value,
      authorLastName: otherAuthorLastNameValue.value
    };
    console.log(
      "data:",
      data.bookTitle,
      "||",
      data.authorFirstName,
      "||",
      data.authorLastName
    );
  } 
else {
    data = { bookTitle: bookInput.value, authorId: selectedAuthorId };
    console.log("data:", data.bookTitle, "||", data.authorId);
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
