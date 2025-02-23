// URL base per le chiamate API al backend
const API_URL = "http://localhost:5000";

// Funzione per ottenere l'elenco completo delle località italiane disponibili
function getItalianLocations() {
  // Definizione degli aeroporti principali con relativi codici IATA
  const airports = [
    { name: "Roma Fiumicino", code: "FCO" },
    { name: "Milano Malpensa", code: "MXP" },
    { name: "Milano Linate", code: "LIN" },
    { name: "Bergamo Orio al Serio", code: "BGY" },
    { name: "Venezia Marco Polo", code: "VCE" },
    { name: "Napoli Capodichino", code: "NAP" },
    { name: "Torino Caselle", code: "TRN" },
    { name: "Bologna Guglielmo Marconi", code: "BLQ" },
    { name: "Catania Fontanarossa", code: "CTA" },
    { name: "Palermo Punta Raisi", code: "PMO" },
    { name: "Cagliari Elmas", code: "CAG" },
    { name: "Bari Karol Wojtyla", code: "BRI" },
    { name: "Brindisi Casale", code: "BDS" },
    { name: "Pisa Galileo Galilei", code: "PSA" },
    { name: "Firenze Peretola", code: "FLR" },
  ];

  // Città principali
  const cities = [
    "Roma",
    "Milano",
    "Napoli",
    "Torino",
    "Palermo",
    "Genova",
    "Bologna",
    "Firenze",
    "Bari",
    "Catania",
    "Venezia",
    "Verona",
    "Messina",
    "Padova",
    "Trieste",
    "Brescia",
    "Taranto",
    "Prato",
    "Modena",
    "Reggio Calabria",
    "Reggio Emilia",
    "Perugia",
    "Livorno",
    "Ravenna",
    "Cagliari",
    "Foggia",
    "Rimini",
    "Salerno",
    "Ferrara",
    "Sassari",
    "Latina",
    "Monza",
    "Siracusa",
    "Pescara",
    "Bergamo",
    "Forlì",
    "Trento",
    "Vicenza",
    "Terni",
    "Bolzano",
    "Piacenza",
    "Novara",
    "Ancona",
    "Andria",
    "Udine",
    "Arezzo",
    "Cesena",
    "Lecce",
    "Barletta",
    "Alessandria",
    "La Spezia",
    "Pesaro",
    "Parma",
    "Como",
    "Lucca",
    "Grosseto",
    "Viterbo",
    "Frosinone",
    "Campobasso",
    "Isernia",
    "Potenza",
    "Matera",
    "Cosenza",
    "Catanzaro",
    "Trapani",
    "Agrigento",
    "Caltanissetta",
    "Ragusa",
    "Nuoro",
    "Oristano",
    "Olbia",
    "Aosta",
    "Sondrio",
  ];

  return [...cities, ...airports.map((a) => `${a.name} (${a.code})`)];
}

const locations = getItalianLocations();

function isLocationValid(location) {
  return locations.some((loc) => loc.toLowerCase() === location.toLowerCase());
}

// Funzione per avviare la ricerca delle auto disponibili
function searchCars() {
  // Recupero dei valori inseriti dall'utente per la ricerca
  const pickupLocation = document.getElementById("pickupLocation").value; // Località di ritiro
  const returnLocation = document.getElementById("returnLocation").value; // Località di consegna
  const startDate = document.getElementById("startDate").value; // Data di inizio noleggio
  const endDate = document.getElementById("endDate").value; // Data di fine noleggio

  if (!isLocationValid(pickupLocation) || !isLocationValid(returnLocation)) {
    showAlert("Seleziona una località valida dalla lista", "warning");
    return;
  }

  if (!startDate || !endDate) {
    showAlert("Seleziona entrambe le date", "warning");
    return;
  }

  showCarResults();
}

