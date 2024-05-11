let API_KEY = "93694df2b25afd94a6eb2508";
let formulario = document.forms["form"];
let currencyCountry = document.getElementById("currencyCountry");
let choiceCurrencyCountry = [
  {
    country: "argentina",
    currency: "ARS",
  },
  {
    country: "colombia",
    currency: "COP",
  },
  {
    country: "chile",
    currency: "CLP",
  },
  {
    country: "mexico",
    currency: "MXN",
  },
  {
    country: "eeuu",
    currency: "USD",
  },
  {
    country: "peru",
    currency: "PEN",
  },
  {
    country: "venezuela",
    currency: "VES",
  },
];
const numberInput = document.getElementById("numberCurrency");

currencyCountry.addEventListener("change", () => {
  let currencyValue = currencyCountry.value;
  // Check if user has changed the value
  if (currencyValue !== "defecto") {
    saveApiCurrency(currencyValue);
  }
});
formulario.addEventListener("submit", (event) => {
  // Only submit if user has changed the value
  if (currencyCountry.value !== "defecto") {
    event.preventDefault();
    let currencyValue = currencyCountry.value;
    printCurrencyValue(currencyValue);
    handleDomCard(currencyValue);
  } else {
    // Optional: Inform user they haven't changed the selection
    alert("Porfavor selecciona la moneda de un pais");
    event.preventDefault(); // Prevent submission even if not changed
  }
});
 // Assuming this is the input field ID
restrictInputToNumbers(numberInput);

function saveApiCurrency(currency) {
  if (
    localStorage.getItem(`exchange_${currency}`) == null ||
    localStorage.getItem(`exchange_${currency}`) == undefined
  ) {
    const matchingCurrency = choiceCurrencyCountry.find(
      (country) => country.country === currency
    );
    fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${matchingCurrency.currency}`
    )
      .then((response) =>{
        if(response.status === 403 || response.status === 500){
          localStorage.clear()
          return alert('Error en la peticion de la api: Status ' + response.status);
        }
        if(response.ok){
          return response.json()
        }
      })
      .then((data) => {
        const stringifiedData = JSON.stringify(data);
        localStorage.setItem(`exchange_${currency}`, stringifiedData);
        choiceCurrencyCountry.map((dataMap) => {
          dataMap.value = data.conversion_rates[dataMap.currency];
          return dataMap;
        });
        return choiceCurrencyCountry; 
      }).catch((error) =>{
        alert('Hubo un error con la api: '+ error)
      });
  } else {
    let storageCurrency = localStorage.getItem(`exchange_${currency}`);
    let parseCurrency = JSON.parse(storageCurrency);
    choiceCurrencyCountry.map((data) => {
      data.value = parseCurrency.conversion_rates[data.currency];
      return data;
    });
    return choiceCurrencyCountry;
  }
}

function handleDomCard(country) {
  const cardElements = document.querySelectorAll(".card"); // Get all card elements

  // Loop through all cards and reset their display styles
  cardElements.forEach((cardElement) => {
    cardElement.style.display = "flex"; // Reset display to default (usually visible)
    cardElement.classList.add("fade-out"); 
    
    setTimeout(() => {
      if (cardElement.classList[1] !== `.${country}-card`) {
        // Fade out cards except the selected one
        cardElement.classList.remove("fade-out");
      }
    }, 100);
  });

  // Now, specifically hide the newly selected card
  const selectedCard = document.querySelector(`.${country}`);
  if (selectedCard) {
    selectedCard.style.display = "none";
  } else {
    console.warn(`Element with class '.${country}' not found.`);
  }
}

function printCurrencyValue(country) {
  const cardElements = document.querySelectorAll(".card");

  const formValue = document.forms["form"]["numberCurrency"].value; // Access form value
  
  cardElements.forEach((cardElement) => {
    cardElement.style.display = "flex"; // Reset display to default (usually visible)
    cardElement.style.flexDirection = "column";
    const countryClass = cardElement.classList[1]; // Extract country code from class
    const matchingCurrency = choiceCurrencyCountry.find(
      (data) => data.country === countryClass
    ); // Remove trailing "-card"
    if (matchingCurrency) {
      const convertedValue = formValue * matchingCurrency.value; // Calculate value for the matching currency
      
        cardElement.querySelector(
          "p.text"
        ).textContent = `${convertedValue} ${matchingCurrency.currency}`;
     
     
    } else {
      // Handle cases where exchange rate is not available (optional)
      cardElement.querySelector("p.text").textContent =
        "Vuelva intentar error en la conversion";
    }
  });
}
function restrictInputToNumbers(inputElement) {
  // Add event listener for keypress event
  inputElement.addEventListener("keypress", (event) => {
    // Get the character code of the pressed key
    const keyCode = event.keyCode;

    // Allow backspace, delete, tab, and decimal point (if allowed)
    const allowedKeys = [8, 9, 13, 46]; // Backspace, Tab, Enter, Decimal point

    // Check if the pressed key is a number (0-9) or an allowed key
    if (!(keyCode >= 48 && keyCode <= 57) && !allowedKeys.includes(keyCode)) {
      // Prevent default behavior (prevent character from being entered)
      event.preventDefault();
    }
  });
}
