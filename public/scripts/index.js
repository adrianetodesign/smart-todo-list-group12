/* global $ loadUser loadTasks */

$(() => {
  // Found in scripts/user.js
  loadUser();

  // Found in scripts/render.js
  loadTasks();

  //--- Open task-form on clicking add.
  $("#add-task-btn").on("click", function() {
    $("#new-task").addClass("active");
    $("html, body").animate({
      scrollTop: $("header").offset().top
    },500, function() {
      $("#task-text").focus();
    });
  });

  //--- Post request for data in task-form.
  $("#task-form").on("submit", function(e) {
    const $radioCategory = $("input[type=radio]:checked");
    const radioCategoryID = $radioCategory.siblings().data('category_id');

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
            console.log("task submission successful.");
            $("#new-task").removeClass("active");
            $("form").trigger("reset");
            if ($taskCategoryID === radioCategoryID) {
              loadTasks(radioCategoryID);
              $radioCategory.prop("checked", true);
            } else {
              loadTasks();
              $("#radio-all").prop("checked", true);
            }
          }).catch((err) => {
            console.log("An error has occured:", err);
          });
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
  });

  //--- Close task-form on clicking cancel.
  $("#task-cancel").on("click", function() {
    $("#new-task").removeClass("active");
    $("form").trigger("reset");
    return false;
  });

  //--- Post request for delete task.
  $('#tasks-container').on("click", ".delete", function() {
    const $taskElement = $(this).closest(".task");
    const taskID = $taskElement.data("task-id");
    $.post(`/tasks/${taskID}/delete`)
      .then(() => {
        console.log("Delete task successful.");
        $taskElement.remove();
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
  });

  //--- Post request for toggle complete.
  $('#tasks-container').on("click", "input[type='checkbox']", function() {
    const $taskElement = $(this).closest('.task');
    const taskID = $taskElement.data("task-id");
    $.post(`/tasks/${taskID}/done`)
      .then(() => {
        console.log("Toggled is_completed successful.");
        $taskElement.find('.task-body').toggleClass('completed');
      }).catch((err) => {
        console.log("An error has occured:", err);
      });

  });

  //--- Add .edit-mode class to task-body when clicked.
  $("#tasks-container").on("click", ".task-body", function() {
    const $taskBody = $(this);
    const $taskDiv = $taskBody.closest("div");
    const $task = $taskBody.closest(".task");
    const $inputText = $task.find("input[type='text']");
    $($taskDiv).addClass("edit-mode");
    $inputText.val($taskBody.text()).focus();
  });

  //--- Add .edit-mode class to category-id when clicked.
  $("#tasks-container").on("click", ".category-id", function() {
    const $taskCategoryID = $(this);
    const $taskDiv = $taskCategoryID.closest("div");
    const $task = $taskCategoryID.closest(".task");
    const $select = $task.find("select");
    const categoryID = $task.data("category-id");
    $($taskDiv).addClass("edit-mode");
    $select.val(categoryID).focus();
  });

  //--- Post request for updating task-values when save button is clicked.
  $("#tasks-container").on("click", ".save", function() {
    const $saveBtn = $(this);
    const $task = $saveBtn.closest(".task");
    const taskID = $task.data("task-id");
    const $taskDiv = $saveBtn.closest("div");
    const $radioCategory = $("input[type=radio]:checked");
    const radioCategoryID = $radioCategory.siblings().data('category_id');
    $.post(`/tasks/${taskID}`,
      $($taskDiv).find("select, input[type='text']").serialize()
    ).then(() => {
      console.log("Edit Task was successful");
      $taskDiv.removeClass("edit-mode");
      if (radioCategoryID) {
        loadTasks(radioCategoryID);
        $radioCategory.prop("checked", true);
      } else {
        loadTasks();
        $("#radio-all").prop("checked", true);
      }
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
  });

  //--- Filter category on label click.
  $('#task-category-select').on("click", "label", function() {
    loadTasks($(this).data('category_id'));
  });

});
