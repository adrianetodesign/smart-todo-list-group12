
const formatDate = function(stringDate) {
  return new Date(stringDate).toLocaleString('en-GB', {year: "numeric", month: "long", day: "numeric", hour: 'numeric', minute: "numeric" });
}
