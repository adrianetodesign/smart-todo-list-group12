// Client facing scripts here
$(() => {
  console.log("ready");
  $("#users").on('click', onClick);
  $("#clear").on('click', onClear);
});

const onClear = function() {
  const list = $("#list");
  list.empty();
};

const onClick = function() {
  $.get("/api/users")
    .then((data) => {
      const list = $("#list");

      for (user of data.users) {
        const li = `<li>${user.name}</li>`;
        list.append(li);
      }

    });

};