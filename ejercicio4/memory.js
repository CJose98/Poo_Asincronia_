class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }
    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }
    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }
/*💎🎨Cambia el estado de volteo de la carta en función de su estado actual.*/
    toggleFlip(){
        console.log("****OPERACION****")
        const select = this.element.querySelector(".card");
        console.log("tipo: ", select.classList.value); // 1 forma (select.classList.value == "card")
        console.log("valor: ", this.isFlipped);        // 2 forma
        if (!this.isFlipped){       
            console.log("vemos la carta")
            this.#flip();
            this.isFlipped = true
        }else{
            console.log("removemos la carta")
            this.#unflip();
            this.isFlipped = false
    }}
/*💎🎨Verifica si la carta actual coincide con otra carta. */
    matches(otherCard){
        return this.name === otherCard.name
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }
    //calcula el número de columnas del tablero en función del número de cartas
    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }
        return columns;
    }
    //establece el número de columnas del tablero
    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }
    //renderiza las cartas en el tablero
    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }
    //maneja el evento de clic en una carta
    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }}
/*Mezcla las cartas del tablero. 
  El criterio de mezcla esta dispuesto a elección del estudiante.
  mezclar matrices en JavaScript*/
    shuffleCards(){
        //Algoritmo aleatorio de Fisher-Yates
        for (let i= this.cards.length -1; i > 0; i--){
            const j = Math.floor(Math.random() * (i-1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        this.render(); //volver a renderizar el tablero despues de barajar
    }
//Implementar el método `reset()` que reinicia el tablero.
    reset(){
        this.shuffleCards();    //Baraja las cartas
        this.flipDownAllCards();//Voltea todas las cartas hacia abajo
    }
/*posiciona todas las cartas en su estado inicial. 
  Es necesario para reiniciar el tablero. */
    flipDownAllCards(){
        this.cards.forEach(card => {
            if (card.isFlipped) {
                card.toggleFlip();
        }})
    }
}


class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;     //tablero
        this.flippedCards = []; //conjunto de cartas volteadas
        this.matchedCards = []; //conjunto de cartas emparejadas

        //duración de animación para voltear las cartas
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }
    /*define la interacción del usuario con las cartas, 
    evitando que se volteen más de dos cartas a la vez */
    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }
    /*verifica si las cartas volteadas coinciden.
    En caso de coincidir, las cartas deben ser añadidas 
    al conjunto de cartas emparejadas*/
    checkForMatch(){
        if (this.flippedCards.length === 2){
            if (this.flippedCards[0].id === this.flippedCards[1].id){
                this.matchedCards.push(this.flippedCards[0], this.flippedCards[1])
            }
            this.flippedCards = [];
        }}
    /*reinicia el juego. 
    Debe emplear otros métodos de la clase `MemoryGame` para realizar esta tarea. */
    resetGame(){
        this.board.reset();
        this.flippedCards = [];
        this.matchedCards = [];
        console.log("reinicio")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
