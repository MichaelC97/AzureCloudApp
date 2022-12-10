//The URIs of the REST endpoint
IUPS = "https://prod-28.ukwest.logic.azure.com/workflows/65eeab54aca04f07a6769e981e31683e/triggers/manual/paths/invoke/rest/v1/videos?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=URIw0cWB0pod6wvRscvMGqzUWO_XzZAztzhgRkrx_Es";
RAI = "https://prod-14.ukwest.logic.azure.com/workflows/321c3e772e244378b567e19bec2748c8/triggers/manual/paths/invoke/rest/v1/videos?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4jlatqW-ZZl9QTZ7gt8-Ti1HbbYI7mJGnyexYDdxJow";
DAI1 = "https://prod-26.centralus.logic.azure.com/workflows/fdc9a2f928b54c09becea7a11f9fe6e6/triggers/manual/paths/invoke/rest/v1/video/"
DAI2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O3y4iXKoAn5IJbPUAOJgu_z3UJRBPMH8OfS_RH-Rul0"
checkUser = "https://prod-10.ukwest.logic.azure.com/workflows/c1f917df9fa24242bbb5e499d6faf22b/triggers/manual/paths/invoke/rest/v1/password?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ja7KxurOLUdqo7PPKuEJtCJo1yaMa5lLNk4niKkGXos"
BLOB_ACCOUNT = "https://blobstorageb00687152.blob.core.windows.net";
userAdd = "https://prod-21.ukwest.logic.azure.com/workflows/5944ee3cce7c4f048bcc92ba1da2af31/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qaedHVLY8qYrjw7p_qoGT9f3C7ZM2OdEFdkOKLQ1MAQ"
userUpdate = "https://prod-09.ukwest.logic.azure.com/workflows/738d4495294a4150b2fd92376777e5d6/triggers/manual/paths/invoke/rest/v1/videos/"
userUpdate2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FIK7twosHV_QR7dl4UXLXs-lUrNeAvd3yHts7yBCNEs"

//Handlers for button clicks
$(document).ready(function () {

  if (window.location.href.indexOf('HomePage.html') > -1) {
    getVideos();
  }

  if (window.location.href.indexOf('userProfile.html') > -1) {
    getUserInfo();
  }
  //Handler for the new asset submission button
  $("#button-blue").click(function () {
    //Execute the submit new asset function
    submitNewAsset();
  });
    //Handler for the new asset submission button
    $("#button-red").click(function () {
      //Execute the submit new asset function
      window.location = "HomePage.html"
    });
  $("#btnCancel").click(function () {
    window.location = "HomePage.html"
  });
  $("#btnUpdate").click(function () {
    var userID = sessionStorage.getItem("userID");
    updateUser(userID);
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
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (data) {
      alert("New Video Added!")
    }
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideos() {

  if(sessionStorage.getItem('checkAdmin') == "true") {
    adminStuff();
  }

  var userContinue = [];

    userContinue.push("Videos for ");
    userContinue.push(sessionStorage.getItem('userFName'))

    $("<h2/>", {
      "class": "userContinue",
      html: userContinue.join("")
    }).appendTo("#continue");

  //Replace the current HTML in that div with a loading message
  $('#tall').html('<div  width="400" height="400" class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr width='400' height='400' />");
      items.push("<video controls width='400' height='400' controls src='"+BLOB_ACCOUNT + val["filepath"] +"'type='video/mp4'/></video> <br />")
      items.push("<br />");
      items.push("File : " + val["fileName"] + "<br />");
      items.push("Genre: " + val["genre"] + "<br />");
      items.push("Produced by: " + val["producer"] + "<br />");
      for(var i in val["comments"]){
        items.push("Comments: " + val["comments"][i].comment + "<br />")
      }
      if(sessionStorage.getItem('checkAdmin') == "true") {
        items.push("FilePath : " + val["filepath"] + "<br />");
        items.push("uploaded By: " + val["userID"].$content + "<br />");
        items.push('<button type="button" id="deleteVideoButton" class="btn btn-danger" onclick="deleteAsset(\''+val["id"]+'\')">Delete</button><br/><br/>');
      }
      items.push("<hr />");
    });
    //Clear the assetlist div
    $('#tall').empty();
    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      "class": "my-new-list",
      "style": "width='400' height='400'",
      html: items.join("")
    }).appendTo("#tall");
  });
}

