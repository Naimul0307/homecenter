const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true, // Allow using require in renderer
            contextIsolation: false, // Allows direct ipcRenderer use
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'app/public/templates/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// 🖨 Handle receipt print request
ipcMain.on("print-receipt", (event, base64data) => {
    let pdfBuffer = Buffer.from(base64data, "base64");

    // Save the PDF to a temporary file
    let filePath = path.join(app.getPath("temp"), "receipt.pdf");
    fs.writeFileSync(filePath, pdfBuffer);

    // Open a hidden window to load and print the PDF
    let printWindow = new BrowserWindow({ show: false });
    printWindow.loadURL(`file://${filePath}`);

    printWindow.webContents.once("did-finish-load", () => {
        printWindow.webContents.print({
            silent: true, // No print dialog
            printBackground: true, // Include background styles
            deviceName: "" // Uses the default printer
        }, (success, errorType) => {
            if (!success) console.error("Print failed:", errorType);
            printWindow.close(); // Close after printing
        });
    });
});