// Database delle auto disponibili con dettagli tecnici e prezzi
const carData = {
  // Struttura dati contenente tutte le informazioni sui veicoli
  brands: {
    BMW: [
      {
        model: "Serie 1",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "X5",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Diesel",
      },
      {
        model: "Z4",
        type: "Sportiva",
        seats: 2,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],
    Audi: [
      {
        model: "A3",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Q5",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Diesel",
      },
      {
        model: "TT",
        type: "Sportiva",
        seats: 2,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],
    Mercedes: [
      {
        model: "Classe A",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "GLC",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Diesel",
      },
      {
        model: "SLK",
        type: "Sportiva",
        seats: 2,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "Classe E",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],
    Ford: [
      {
        model: "Fiesta",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Focus",
        type: "Berlina",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Kuga",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "Mustang",
        type: "Sportiva",
        seats: 4,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],
    Toyota: [
      {
        model: "Yaris",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Ibrida",
      },
      {
        model: "RAV4",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "Supra",
        type: "Sportiva",
        seats: 2,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],

    Honda: [
      {
        model: "Civic",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "CR-V",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "HR-V",
        type: "SUV",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
    ],

    Fiat: [
      {
        model: "500",
        type: "Citycar",
        seats: 4,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Panda",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Metano",
      },
      {
        model: "500X",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Diesel",
      },
    ],
    "Alfa Romeo": [
      {
        model: "Giulia",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "Stelvio",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "Tonale",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
    ],
    Jeep: [
      {
        model: "Renegade",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "Compass",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "Cherokee",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "Wrangler",
        type: "Fuoristrada",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
    ],
    Volkswagen: [
      {
        model: "Golf",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Tiguan",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "Polo",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Arteon",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
    ],
    Renault: [
      {
        model: "Clio",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Captur",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "Megane",
        type: "Berlina",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "Kadjar",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Diesel",
      },
    ],
    Peugeot: [
      {
        model: "208",
        type: "Citycar",
        seats: 5,
        transmission: "Manuale",
        fuel: "Benzina",
      },
      {
        model: "3008",
        type: "SUV",
        seats: 5,
        transmission: "Automatico",
        fuel: "Ibrida",
      },
      {
        model: "508",
        type: "Berlina",
        seats: 5,
        transmission: "Automatico",
        fuel: "Benzina",
      },
      {
        model: "5008",
        type: "SUV",
        seats: 7,
        transmission: "Automatico",
        fuel: "Diesel",
      },
    ],
  },
  prices: {
    BMW: [80, 120],
    Audi: [70, 110],
    Mercedes: [90, 130],
    Ford: [50, 80],
    Toyota: [60, 90],
    Honda: [55, 85],
    Fiat: [40, 70],
    "Alfa Romeo": [75, 100],
    Jeep: [65, 95],
    Volkswagen: [60, 90],
    Renault: [45, 75],
    Peugeot: [50, 80],
  },
};

// Funzione per recuperare l'URL dell'immagine dell'auto dal servizio CDN
function getCarImage(make, model) {
  // Parametri: marca e modello dell'auto
  return `https://cdn.imagin.studio/getImage?&customer=img&make=${make}&modelFamily=${model}&zoomType=fullscreen&angle=01`;
}

// Funzione asincrona per visualizzare i risultati della ricerca auto
async function showCarResults() {
  // Gestisce la visualizzazione dinamica delle auto disponibili
  const carList = document.getElementById("carList");
  carList.innerHTML =
    '<div class="col-12 text-center"><div class="spinner-border text-primary"></div></div>';

  try {
    const carPromises = Object.keys(carData.brands).map(async (brand) => {
      const models = carData.brands[brand];
      const randomModelObj = models[Math.floor(Math.random() * models.length)];
      const [minPrice, maxPrice] = carData.prices[brand];
      const year = new Date().getFullYear() - Math.floor(Math.random() * 3);
      const price =
        Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
      const imageUrl = await getCarImage(brand, randomModelObj.model);

      return {
        make: brand,
        model: randomModelObj.model,
        year: year,
        image: imageUrl,
        price: price,
        type: randomModelObj.type,
        seats: randomModelObj.seats,
        transmission: randomModelObj.transmission,
        fuel: randomModelObj.fuel,
      };
    });

    const cars = await Promise.all(carPromises);

    carList.innerHTML = "";
    cars.forEach((car) => {
      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
            <div class="card car-card h-100">
            <div class="image-container position-relative" style="height: 200px;">
                <img src="${car.image}" 
                     class="car-image img-fluid h-100 w-100" 
                     style="object-fit: contain"
                     alt="${car.make} ${car.model}" 
                     loading="lazy">
                <div class="price-tag">€${car.price}/giorno</div>
            </div>
                    <div class="card-body">
                        <h5 class="card-title">${car.make} ${car.model}</h5>
                        <ul class="feature-list">
                            <li><i class="fa-solid fa-car"></i> Tipo: ${car.type}</li>
                            <li><i class="fa-solid fa-users"></i> Posti: ${car.seats}</li>
                            <li><i class="fa-solid fa-gears"></i> Cambio: ${car.transmission}</li>
                            <li><i class="fa-solid fa-gas-pump"></i> Alimentazione: ${car.fuel}</li>
                            <li><i class="fa-solid fa-calendar-days"></i> Anno: ${car.year}</li>
                        </ul>
                        <button class="btn btn-primary w-100" onclick="showBookingDetail('${car.make}', '${car.model}', ${car.year}, '${car.image}', '${car.type}', ${car.seats}, '${car.transmission}', '${car.fuel}', ${car.price})">
                            Prenota Ora
                        </button>
                    </div>
                </div>`;
      carList.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Errore durante il caricamento delle auto:", error);
    carList.innerHTML =
      '<div class="col-12 text-danger text-center">Errore nel caricamento delle auto</div>';
  }
}

// Funzione per mostrare i dettagli di una prenotazione specifica
function showBookingDetail(
  make, // Marca dell'auto
  model, // Modello dell'auto
  year, // Anno di produzione
  image, // URL dell'immagine
  type, // Tipo di veicolo
  seats, // Numero di posti
  transmission, // Tipo di trasmissione
  fuel, // Tipo di carburante
  price // Prezzo giornaliero
) {
  // Nascondi la sezione principale
  document.getElementById("mainContent").style.display = "none";

  // Mostra la pagina di dettaglio della prenotazione
  const bookingDetailPage = document.getElementById("bookingDetailPage");
  bookingDetailPage.style.display = "block";

  // Scrolla fino alla sezione bookingDetailPage
  bookingDetailPage.scrollIntoView({ behavior: "smooth" });

  // Calcola la differenza di giorni tra la data di ritiro e restituzione
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const timeDiff = endDate - startDate;
  const daysDiff = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Evita valori negativi

  // Log per verificare se la differenza dei giorni è corretta
  console.log(`Days Difference: ${daysDiff}`);

  // Aggiorna i dettagli di prenotazione
  document.getElementById("detailPickupLocation").textContent =
    document.getElementById("pickupLocation").value;
  document.getElementById("detailReturnLocation").textContent =
    document.getElementById("returnLocation").value;

  const dateOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  document.getElementById("detailStartDate").textContent =
    startDate.toLocaleDateString("it-IT", dateOptions) +
    ", ore " +
    startDate.toLocaleTimeString("it-IT", timeOptions);

  document.getElementById("detailEndDate").textContent =
    endDate.toLocaleDateString("it-IT", dateOptions) +
    ", ore " +
    endDate.toLocaleTimeString("it-IT", timeOptions);

  // Immagine e dettagli dell'auto
  document.getElementById("detailCarImage").src = image;
  document.getElementById("detailCarTitle").textContent = `${make} ${model}`;
  document.getElementById("detailCarType").textContent = type;
  document.getElementById("detailCarSeats").textContent = seats;
  document.getElementById("detailCarTransmission").textContent = transmission;
  document.getElementById("detailCarFuel").textContent = fuel;
  document.getElementById("detailCarYear").textContent = year;

  // Log per verificare che price non sia undefined o null
  console.log(`Price: ${price}`);

  // Prezzo
  if (price && daysDiff > 0) {
    // Aggiungi log per vedere come vengono impostati i valori
    console.log(`Daily Price: €${price}`);
    console.log(`Total Price: €${price * daysDiff}`);

    document.getElementById("detailCarPrice").textContent = `€${price.toFixed(
      2
    )} /giorno`;
    document.getElementById("detailTotalPrice").textContent = `€${(
      price * daysDiff
    ).toFixed(2)}`;
  } else {
    // Gestisci il caso in cui price o daysDiff non sono validi
    console.log("Error: Invalid price or days difference");
    document.getElementById("detailCarPrice").textContent = "€0.00 /giorno";
    document.getElementById("detailTotalPrice").textContent = "€0.00";
  }
}

// Gestione del processo di login utente
async function handleLogin(e) {
  // Gestisce l'autenticazione dell'utente
  e.preventDefault();
  const formData = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Errore durante il login");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    updateAuthUI(true, data.user);
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();

    // Mostra un alert di successo immediatamente
    showAlert("Login effettuato con successo!", "success");
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// Gestione della registrazione di un nuovo utente
async function handleRegister(e) {
  // Gestisce la creazione di un nuovo account
  e.preventDefault();
  const formData = {
    full_name: e.target.full_name.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Cambio tab
      document.querySelector("#authTabs .nav-link").click();

      // Salva l'alert in localStorage
      const alertQueue = JSON.parse(localStorage.getItem("alertQueue")) || [];
      alertQueue.push({
        message: "Registrazione completata! Effettua il login",
        type: "success",
      });
      localStorage.setItem("alertQueue", JSON.stringify(alertQueue));
    } else {
      alert(data.message || "Errore durante la registrazione");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Errore di connessione");
  }
}

// Funzione per gestire il logout dell'utente
function logout() {
  // Rimuove il token di autenticazione dalla memoria locale
  localStorage.removeItem("authToken");

  // Aggiunge un messaggio di logout nella coda degli alert
  const messages = [
    { message: "Logout effettuato con successo!", type: "success" },
  ];

  // Recupera la coda esistente di messaggi, se presente
  const alertQueue = JSON.parse(localStorage.getItem("alertQueue")) || [];
  alertQueue.push(...messages);

  // Salva la coda aggiornata in localStorage
  localStorage.setItem("alertQueue", JSON.stringify(alertQueue));

  // Aggiorna l'interfaccia e ricarica la pagina
  updateAuthUI(false);
  window.location.reload();
}

// UI
function updateAuthUI(isLoggedIn, userData) {
  const authSection = document.getElementById("authSection");
  const userMenu = document.getElementById("userMenu");
  const emailField = document.querySelector("#paymentForm input[type='email']");
  const adminLink = document.getElementById("adminLink");

  if (isLoggedIn) {
    // Nascondi la sezione login/registrazione
    authSection.style.display = "none";

    // Mostra il menu utente
    userMenu.innerHTML = `
          <div class="dropdown">
          <button class="btn btn-light dropdown-toggle notranslate" 
          type="button" 
          data-bs-toggle="dropdown"
          translate="no">
      <i class="fa-solid fa-user me-2"></i>${userData?.full_name || "Utente"}
  </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                  <li><div class="dropdown-header small">${userData?.email || ""
      }</div></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item" onclick="logout()">
                      <i class="fa-solid fa-right-from-bracket me-2"></i>Esci
                  </button></li>
              </ul>
          </div>
      `;

    // Mostra il link alla gestione prenotazioni solo se l'utente è admin
    if (userData?.role === "admin") {
      adminLink.style.display = "block";
    } else {
      adminLink.style.display = "none";
    }

    // Precompila il campo email nel form di pagamento
    if (emailField) {
      emailField.value = userData.email; // Imposta l'email dell'utente loggato
    }
  } else {
    // Mostra la sezione login/registrazione
    authSection.style.display = "block";
    // Nascondi il menu utente
    userMenu.innerHTML = "";
    // Nascondi il link alla gestione prenotazioni
    adminLink.style.display = "none";
    // Pulisci il campo email
    if (emailField) {
      emailField.value = ""; // Pulisci il campo email se l'utente non è loggato
    }
  }
}

// Funzione per validare il form di modifica prenotazione
function validateEditForm() {
  // Controlla la validità dei campi del form
  const fields = [
    { id: "editPickup", message: "Inserisci luogo di ritiro" },
    { id: "editReturn", message: "Inserisci luogo di restituzione" },
    { id: "editStart", message: "Seleziona data ritiro" },
    { id: "editEnd", message: "Seleziona data restituzione" },
  ];

  let isValid = true;

  fields.forEach((field) => {
    const element = document.getElementById(field.id);
    if (!element.value.trim()) {
      showAlert(field.message, "warning");
      element.classList.add("is-invalid");
      isValid = false;
    } else {
      element.classList.remove("is-invalid");
    }
  });

  return isValid;
}

// Configurazione dei listener per gli input delle date
function setupDateListeners() {
  // Imposta gli eventi per gli input delle date
  const startInput = document.getElementById("editStart");
  const endInput = document.getElementById("editEnd");

  if (startInput && endInput) {
    startInput.addEventListener("change", updateTotal);
    endInput.addEventListener("change", updateTotal);
  }
}

// Funzione per aggiornare il totale della prenotazione
function updateTotal() {
  // Calcola e aggiorna il prezzo totale
  const startDate = new Date(document.getElementById("editStart").value);
  const endDate = new Date(document.getElementById("editEnd").value);

  if (startDate && endDate && startDate < endDate) {
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const dailyPrice = parseFloat(
      document.getElementById("bookingCarPrice").dataset.dailyPrice
    );
    document.getElementById("bookingTotalPrice").textContent = `€${(
      daysDiff * dailyPrice
    ).toFixed(2)}`;
  }
}

// Funzione per chiudere tutti gli elementi aperti nell'interfaccia
function closeAllOpenElements() {
  // Pulisce l'interfaccia chiudendo menu e modali
  // Chiudi tutti i dropdown aperti
  document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
    menu.classList.remove("show");
  });

  // Chiudi tutti i modali Bootstrap
  document.querySelectorAll(".modal.show").forEach((modal) => {
    bootstrap.Modal.getInstance(modal)?.hide();
  });

  // Nascondi eventuali sezioni secondarie
  document.getElementById("bookingDetailPage").style.display = "none";
  document.getElementById("carList").innerHTML = "";
}

// Funzione per visualizzare i dettagli completi di una prenotazione
function showBookingDetails(booking) {
  // Mostra tutte le informazioni di una prenotazione
  closeAllOpenElements(); // Aggiungi questa linea

  document.getElementById("bookingDetails").style.display = "block";

  // Sposta questa sezione DOPO aver calcolato dailyPrice
  const daysDiff = Math.ceil(
    (new Date(booking.end_date) - new Date(booking.start_date)) /
    (1000 * 60 * 60 * 24)
  );
  const dailyPrice = (booking.total_price / daysDiff).toFixed(2);

  // Ora puoi impostare il dataset
  document.getElementById("bookingCarPrice").dataset.dailyPrice = dailyPrice;
  document.getElementById(
    "bookingCarPrice"
  ).textContent = `€${dailyPrice}/giorno`;

  // Formatta le date correttamente
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  // Popola i dati della prenotazione
  document.getElementById(
    "bookingCode"
  ).textContent = `Numero: ${booking.booking_code}`;
  document.getElementById("bookingPickupLocation").textContent =
    booking.pickup_location;
  document.getElementById("bookingReturnLocation").textContent =
    booking.return_location;
  document.getElementById("bookingStartDate").textContent = formatDate(
    booking.start_date
  );
  document.getElementById("bookingEndDate").textContent = formatDate(
    booking.end_date
  );
  document.getElementById(
    "bookingTotalPrice"
  ).textContent = `€${booking.total_price.toFixed(2)}`;

  // Costruisci l'URL dell'immagine correttamente
  const imageUrl = getCarImage(booking.car_make, booking.car_model);
  document.getElementById("bookingCarImage").src = imageUrl;

  // Popola i dettagli dell'auto
  document.getElementById("bookingCarTitle").textContent = booking.car_name;
  document.getElementById("bookingCarType").textContent =
    booking.car_details.type;
  document.getElementById("bookingCarSeats").textContent =
    booking.car_details.seats;
  document.getElementById("bookingCarTransmission").textContent =
    booking.car_details.transmission;
  document.getElementById("bookingCarFuel").textContent =
    booking.car_details.fuel;
  document.getElementById("bookingCarYear").textContent =
    booking.car_details.year;

  // ... codice esistente ...

  // Aggiungi sezione modifica
  const editSection = `
    <div id="editSection" style="display: none;" class="mt-4 p-4 border rounded">
      <h4 class="text-primary mb-4">
        <i class="fa-solid fa-pen-to-square me-2"></i>Modifica Prenotazione
      </h4>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Luogo di ritiro</label>
          <div class="input-icon d-flex align-items-center">
            <input type="text" class="form-control" id="editPickup">
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Luogo di restituzione</label>
          <div class="input-icon d-flex align-items-center">
            <input type="text" class="form-control" id="editReturn">
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Data ritiro</label>
          <input type="datetime-local" class="form-control" id="editStart">
        </div>
        <div class="col-md-6">
          <label class="form-label">Data restituzione</label>
          <input type="datetime-local" class="form-control" id="editEnd">
        </div>
      </div>
      <div class="mt-4 d-flex gap-2">
        <button class="btn btn-success flex-grow-1" onclick="saveChanges('${booking.booking_code}')">
          <i class="fa-solid fa-floppy-disk me-2"></i>Salva modifiche
        </button>
        <button class="btn btn-secondary flex-grow-1" onclick="editBooking('${booking.booking_code}')">
          <i class="fa-solid fa-xmark me-2"></i>Annulla
        </button>
      </div>
    </div>`;

  // Aggiungi i pulsanti principali
  const mainButtons = `
      <div class="mt-5 d-grid gap-3">
        <button class="btn btn-lg btn-primary" onclick="editBooking('${booking.booking_code}')">
          <i class="fa-solid fa-edit me-2"></i>Modifica Prenotazione
        </button>
        <button class="btn btn-lg btn-danger" onclick="confirmDelete('${booking.booking_code}')">
          <i class="fa-solid fa-trash me-2"></i>Elimina Prenotazione
        </button>
        <button class="btn btn-outline-primary" onclick="resetBookingDetails()">
          <i class="fa-solid fa-arrow-left me-2"></i>Torna alla Ricerca
        </button>
      </div>`;

  // Inserisci gli elementi nel DOM
  document
    .querySelector("#bookingDetails .card-body")
    .insertAdjacentHTML("beforeend", editSection);
  document
    .querySelector("#bookingDetails .card-body")
    .insertAdjacentHTML("beforeend", mainButtons);

  document.getElementById("editPickup").value = booking.pickup_location;
  document.getElementById("editReturn").value = booking.return_location;

  // Formatta le date per gli input datetime-local
  const formatForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  document.getElementById("editStart").value = formatForInput(
    booking.start_date
  );
  document.getElementById("editEnd").value = formatForInput(booking.end_date);

  // Setup ricorsivo per gestire il caricamento degli elementi
  const setupEditFields = () => {
    const editPickup = document.getElementById("editPickup");
    const editReturn = document.getElementById("editReturn");

    if (editPickup && editReturn) {
      setupAutocomplete(editPickup);
      setupAutocomplete(editReturn);

      flatpickr("#editStart", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        locale: "it",
        time_24hr: true,
        altInput: true,
        altFormat: "d/m/Y H:i",
      });

      flatpickr("#editEnd", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        locale: "it",
        time_24hr: true,
        altInput: true,
        altFormat: "d/m/Y H:i",
      });
    } else {
      setTimeout(setupEditFields, 50);
    }
  };

  setupEditFields();
}

// Nuove funzioni per gestire le azioni
// Funzione per salvare le modifiche a una prenotazione
async function saveChanges(bookingCode) {
  // Aggiorna i dati della prenotazione nel database
  if (!validateEditForm()) return;

  const startDate = new Date(document.getElementById("editStart").value);
  const endDate = new Date(document.getElementById("editEnd").value);

  if (startDate >= endDate) {
    showAlert(
      "La data di restituzione deve essere successiva al ritiro",
      "warning"
    );
    return;
  }

  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const dailyPrice = parseFloat(
    document.getElementById("bookingCarPrice").dataset.dailyPrice
  );
  const newTotal = daysDiff * dailyPrice;

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/bookings/${bookingCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickup_location: document.getElementById("editPickup").value,
        return_location: document.getElementById("editReturn").value,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        new_total: newTotal,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const result = await response.json();
    document.getElementById(
      "bookingTotalPrice"
    ).textContent = `€${result.booking.new_total.toFixed(2)}`;
    showAlert(
      `Prenotazione aggiornata! Nuovo totale: €${result.booking.new_total.toFixed(
        2
      )}`,
      "success"
    );
  } catch (error) {
    showAlert(`Errore durante l'aggiornamento: ${error.message}`, "error");
  }
}

// Funzione per gestire la cancellazione di una prenotazione
async function confirmDelete(bookingCode) {
  // Gestisce il processo di eliminazione
  // 1. Controllo se l'utente è loggato
  const token = localStorage.getItem("authToken");
  if (!token) {
    showAlert(
      "Devi effettuare il login per cancellare una prenotazione!",
      "warning"
    );
    new bootstrap.Modal(document.getElementById("loginModal")).show();
    return;
  }

  // 2. Conferma l'azione dell'utente
  if (!confirm("Sei sicuro di voler cancellare questa prenotazione?")) return;

  try {
    // 3. Verifica il token e ottiene l'email dell'utente
    const verifyResponse = await fetch(`${API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!verifyResponse.ok) throw new Error("Token non valido o scaduto");

    const { user } = await verifyResponse.json();
    const loggedUserEmail = user?.email.toLowerCase();

    // 4. Recupera i dettagli della prenotazione
    const bookingResponse = await fetch(
      `${API_URL}/bookings?email=${encodeURIComponent(
        loggedUserEmail
      )}&code=${bookingCode}`
    );

    if (!bookingResponse.ok)
      throw new Error("Non sei il proprietario di questa prenotazione");

    const booking = await bookingResponse.json();

    // 5. Controllo di autorizzazione
    if (booking.user_email.toLowerCase() !== loggedUserEmail) {
      throw new Error("Non sei il proprietario di questa prenotazione");
    }

    // 6. Procedi con la cancellazione
    const deleteResponse = await fetch(`${API_URL}/bookings/${bookingCode}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!deleteResponse.ok) throw new Error("Errore durante la cancellazione");

    // 7. Feedback e reset
    showAlert("✅ Prenotazione cancellata con successo!", "success");
    resetPage();
  } catch (error) {
    // 8. Gestione degli errori
    console.error("Errore cancellazione:", error);

    // Caso specifico per utenti non autorizzati
    if (
      error.message.includes("proprietario") ||
      error.message.includes("autorizzato")
    ) {
      showAlert("🔒 Accesso negato: " + error.message, "error");
      localStorage.removeItem("authToken");
      updateAuthUI(false);
      setTimeout(() => window.location.reload(), 2000);
    } else {
      showAlert(`❌ Errore: ${error.message}`, "error");
    }

    // Reset parziale per mantenere la coerenza UI
    document.getElementById("bookingDetails").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  }
}

// Funzione per resettare la visualizzazione dei dettagli prenotazione
function resetBookingDetails() {
  // Ripristina lo stato iniziale della pagina
  document.getElementById("bookingDetails").style.display = "none";
  document.getElementById("mainContent").style.display = "block"; // Ripristina il form principale
  document.getElementById("searchBookingForm").reset();
}

// Funzione per attivare la modalità di modifica di una prenotazione
async function editBooking(bookingCode) {
  // Prepara l'interfaccia per la modifica
  const token = localStorage.getItem("authToken");

  if (!token) {
    showAlert(
      "Devi effettuare il login per modificare una prenotazione!",
      "warning"
    );
    new bootstrap.Modal(document.getElementById("loginModal")).show();
    return;
  }

  try {
    // Verifica token e ottieni email utente
    const verifyResponse = await fetch(`${API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!verifyResponse.ok) throw new Error("Token non valido o scaduto");

    const { user } = await verifyResponse.json();
    const loggedUserEmail = user?.email;

    if (!loggedUserEmail) throw new Error("Email utente non trovata nel token");

    // Recupera dati prenotazione
    const bookingResponse = await fetch(
      `${API_URL}/bookings?email=${encodeURIComponent(
        loggedUserEmail
      )}&code=${bookingCode}`
    );

    if (!bookingResponse.ok)
      throw new Error(
        "Accesso negato: non sei il proprietario della prenotazione"
      );

    const booking = await bookingResponse.json();

    // Log di debug sicuro
    console.log("Dati prenotazione:", {
      userLogged: loggedUserEmail,
      bookingUser: booking?.user_email,
      status: booking?.status,
    });

    // Controllo autorizzazione
    if (
      !booking?.user_email ||
      booking.user_email.toLowerCase() !== loggedUserEmail.toLowerCase()
    ) {
      showAlert("Accesso negato: non sei il proprietario", "error");
      setTimeout(() => window.location.replace("index.html"), 4000);
      return;
    }

    // Mostra sezione modifica
    const editSection = document.getElementById("editSection");
    if (!editSection) throw new Error("Elemento modifica non trovato");

    editSection.style.display = "block";
  } catch (error) {
    console.error("Errore durante l'operazione:", error);
    showAlert(`Errore: ${error.message}`, "error");
    setTimeout(() => window.location.reload(), 1500);
  }
}

// Funzione per eliminare la prenotazione
async function deleteBooking() {
  const email = document.getElementById("searchEmail").value;
  const code = document.getElementById("searchCode").value;

  try {
    const response = await fetch(
      `${API_URL}/bookings?email=${email}&code=${code}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok)
      throw new Error("Errore durante l'eliminazione della prenotazione");

    showAlert("Prenotazione eliminata con successo!", "success");
    resetBookingDetails();
  } catch (error) {
    showAlert(error.message, "error");
  }
}

// Funzione per cercare una prenotazione esistente
async function searchBooking(e) {
  // Gestisce la ricerca delle prenotazioni
  e.preventDefault();
  const email = document.getElementById("searchEmail").value;
  const code = document.getElementById("searchCode").value;

  try {
    const response = await fetch(
      `${API_URL}/bookings?email=${email}&code=${code}`
    );
    if (!response.ok) throw new Error("Prenotazione non trovata");

    const booking = await response.json();

    // Chiudi il modal di ricerca
    bootstrap.Modal.getInstance(document.getElementById("searchModal")).hide();

    // Nascondi il form principale
    document.getElementById("mainContent").style.display = "none";

    // Mostra i dettagli della prenotazione
    showBookingDetails(booking);

    // Resetta il form
    document.getElementById("searchBookingForm").reset();
  } catch (error) {
    // Resetta il form anche in caso di errore
    document.getElementById("searchBookingForm").reset();
    showAlert(error.message, "error");
  }
}

// Funzione per mostrare/nascondere il menu utente
function showUserMenu() {
  // Gestisce la visualizzazione del menu dropdown utente
  const menu = document.querySelector("#userMenu .dropdown-menu");
  menu.classList.toggle("show");
}

// Funzione per gestire il processo di pagamento
function handlePayment(e) {
  // Gestisce la procedura di pagamento e creazione prenotazione
  e.preventDefault();

  const requiredFields = e.target.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value) {
      isValid = false;
      field.classList.add("is-invalid");
    }
  });

  if (!isValid) {
    showAlert("Compila tutti i campi obbligatori", "warning");
    return;
  }

  const token = localStorage.getItem("authToken"); // Recupera il token di autenticazione

  if (!token) {
    alert("Devi effettuare il login per completare la prenotazione.");

    // Nascondi la pagina di dettaglio
    document.getElementById("paymentModal").style.display = "none";

    // Mostra il modal di login
    const loginModal = new bootstrap.Modal(
      document.getElementById("loginModal")
    );

    // Gestisci gli eventi del modal
    loginModal.show();

    // Quando il modal viene chiuso, ri-mostra la pagina di dettaglio
    document
      .getElementById("loginModal")
      .addEventListener("hidden.bs.modal", () => {
        document.getElementById("paymentModal").style.display = "block";
      });

    return;
  }

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("paymentModal")
  );

  if (modal) {
    modal.hide();
  }

  // Dati della prenotazione

  const bookingData = {
    user_email: document.querySelector("#paymentForm input[type='email']")
      .value,
    car_name: document.getElementById("detailCarTitle").textContent,
    pickup_location: document.getElementById("detailPickupLocation")
      .textContent,
    return_location: document.getElementById("detailReturnLocation")
      .textContent,
    start_date: document.getElementById("startDate").value,
    end_date: document.getElementById("endDate").value,
    total_price: parseFloat(
      document.getElementById("detailTotalPrice").textContent.replace("€", "")
    ),
    car_type: document.getElementById("detailCarType").textContent,
    car_seats: parseInt(document.getElementById("detailCarSeats").textContent),
    car_transmission: document.getElementById("detailCarTransmission")
      .textContent,
    car_fuel: document.getElementById("detailCarFuel").textContent,
    car_year: parseInt(document.getElementById("detailCarYear").textContent),
  };

  // Crea la prenotazione
  createBooking(bookingData).then(() => {
    // Salva entrambi i messaggi in localStorage

    const messages = [
      { message: "Pagamento simulato con successo!", type: "success" },
      {
        message: "Prenotazione creata! Controlla la tua email per i dettagli.",
        type: "success",
      },
    ];

    // Aggiungi i messaggi alla coda esistente, se ci sono messaggi precedenti
    const alertQueue = JSON.parse(localStorage.getItem("alertQueue")) || [];
    alertQueue.push(...messages);

    // Salva la coda aggiornata in localStorage
    localStorage.setItem("alertQueue", JSON.stringify(alertQueue));

    // Reset della pagina o altre operazioni
    resetPage();
  });
}

// Funzione per resettare completamente la pagina
function resetPage(event) {
  // Ripristina tutti i form e gli elementi dell'interfaccia
  if (event) event.preventDefault(); // Blocca il submit del form

  // Reset dei form
  document.getElementById("paymentForm").reset();

  // Reset dei datepicker
  if (window.startPicker) window.startPicker.clear();
  if (window.endPicker) window.endPicker.clear();
  if (window.birthDatePicker) window.birthDatePicker.clear();
  if (window.licenseExpiryPicker) window.licenseExpiryPicker.clear();

  // Reset manuale degli input visibili
  const resetElements = [
    "pickupLocation",
    "returnLocation",
    "startDate",
    "endDate",
    "birthDate",
    "licenseExpiry",
  ];

  resetElements.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = "";
      if (input._flatpickr) {
        input._flatpickr.clear();
        input._flatpickr.altInput.value = "";
      }
    }
  });

  // Ripristino UI
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("bookingDetailPage").style.display = "none";
  document.getElementById("carList").innerHTML = "";

  // Reset degli autocomplete
  const locationInputs = ["pickupLocation", "returnLocation"];
  locationInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input"));
      const parent = input.parentNode;
      const dropdown = parent?.querySelector(".autocomplete-dropdown");
      if (dropdown) dropdown.remove();
    }
  });

  // Scroll e pulizia finale
  window.scrollTo({ top: 0, behavior: "smooth" });
  document
    .querySelectorAll(".is-invalid")
    .forEach((el) => el.classList.remove("is-invalid"));
  document
    .querySelectorAll(".autocomplete-dropdown")
    .forEach((dropdown) => dropdown.remove());

  // Reimposta i datepicker principali
  if (window.startPicker) {
    window.startPicker.set("minDate", "today");
    window.startPicker.set("maxDate", null);
  }
  if (window.endPicker) {
    window.endPicker.set("minDate", "today");
    window.endPicker.set("maxDate", null);
  }
}

//invio form assistenza
// Gestione form contatto
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("contactModal")
  );

  // Simulazione invio (sostituisci con chiamata API reale)
  setTimeout(() => {
    modal.hide();
    showAlert(
      "Grazie per averci contattato! Abbiamo ricevuto la tua richiesta e il nostro team di supporto ti risponderà al più presto. Ti invieremo un'email di conferma con i dettagli.",
      "success",
      5000
    );
    e.target.reset();
  }, 1000);
});

