//Función para cargar un archivo HTML e insertarlo en un elemento
async function loadHTML(url, elementId) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        let element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = data;

            if (url !== 'footer.html') {
                return;
            }

            // Encuentra y ejecuta los scripts dentro del contenido cargado
            const scripts = element.querySelectorAll("script");

            for (let script of scripts) {
                console.log(script.src);
                let newScript = document.createElement("script");
                newScript.src = script.src;

                // Pausar hasta que se cargue.
                await new Promise((resolve, reject) => {
                    newScript.onload = () => {
                        console.log('Continuar.');
                        resolve(); // Continuar cuando el script se ha cargado
                    };
                    newScript.onerror = () => {
                        reject(new Error(`Error al cargar el script: ${script.src}`));
                    };
                    console.log('newScript');
                    document.body.appendChild(newScript);
                });
            }
            console.log(url);
        }
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
    }
}


// Cargar el contenido de header.html y footer.html en los respectivos divs
loadHTML('header.html', 'header');
loadHTML('footer.html', 'footer');
