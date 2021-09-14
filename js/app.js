const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");
const errMsg = document.querySelector(".alert-msg");
const foodCard = document.querySelector(".food-card");
const loader = document.querySelector(".spinner");
const foodDetails = document.querySelector(".food-details");
let cartArray = [];
// Fetch all data common function
async function fetchData(url) {
  let res = await fetch(url);
  let data = await res.json();

  return data;
}

inputBox.addEventListener("keypress", function (e) {
  if (e.keyCode === 13) {
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", function (e) {
  errMsg.classList.add("d-none");

  foodCard.innerHTML = "";
  let inputValue = inputBox.value.trim().toLowerCase();
  inputBox.value = "";
  if (inputValue.length > 0) {
    mealCardData(inputValue);
    loader.classList.remove("d-none");
  } else {
    errMsg.classList.remove("d-none");
  }
});

// Get Data from Api

function mealCardData(inputText) {
  if (inputText.length == 1) {
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputText}`
    ).then((data) => {
      mealDivData(data);
    });
  } else {
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputText}`
    ).then((data) => {
      mealDivData(data);
    });
  }
}

// Show Data In Card Section

function mealDivData(data) {
  let meals = data.meals;
  loader.classList.add("d-none");
  if (data.meals == null) {
    alert("Enter a exist food name");
    return;
  }
  meals.forEach((meal) => {
    let col = document.createElement("div");
    col.className = "col-12 col-md-4 col-lg-4 ";
    col.innerHTML = `
    <div class="card shadow" style="width: 22rem; height:100%;">
  <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title py-3 text-capitalize">${meal.strMeal}</h5>
    <a href="#" class="btn btn-outline-primary" onclick='detailsBtn("${meal.strMeal}")'>See Details</a>
  </div>
</div>
    `;

    // console.log(col);
    foodCard.appendChild(col);
  });

  //   console.log(meals);
}

// Deatils food div

function detailsBtn(mealName) {
  foodDetails.innerHTML = "";
  fetchData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  ).then((data) => {
    let mainData = data.meals[0];
    let col = document.createElement("div");
    col.className = "col-12 col-md-4 col-lg-4 ";
    col.innerHTML = `
          <div class="card shadow" style="width: 22rem; height:100%;">
        <img src="${mainData.strMealThumb}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title py-3 text-capitalize">${mainData.strMeal}</h5>
          <ul id="ingredients" class="text-capitalize"></ul>
          <a href="#" class="btn btn-outline-primary" onclick='addCart("${mainData.idMeal}")'>See Details</a>
        </div>
      </div>
          `;

    foodDetails.appendChild(col);
    const ul = document.getElementById("ingredients");

    for (let i = 1; i <= 20; i++) {
      let li = document.createElement("li");
      li.className = "fw-lighter fs-5";
      let ingredients = "strIngredient" + i;
      let strIngredient = mainData[ingredients];

      let measure = "strMeasure" + i;
      let strMeasure = mainData[measure];

      let allItems = strIngredient + " " + strMeasure;

      if (allItems.length > 2 && allItems.indexOf("null null") != 0) {
        li.innerHTML = allItems;
        ul.appendChild(li);
      }
    }
  });
}

// function addCart(mealId) {
//   fetchData(
//     `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
//   ).then((data) => {
//     let mealdata = data.meals[0];
//     if (cartArray.indexOf(cartArray.idMeal) !== -1) {
//       console.log("alredy loaded");
//     } else {
//       let { strMeal, strMealThumb, idMeal } = mealdata;
//       cartArray = [...cartArray, { idMeal, strMeal, strMealThumb }];
//       console.log(cartArray);
//     }
//   });
// }
