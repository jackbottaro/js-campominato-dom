console.log('JS OK');
/* 
TRACCIA:
L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49

Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una b.

BONUS:
1- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste
2- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
*/




// # RECUPERO GLI ELEMENTI
const playButton = document.getElementById('play');
const choice = document.getElementById('choice');
const grid = document.getElementById('grid');
const result = document.getElementById('result');



function play() {
    // Cambio testo al bottone
    playButton.innerText = 'Ricomincia';

    // Resetto il contenuto di grid e result
    grid.innerHTML = '';
    result.innerHTML = '';

    // Creo varibiale con numero bombe
    let attempts = 0;
    const totalBombs = 16;

    // Recupero value difficolta
    const level = document.getElementById('level').value;

    // In base alla difficoltà calcolo numero totale delle celle
    let totalCells;
    let cellsPerRow;

    switch (level) {
        case 'easy':
            totalCells = 100;
            break;
        case 'hard':
            totalCells = 49;
            break;
        default:
            totalCells = 81;
    }

    // Calcolo il numero di cell
    cellsPerRow = Math.sqrt(totalCells);

    // Creo variabile per stabilire il punteggio
    const maxChances = totalCells - totalBombs;

    let bombs = [];

    // LISTA FUNZIONI

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateBombs = (totalBombs, totalNumber) => {
        const bombs = [];
        while (bombs.length < totalBombs) {
            const randNumber = getRandomNumber(1, totalNumber);
            if (!bombs.includes(randNumber)) {
                bombs.push(randNumber);
            }
        }
        return bombs;
    }

    const gameOver = (bombs, attempts, hasLost) => {
        const allCells = grid.querySelectorAll('.cell');

        for (let i = 0; i < allCells.length; i++) {
            allCells[i].removeEventListener('click', onCellClick);
        }

        showBoms(bombs);

        // Mostro in pagina il risultato delle partita
        const message = document.createElement('h3');
        message.className = 'message';
        const messageText = hasLost ? `Hai perso 😞 ma puoi sempre riprovare <br>Punteggio: ${attempts}` : `Hai vinto 🥳`
        message.innerHTML = messageText;
        result.appendChild(message);
    }

    const showBoms = (bombs) => {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < totalCells; i++) {
            const cell = cells[i];
            const cellNumber = parseInt(cell.innerText);
            if (bombs.includes(cellNumber)) {
                cell.classList.add('bomb');
            }
        }
    }

    function onCellClick(event) {
        const cell = event.target;
        cell.removeEventListener("click", onCellClick);

        // Controllo se la cella cliccata fa parte del array delle bombe
        let number = parseInt(cell.id);

        if (bombs.includes(number)) {
            gameOver(bombs, attempts, true);
        } else {
            cell.classList.add("safe")
            attempts++;
            if (attempts === maxChances) {
                gameOver(bombs, attempts, false);
            }
        }
    }

    const generateGrid = (cellsNumber, cellsPerRow, bombs) => {
        for (let i = 1; i <= cellsNumber; i++) {
            const cell = createCell(i, cellsPerRow);
            cell.addEventListener('click', onCellClick);
            grid.appendChild(cell);
        }
    }

    function createCell(cellNumber, cellsPerRow) {
        const cell = document.createElement("div");
        cell.id = cellNumber;
        cell.className = "cell";
        cell.innerText = cellNumber;
        const wh = `calc(100% / ${cellsPerRow})`;
        cell.style.height = wh;
        cell.style.width = wh;
        return cell;
    }


    bombs = generateBombs(totalBombs, totalCells)
    generateGrid(totalCells, cellsPerRow, bombs);
};


// addEventListener al button
playButton.addEventListener("click", ()=> play());