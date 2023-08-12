var firstLoadOfferings = true, firstLoadOrders = true, firstLoadRatings = true, firstLoadRevenue = true;

$(document).ready(
    function()
    {
      populateGeneral();
    }
);

// function to switch between all displays
function switchDisplay(buttonID) {

  // for initial focus on page load
  var displays = document.getElementsByClassName("main-display-categories");
  for (var i = 0; i < displays.length; i++) {
     if(displays.item(i).style.display == "block") {
       document.getElementById(displays.item(i).id+"-button").className = "side-nav-buttons-focus";
     }
  }

    clearFocus();
    document.getElementById(buttonID).className = "side-nav-buttons-focus";

    // load content efficiently
    populationControl(buttonID.substring(0, buttonID.indexOf("-")));

    // hide other displays
    for (var i = 0; i < displays.length; i++) {
       if(displays.item(i).style.display == "block") {
         displays.item(i).style.display = "none";
       }
    }

    document.getElementById(buttonID.substring(0, buttonID.indexOf("-"))).style.display = "block";
}

function clearFocus() {
  for(var i of document.getElementsByClassName("side-nav-buttons-focus")) {
    i.className = "side-nav-buttons";
  }
}

function populationControl(category) {
  // general is static html, no need for population control

  if(category == "offerings" && firstLoadOfferings) {
    populateOfferings();
    firstLoadOfferings = false;
  }
  else if(category == "orders" && firstLoadOrders) {
    populateOrders();
    firstLoadOrders = false;
  }
  else if(category == "ratings" && firstLoadRatings) {
    populateRatings();
    firstLoadRatings = false;
  }
  else if(category == "revenue" && firstLoadRevenue) {
    populateRevenue();
    firstLoadRevenue = false;
  }
}

function populateGeneral() {
  document.getElementById("general-button").className = "side-nav-buttons-focus";
  document.getElementById("vendor-name").textContent = "Example Catering" + "!";
  document.getElementById("rating").textContent = "4.4";
  document.getElementById("num-of-reviews").textContent = "1381";
}

// function to populate Offerings panel
function populateOfferings() {
  var numOfOfferings = 15;
  var offeringsWrapper = document.getElementById("offerings-wrapper");

  for(var i = 0; i < numOfOfferings; i++) {
    var offering = document.createElement("div");
    offering.className = "offering";

    offeringsWrapper.appendChild(offering);
  }
}

function populateOrders() {}

function populateRatings() {
  var starRating = 4.25;
  var wholeStars = Math.trunc(starRating);

  var stars = document.getElementsByClassName("star");

  for(var i = 0; i < wholeStars; i++) {
    stars[i].className = "fa-solid fa-star star";
  }

  if(Math.round(starRating*2)/2 % 1 > 0) {
    stars[wholeStars].className = "fa-solid fa-star-half-stroke star";
  }

}

function populateRevenue() {}

