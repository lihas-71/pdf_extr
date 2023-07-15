const {
    contextBridge,
    ipcRenderer
} = require('electron');


const fs = require("fs");
const path = require("path");
const {
    PDFDocument
} = require('pdf-lib');

contextBridge.exposeInMainWorld('selectPdf', function () {
    // trigger file prompt
    ipcRenderer.send('chooseFile');
});


// return a array containg integers from start to end
function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

contextBridge.exposeInMainWorld("filePath","xyz");


// handle response
ipcRenderer.on('chosenFile', (event, f) => {
    let filePath = document.querySelector("#file-path");
    filePath.value = f;
});

contextBridge.exposeInMainWorld('extract',async function(startPage,endPage,newName,filePath){
    await extract(startPage,endPage,newName,filePath);
    console.log("succesfully extracted")
});

async function extract(start, end,newName,filePath) {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    const firstDonorPdfBytes = fs.readFileSync(filePath);

    // Load a PDFDocument from each of the existing PDFs
    const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes)

    // Copy the 1st page from the first donor document, and
    const pages = await pdfDoc.copyPages(firstDonorPdfDoc, range(start-1, end-1))
    console.log(pages.length + "pages found");

    for (let i = 0; i < pages.length; i++) {
        // Add the first copied page
        pdfDoc.addPage(pages[i]);
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    fs.writeFile( path.join( __dirname , 'extracted_pdf' , newName+".pdf" ), pdfBytes, () => {});
}