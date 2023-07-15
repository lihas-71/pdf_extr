const fs = require("fs");
const { PDFDocument } = require('pdf-lib');

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

async function test(start,end){
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // These should be Uint8Arrays or ArrayBuffers
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const firstDonorPdfBytes = fs.readFileSync("1.pdf");

    // Load a PDFDocument from each of the existing PDFs
    const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes)

    // Copy the 1st page from the first donor document, and
    // the 743rd page from the second donor document
    const pages = await pdfDoc.copyPages(firstDonorPdfDoc, range(start,end))

    for(let i=0;i<pages.length;i++){
         // Add the first copied page
        pdfDoc.addPage(pages[i]);
    }
   

    // Insert the second copied page to index 0, so it will be the
    // first page in `pdfDoc`

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    fs.writeFile("new.pdf",pdfBytes,()=>{});
}


test(100,105);
