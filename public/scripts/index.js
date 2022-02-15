// Client facing scripts here
$(() => {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTaskElement = function(task) {
    let $isCompleted = '';
    if (task.is_completed) {
      $isCompleted = 'checked';
    } else {
      $isCompleted = '';
    }
    let $htmlTask = `
    <article class="task" id=${task.id}>
    <div>
      <p>${escape(task.category_id)}</p>
    </div>
    <div>
      <p>${escape(task.body)}</p>
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
          console.log(data);
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
          console.log(data.tasks);
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

    $(document).on('click', '.delete', function() {
      const $deleteBttn = $(this);
      const taskID = $deleteBttn.closest(".task").prop("id");
      $.ajax({
        type: 'post',
        url: `/tasks/${taskID}/delete`
      }).then(() => {
        console.log("delete task successful.");
        loadTasks();
      })
    })

    // $("[type='checkbox']").on("click", function(e) {
    //   let $checkComplete = $(this);
    //   if($checkComplete.prop("checked")) {
    //     console.log("Checkbox checked");
    //   }
    //   if ($checkComplete.prop("checked")) {
    //     console.log("Checkbox unchecked");
    //   }
    // });
});

