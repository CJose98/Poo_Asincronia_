/*
1. Definir una clase `Sensor` en el archivo `sensors.js` que permita representar un sensor.
    - Para respetar la estructura de los sensores definida en el archivo `sensors.json`, 
    la clase debe tener las siguientes propiedades:
        - `id`: Identificador del sensor.
        - `name`: Nombre del sensor.
        - `type`: Tipo del sensor.
        - `value`: Valor del sensor.
        - `unit`: Unidad de medida del sensor.
        - `updated_at`: Fecha de actualización del sensor.
    - Implementar la propiedad computada `updateValue` mediante un *setter* que permita actualizar 
    el valor del sensor y la fecha de actualización.
    - Los únicos valores para `type` permitidos son `temperature`, `humidity` y `pressure`.

*/

class Sensor {
    constructor(id, name, type, value, unit, updated_at){
        this.id = id || '';
        this.name = name || '';
        this.type = type || '';
        this.value = value || '';
        this.unit = unit || '';
        this.updated_at = updated_at || '';

    }
    // funcion set valor del sensor
    set updateValue(valor){
        return this.value = valor;
    }
    // funcion set fecha de actualizaion
    set updateAt(modificar){
        return this.updated_at= modificar;
    }
    set updateType(tipo) {
        const allowedTypes = ['temperature', 'humidity', 'pressure'];
        if (!allowedTypes.includes(tipo)) {
            console.log(`Tipo invalido: ${tipo}`)
        }
        this._type = tipo;
    }
}
const sensor_a = new Sensor(1, "Temperature Sensor", "temperature", 20, "°C", "2021-06-01T12:00:00");   

console.log(sensor_a);
console.log(sensor_a.updateValue = 15);
console.log(sensor_a.value)
console.log(sensor_a.updateAt = '2022-06-01T12:00:00');
console.log(sensor_a.updateType = 'temper');
console.log(sensor_a);


class SensorManager {

    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

        /*Para la clase `SensorManager`, la cual se encarga de gestionar los sensores mediante un arreglo, 
se solicita implementar el método `loadSensors` que se encargue de cargar los sensores desde el archivo `sensors.json`.

    - El método debe ser **asíncrono**, puede utilizar `fetch` o `XMLHttpRequest`. Pueden emplear `async/await` o promesas.
    - El método debe recibir la ruta del archivo `sensors.json` como argumento.
    - El método no debe retornar nada, pero debe invocar al método `render` para mostrar los sensores en la página. */

    async loadSensors(url) {
        try {
            // Realiza una solicitud HTTP GET a la URL proporcionada y espera a que se resuelva la promesa.
            const response = await fetch(url);
            // Si la respuesta no es OK (status no en el rango 200-299), lanza un error.
            if (!response.ok) {
                throw new Error('La respuesta no fue OK');
            }
            
            // Convierte la respuesta JSON a un objeto JavaScript y espera a que se resuelva la promesa.
            const data = await response.json();
            // Itera sobre cada elemento en el array `data` y llama al método `addSensor` para cada uno.
            data.forEach(sensorData => this.addSensor(sensorData));
            // Llama al método `render` para actualizar la representación visual o interna de los sensores.
            this.render();  // Llama a render después de cargar los sensores
        } catch {
            console.error('Error de ruta');
        } finally {
            console.log("Petición completada");
        }
    }


    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">º
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }

}

const monitor = new SensorManager();
monitor.loadSensors("sensors.json");


