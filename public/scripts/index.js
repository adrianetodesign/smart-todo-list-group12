// Client facing scripts here
$(() => {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTaskElement = function(task) {
    let $isCompleted = "";
    let $completedClass = "";

    if (task.is_completed) {
      $isCompleted = 'checked';
      $completedClass = "completed";
    } else {
      $isCompleted = "";
      $completedClass = "";
    }

    let $htmlTask = `
    <article class="task" id=${task.id}>
      <div>
        <p class="category-id">${escape(task.category_id)}</p>
        <input type="number" name="category_id" min="1" max="4">
      </div>
      <div>
        <p class="task-body ${$completedClass}">${escape(task.body)}</p>
        <input type="text" name="body">
      </div>
      <div>
        <p>${escape(task.time_added)}</p>
      </div>
      <div>
        <input type="checkbox" ${$isCompleted}>
      </div>
      <div class="edit-features">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    </article>
    `;
    return $htmlTask;
  };

  //--- Given an array of tasks, renders them in their proper container on the page.
  const renderTasks = function(tasks) {
    // Prepend to ensure most recent task is placed on top.
    for (const task of tasks) {
      $("#tasks-container").prepend(createTaskElement(task));
    }
  };

  const loadUser = function() {
    $.get("/users")
      .then((data) => {
        $("#user-name").empty();
        $("#user-name").html(`${data.users[0].name}'s`);
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
  };
  loadUser();

  const loadTasks = function() {
    $.get("/tasks")
      .then((data) => {
        $("#tasks-container").empty();
        renderTasks(data.tasks);
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
  };
  loadTasks();

  $("#task-form").on("submit", function(e) {

    e.preventDefault();

    $.post("/tasks", $(this).serialize())
    .then(() => {
      console.log("task submission successful.");
      $("form").trigger("reset");
      loadTasks();
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
  });

  $(document).on("click", ".delete", function() {
    const $deleteBttn = $(this);
    const taskID = $deleteBttn.closest(".task").prop("id");
    $.post(`/tasks/${taskID}/delete`)
    .then(() => {
      console.log("delete task successful.");
      loadTasks();
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
  })

  $(document).on("click", "input[type='checkbox']", function() {
    const $checkComplete = $(this);
    const taskID = $checkComplete.closest(".task").prop("id");
    $.post(`/tasks/${taskID}/done`)
    .then(() => {
      console.log("Toggled is_completed successful.");
      loadTasks();
    }).catch((err) => {
      console.log("An error has occured:", err);
    });

  });

  $(document).on("click", ".edit", function() {
    const $editTask = $(this);
    const $task = $editTask.closest(".task");
    const $taskID = $editTask.closest(".task").prop("id");
    const $categoryID = $editTask.closest(".category-id");
    const $taskBody = $editTask.closest(".task-body");
    const $taskInputText = $taskBody.find("input[type='text']");
    const $taskInputNumber = $categoryID.find("input[type='number']");

    if($task.hasClass("edit-mode")) {
      $.post(`/tasks/${$taskID}/`,
      $($task).find("input[type='text'], input[type='number']").serialize()
      )
      .then(() => {
        console.log("Edit Task was successful");
        $task.removeClass("edit-mode");
        $(this).text("Edit");
        loadTasks();
      }).catch((err) => {
        console.log("An error has occured:", err);
      })
    } else {
      $($task).addClass("edit-mode");
      $($taskInputText).val($($taskBody).text());
      $($taskInputNumber).val($($categoryID).text());
      $(this).text("Save");
    }
  });
});
