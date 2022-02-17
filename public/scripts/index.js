/* global $ loadUser loadTasks */

$(() => {
  loadUser();

  loadTasks();

  $("#add-task-btn").on("click", function() {
    $("#new-task").addClass("active");
    $("html, body").animate({
      scrollTop: $("header").offset().top
    },500, function() {
      $("#task-text").focus();
    });
  });

  $("#task-form").on("submit", function(e) {

    e.preventDefault();
    let $postData = $(this).serializeArray();
    const radioCategoryID = $("input[type=radio]:checked").siblings().data('category_id');
    const $taskText = escape($("#task-text").val());
    let $taskCategoryID = '';
    $.get(`tasks/classify/${$taskText}`)
      .then((data) => {
        $taskCategoryID = data.classNumber;
        $postData.push({name: "categoryID", value: $taskCategoryID});
        $.post("/tasks", $postData)
          .then(() => {
            // console.log($postData);
            console.log("task submission successful.");
            $("#new-task").removeClass("active");
            $("form").trigger("reset");
            if ($taskCategoryID === radioCategoryID) {
              loadTasks(radioCategoryID);
            } else {
              loadTasks();
            }
          }).catch((err) => {
            console.log("An error has occured:", err);
          });
      }).catch((err) => {
        console.log("An error has occured:", err);
      });
  });

  $("#task-cancel").on("click", function() {
    $("#new-task").removeClass("active");
    $("form").trigger("reset");
    return false;
  });

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

  $("#tasks-container").on("click", ".task-body", function() {
    const $taskBody = $(this);
    const $taskDiv = $taskBody.closest("div");
    const $task = $taskBody.closest(".task");
    const $inputText = $task.find("input[type='text']");
    $($taskDiv).addClass("edit-mode");
    $inputText.val($taskBody.text()).focus();
  });

  $("#tasks-container").on("click", ".category-id", function() {
    const $taskCategoryID = $(this);
    const $taskDiv = $taskCategoryID.closest("div");
    const $task = $taskCategoryID.closest(".task");
    const $select = $task.find("select");
    const categoryID = $task.data("category-id");
    $($taskDiv).addClass("edit-mode");
    $select.val(categoryID).focus();
  });

  $("#tasks-container").on("click", ".save", function() {
    const $saveBtn = $(this);
    const $task = $saveBtn.closest(".task");
    const taskID = $task.data("task-id");
    const $taskDiv = $saveBtn.closest("div");
    const radioCategoryID = $("input[type=radio]:checked").siblings().data('category_id');
    $.post(`/tasks/${taskID}`,
      $($taskDiv).find("select, input[type='text']").serialize()
    ).then(() => {
      console.log("Edit Task was successful");
      $taskDiv.removeClass("edit-mode");
      if (radioCategoryID) {
        loadTasks(radioCategoryID);
      } else {
        loadTasks();
      }
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
  });

  $('#task-category-select').on("click", "label", function() {
    loadTasks($(this).data('category_id'));
  });

});