// dati prenotazione db
async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Errore durante la creazione della prenotazione");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore:", error);
    showAlert("Errore durante la creazione della prenotazione", "error");
  }
}

// Funzione per gestire la traduzione della pagina
function translatePage(lang) {
  // Gestisce il cambio di lingua dell'interfaccia
  localStorage.setItem("selectedLanguage", lang);
  document.getElementById("currentLanguage").textContent = lang.toUpperCase();

  if (lang === "it") {
    // Rimuove la traduzione forzata resettando Google Translate
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
      window.location.hostname +
      ";";

    // Ricarica la pagina per applicare la rimozione della traduzione
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    // Attiva Google Translate per la lingua selezionata
    let googleTranslateCombo = document.querySelector(".goog-te-combo");
    if (googleTranslateCombo) {
      googleTranslateCombo.value = lang;
      googleTranslateCombo.dispatchEvent(new Event("change"));
    }
  }
}

// Funzione di inizializzazione del componente Google Translate
function googleTranslateElementInit() {
  // Configura il widget di traduzione
  new google.translate.TranslateElement(
    {
      pageLanguage: "it",
      includedLanguages: "en,es,fr",
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    },
    "google_translate_element"
  );

  // Aggiornamento iniziale senza forzare il reload
  const currentLang = localStorage.getItem("selectedLanguage") || "it";
  if (currentLang === "it") {
    document.querySelector(".goog-te-gadget").style.display = "none";
    google.translate.TranslateElement().restore();
  } else {
    document.querySelector(".goog-te-combo").value = currentLang;
  }
}

