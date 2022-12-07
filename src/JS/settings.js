//The URIs of the REST endpoint
IUPS = "https://prod-28.ukwest.logic.azure.com:443/workflows/65eeab54aca04f07a6769e981e31683e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=URIw0cWB0pod6wvRscvMGqzUWO_XzZAztzhgRkrx_Es";
RAI = "https://prod-14.ukwest.logic.azure.com:443/workflows/321c3e772e244378b567e19bec2748c8/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4jlatqW-ZZl9QTZ7gt8-Ti1HbbYI7mJGnyexYDdxJow";
AddUser = "https://prod-21.ukwest.logic.azure.com/workflows/5944ee3cce7c4f048bcc92ba1da2af31/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qaedHVLY8qYrjw7p_qoGT9f3C7ZM2OdEFdkOKLQ1MAQ"

BLOB_ACCOUNT = "https://blobstorageb00687152.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function () {

  getVideos();

  //Handler for the new asset submission button
  $("#subNewForm").click(function () {
    //Execute the submit new asset function
    submitNewAsset();
  });
});
//A function to submit a new asset to the REST endpoint
function submitNewAsset() {
  //Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('title', $('#title').val());
  submitData.append('genre', $('#genre').val());
  submitData.append('ageRating', $('#ageRating').val());
  submitData.append('producer', $('#producer').val());
  submitData.append('publisher', $('#publisher').val());
  submitData.append('File', $("#UpFile")[0].files[0]);

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: AddUser,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (data) {

    }
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideos() {
  //Replace the current HTML in that div with a loading message
  $('#tall').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr />");
      items.push("<video controls width='400' height='400' controls src='"+BLOB_ACCOUNT + val["filepath"] +"'type='video/mp4'/></video> <br />")
      items.push("<br />");
      items.push("File : " + val["fileName"] + "<br />");
      items.push("Produced by: " + val["producer"] + "<br />");
      items.push("<hr />");
    });
    //Clear the assetlist div
    $('#tall').empty();
    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#tall");
  });
}

function deleteAsset(id) {
  $.ajax({
    type: "DELETE",
    //Note the need to concatenate the
    url: DIAURI0 + id + DIAURI1,
  }).done(function (msg) {
    //On success, update the assetlist.
    getAssetList();
  });
}