// when user enters site
// -> see an empty todo list

// when user submits a new todo, add todo to list
// -> get user input ✅
// -> add task to list ✅
// -> clear input field on submission ✅

// When user clicks on the delete button, task is deleted
// -> list item is removed the list ✅
// -> remove list item from allTodos array ✅

const form = document.querySelector('.create-bar-form');
const userInput = document.querySelector('.create-bar');
const list = document.querySelector('.list');
const deleteButtons = document.querySelectorAll('.delete-btn');

const state = {
  allTodos: [],
};

// GET TODOS FROM LOCAL STORAGE

// ADD TODO
if (form instanceof HTMLFormElement) {
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (userInput instanceof HTMLInputElement) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = renderListItem(userInput.value);

      const newTodo = {
        id: generateId(),
        text: userInput.value,
      };

      li.dataset.id = newTodo.id;

      list?.append(li);
      userInput.value = '';

      state.allTodos.push(newTodo);
    }
  });
}

// REMOVE TODO
list.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('d')) {
    const deleteBtn = target.parentElement;
    const listItem = deleteBtn.parentElement;
    const listItemId = listItem.dataset.id;

    listItem.remove();

    const clickedTodo = state.allTodos.filter((todo) => {
      return todo.id !== listItemId;
    });

    state.allTodos = clickedTodo;
  }
});

// UPDATE TODO

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

// HELPER FUNCTIONS
function generateId() {
  return Math.random().toString(16).slice(2);
}
