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
const themeToggler = document.getElementById("theme-toggle-btn");
let toggleState = 0;

const state = {
  allTodos: [],
};

// GET TODOS AND THEME FROM LOCAL STORAGE
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

  renderCount();
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
      renderCount();
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
    renderCount();
    resetMain();
  }
});

// UPDATE TODO
list.addEventListener("focusout", (e) => {
  const target = e.target;
  if (target.classList.contains("list-item-text") === true) {
    const targetText = target.textContent;
    const listItem = target.parentElement;
    const listItemId = listItem.dataset.id;
    const targetTextPattern = targetText.replace(/ /g, "").trim();

    for (var i = 0; i < state.allTodos.length; i++) {
      if (state.allTodos[i].id === listItemId) {
        if (targetTextPattern.length === 0) {
          target.textContent = state.allTodos[i].text;
        } else {
          state.allTodos[i].text = targetText;
          saveItem();
        }
      }
    }
  }
});

// COMPLETE BUTTON FUNCTIONALITY
function completeTask() {
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
}

completeTask();

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
      if (listItem.dataset.completed === "true") {
        listItem.remove();
        renderCount();
      }
    });
  });
});

// SHOW HOW MANY ITEMS LEFT
function countItemsLeft(array) {
  let itemsLeft = array.filter(function (todo) {
    return todo.isCompleted;
  });
  return itemsLeft.length;
}

function renderCount(array = state.allTodos) {
  let count = countItemsLeft(array);

  let itemsLeftCounter = document.querySelectorAll(".items-left p");

  itemsLeftCounter.forEach((p) => {
    if (count === 1) {
      p.textContent = `1 item left`;
    } else {
      p.textContent = `${count} items left`;
    }
  });
}

// THEME-ING

// LOAD THEME
function loadTheme() {
  const themeObject = JSON.parse(localStorage.getItem("theme"));
  const image = themeToggler.firstElementChild;
  const body = document.body;

  if (themeObject !== null) {
    toggleState = themeObject.currentToggleState;
    const theme = themeObject.theme;

    if (toggleState === 0) {
      image.setAttribute("src", "./src/assets/images/icon-moon.svg");
      body.setAttribute("id", theme);
    } else if (toggleState === 1) {
      image.setAttribute("src", "/src/assets/images/icon-sun.svg");
      body.setAttribute("id", theme);
    }
  }
}

loadTheme();

// TOGGLE DARK MODE

function toggleTheme() {
  themeToggler.addEventListener("click", () => {
    toggleStateFunction();
  });
}

toggleTheme();

function toggleStateFunction() {
  const body = document.body;
  const image = themeToggler.firstElementChild;

  let themeSettings = {};

  if (toggleState === 0) {
    image.setAttribute("src", "./src/assets/images/icon-sun.svg");
    body.setAttribute("id", "dark");
    const themeBody = body.getAttribute("id");
    toggleState = 1;

    themeSettings = {
      theme: themeBody,
      currentToggleState: toggleState,
    };

    localStorage.setItem("theme", JSON.stringify(themeSettings));
  } else if (toggleState === 1) {
    image.setAttribute("src", "/src/assets/images/icon-moon.svg");
    body.setAttribute("id", "light");
    const themeBody = body.getAttribute("id");
    toggleState = 0;

    themeSettings = {
      theme: themeBody,
      currentToggleState: toggleState,
    };
    localStorage.setItem("theme", JSON.stringify(themeSettings));
  }
}

// SET DISPLAY WHEN NO TASKS ARE LEFT
function resetMain() {
  const main = document.querySelector("main");

  if (state.allTodos.length === 0) {
    main.style.transform = "translateY(0)";
  } else {
    main.style.transform = "translateY(-24px)";
  }
}

resetMain();

// FILTER TASKS
function filterTasks() {
  const tabs = document.querySelectorAll(".tabs");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const button = e.target;
      if (button.classList.contains("all")) {
        renderTodos(state.allTodos);
        toggleAriaSelected(button);
        completeTask();
        renderCount();
      }
      if (button.classList.contains("active")) {
        const activeTodos = state.allTodos.filter((todo) => {
          return todo.isCompleted === "false";
        });

        renderTodos(activeTodos);
        toggleAriaSelected(button);
        completeTask();
        renderCount(activeTodos);
      }

      if (button.classList.contains("completed")) {
        const completeTodos = state.allTodos.filter((todo) => {
          return todo.isCompleted === "true";
        });

        renderTodos(completeTodos);
        toggleAriaSelected(button);
        completeTask();
        renderCount(completeTodos);
      }
    });
  });
}

filterTasks();

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

function renderTodos(array) {
  list.innerHTML = "";

  array.forEach((todo) => {
    const li = createLi(todo.id, todo.text, todo.isCompleted);
    list.append(li);
  });
}

function toggleAriaSelected(tab) {
  const tabs = document.querySelectorAll(".tabs button");

  tabs.forEach((tab) => {
    tab.setAttribute("aria-selected", "");
  });

  const isSelected = tab.getAttribute("aria-selected");
  if (isSelected == null || isSelected === "") {
    tab.setAttribute("aria-selected", "true");
  }
}

// HELPER FUNCTIONS
function generateId() {
  return Math.random().toString(16).slice(2);
}

function saveItem() {
  localStorage.setItem("taskListItem", JSON.stringify(state.allTodos));
}
