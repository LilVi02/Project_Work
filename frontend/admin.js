// URL dell'API per il backend (in questo caso è in locale)
const API_URL = "http://localhost:5000";

// Funzione per ottenere tutte le prenotazioni dal server e visualizzarle nella tabella
async function fetchBookings() {
  try {
    // Effettua una richiesta GET per ottenere le prenotazioni
    const response = await fetch(`${API_URL}/bookings`);
    
    // Converte la risposta in formato JSON
    const bookings = await response.json();
    
    // Ottiene il corpo della tabella
    const tableBody = document.getElementById("bookingTableBody");
    
    // Pulisce il contenuto esistente della tabella
    tableBody.innerHTML = "";

    // Itera su ogni prenotazione per creare le righe della tabella
    bookings.forEach((booking) => {
      // Converte le date di ritiro e restituzione in formato leggibile in italiano
      const startDate = new Date(booking.start_date).toLocaleString("it-IT");
      const endDate = new Date(booking.end_date).toLocaleString("it-IT");

      // Crea una nuova riga per la tabella
      const row = document.createElement("tr");

      // Aggiunge il contenuto della riga con i dettagli della prenotazione
      row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.user_full_name || 'N/D'}</td>
        <td>${booking.user_email}</td>
        <td>${booking.car_name}</td>
        <td><code>${booking.booking_code}</code></td>
        <td>${booking.pickup_location} (${startDate})</td>
        <td>${booking.return_location} (${endDate})</td>
        <td>€${booking.total_price.toFixed(2)}</td>
        <td>
          ${booking.status === 'cancelled' ?
            // Se la prenotazione è cancellata, mostra un badge con lo stato
            '<span class="badge bg-secondary">Cancellato</span>' :
            // Altrimenti, mostra il bottone per eliminare la prenotazione
            `
             <button class="btn btn-danger btn-sm" onclick="deleteBooking(${booking.id})">Elimina</button>`}
        </td>
      `;

      // Aggiunge la riga appena creata alla tabella
      tableBody.appendChild(row);
    });
  } catch (error) {
    // Gestisce eventuali errori di rete o durante il fetch
    console.error("Errore nel caricamento delle prenotazioni:", error);
  }
}

// Funzione per eliminare una prenotazione
async function deleteBooking(id) {
  // Chiede conferma all'utente prima di procedere con l'eliminazione
  if (confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
    try {
      // Recupera il token di autenticazione dall'archiviazione locale
      const token = localStorage.getItem("authToken");

      // Effettua una richiesta DELETE per eliminare la prenotazione dal server
      await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // Include il token di autenticazione nell'header
        }
      });

      // Ricarica la lista delle prenotazioni dopo l'eliminazione
      fetchBookings();
    } catch (error) {
      // Gestisce eventuali errori nell'eliminazione, come la mancanza di permessi
      console.error("Errore eliminazione:", error);
      alert("Non hai i permessi necessari");
    }
  }
}

// Chiama la funzione fetchBookings quando il contenuto della pagina è completamente caricato
document.addEventListener("DOMContentLoaded", fetchBookings);