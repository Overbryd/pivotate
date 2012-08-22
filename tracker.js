var Pivotaltracker = function(project_id, apikey) {
  this.project_id = project_id;
  this.apikey = apikey;

  this.route = function() {
    var paths = $.makeArray(arguments);
    return 'https://www.pivotaltracker.com/services/v3/projects/'
      + this.project_id
      + paths.join("/").replace(/^([^/])/, "/$1");
  }

  this.data_uri_to_blob = function(data_uri) {
    var byteString,
        arrayBuffer,
        intArray,
        i,
        bb,
        mimeString;

    if (data_uri.split(',')[0].indexOf('base64') >= 0) {
        // Convert base64 to raw binary data held in a string:
        byteString = atob(data_uri.split(',')[1]);
    } else {
        // Convert base64/URLEncoded data component to raw binary data:
        byteString = decodeURIComponent(data_uri.split(',')[1]);
    }

    // Write the bytes of the string to an ArrayBuffer:
    arrayBuffer = new ArrayBuffer(byteString.length);
    intArray = new Uint8Array(arrayBuffer);
    for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i);
    }
    // Separate out the mime component:
    mimeString = data_uri.split(',')[0].split(':')[1].split(';')[0];
    // Write the ArrayBuffer to a blob:
    return new Blob([arrayBuffer], {type: mimeString});
  }

  this.api = function(method, route, data, options, callback) {
    if (callback === undefined) {
      callback = options;
      options = {
        headers: {}
      };
    }
    options.headers = $.extend(options.headers, { 'X-TrackerToken': this.apikey });
    $.ajax(
      $.extend({
        type: method,
        url: route,
        dataType: 'xml',
        data: data,
        success: callback
      }, options)
    );
  }
}

Pivotaltracker.prototype.upload_attachment = function(story_id, data, callback) {
  var form_data = new FormData();

  form_data.append("Filedata", this.data_uri_to_blob(data));

  this.api('POST', this.route('stories', story_id, 'attachments'), form_data, {
    cache: false,
    contentType: false,
    processData: false,
  }, callback);
}

Pivotaltracker.prototype.create_story = function(story_type, title, description, callback) {
  this.api('POST', this.route('stories'), {
    'story': {
      'name': title,
      'description': description,
      'story_type': story_type
    }
  }, callback);
}