function adminStuff(){
  var adminbuttons = [];

  adminbuttons.push("<a href=addVideo.html>Add Vid</a>");
  

  $("<div/>",{
    html: adminbuttons.join("")
  }).appendTo(".topnav");
}

function deleteAsset(id) {
  $.ajax({
    type: "DELETE",
    //Note the need to concatenate the
    url: DAI1 + id + DAI2,
  }).done(function () {
    //On success, update the assetlist.
    get();
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getUserInfo() {

  //Replace the current HTML in that div with a loading message
  $('#userProfile').html('<div  width="400" height="400" class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

    var items = [];
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data

      //items.push("UserName: " + sessionStorage.getItem("userFName") + " " + sessionStorage.getItem("userLName"))
      //items.push("<br />");
      //items.push("Email : " + sessionStorage.getItem("userEmail") + "<br />");
      //items.push("Country: " + sessionStorage.getItem("usrCountry") + "<br />");

    //Clear the assetlist div
    $('#userProfile').empty();
    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      "class": "my-new-list",
      "style": "width='400' height='400'",
      html: items.join("")
    }).appendTo("#userProfile");
  }

//A function to submit a new asset to the REST endpoint
function checkLogin() {

  var userEmail = document.getElementById("userEmail").value;
  var userPassword =  document.getElementById("userPassword").value;
  //Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append('userEmail', userEmail);
  submitData.append('userPassword', userPassword);


  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: checkUser,
    data: submitData,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (userData) {

      sessionStorage.setItem("userID", userData[0].userID);
      sessionStorage.setItem("checkAdmin", userData[0].userType);
      sessionStorage.setItem('userEmail', userData[0].userEmail);
      sessionStorage.setItem("userPassword", userData[0].userPassword);
      sessionStorage.setItem('userFName', userData[0].userFName);
      sessionStorage.setItem("userLName", userData[0].userLName);
      sessionStorage.setItem("usrCountry", userData[0].usrCountry);

      if(userData[0].userID){
          if(userData[0].userType){
              alert("Login Successful"); 
              window.location = "HomePage.html"
          }
          else{
              alert("Login Successful");
              window.location = "HomePage.html";
          }
      }
      else{
          alert("Please Check Login Information");
      }

    }
  });
}

//A function to submit a new asset to the REST endpoint
function addNewUser() {
  //Create a form data object
  var userEmail = document.getElementById("userEmail").value;
  var userPassword =  document.getElementById("userPassword").value;
  var userConPass = document.getElementById("userConPass").value;
  var userFName = document.getElementById("userFName").value;
  var userLName =  document.getElementById("userLName").value;
  var usrCountry = document.getElementById("usrCountry").value;

  if(userPassword == userConPass){
    submitData = new FormData();
    //Get form variables and append them to the form data object
    submitData.append('userEmail', userEmail);
    submitData.append('userPassword', userPassword);
    submitData.append('userFName', userFName);
    submitData.append('userLName', userLName);
    submitData.append('usrCountry', usrCountry);
    submitData.append('userType', 0);

    //Post the form data to the endpoint, note the need to set the content type header
    $.ajax({
      url: userAdd,
      data: submitData,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function (data) {
        sessionStorage.setItem("checkAdmin", false);
        sessionStorage.setItem("userFName", userFName);
        window.location = "HomePage.html";
      }
    });
  }
  else{
    alert("Passwords do not match")
  }
}

//A function to submit a new asset to the REST endpoint
function updateUser(userID) {
  //Create a form data object

  if(document.getElementById("userEmail").value.length == 0 && document.getElementById("userPassword").value.length != 0  ){
    userEmail = sessionStorage.getItem("userEmail");
    userPassword = document.getElementById("userPassword").value;
  }
  else if(document.getElementById("userPassword").value.length == 0 && document.getElementById("userEmail").value.length != 0 ){
    userPassword = sessionStorage.getItem("userPassword");
    userEmail = document.getElementById("userEmail").value;
  }
  else{
    userEmail = document.getElementById("userEmail").value;
    userPassword = document.getElementById("userPassword").value;
  }

    submitData = new FormData();
    //Get form variables and append them to the form data object
    submitData.append("userID", userID);
    submitData.append('userEmail', userEmail);
    submitData.append('userPassword', userPassword);

    //Post the form data to the endpoint, note the need to set the content type header
    $.ajax({
      url: userUpdate + userID + userUpdate2,
      data: submitData,
      cache: false,
      contentType: false,
      processData: false,
      type: 'PUT',
      success: function (data) {
        window.location = "userProfile.html"
      }
    });
}