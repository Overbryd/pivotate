$(function() {
  $("#apikey").val( localStorage["apikey"] );
  $("#project_id").val( localStorage["project_id"] );

  $("#save").click(function() {
    var $this = $(this);

    localStorage["apikey"] = $("#apikey").val();
    localStorage["project_id"] = $("#project_id").val();

    $this
      .attr("disabled", true)
      .text("Options saved");
    setTimeout(function() {
      $this
        .attr("disabled", false)
        .text("Save")
    }, 1500)
  });
});
