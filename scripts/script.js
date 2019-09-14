$(document).ready(function() {
  $("#showCardButton").click(function() {
    $("#card").slideToggle("slow");
  });

  $("#showCardButton").css("border", "3px solid green");
});
