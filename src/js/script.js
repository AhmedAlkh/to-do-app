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
    const li = createLi(todo.id, todo.text);
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
      };

      const li = createLi(newTodo.id, newTodo.text);

      list?.append(li);
      userInput.value = "";

      state.allTodos.push(newTodo);

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

// VIEW FUNCTIONS
/**
 * Creates a list item with all its children and styles
 * @param {string} text
 * @returns {string}
 */
function renderListItem(text) {
  const listItem = `
    <button class="complete-btn">
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

function createLi(id, text) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.innerHTML = renderListItem(text);
  li.dataset.id = id;
  return li;
}

// HELPER FUNCTIONS
function generateId() {
  return Math.random().toString(16).slice(2);
}

function saveItem() {
  localStorage.setItem("taskListItem", JSON.stringify(state.allTodos));
}
