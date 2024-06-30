/*1. Definir una clase `Customer` en el archivo `reservations.js` que permita representar un cliente.
    - La clase debe tener las siguientes propiedades:
        - `id`: Identificador del cliente.
        - `name`: Nombre del cliente.
        - `email`: Correo electrónico del cliente.
    - La clase debe tener un constructor.
    - Se debe implementar una propiedad computada `info` que retorne una cadena con el nombre y el correo electrónico del cliente. 
*/

class Customer {
    constructor(id,name,email){
        this.id = id || '';
        this.name = name || '';
        this.email = email || '';
    }
    info() {
        console.log(`Informacion sobre el cliente; Nombre :${this.name}, Email :${this.email}`)
    }
}
//perso = new Customer(1, 'Jose', 'colquejose53@gmail.com');
//perso.info();


/*
2. Definir una clase `Reservation` en el archivo `reservations.js` que permita representar una reserva.
    - La clase debe tener las siguientes propiedades:
        - `id`: Identificador de la reserva.
        - `customer`: instancia de la clase `Customer` que realiza la reserva.
        - `date`: Fecha y hora de la reserva.
        - `guests`: Número de comensales de la reserva.
    - La clase debe tener un constructor.
    - Se debe implementar una propiedad computada `info` que retorne una cadena con la fecha y hora de la reserva, 
    la información del cliente y el número de comensales.
    - Se debe implementar un método estático `validateReservation` que reciba un objeto con la información de la reserva 
    y retorne `true` si la información es válida y `false` en caso contrario. 
    Si la fecha de la reserva es anterior a la fecha actual y la cantidad de comensales es menor o igual a 0, la reserva no es válida. */
class Reservation extends Customer{
    constructor(id_reserva,customer,date,guests){
         // Llama al constructor de Customer
        super(customer.id, customer.name, customer.email)
            this.id = id_reserva;
            this.date = date;
            this.guests = guests;
    };

    info(){
      return `Info de la reserva: Fecha y Hora: ${this.date}, Nombre: ${this.name}, Email: ${this.email}, Nª Comensal: ${this.guests}`;
    };
    static validateReservation(reservationDate, guests){
        const now = new Date();
        const reserva = new Date(reservationDate); // Convertir la cadena a un objeto Date para la comparación
        console.log(`hoy: ${now}`);
        console.log(`reserva: ${reserva}`);
        return reserva >= now && guests >= 0;
    };
}
//const c1 = new Customer(1,"pedro","@gmail");
//const reserva = new Reservation(2, c1, "2024-06-27T23:50:00", 5);
//reserva.infoReserva();
//console.log(Reservation.validateReservation(reserva.date, reserva.guests)) // TRABAJAMOS con el OBJETO




class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info()}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document.getElementById("reservation-form")
        .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });
const restaurant = new Restaurant("El Lojal Kolinar");
const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2028-07-28T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}



//const c1 = new Customer(1,"pedro","@gmail");
//const reserva = new Reservation(2, c1, "2024-06-27T23:50:00", 5);
//reserva.infoReserva();
//console.log(Reservation.validateReservation(reserva.date, reserva.guests)) // TRABAJAMOS con el OBJETO