// Inizializzazioni
document.addEventListener("DOMContentLoaded", () => {
  // Verifica e mostra gli alert salvati in localStorage
  const alertQueue = JSON.parse(localStorage.getItem("alertQueue")) || [];

  if (alertQueue.length > 0) {
    function showNextAlert(index) {
      if (index < alertQueue.length) {
        const msg = alertQueue[index];

        // Mostra il messaggio
        showAlert(msg.message, msg.type);

        // Rimuove l'alert dopo la durata specificata (3000 ms di default)
        setTimeout(() => {
          // Chiamata ricorsiva per mostrare il prossimo messaggio
          showNextAlert(index + 1);
        }, 3000); // Mostra il prossimo messaggio dopo 3 secondi
      } else {
        // Rimuove i messaggi dopo che sono stati mostrati
        localStorage.removeItem("alertQueue");
      }
    }

    // Inizia a mostrare il primo messaggio
    showNextAlert(0);
  }

  // Verifica login
  const token = localStorage.getItem("authToken");
  if (token) {
    fetch(`${API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Token non valido");
        return response.json();
      })
      .then((data) => updateAuthUI(true, data.user))
      .catch(() => {
        localStorage.removeItem("authToken");
        updateAuthUI(false);
      });
  }

  // DatePicker

  // Sostituisci le dichiarazioni const con assegnazioni a window
  // Inizializzazione dei datepicker
  window.startPicker = flatpickr("#startDate", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    locale: "it",
    time_24hr: true,
    altInput: true,
    altFormat: "d/m/Y H:i",
    onChange: (dates) => window.endPicker.set("minDate", dates[0]),
    defaultDate: null,
  });

  window.endPicker = flatpickr("#endDate", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    locale: "it",
    time_24hr: true,
    altInput: true,
    altFormat: "d/m/Y H:i",
    defaultDate: null,
  });

  // Inizializzazione flatpickr per il payment modal
  window.birthDatePicker = flatpickr("#birthDate", {
    dateFormat: "Y-m-d",
    locale: "it",
    altInput: true,
    altFormat: "d/m/Y",
    maxDate: new Date().fp_incr(-365 * 18),
  });

  window.licenseExpiryPicker = flatpickr("#licenseExpiry", {
    dateFormat: "Y-m-d",
    locale: "it",
    altInput: true,
    altFormat: "d/m/Y",
    minDate: "today",
  });

  // Event Listeners
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document
    .getElementById("registerForm")
    .addEventListener("submit", handleRegister);
  document
    .getElementById("paymentForm")
    .addEventListener("submit", handlePayment);

  // Funzione per validare il form prima del pagamento con Apple Pay/Google Pay
  function isPaymentFormValid() {
    // Seleziona tutti i campi richiesti tranne quelli della carta di credito
    const requiredFields = document.querySelectorAll(
      "#paymentForm [required]:not(#cards input)"
    );

    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid"); // Evidenzia in rosso i campi vuoti
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (!isValid) {
      showAlert(
        "Compila tutti i campi obbligatori prima di procedere con il pagamento!",
        "warning"
      );
    }

    return isValid;
  }

  // Seleziona solo i pulsanti reali di pagamento
  const applePayButton = document.querySelector("#apple-pay button");
  const googlePayButton = document.querySelector("#google-pay button");

  if (applePayButton) {
    applePayButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (isPaymentFormValid()) {
        handlePayment(e);
      }
    });
  }

  if (googlePayButton) {
    googlePayButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (isPaymentFormValid()) {
        handlePayment(e);
      }
    });
  }
});

// Funzione per configurare l'autocompletamento delle località
function setupAutocomplete(input) {
  // Implementa la funzionalità di suggerimento località
  let currentDropdown = null;

  input.addEventListener("input", (e) => {
    const value = e.target.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Clear previous dropdown
    if (currentDropdown) {
      currentDropdown.remove();
      currentDropdown = null; // Important: reset currentDropdown
    }

    if (value.length < 2) return;

    const filtered = locations.filter((loc) =>
      loc
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(value)
    );

    if (filtered.length > 0) {
      currentDropdown = document.createElement("div");
      currentDropdown.className = "autocomplete-dropdown";
      currentDropdown.style.position = "absolute"; // Ensure correct positioning
      currentDropdown.style.top = input.offsetTop + input.offsetHeight + "px"; // Position below input
      currentDropdown.style.left = input.offsetLeft + "px";
      currentDropdown.style.width = input.offsetWidth + "px"; // Match input width
      currentDropdown.style.zIndex = "1000"; // Ensure it's on top

      filtered.forEach((loc) => {
        const item = document.createElement("div");
        item.className = "dropdown-item";

        if (loc.includes("(")) {
          item.innerHTML = `<i class="fa-solid fa-plane me-2"></i>${loc}`;
        } else {
          item.innerHTML = `<i class="fa-solid fa-city me-2"></i>${loc}`;
        }

        item.addEventListener("click", () => {
          // Use addEventListener
          input.value = loc;
          if (currentDropdown) {
            // Check if it exists before removing
            currentDropdown.remove();
            currentDropdown = null; // Reset
          }
        });
        currentDropdown.appendChild(item);
      });

      input.parentNode.appendChild(currentDropdown); // Append to parent, not parent's parent
    }
  });

  // IMPORTANT: Handle clicks outside the dropdown *and* the input
  document.addEventListener("click", (e) => {
    if (
      currentDropdown &&
      !input.contains(e.target) &&
      !currentDropdown.contains(e.target)
    ) {
      currentDropdown.remove();
      currentDropdown = null; // Reset
    }
  });
}

// Autocomplete
setupAutocomplete(document.getElementById("pickupLocation"));
setupAutocomplete(document.getElementById("returnLocation"));

// Funzione per creare il container delle notifiche
function createAlertContainer() {
  // Crea il contenitore per i messaggi di alert
  if (!document.getElementById("customAlert")) {
    const alertDiv = document.createElement("div");
    alertDiv.id = "customAlert";
    alertDiv.className = "alert alert-dismissible fade";
    alertDiv.setAttribute("role", "alert");
    alertDiv.style =
      "position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 350px;";
    alertDiv.innerHTML = `
          <div class="d-flex align-items-center">
              <span id="alertIcon" class="me-3"></span>
              <div>
                  <h6 id="alertTitle" class="alert-heading mb-1"></h6>
                  <span id="alertMessage"></span>
              </div>
              <button type="button" class="btn-close ms-3" data-bs-dismiss="alert"></button>
          </div>
      `;
    document.body.appendChild(alertDiv);
  }
}

// Funzione per mostrare notifiche all'utente
function showAlert(message, type = "success", duration = 3000) {
  // Gestisce la visualizzazione dei messaggi di feedback
  createAlertContainer(); // Assicura che l'alert esista

  const alert = document.getElementById("customAlert");
  const icon = document.getElementById("alertIcon");
  const title = document.getElementById("alertTitle");
  const msg = document.getElementById("alertMessage");

  if (!alert || !icon || !title || !msg) {
    console.error("❌ Elemento dell'alert non trovato nel DOM!");
    return;
  }

  // Resetta le classi e fornisce la posizione fissa
  alert.className = "alert alert-dismissible fade show " + type;
  alert.style.position = "fixed";
  alert.style.top = "75px"; // Reimposta la posizione iniziale
  alert.style.right = "20px";
  alert.style.zIndex = "9999";
  alert.style.minWidth = "350px";
  alert.style.opacity = "1";
  alert.style.visibility = "visible";

  // Configurazione icone e titoli
  const alertConfig = {
    success: { icon: "✔", title: "Successo!" },
    error: { icon: "✖", title: "Errore!" },
    warning: { icon: "⚠", title: "Attenzione!" },
  };

  const config = alertConfig[type] || alertConfig.success;
  icon.textContent = config.icon;
  title.textContent = config.title;
  msg.textContent = message;

  // Nasconde l'alert dopo duration millisecondi
  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.visibility = "hidden";
  }, duration);
}
