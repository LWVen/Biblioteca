        // =====================================================
    // URL DE GOOGLE APPS SCRIPT
    // =====================================================

    const URL_BIBLIOTECA =
    "https://script.google.com/macros/s/AKfycbyVqvklxitqN0_L9nqdtYWfzWcy10yQnXy9dpsAgQRGYiEiHIGBLdWKhaKzaTRPPxk/exec";


    let libros = [];


    // =====================================================
    // CARGAR LIBROS
    // =====================================================

    async function cargarLibros() {

            const lista =
    document.getElementById("listaLibros");

    const cantidad =
    document.getElementById("cantidadLibros");


    lista.innerHTML =
    '<tr><td colspan="7" class="cargando">Cargando libros...</td></tr>';


    try {

                const respuesta =
    await fetch(URL_BIBLIOTECA);


    if (!respuesta.ok) {
                    throw new Error("Error de conexión");
                }


    const resultado = await respuesta.json();

    if (!resultado.ok) {
                    throw new Error(resultado.error || "Error al cargar los libros");
                }

    libros = resultado.libros || [];

    mostrarLibros(libros);


            } catch (error) {

        console.error(error);


    lista.innerHTML =
    '<tr><td colspan="7">No se pudieron cargar los libros.</td></tr>';


    cantidad.textContent =
    "Error al conectar con la biblioteca.";

            }

        }


    // =====================================================
    // MOSTRAR LIBROS
    // =====================================================

    function mostrarLibros(listaLibros) {

            const lista =
    document.getElementById("listaLibros");

    const cantidad =
    document.getElementById("cantidadLibros");


    lista.innerHTML = "";


    cantidad.textContent =
    "Cantidad de libros: " +
    listaLibros.length;


    if (listaLibros.length === 0) {

        lista.innerHTML =
        '<tr><td colspan="7">No hay libros registrados.</td></tr>';

    return;
            }


    listaLibros.forEach(function (libro) {

                const fila =
    document.createElement("tr");


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
            onclick="eliminarLibro('${libro.id}')">

            🗑️ Eliminar

        </button>

    </td>

    `;


    lista.appendChild(fila);

            });

        }


    // =====================================================
    // BUSCAR
    // =====================================================

    function filtrarLibros() {

            const texto =
    document
    .getElementById("buscarLibro")
    .value
    .toLowerCase()
    .trim();


    const resultados =
    libros.filter(function (libro) {

                    return (

    String(libro.titulo)
    .toLowerCase()
    .includes(texto)

    ||

    String(libro.autor)
    .toLowerCase()
    .includes(texto)

    ||

    String(libro.isbn)
    .toLowerCase()
    .includes(texto)

    ||

    String(libro.categoria)
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
    document
    .getElementById("tituloLibro")
    .value
    .trim();


    const autor =
    document
    .getElementById("autorLibro")
    .value
    .trim();


    const editorial =
    document
    .getElementById("editorialLibro")
    .value
    .trim();


    const anio =
    document
    .getElementById("anioLibro")
    .value
    .trim();


    const isbn =
    document
    .getElementById("isbnLibro")
    .value
    .trim();


    const categoria =
    document
    .getElementById("categoriaLibro")
    .value
    .trim();


    const mensaje =
    document
    .getElementById("mensajeBiblioteca");


    const error =
    document
    .getElementById("errorBiblioteca");


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


    const resultado =
    await respuesta.json();


    mensaje.textContent =
    "✅ " +
    resultado.mensaje;


    mensaje.style.display =
    "block";


    // Limpiar formulario

    document
    .getElementById("tituloLibro")
    .value = "";

    document
    .getElementById("autorLibro")
    .value = "";

    document
    .getElementById("editorialLibro")
    .value = "";

    document
    .getElementById("anioLibro")
    .value = "";

    document
    .getElementById("isbnLibro")
    .value = "";

    document
    .getElementById("categoriaLibro")
    .value = "";


    // Recargar libros

    await cargarLibros();


            } catch (error) {

        console.error(error);


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


    alert(resultado.mensaje);


    await cargarLibros();


            } catch (error) {

        console.error(error);


    alert(
    "No se pudo eliminar el libro."
    );

            }

        }


    // =====================================================
    // ERROR
    // =====================================================

    function mostrarErrorBiblioteca(mensaje) {

            const error =
    document
    .getElementById("errorBiblioteca");


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
// CARGAR AL ABRIR
// =====================================================

cargarLibros();
