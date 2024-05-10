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
currencyCountry.addEventListener("change", () => {
  let currencyValue = currencyCountry.value;
  console.log(saveApiCurrency(currencyValue));
});
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  let currencyValue = currencyCountry.value;
  printCurrencyValue(currencyValue);
  handleDomCard(currencyValue);
});

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
      .then((response) => response.json())
      .then((data) => {
        const stringifiedData = JSON.stringify(data);
        localStorage.setItem(`exchange_${currency}`, stringifiedData);
        let allCurrency = choiceCurrencyCountry.map((dataMap) => {
          dataMap.value = data.conversion_rates[dataMap.currency];
          return dataMap;
        });
        return allCurrency;
      });
  } else {
    let storageCurrency = localStorage.getItem(`exchange_${currency}`);
    let parseCurrency = JSON.parse(storageCurrency);
    let allCurrency = choiceCurrencyCountry.map((data) => {
      data.value = parseCurrency.conversion_rates[data.currency];
      return data;
    });
    return allCurrency;
  }
}

function handleDomCard(country) {
  const cardElements = document.querySelectorAll(".card"); // Get all card elements

  // Loop through all cards and reset their display styles
  cardElements.forEach((cardElement) => {
    cardElement.style.display = "flex"; // Reset display to default (usually visible)
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
        "Exchange rate unavailable";
    }
  });
}
