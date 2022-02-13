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
      <p>${escape(task.category_id)}</p>
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

});

