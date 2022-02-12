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
  $.get("/api/widgets")
    .then((data) => {
      const list = $("#list");

      for (widget of data.widgets) {
        const li = `<li>${widget.name}</li>`;
        list.append(li);
      }
    });

};