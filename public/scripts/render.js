/* global $ timeago */

const createTaskElement = function(task) {
  let isCompleted = "";
  let completedClass = "";
  let categoryIcon = "";

  if (task.is_completed) {
    isCompleted = 'checked';
    completedClass = "completed";
  } else {
    isCompleted = "";
    completedClass = "";
  }

  switch (task.category_id) {
  case 1:
    categoryIcon = "<i class='fa-solid fa-film'></i>";
    break;
  case 2:
    categoryIcon = "<i class='fa-solid fa-utensils'></i>";
    break;
  case 3:
    categoryIcon = "<i class='fa-solid fa-book'></i>";
    break;
  case 4:
    categoryIcon = "<i class='fa-solid fa-bag-shopping'></i>";
    break;
  }

  let $htmlTask = `
    <article class="task" data-task-id=${task.id} data-category-id=${task.category_id}>
      <div>
        <p class="category-id">${categoryIcon}<br>${task.name}</p>
        <select name="category_id">
          <option value="1">Watch</option>
          <option value="2">Eat</option>
          <option value="3">Read</option>
          <option value="4">Buy</option>
        </select>
        <button class="save"> <i class="fa-solid fa-file-arrow-down"></i> </button>
      </div>
      <div>
        <p class="task-body ${completedClass}">${task.body}</p>
        <input type="text" name="body">
        <button class="save"> <i class="fa-solid fa-file-arrow-down"></i> </button>
      </div>
      <div>
        <p>${timeago.format(new Date(task.time_added))}</p>
      </div>
      <div>
        <input type="checkbox" ${isCompleted}>
      </div>
      <div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </article>
    `;
  return $htmlTask;
};

//--- Given an array of tasks, renders them in their proper container on the page.
const renderTasks = function(tasks, categoryID) {
  // Prepend to ensure most recent task is placed on top.
  if (categoryID) {
    return tasks
      .filter(task => task.category_id === categoryID)
      .forEach(task => $("#tasks-container").prepend(createTaskElement(task)));
  }
  return tasks.forEach(task => $("#tasks-container").prepend(createTaskElement(task)));
};

const loadTasks = function(categoryID) {
  $.get("/tasks")
    .then((data) => {
      $("#tasks-container").empty();
      renderTasks(data.tasks, categoryID);
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
};


