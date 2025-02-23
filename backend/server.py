# Importazione delle librerie necessarie
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import uuid
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Inizializzazione dell'applicazione Flask con configurazione delle cartelle
app = Flask(__name__, static_folder='../frontend',
            template_folder='../frontend')
CORS(app)  # Abilita CORS per permettere richieste cross-origin

# Configurazioni per l'invio delle email tramite SendGrid
SENDGRID_API_KEY = "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"
DEFAULT_SENDER = "autorent24.7@workmail.com"

# Funzione per l'invio delle email
def send_email(subject, recipient, body):
    try:
        # Creazione del messaggio email
        message = Mail(
            from_email=DEFAULT_SENDER,
            to_emails=recipient,
            subject=subject,
            plain_text_content=body
        )

        # Invio dell'email tramite SendGrid
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(
            f"✅ Email inviata con successo a {recipient} - Status Code: {response.status_code}")
        return True

    except Exception as e:
        # Gestione degli errori durante l'invio dell'email
        print(f"🔥 Errore grave invio email:")
        print(f"- Tipo errore: {type(e).__name__}")
        print(f"- Dettagli: {str(e)}")
        print(
            f"- Info extra: {e.__dict__ if hasattr(e, '__dict__') else 'Nessun dettaglio aggiuntivo'}")
        return False

# Configurazioni del database e chiave segreta
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rental.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definizione del modello Utente
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(50), default='user')  # Ruolo dell'utente (user/admin)

# Definizione del modello Prenotazione
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)
    car_name = db.Column(db.String(100), nullable=False)
    pickup_location = db.Column(db.String(200), nullable=False)
    return_location = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    booking_code = db.Column(db.String(36), unique=True, nullable=False)
    car_type = db.Column(db.String(50))
    car_seats = db.Column(db.Integer)
    car_transmission = db.Column(db.String(50))
    car_fuel = db.Column(db.String(50))
    car_year = db.Column(db.Integer)
    status = db.Column(db.String(50), default='active')  # Stato della prenotazione
    daily_price = db.Column(db.Float, nullable=False)  # Prezzo giornaliero

# Decoratore per verificare i permessi di amministratore
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token mancante"}), 401

        try:
            # Verifica del token JWT
            token = token.split(' ')[1]  # Rimuove "Bearer "
            payload = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user = User.query.filter_by(email=payload['sub']).first()

            if user.role != 'admin':
                return jsonify({"message": "Accesso negato"}), 403

            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token scaduto"}), 401
        except Exception as e:
            return jsonify({"message": "Token non valido"}), 401

    return decorated_function

# Rotte per servire i file frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# API per la registrazione degli utenti
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Verifica dei dati richiesti
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Dati mancanti"}), 400

    # Verifica se l'email è già registrata
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "Email già registrata"}), 409

    # Creazione nuovo utente con password criptata
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'],
        password=hashed_password,
        full_name=data.get('full_name', ''),
        role=data.get('role', 'user')
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registrazione completata con successo"}), 201

# API per il login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    # Verifica credenziali
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Credenziali non valide"}), 401

    # Generazione token JWT
    token = jwt.encode({
        'sub': user.email,
        'exp': datetime.utcnow() + timedelta(hours=2)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    })

