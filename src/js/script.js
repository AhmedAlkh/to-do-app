// when user enters site
// -> see an empty todo list

// when user submits a new todo, add todo to list
// -> get user input ✅
// -> add task to list ✅
// -> clear input field on submission ✅

// When user clicks on the delete button, task is deleted
// -> list item is removed the list ✅
// -> remove list item from allTodos array ✅

// When user adds a task to the list
// -> That task is added to local storage ✅
// -> Task stays on list even when user leaves and returns to app ✅

// When user updates a todo
// -> When a task is clicked ✅
// -> User can update that task by entering a new one ✅

// When a user checks a task as complete
// -> The complete button will be checked ✅
// -> The text will be light gray ✅
// -> The text will have a strikethough ✅

const form = document.querySelector(".create-bar-form");
const userInput = document.querySelector(".create-bar");
const list = document.querySelector(".list");
const deleteButtons = document.querySelectorAll(".delete-btn");

const state = {
  allTodos: [],
};

// GET TODOS FROM LOCAL STORAGE
const savedTasksString = localStorage.getItem("taskListItem");
if (savedTasksString === null) {
  state.allTodos = [];
} else {
  const parsedTasks = JSON.parse(savedTasksString);
  state.allTodos = parsedTasks;

  state.allTodos.forEach((todo) => {
    const li = createLi(todo.id, todo.text, todo.isCompleted);
    list.append(li);
  });
}

// ADD TODO
if (form instanceof HTMLFormElement) {
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (userInput instanceof HTMLInputElement) {
      const newTodo = {
        id: generateId(),
        text: userInput.value,
        isCompleted: "false",
      };

      const li = createLi(newTodo.id, newTodo.text, newTodo.isCompleted);

      list?.append(li);
      userInput.value = "";

      state.allTodos.push(newTodo);

      const allListItems = document.querySelectorAll(".list-item");
      const listItemId = newTodo.id;
      allListItems.forEach((listItem) => {
        if (listItem.dataset.id === listItemId) {
          const button = listItem.children[0];
          button.addEventListener("click", () => {
            toggleCheck(button);

            state.allTodos.forEach((todo) => {
              if (todo.id === listItem.dataset.id) {
                todo.isCompleted = listItem.dataset.completed;

                // Save to local storage
                saveItem();
              }
            });
          });
        }
      });
      // Save to local storage
      saveItem();
    }
  });
}

// REMOVE TODO
list.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("d")) {
    const deleteBtn = target.parentElement;
    const listItem = deleteBtn.parentElement;
    const listItemId = listItem.dataset.id;

    listItem.remove();

    const clickedTodo = state.allTodos.filter((todo) => {
      return todo.id !== listItemId;
    });

    state.allTodos = clickedTodo;

    saveItem();
  }
});

// UPDATE TODO
list.addEventListener("focusout", (e) => {
  const target = e.target;
  if (target.classList.contains("list-item-text") === true) {
    const targetText = target.textContent;
    const listItem = target.parentElement;
    const listItemId = listItem.dataset.id;

    for (var i = 0; i < state.allTodos.length; i++) {
      if (state.allTodos[i].id === listItemId) {
        state.allTodos[i].text = targetText;
        saveItem();
      }
    }
  }
});

// COMPLETE BUTTON FUNCTIONALITY
const completeBtns = document.querySelectorAll(".complete-btn");
completeBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const listItem = button.parentElement;

    toggleCheck(button);

    state.allTodos.forEach((todo) => {
      if (todo.id === listItem.dataset.id) {
        todo.isCompleted = listItem.dataset.completed;

        // Save to local storage
        saveItem();
      }
    });
  });
});

// CLEAR ALL COMPLETED TASKS
const clearBtns = document.querySelectorAll(".clear-btn");

clearBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const unCompletedTodos = state.allTodos.filter(
      (todo) => todo.isCompleted === "false"
    );

    state.allTodos = unCompletedTodos;
    saveItem();

    const listItems = document.querySelectorAll(".list-item");
    listItems.forEach((listItem) => {
      console.log(listItem);
      if (listItem.dataset.completed === "true") {
        listItem.remove();
      }
    });
  });
});

// When a task is added to the list, the counter increases
// When a task is checked as complete, the counter decreases

// SHOW HOW MANY ITEMS LEFT
function countItemsLeft() {
  let itemsLeft = state.allTodos.filter(function (todo) {
    return todo.isCompleted;
  });
  return itemsLeft.length;
}

let count = countItemsLeft();

let itemsLeftCounter = document.querySelector(".items-left p");
itemsLeftCounter.textContent = count.toString();

console.log(itemsLeftCounter);

// TOGGLE DARK MODE
// let currentTheme = "light";

// function toggleTheme() {
//   if (currentTheme === "light") {
//     currentTheme = "dark";
//     document.body.classList.add("dark");
//     document.getElementById("theme-toggle-btn");
//     document
//       .getElementById("theme-toggle-btn")
//       .setAttribute("aria-label", "Enable light mode");
//   } else {
//     currentTheme = "light";
//     document.body.classList.remove("dark");
//     document.getElementById("theme-toggle-btn");
//     document
//       .getElementById("theme-toggle-btn")
//       .setAttribute("aria-label", "Enable dark mode");
//   }
// }

// document
//   .getElementById("theme-toggle-btn")
//   .addEventListener("click", toggleTheme);

// remove #light from light theme, change body#dark to body .dark

// VIEW FUNCTIONS
/**
 * Creates a list item with all its children and styles
 * @param {string} text
 * @returns {string}
 */
function renderListItem(text, isCompleted = "false") {
  const listItem = `
    <button class="complete-btn" data-completed=${isCompleted}>
      <img src="/src/assets/images/icon-check.svg" alt="" />
    </button>
    <p class="list-item-text" contenteditable="true">${text}</p>
    <button class="delete-btn">
      <img class="d" src="/src/assets/images/icon-cross.svg" alt="" />
    </button>
  `;

  return listItem;
}

/**
 * Create a list element
 * @param {string} id - This should be the id of the specific task on the list
 * @param {string} text - This is the task
 */

function createLi(id, text, isCompleted) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.innerHTML = renderListItem(text);
  li.dataset.id = id;
  li.dataset.completed = isCompleted;
  return li;
}

function toggleCheck(button) {
  const listItem = button.parentElement;
  const currentValue = listItem.dataset.completed;

  if (currentValue === "false") {
    listItem.dataset.completed = "true";
  }

  if (currentValue === "true") {
    listItem.dataset.completed = "false";
  }
}

// HELPER FUNCTIONS
function generateId() {
  return Math.random().toString(16).slice(2);
}

function saveItem() {
  localStorage.setItem("taskListItem", JSON.stringify(state.allTodos));
}
