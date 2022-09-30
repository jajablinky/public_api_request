const searchContainer = document.getElementById("search-container");
const gallery = document.getElementById("gallery");
let humanData = [];
let modalIndex;

// ------------------------------------------
//  Search Bar
// ------------------------------------------

const searchHTML = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form> `;
searchContainer.insertAdjacentHTML("beforeend", searchHTML);
const search = document.getElementById("search-input");

// ------------------------------------------
//  Load Profile
// ------------------------------------------

const loadHumanData = async () => {
  try {
    const url = "https://randomuser.me/api/?results=12";
    const res = await fetch(url);
    const data = await res.json();
    humanData = data.results;
  } catch (err) {
    console.error(err);
  }
};

// ------------------------------------------
//  Show 12 Humans
// ------------------------------------------
loadHumanData().then(() => {
  for (i = 0; i <= humanData.length - 1; i++) {
    const galleryHTML = `
      <div class="card" data-index-number="${[i]}">
      <div class="card-img-container" data-index-number="${[i]}">
      <img class="card-img" src="${humanData[i].picture.large}" alt="profile picture" data-index-number="${[i]}">
      </div>
      <div class="card-info-container" data-index-number="${[i]}">
          <h3 id="name" class="card-name cap" data-index-number="${[i]}">${humanData[i].name.first}, ${humanData[i].name.last}</h3>
          <p class="card-text" data-index-number="${[i]}">${humanData[i].email}</p>
          <p class="card-text cap" data-index-number="${[i]}">${humanData[i].location.city}, ${humanData[i].location.state}</p>
      </div>
      </div>`;
    gallery.insertAdjacentHTML("beforeend", galleryHTML);
  }

  // ------------------------------------------
  //  Modal Window
  // ------------------------------------------
  const displayModal = (event) => {
    for (i = 0; i <= humanData.length - 1; i++) {
      if (event.target.getAttribute("data-index-number") === `${i}`) {
      
        // Reformatting data for inserting html
        // ------------------------------------------
        const reformatPhone = (phoneNumberString) => {
          const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
          const sliced = cleaned.slice(0, 10);
          console.log(sliced);
          const match = sliced.match(/^(\d{3})(\d{3})(\d{4}|\d{3}|\d{2})$/);
          return "(" + match[1] + ") " + match[2] + "-" + match[3];
        };

        const reformatBirthday = (birthdayString) => {
          const cleaned = ("" + birthdayString).replace(/\D/g, "");
          const sliced = cleaned.slice(0, 8);
          const match = sliced.match(
            /^(\d{4})(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/
          );
          if (match) {
            return `${match[2]}/${match[3]}/${match[1]}`;
          }
          return null;
        };

        const reformatLocation = `
            ${humanData[i].location.street.number}, ${humanData[i].location.street.name}, ${humanData[i].location.city}, ${humanData[i].location.state}, ${humanData[i].location.postcode}
            `;

        
        //  Displaying the modal window inserting the html
        // ------------------------------------------
        modalIndex = i;
        const insertModalHtml = (index) => document.body.insertAdjacentHTML("beforeend",
          `<div class="modal-container" data-index-number="${index}">
                  <div class="modal">
                      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                      <div class="modal-info-container">
                          <img class="modal-img" src="${
                            humanData[index].picture.large
                          }" alt="profile picture">
                          <h3 id="name" class="modal-name cap">${
                            humanData[index].name.first
                          }, ${humanData[index].name.last}</h3>
                          <p class="modal-text">${humanData[index].email}</p>
                          <p class="modal-text cap">${
                            humanData[index].location.city
                          }</p>
                          <hr>
                          <p class="modal-text">${reformatPhone(
                            humanData[index].cell
                          )}</p>
                          <p class="modal-text">${reformatLocation}</p>
                          <p class="modal-text">${reformatBirthday(
                            humanData[index].dob.date
                          )}</p>
                      </div>
                  </div>

                  <div class="modal-btn-container">
                      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                      <button type="button" id="modal-next" class="modal-next btn">Next</button>
                  </div>
              </div>`
        );
        insertModalHtml(i);

        //  Prev / Next button
        // ------------------------------------------
        const modalWindow = document.getElementsByClassName("modal-container")[0];
        let modalPrev = document.getElementById('modal-prev');
        let modalNext = document.getElementById('modal-next');;
        modalPrev.addEventListener('click',() => {
          let prev = modalIndex - 1;
          modalWindow.remove()
          insertModalHtml(prev);

        });
        modalNext.addEventListener('click',() => {
          const next = modalIndex + 1;
          modalWindow.remove()
          insertModalHtml(next);
          });
        //  Close modal window
        // ------------------------------------------
        const modalClose = document.getElementById("modal-close-btn");
        modalClose.addEventListener("click", (event) => {
          modalWindow.remove();
        });
      }
    }
  };

  // ------------------------------------------
  //  Event Listeners
  // ------------------------------------------

  gallery.addEventListener("click", (event) => {
    // on empty space click doesnt register
    if (event.target.className !== "gallery") {
      displayModal(event);
    }
  });

  search.addEventListener("click", (event) => {
    // on empty space click doesnt register
    if (event.target.className !== "gallery") {
      displayModal(event);
    }
  });


  search.addEventListener("keyup", (event) => {
    let currentValue = event.target.value.toLowerCase();
    let humans = document.querySelectorAll("h3");
    humans.forEach((humans) => {
      if (humans.textContent.toLowerCase().includes(currentValue)) {
        humans.parentNode.parentNode.style.display = "flex";
      } else {
        humans.parentNode.parentNode.style.display = "none";
      }
    });
  });

  // ------------------------------------------
  //  Animation
  // ------------------------------------------

  const humanCards = document.querySelectorAll(".card");
  humanCards.forEach((card) => {
    let randomAniDelay = Math.floor(Math.random() * 100);
    card.style.animation = `fadeIn .75s .${randomAniDelay}s ease forwards`;
  });
});
