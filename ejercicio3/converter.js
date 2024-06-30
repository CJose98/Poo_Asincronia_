class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}
/*Además, se solicita que la clase `CurrencyConverter` sea implementada. La clase debe contar con los siguientes atributos:

- `apiUrl`: URL base de la API de Frankfurter.
- `currencies`: arreglo que almacenará instancias de la clase `Currency`. 
               Al instanciar un objeto de esta clase, el arreglo `currencies` debe estar vacío. 
1. `constructor`: Constructor de la clase que inicializa el atributo `apiUrl` con la URL base de la API de Frankfurter.

    - El constructor recibe un parámetro `apiUrl` que corresponde a la URL base de la API de Frankfurter.
    - El constructor debe inicializar el atributo `currencies` como un arreglo vacío.*/

class CurrencyConverter extends Currency{
    constructor(apiUrl, code, name) { 
        super(code, name);
            this.apiUrl = apiUrl || 'https://www.frankfurter.app/';
            this.currencies = [];
    }
    /*2. `getCurrencies`: Método asíncrono que realiza una petición al endpoint `/currencies` de la API de Frankfurter 
        para obtener la lista de códigos de monedas disponibles.

    - El método no recibe parámetros.
    - El método debe almacenar las monedas obtenidas en el atributo `currencies` como instancias de la clase `Currency`.
    - El método no retorna nada. */

    async getCurrencies() {
        try {
            const response = await fetch('https://www.frankfurter.app/currencies')
            if (!response.ok){
                throw new Error('La respuesta no fue resuelta')
            }
            const data = await response.json();
            console.log(`DATOS: ${JSON.stringify(data)}`)

            for (const [key, value] of Object.entries(data)){
                const currencyData = new Currency(key, value);
                this.currencies.push(currencyData);
                //console.log(`Instancia: ${this.currencyData}`)
            }
        }catch{
            console.error('Error al obtener los datos getCurrience');
        }finally{
            console.log("Petición completada");
        }

    }
/*3. `convertCurrency`: Método asíncrono que realiza una petición al endpoint `/latest` de la API de Frankfurter 
                       para obtener la conversión de una moneda a otra.

    - El método recibe los siguientes parámetros:
        - `amount`: monto a convertir, un número.
        - `fromCurrency`: código de la moneda de origen, una instancia de la clase `Currency`.
        - `toCurrency`: código de la moneda de destino, una instancia de la clase `Currency`.
    - Dependiendo de los parámetros recibidos, el método debe realizar diferentes acciones:
        - Si el atributo `code` de `fromCurrency` es igual al atributo `code` de `toCurrency`, 
          el método debe retornar el monto sin realizar ninguna petición.
        - Si los códigos de moneda son diferentes, el método debe realizar una petición HTTP a la API 
          y retornar el monto convertido, el cual es un número.
        - El método debe manejar errores en caso de que la petición falle y retornar `null` en caso de error. */
    async convertCurrency(amount, fromCurrency, toCurrency) {
        
        try {
            if (fromCurrency == toCurrency){
                console.log(`retorno sin cambio: ${amount}`)
                return amount;
            }else {
                const host = 'api.frankfurter.app';
                var origen;
                var destino;
                for (const [key, value] of Object.entries(fromCurrency)){
                    if (key == "code"){
                        origen = value
                }}
                for (const [key, value] of Object.entries(toCurrency)){
                    if (key == "code"){
                        destino = value
                }}
                console.log(`DATOS HTML: ${amount}, ${origen}, ${destino}`)
                const response = await fetch(`https://${host}/latest?amount=${amount}&from=${origen}&to=${destino}`)
                if (!response.ok){
                    throw new Error('La respuesta no fue resuelta')
                }
                const data = await response.json();
                console.log(`DATOS: ${JSON.stringify(data)}`)

                for (const [key, value] of Object.entries(data)){
                    if (key == "rates"){
                        for (const [key_2, value_2] of Object.entries(value)){
                            console.log(`DATOS: ${JSON.stringify(value_2)}`)
                            return value_2;
                }}}
            }
        } catch{
            console.error('Error al obtener los datos en convertCurrency');
        } finally{
            console.log("Petición completada");
        }
    }
}
//LLAMA A LA FUNCION getCurrencies
const convert = new CurrencyConverter();
convert.getCurrencies();

const origen = new Currency("GBP", "British Pound");
const destino = new Currency("USD", "United States Dollar");
convert.convertCurrency(100, origen, destino);



document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            if (convertedAmount != amount){
                resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
            }else {
                resultDiv.textContent = `${convertedAmount} ${fromCurrency.code}`
            }
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
