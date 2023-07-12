const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const modalContainer = document.getElementById("modal");
let apiURL = "https://pokeapi.co/api/v2/pokemon/";
let pokemonDataFetched = false;


//recolectar la info de los pokemon desde el API
for (let i = 1; i <= 200; i++){
    fetch(apiURL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}
pokemonDataFetched = true;


//Mostrar los pokemon (vista principal)
function mostrarPokemon(data) {

    //convertir peso/altura a las unidades correctas
    let unidadAltura = "m";
    let altura = (data.height/10);

    if (altura < 1){
        unidadAltura = "cm";
        altura *= 100;
    }

    let tipos = data.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <button class="verDetalles">
            <p class="pokemon-id-back">${data.id}</p>
            <div class="pokemon-imagen">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">${data.id}</p>
                    <h2 class="pokemon-nombre">${data.name}</h2>
                </div>
                <div class="pokemon-tipos">
                    ${tipos}
                </div>
                <div class="pokemon-stats">
                    <p class="stat">${altura + unidadAltura}</p>
                    <p class="stat">${(data.weight/10)} kg</p>
                </div>
            </div>
        </button>
    `;

        // Agregar evento al botón
    const button = div.querySelector(".verDetalles");
    button.addEventListener("click", () => {
        // Lógica para mostrar el modal o activar alguna acción
        console.log("click en tarjeta");
        activarModal(data.id);
    });

    listaPokemon.append(div);
}

function activarModal(id) {
    // traer los elementos del modal
    
    const tarjetaModal = document.getElementById("modal");
    const pokeIdModal = document.getElementById("pkIdModal");
    const pokeTipoModal = document.getElementById("pkTipoModal");
    const pokeNombreModal = document.getElementById("pkNombreModal");
    const imagenPokemon = document.getElementById("pokefotoModal");
    const salud = document.getElementById("hp");
    const ataque = document.getElementById("ataque");
    const defensa = document.getElementById("defensa");
    const specAt = document.getElementById("specAt");
    const specDf = document.getElementById("specDf");
    const velocidad = document.getElementById("velocidad");

    //completar la URL del pokemon a mostrar
    const pokeABuscarAPI = `https://pokeapi.co/api/v2/pokemon/${id}`;

    //traer info del API
    fetch(pokeABuscarAPI)
        .then((response) => {
            if (response.ok){
                return response.json();
            } else {
                throw new Error("Pokemon not found");
            }
        })
        .then((data) => {
            console.log(data);
            pokeIdModal.innerHTML = `${data.id}`;
            const tipos = data.types.map(type => type.type.name);
            const tiposTexto = tipos.join(", ");
            pokeTipoModal.innerHTML = tiposTexto;
            pokeNombreModal.innerHTML = `${data.name}`;
            imagenPokemon.src = `${data.sprites.other["official-artwork"].front_default}`;
            salud.innerHTML = `HP: ${data.stats[0].base_stat}`;
            ataque.innerHTML = `Attack: ${data.stats[1].base_stat}`;
            defensa.innerHTML = `Defense: ${data.stats[2].base_stat}`;
            specAt.innerHTML = `Special-attack: ${data.stats[3].base_stat}`;
            specDf.innerHTML = `Special-defense: ${data.stats[4].base_stat}`;
            velocidad.innerHTML = `Speed: ${data.stats[5].base_stat}`;
            tarjetaModal.style.display = "block";
        })
}

modalContainer.addEventListener("click", function(event){
    if (event.target === modalContainer) {
        modalContainer.style.display = "none"; // cierra el modal al hacer click fuera de él    
    }
});

// Función de búsqueda de Pokémon
const buscaPokemon = (event) => {
    event.preventDefault();
    const searchValue = event.target.pokemon.value.toLowerCase();

    // Limpiar la lista de Pokémon antes de realizar la búsqueda
    listaPokemon.innerHTML = "";

    // Realizar la búsqueda del Pokémon por nombre
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Pokemon not found");
            }
        })
        .then((data) => {
            mostrarPokemon(data);
        })
        .catch((err) => {
            console.log(err);
            renderNotFound();
        });
    }

const renderNotFound = () => {
    alert("Not Found");
    }

// Asociar el evento de envío del formulario a la función de búsqueda
const buscarForm = document.getElementById("buscarPokemon");

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 200; i++) {
        fetch(apiURL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }
            })
        }
    }
))