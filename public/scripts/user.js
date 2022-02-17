/* global $ */

const loadUser = function() {
  $.get("/users")
    .then((data) => {
      $("#user-name").empty();
      $("#user-name").html(`${data.users[0].name}'s`);
    }).catch((err) => {
      console.log("An error has occured:", err);
    });
};
