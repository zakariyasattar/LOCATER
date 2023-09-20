var firstLoadOfferings = true, firstLoadOrders = true, firstLoadRatings = true, firstLoadRevenue = true;
var test_data;
let vendor;

$(document).ready(
  function()
  {
    identifyVendor();

    fetch('testing.json')
      .then((response) => response.json())
      .then((json) => test_data = json);
  }
);

// function to located vendor in db, or initVendor() if vendor doesn't exist yet
function identifyVendor() {
  var vendor_info = localStorage['vendor_info'].split("/");
  var vendor_name = vendor_info[3];

  firebase.database().ref("vendors/" + vendor_name).on('value', (snapshot) => {
    if(snapshot.val() == null) {
      initVendor(vendor_info);
    }
    else {
      // store vendor data where page can access
      var secretKey = snapshot.val().info.secret_key;
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(snapshot.val()), secretKey).toString();
      localStorage['vendor'] = ciphertext;
    }
  });
  populateGeneral();
}


// function to create vendor profile in db, takes an array: vendor_info
function initVendor(vendor_info) {
  var vendor_gov_name = vendor_info[0];
  var vendor_email = vendor_info[1];
  var vendor_phone = vendor_info[2];
  var vendor_name = vendor_info[3];
  var secretKey = JSON.stringify(generateKey(vendor_name));

  var newVendor = {
    "info": {
      "gov_name": vendor_gov_name,
      "email": vendor_email,
      "phone": vendor_phone,
      "vendor_name": vendor_name,
      "secret_key": secretKey
    },
    "data": {
      "general": {
        "income_month": "0",
        "num_of_reviews": "0",
        "rating": "-"
      },
      "offerings": {
          "na": "na"
      },
      "orders": {
        "completed": {
            "na": "na"
        },
        "new": {
            "na": "na"
        }
      }
    }
  }
  localStorage['vendor'] = JSON.stringify(newVendor);
  firebase.database().ref().child('/vendors/' + vendor_name).set(newVendor);
}

// function to generate new secretKey for user
function generateKey(p){
  var salt = CryptoJS.lib.WordArray.random(128/8);
  return CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 });
}

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
  firebase.database().ref("vendors/" + localStorage['vendor_info'].split("/")[3] + "/info/secret_key").on('value', (snapshot) => {
    localStorage['secret_key'] = snapshot.val();
  });
  var bytes  = CryptoJS.AES.decrypt(localStorage['vendor'], localStorage['secret_key']);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  vendor = JSON.parse(originalText);

  console.log(vendor);

  document.getElementById("general-button").className = "side-nav-buttons-focus";

  //initialize all general data points
  document.getElementById("vendor-name").textContent = "vendor.info.vendor_name"+ "!";
  document.getElementById("rating").textContent = "doc_data.rating.substring(0, 3);"
  document.getElementById("num-of-reviews").textContent = "doc_data.num_of_reviews;"
  document.getElementById("order-count").textContent = "order_doc.data();"
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

