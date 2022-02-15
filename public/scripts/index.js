// Client facing scripts here
$(() => {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTaskElement = function(task) {
    let $isCompleted = '';
    let $completedClass = '';
    if (task.is_completed) {
      $isCompleted = 'checked';
      $completedClass = "completed";
    } else {
      $isCompleted = '';
      $completedClass = '';
    }
    let $htmlTask = `
    <article class="task" id=${task.id}>
    <div>
      <p>${escape(task.category_id)}</p>
    </div>
    <div>
      <p class="task-body ${$completedClass}">${escape(task.body)}</p>
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
        console.log($(this));
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
      })
    })

    $(document).on("click", "input[type='checkbox']", function() {
      let $checkComplete = $(this);
      const taskID = $checkComplete.closest(".task").prop("id");
      if($checkComplete.prop("checked")) {
        $.post(`/tasks/${taskID}/done`);
      }
      if(!$checkComplete.prop("checked")) {
        $.post(`/tasks/${taskID}/done`);
      }
      loadTasks();
    });

    $(document).on("click", ".edit", function() {
      let task = $(this).closest(".task");
    });
});
