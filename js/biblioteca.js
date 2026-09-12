// =====================================================
// URL DE GOOGLE APPS SCRIPT
// =====================================================

const URL_BIBLIOTECA =
    "https://script.google.com/macros/s/AKfycbzGrhS1bQXsMoW-3o7SXUWkPy0te5jGPXt4lq_lEalWiLDE4lELiooT3zxSwb-wQWjt/exec";

let libros = [];


// =====================================================
// CARGAR LIBROS
// =====================================================

async function cargarLibros() {

    const lista = document.getElementById("listaLibros");
    const cantidad = document.getElementById("cantidadLibros");

    if (!lista || !cantidad) {
        return;
    }

    lista.innerHTML =
        '<tr><td colspan="7">⏳ Conectando con Google Apps Script...</td></tr>';

    cantidad.textContent = "Conectando...";

    const MAX_INTENTOS = 3;

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {

        try {

            console.log(
                "Intento de conexión:",
                intento,
                "de",
                MAX_INTENTOS
            );

            const respuesta = await fetch(
                URL_BIBLIOTECA + "?t=" + Date.now(),
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

            console.log("Respuesta:", respuesta);

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const texto = await respuesta.text();

            console.log("Texto recibido:");
            console.log(texto);

            const datos = JSON.parse(texto);

            if (datos.ok !== true) {

                throw new Error(
                    datos.mensaje ||
                    "Google Apps Script devolvió un error."
                );

            }

            libros = datos.libros || [];

            console.log(
                "Libros recibidos:",
                libros.length
            );

            mostrarLibros(libros);

            cantidad.textContent =
                "🟢 Conectado. " +
                libros.length +
                " libro(s) cargado(s).";

            return;

        } catch (error) {

            console.error(
                "Intento " + intento + " fallido:",
                error
            );

            if (intento < MAX_INTENTOS) {

                lista.innerHTML =
                    '<tr><td colspan="7">⏳ Conexión temporalmente no disponible. Reintentando...</td></tr>';

                cantidad.textContent =
                    "Reintentando conexión...";

                await new Promise(function (resolver) {

                    setTimeout(resolver, 2000);

                });

            } else {

                lista.innerHTML =
                    '<tr><td colspan="7">🔴 No se pudo conectar con Google Apps Script.</td></tr>';

                cantidad.textContent =
                    "Error de conexión.";

                console.error(
                    "Se agotaron los intentos de conexión."
                );

            }

        }

    }

}
// =====================================================
// MOSTRAR LIBROS
// =====================================================

function mostrarLibros(listaLibros) {

    const lista = document.getElementById("listaLibros");
    const cantidad = document.getElementById("cantidadLibros");

    if (!lista || !cantidad) {
        return;
    }

    lista.innerHTML = "";

    cantidad.textContent =
        "Cantidad de libros: " + listaLibros.length;


    if (listaLibros.length === 0) {

        lista.innerHTML =
            '<tr><td colspan="7">No hay libros registrados.</td></tr>';

        return;
    }


    listaLibros.forEach(function (libro) {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${escaparHTML(libro.titulo)}</td>

            <td>${escaparHTML(libro.autor)}</td>

            <td>${escaparHTML(libro.editorial)}</td>

            <td>${escaparHTML(libro.anio)}</td>

            <td>${escaparHTML(libro.isbn)}</td>

            <td>${escaparHTML(libro.categoria)}</td>

            <td>

                <button
                    class="boton-eliminar"
                    onclick="eliminarLibro('${escaparHTML(libro.id)}')">

                    🗑️ Eliminar

                </button>

            </td>

        `;

        lista.appendChild(fila);

    });

}


// =====================================================
// BUSCAR LIBROS
// =====================================================

function filtrarLibros() {

    const campo = document.getElementById("buscarLibro");

    if (!campo) {
        return;
    }

    const texto =
        campo.value
            .toLowerCase()
            .trim();


    const resultados =
        libros.filter(function (libro) {

            return (

                String(libro.titulo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(libro.autor || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(libro.isbn || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(libro.categoria || "")
                    .toLowerCase()
                    .includes(texto)

            );

        });


    mostrarLibros(resultados);

}


// =====================================================
// AGREGAR LIBRO
// =====================================================

async function agregarLibro() {

    const titulo =
        document.getElementById("tituloLibro").value.trim();

    const autor =
        document.getElementById("autorLibro").value.trim();

    const editorial =
        document.getElementById("editorialLibro").value.trim();

    const anio =
        document.getElementById("anioLibro").value.trim();

    const isbn =
        document.getElementById("isbnLibro").value.trim();

    const categoria =
        document.getElementById("categoriaLibro").value.trim();


    const mensaje =
        document.getElementById("mensajeBiblioteca");

    const error =
        document.getElementById("errorBiblioteca");


    mensaje.style.display = "none";
    error.style.display = "none";


    if (titulo === "") {

        mostrarErrorBiblioteca(
            "Ingresá el título del libro."
        );

        return;
    }


    if (autor === "") {

        mostrarErrorBiblioteca(
            "Ingresá el autor del libro."
        );

        return;
    }


    try {
        console.log("INICIO: enviando libro a Google Sheets");
        const respuesta =
            await fetch(
                URL_BIBLIOTECA,
                {
                    method: "POST",

                    body: JSON.stringify({

                        accion: "agregar",

                        titulo: titulo,

                        autor: autor,

                        editorial: editorial,

                        anio: anio,

                        isbn: isbn,

                        categoria: categoria

                    })
                }
            );


        const textoRespuesta = await respuesta.text();

        console.log("RESPUESTA DEL GUARDADO:");
        console.log(textoRespuesta);

        const resultado = JSON.parse(textoRespuesta);


        if (resultado.ok !== true) {

            throw new Error(
                resultado.mensaje || "No se pudo agregar el libro."
            );

        }


        mensaje.textContent =
            "✅ " + resultado.mensaje;

        mensaje.style.display =
            "block";


        // Limpiar formulario

        document.getElementById("tituloLibro").value = "";
        document.getElementById("autorLibro").value = "";
        document.getElementById("editorialLibro").value = "";
        document.getElementById("anioLibro").value = "";
        document.getElementById("isbnLibro").value = "";
        document.getElementById("categoriaLibro").value = "";


        // Recargar libros

        await cargarLibros();


    } catch (error) {

        console.error(
            "ERROR AL AGREGAR LIBRO:",
            error
        );

        mostrarErrorBiblioteca(
            "No se pudo guardar el libro."
        );

    }

}


// =====================================================
// ELIMINAR LIBRO
// =====================================================

async function eliminarLibro(id) {

    const confirmar =
        confirm(
            "¿Seguro que querés eliminar este libro?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                URL_BIBLIOTECA,
                {
                    method: "POST",

                    body: JSON.stringify({

                        accion: "eliminar",

                        id: id

                    })
                }
            );


        const resultado =
            await respuesta.json();


        if (resultado.ok !== true) {

            throw new Error(
                resultado.mensaje || "No se pudo eliminar el libro."
            );

        }


        alert(
            "✅ " + resultado.mensaje
        );


        await cargarLibros();


    } catch (error) {

        console.error(
            "ERROR AL ELIMINAR LIBRO:",
            error
        );

        alert(
            "❌ No se pudo eliminar el libro."
        );

    }

}


// =====================================================
// MOSTRAR ERROR
// =====================================================

function mostrarErrorBiblioteca(mensaje) {

    const error =
        document.getElementById("errorBiblioteca");


    if (!error) {
        return;
    }


    error.textContent =
        mensaje;


    error.style.display =
        "block";

}


// =====================================================
// EVITAR HTML INDESEADO
// =====================================================

function escaparHTML(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// CARGAR AL ABRIR LA PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Página de libros cargada.");

        cargarLibros();

    }
);
