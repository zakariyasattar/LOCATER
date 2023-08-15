var firstLoadOfferings = true, firstLoadOrders = true, firstLoadRatings = true, firstLoadRevenue = true;
var test_data;

$(document).ready(
    function()
    {
      populateGeneral();

      fetch('testing.json')
        .then((response) => response.json())
        .then((json) => test_data = json);

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

  //populate feedback-div
  var feedback_div = document.createElement("div");
  feedback_div.id = "feedback-div";

  for(var key in test_data["reviews"]) {
    var review = test_data["reviews"][key];

    var name = review['name'];
    var rating = review['rating'];
    var feedback_header = review['feedback-header'];
    var feedback_body = review['feedback-body'];

    feedback_div.appendChild(createTestimonial(name, rating, feedback_header, feedback_body));
  }

  document.getElementById('ratings').appendChild(feedback_div);
}

function createTestimonial(name, rating, feedback_header, feedback_body) {
  var br = document.createElement('br');
  var testimonial = document.createElement('div');
  testimonial.className = "testimonial";

  var reviewInfo = document.createElement('div');
  reviewInfo.id = "review-info";

  var n = document.createElement('span');
  n.textContent = name;

  var r = document.createElement('span');
  r.textContent = rating + " / 5";

  reviewInfo.appendChild(document.createElement("br"));
  reviewInfo.appendChild(n);
   reviewInfo.appendChild(document.createElement("br"));
  reviewInfo.appendChild(r);

  var reviewContent = document.createElement('div');
  reviewContent.id = "review-content";

  var f_h = document.createElement('span');
  f_h.textContent = feedback_header;

  var f_b = document.createElement('span');
  f_b.textContent = feedback_body;

  reviewContent.appendChild(f_h); reviewContent.appendChild(document.createElement("br")); ;reviewContent.appendChild(f_b);

  testimonial.appendChild(reviewInfo);
  testimonial.appendChild(reviewContent);

  return testimonial;
}

function populateRevenue() {
  const ctx = document.getElementById('all-time');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Income',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

