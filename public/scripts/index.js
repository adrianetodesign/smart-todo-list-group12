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
    <article class="task" data-task-id=${task.id} data-category-id=${task.category_id}>
      <div>
        <p class="category-id">${escape(task.name)}</p>
        <select name="category_id">
          <option value="1">films</option>
          <option value="2">restauraunts</option>
          <option value="3">books</option>
          <option value="4">products</option>
        </select>
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
    let $postData = $(this).serializeArray();

    const $taskText = escape($("#task-text").val());
    let $taskCategoryID = '';
    $.get(`tasks/classify/${$taskText}`)
    .then((data) => {
      $taskCategoryID = data.classNumber;
      $postData.push({name: "categoryID", value: $taskCategoryID});
      $.post("/tasks", $postData)
      .then(() => {
        console.log($postData);
        console.log("task submission successful.");
        $("form").trigger("reset");
        loadTasks();
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
  });

  $(document).on("click", ".delete", function() {
    const $deleteBttn = $(this);
    const taskID = $deleteBttn.closest(".task").data("task-id");
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
    const taskID = $editTask.closest(".task").data("task-id");
    const $taskBody = $task.find("p.task-body");
    const $inputText = $task.find("input[type='text']");
    const $selectCategory = $task.find("select");
    const categoryID = $task.data("category-id");

    if($task.hasClass("edit-mode")) {
      $.post(`/tasks/${taskID}`,
      $($task).find("select, input[type='text']").serialize()
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
      $inputText.val($taskBody.text());
      $selectCategory.val(categoryID);
      $(this).text("Save");
    }
  });
});
