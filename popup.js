function screenshot(callback) {
  chrome.tabs.captureVisibleTab(null, {}, callback);
}

$(function() {
  var tracker = new Pivotaltracker(localStorage['project_id'], localStorage['apikey']);
  var app = chrome.extension.getBackgroundPage();

  $(window).bind("unload", function() {
    localStorage["title"] = $("#title").val();
    localStorage["description"] = $("#description").val();
  });

  $("#title").val(localStorage["title"]);
  $("#description").val(localStorage["description"]);

  screenshot(function(data) {
    $("#screenshot").attr("src", data);
  });

  $("#story_type").change(function() {
    var img_url = "https://cdn1-pivotaltracker.pantherssl.com/images/v7/application/stories_view/icons/"+$(this).val()+".png";
    $("img.story_type").attr("src", img_url);
  });

  $("#doodle").click(function() {
    app.enable_canvas();
    window.close();
  });

  $(".submit").click(function() {
    var $this = $(this),
      label = $this.text();

    $this
      .attr("disabled", true)
      .text("Saving...");

    tracker.create_story("bug", $("#title").val(), $("#description").val(), function(story) {
      var story_id = $(story).find("id").text(),
        image_data;

      if (story_id) {
        image_data = $("#screenshot").attr("src");
        tracker.upload_attachment(story_id, image_data, function(attachment) {
          $this
            .attr("disabled", false)
            .text(label);
        });
      } else {
        $this
          .attr("disabled", false)
          .text(label);
      }
    });

  });

  $(".cancel").click(function() {
    $("#title").val('');
    $("#description").val('');
    window.close();
  });

  app.enable_canvas();
});