# API per la verifica del token
@app.route('/verify-token', methods=['GET'])
def verify_token():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token mancante"}), 401

    try:
        # Decodifica e verifica del token
        token = token.split(' ')[1]
        payload = jwt.decode(
            token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.filter_by(email=payload['sub']).first()

        return jsonify({
            "user": {
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto"}), 401
    except Exception as e:
        return jsonify({"message": "Token non valido"}), 401

# API per la gestione delle prenotazioni
@app.route('/bookings', methods=['GET'])
def get_bookings():
    email = request.args.get('email')
    code = request.args.get('code')

    if email and code:
        # Ricerca prenotazione specifica
        booking = Booking.query.filter_by(
            user_email=email,
            booking_code=code,
            status='active'
        ).first()

        if not booking:
            return jsonify({"message": "Nessuna prenotazione attiva trovata"}), 404

        # Restituzione dettagli prenotazione
        return jsonify({
            "user_email": booking.user_email,
            "car_name": booking.car_name,
            "car_make": booking.car_name.split()[0],
            "car_model": ' '.join(booking.car_name.split()[1:]),
            "pickup_location": booking.pickup_location,
            "return_location": booking.return_location,
            "start_date": booking.start_date.isoformat(),
            "end_date": booking.end_date.isoformat(),
            "total_price": booking.total_price,
            "booking_code": booking.booking_code,
            "status": booking.status,
            "car_details": {
                "type": booking.car_type,
                "seats": booking.car_seats,
                "transmission": booking.car_transmission,
                "fuel": booking.car_fuel,
                "year": booking.car_year
            }
        })

    # Lista di tutte le prenotazioni con dati utente
    bookings = db.session.query(
        Booking,
        User.full_name
    ).outerjoin(
        User,
        Booking.user_email == User.email
    ).all()

    result = []
    for booking, full_name in bookings:
        result.append({
            "id": booking.id,
            "user_email": booking.user_email,
            "user_full_name": full_name or "N/A",
            "car_name": booking.car_name,
            "pickup_location": booking.pickup_location,
            "return_location": booking.return_location,
            "start_date": booking.start_date.isoformat(),
            "end_date": booking.end_date.isoformat(),
            "total_price": booking.total_price,
            "booking_code": booking.booking_code,
            "status": booking.status
        })

    return jsonify(result)

# API per la creazione di una nuova prenotazione
@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    # Verifica campi obbligatori
    required_fields = ['user_email', 'car_name', 'pickup_location',
                       'return_location', 'start_date', 'end_date',
                       'total_price', 'car_type', 'car_seats',
                       'car_transmission', 'car_fuel', 'car_year']

    if not all(field in data for field in required_fields):
        return jsonify({"message": "Dati mancanti"}), 400

    try:
        booking_code = str(uuid.uuid4())

        # Calcolo durata e prezzo giornaliero
        start_date = datetime.fromisoformat(data['start_date'])
        end_date = datetime.fromisoformat(data['end_date'])
        days = (end_date - start_date).days
        if days <= 0:
            return jsonify({"message": "Durata non valida"}), 400

        daily_price = data['total_price'] / days

        # Creazione nuova prenotazione
        new_booking = Booking(
            user_email=data['user_email'],
            car_name=data['car_name'],
            pickup_location=data['pickup_location'],
            return_location=data['return_location'],
            start_date=start_date,
            end_date=end_date,
            total_price=data['total_price'],
            daily_price=daily_price,
            booking_code=booking_code,
            car_type=data['car_type'],
            car_seats=data['car_seats'],
            car_transmission=data['car_transmission'],
            car_fuel=data['car_fuel'],
            car_year=data['car_year']
        )

        db.session.add(new_booking)
        db.session.commit()

        # Invio email di conferma
        email_subject = "Conferma Prenotazione AUTORENT24/7"
        email_body = f"""Grazie per aver scelto AUTORENT24/7!

🔑 Codice prenotazione: {booking_code}
🚗 Veicolo: {new_booking.car_name}
💰 Prezzo giornaliero: €{daily_price:.2f}
📅 Ritiro: {new_booking.start_date.strftime('%d/%m/%Y %H:%M')} - {new_booking.pickup_location}
📅 Restituzione: {new_booking.end_date.strftime('%d/%m/%Y %H:%M')} - {new_booking.return_location}
💶 Importo totale: €{new_booking.total_price:.2f}

📞 +39 123 456 789
✉️ support@autorent24-7.com
"""

        email_sent = send_email(
            email_subject, new_booking.user_email, email_body)

        return jsonify({
            "message": "Prenotazione creata con successo",
            "id": new_booking.id,
            "booking_code": booking_code,
            "daily_price": daily_price,
            "email_sent": email_sent
        }), 201

    except Exception as e:
        print(f"🔥 Errore creazione prenotazione: {str(e)}")
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

# API per la cancellazione di una prenotazione (solo admin)
@app.route('/bookings/<int:id>', methods=['DELETE'])
@admin_required
def delete_booking(id):
    booking = Booking.query.get(id)
    if not booking:
        return jsonify({"message": "Prenotazione non trovata"}), 404

    try:
        # Recupero dati prenotazione
        user_email = booking.user_email
        booking_code = booking.booking_code
        car_name = booking.car_name
        original_start_date = booking.start_date.strftime('%d/%m/%Y %H:%M')

        # Aggiornamento stato
        booking.status = 'cancelled'
        db.session.commit()

        # Invio email di notifica cancellazione
        email_subject = "Cancellazione Prenotazione AUTORENT24/7"
        email_body = f"""Gentile Cliente,

La informiamo che la seguente prenotazione è stata cancellata:

🔑 Codice prenotazione: {booking_code}
🚗 Veicolo: {car_name}
📅 Data prevista ritiro: {original_start_date}

Se la cancellazione è avvenuta per nostra iniziativa, verrà effettuato un rimborso completo entro 5-7 giorni lavorativi.

Per qualsiasi chiarimento:
📞 +39 123 456 789
✉️ support@autorent24-7.com

Ci scusiamo per il disagio.

Team AUTORENT24/7
"""

        email_sent = send_email(email_subject, user_email, email_body)

        return jsonify({
            "message": "Prenotazione cancellata con successo",
            "email_sent": email_sent
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# API per la gestione delle prenotazioni utente (modifica/cancellazione)
@app.route('/bookings/<string:booking_code>', methods=['PUT', 'DELETE'])
def manage_user_booking(booking_code):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token mancante"}), 401

    try:
        # Verifica autenticazione utente
        token = token.split(' ')[1]
        payload = jwt.decode(
            token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_email = payload['sub']

        # Ricerca prenotazione attiva
        booking = Booking.query.filter_by(
            booking_code=booking_code,
            user_email=user_email,
            status='active'
        ).first()

        if not booking:
            return jsonify({"message": "Prenotazione non trovata"}), 404

        if request.method == 'PUT':
            # Modifica prenotazione
            data = request.get_json()

            # Calcolo nuova durata e prezzo
            new_start = datetime.fromisoformat(data.get('start_date'))
            new_end = datetime.fromisoformat(data.get('end_date'))
            new_days = (new_end - new_start).days

            if new_days <= 0:
                return jsonify({"message": "Date non valide"}), 400

            original_days = (booking.end_date - booking.start_date).days
            daily_price = booking.total_price / original_days
            new_total = daily_price * new_days

            # Aggiornamento dati prenotazione
            booking.pickup_location = data.get(
                'pickup_location', booking.pickup_location)
            booking.return_location = data.get(
                'return_location', booking.return_location)
            booking.start_date = new_start
            booking.end_date = new_end
            booking.total_price = new_total

            db.session.commit()

            # Invio email di conferma modifica
            email_subject = "Modifica Prenotazione AUTORENT24/7"
            email_body = f"""Gentile Cliente,

La informiamo che la sua prenotazione è stata modificata:

🔑 Codice prenotazione: {booking.booking_code}
🚗 Veicolo: {booking.car_name}
📅 Nuovo ritiro: {booking.start_date.strftime('%d/%m/%Y %H:%M')} - {booking.pickup_location}
📅 Nuova restituzione: {booking.end_date.strftime('%d/%m/%Y %H:%M')} - {booking.return_location}
💶 Nuovo importo totale: €{booking.total_price:.2f}

Dettagli modifiche:
- Prezzo giornaliero: €{daily_price:.2f}
- Durata noleggio: {new_days} giorni

Per qualsiasi chiarimento:
📞 +39 123 456 789
✉️ support@autorent24-7.com

Grazie per aver scelto AUTORENT24/7!
"""

            email_sent = send_email(email_subject, user_email, email_body)

            return jsonify({
                "message": "Prenotazione aggiornata",
                "booking": {
                    "booking_code": booking.booking_code,
                    "new_total": booking.total_price
                },
                "email_sent": email_sent
            })

        elif request.method == 'DELETE':
            # Cancellazione prenotazione
            booking.status = 'cancelled'
            db.session.commit()

            # Invio email di conferma cancellazione
            send_email(
                "Cancellazione Prenotazione Confermata",
                user_email,
                f"""Gentile Cliente,\n\n
La prenotazione {booking_code} è stata annullata correttamente.\n\n
**Dettagli Cancellazione:**\n
• Codice: {booking_code}\n
• Data cancellazione: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n
• Rimborso previsto: 5-7 giorni lavorativi\n\n
Per qualsiasi domanda o assistenza:\n
📞 +39 02 123 4567\n
✉️ assistenza@autorent24-7.it\n\n
Cordiali saluti,\n
Il Team di AUTORENT24/7"""
            )

            return jsonify({"message": "Prenotazione cancellata"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Inizializzazione del database e creazione admin
with app.app_context():
    db.create_all()

    # Verifica esistenza admin
    admin_email = 'virgilianionascu@gmail.com'
    existing_admin = User.query.filter_by(email=admin_email).first()

    if not existing_admin:
        # Creazione admin se non esiste
        hashed_password = generate_password_hash('securepassword')
        new_admin = User(
            email=admin_email,
            password=hashed_password,
            full_name='Virgilian Ionascu',
            role='admin'
        )

        db.session.add(new_admin)
        db.session.commit()
        print(f"Admin creato: {admin_email}")
    else:
        print(f"L'admin con email {admin_email} esiste già.")

# Avvio dell'applicazione
if __name__ == '__main__':
    app.run(debug=True)
