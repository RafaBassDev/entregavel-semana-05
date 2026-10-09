// Manipulação e Validação de Dados

const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 75.50, status: "pendente" },
    { cliente: "Ana", valor: 200, status: "pago" },
    { cliente: "", valor: 50, status: "pago" },
    { cliente: "Lucas", valor: -20, status: "pago" },
    { cliente: "Marina", valor: "90", status: "pago" }
];

function pedidoValido(pedido) {
    const clienteValido =
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "";

    const valorValido =
        typeof pedido.valor === "number" &&
        pedido.valor > 0;

    return clienteValido && valorValido;
}

const pedidosValidos = pedidos.filter(pedidoValido);

console.log("Pedidos válidos:", pedidosValidos);


const pedidosPagos = pedidosValidos.filter(function (pedido) {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:", pedidosPagos);


const totalFaturado = pedidosPagos.reduce(function (total, pedido) {
    return total + pedido.valor;
}, 0);

console.log(
    "Total faturado:",
    `R$ ${totalFaturado.toFixed(2)}`
);


const textosPedidos = pedidosPagos.map(function (pedido) {
    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Pedidos formatados:");

textosPedidos.forEach(function (texto) {
    console.log(texto);
});

// Buscador de CEP

const cepForm = document.querySelector("#cep-form");
const cepInput = document.querySelector("#cep");
const cepBotao = document.querySelector("#cep-botao");
const cepStatus = document.querySelector("#cep-status");
const cepResultado = document.querySelector("#cep-resultado");
const historicoLista = document.querySelector("#historico-lista");

const historicoCEPs = [];


function criarCampoCEP(titulo, valor) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");

    dt.textContent = titulo;
    dd.textContent = valor || "Não informado";

    cepResultado.append(dt, dd);
}


function atualizarHistorico() {
    historicoLista.replaceChildren();

    historicoCEPs.forEach(function (item) {
        const li = document.createElement("li");

        li.textContent =
            `${item.cep} — ${item.cidade}/${item.uf}`;

        historicoLista.append(li);
    });
}


cepForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const valorDigitado = cepInput.value.trim();

    const cepLimpo = valorDigitado.replace(/\D/g, "");


    if (!/^\d{8}$/.test(cepLimpo)) {

        cepResultado.replaceChildren();

        cepStatus.textContent =
            "Digite um CEP válido com 8 números.";

        return;
    }


    cepResultado.replaceChildren();

    cepStatus.textContent = "Buscando...";

    cepBotao.disabled = true;


    try {

        const response = await fetch(
            `https://viacep.com.br/ws/${cepLimpo}/json/`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );


        if (!response.ok) {
            throw new Error("Erro HTTP");
        }


        const dados = await response.json();


        if (dados.erro) {

            cepResultado.replaceChildren();

            cepStatus.textContent =
                "CEP não encontrado";

            return;
        }


        cepResultado.replaceChildren();


        criarCampoCEP(
            "Rua:",
            dados.logradouro
        );

        criarCampoCEP(
            "Bairro:",
            dados.bairro
        );

        criarCampoCEP(
            "Cidade:",
            dados.localidade
        );

        criarCampoCEP(
            "UF:",
            dados.uf
        );


        cepStatus.textContent = "";


        historicoCEPs.push({
            cep: cepLimpo,
            cidade: dados.localidade,
            uf: dados.uf
        });


        atualizarHistorico();

    } catch (erro) {

        console.error(erro);

        cepResultado.replaceChildren();

        cepStatus.textContent =
            "Falha na conexão. Tente novamente.";

    } finally {

        cepBotao.disabled = false;
    }

});

// Mini Pokédex

const pokemonForm = document.querySelector("#pokemon-form");
const pokemonInput = document.querySelector("#pokemon");
const pokemonBotao = document.querySelector("#pokemon-botao");
const pokemonStatus = document.querySelector("#pokemon-status");
const pokemonResultado = document.querySelector("#pokemon-resultado");


pokemonForm.addEventListener("submit", async function (e) {

    e.preventDefault();


    const nome = pokemonInput.value
        .trim()
        .toLowerCase();


    if (nome === "") {

        pokemonResultado.replaceChildren();

        pokemonStatus.textContent =
            "Digite o nome de um Pokémon.";

        return;
    }


    pokemonResultado.replaceChildren();

    pokemonStatus.textContent = "Buscando...";

    pokemonBotao.disabled = true;


    try {

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`
        );


        if (response.status === 404) {

            pokemonResultado.replaceChildren();

            pokemonStatus.textContent =
                "Pokémon não encontrado";

            return;
        }


        if (!response.ok) {

            throw new Error("Erro HTTP");

        }


        const dados = await response.json();


        pokemonResultado.replaceChildren();


        const titulo = document.createElement("h3");

        titulo.textContent = dados.name;

        pokemonResultado.append(titulo);


        if (dados.sprites.front_default) {

            const imagem = document.createElement("img");

            imagem.src = dados.sprites.front_default;

            imagem.alt =
                `Imagem do Pokémon ${dados.name}`;

            pokemonResultado.append(imagem);
        }


        const tipos = document.createElement("p");


        const nomesTipos = dados.types.map(function (item) {

            return item.type.name;

        });


        tipos.textContent =
            `Tipos: ${nomesTipos.join(", ")}`;


        pokemonResultado.append(tipos);


        pokemonStatus.textContent = "";


    } catch (erro) {

        console.error(erro);

        pokemonResultado.replaceChildren();

        pokemonStatus.textContent =
            "Falha na conexão. Tente novamente.";


    } finally {

        pokemonBotao.disabled = false;

    }

});