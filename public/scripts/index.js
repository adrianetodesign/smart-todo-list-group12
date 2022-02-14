// Client facing scripts here
$(() => {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTaskElement = function(task) {
    let $htmlTask = `
    <article class="task">
    <div>
      <p>${escape(task.name)}</p>
    </div>
    <div>
      <p>${escape(task.body)}</p>
    </div>
    <div>
      <p>${escape(task.time_added)}</p>
    </div>
    <div>
      <input type="checkbox">
    </div>
    <div class="kebab">
      <i class="fa-solid fa-ellipsis-vertical fa-xl"></i>
    </div>
    </article>
    `;
    return $htmlTask;
  }
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
});

