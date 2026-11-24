
const pdfContainer = document.getElementById("pdfContainer");

const pdfUrl = "/images/PORTOFOLIO RAFFLY 2026.pdf";

let pdfDoc = null;
let currentPage = 15;
let zoom = 1;


// Load PDF
async function loadPDF() {

    try {

        const loadingTask = pdfjsLib.getDocument(pdfUrl);

        pdfDoc = await loadingTask.promise;

        document.getElementById("pageCount").textContent =
            pdfDoc.numPages;

        document.getElementById("pageNumber").max =
            pdfDoc.numPages;

        pdfContainer.innerHTML = "";

        // Render semua halaman
        for (let i = 1; i <= pdfDoc.numPages; i++) {

            const page = await pdfDoc.getPage(i);

            const viewport = page.getViewport({
                scale: 1.5 * zoom
            });

            const canvas = document.createElement("canvas");

            canvas.className = "pdf-page";

            canvas.dataset.page = i;

            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            pdfContainer.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

        }

    } catch (error) {

        pdfContainer.innerHTML = `
            <p style="color:red">
                PDF gagal dimuat: ${error.message}
            </p>
        `;

        console.error(error);

    }

}


// Navigasi halaman
function goToPage(page) {

    if (!pdfDoc) return;

    page = Math.max(1, Math.min(page, pdfDoc.numPages));

    currentPage = page;

    document.getElementById("pageNumber").value = page;

    const target = document.querySelector(
        `.pdf-page[data-page="${page}"]`
    );

    if (target) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


// Tombol navigasi
document.getElementById("prevPage").onclick = () => {
    goToPage(currentPage - 1);
};

document.getElementById("nextPage").onclick = () => {
    goToPage(currentPage + 1);
};

document.getElementById("pageNumber").onchange = (event) => {
    goToPage(Number(event.target.value));
};


// Zoom
async function changeZoom(value) {

    zoom = Math.max(0.6, Math.min(2, zoom + value));

    document.getElementById("zoomLevel").textContent =
        Math.round(zoom * 100) + "%";

    await loadPDF();

}

document.getElementById("zoomIn").onclick = () => {
    changeZoom(0.2);
};

document.getElementById("zoomOut").onclick = () => {
    changeZoom(-0.2);
};


// Jalankan
loadPDF();
