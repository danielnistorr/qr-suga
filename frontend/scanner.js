const html5QrCode = new Html5Qrcode('reader');

function startScan() {
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            fetch('http://localhost:3000/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrId: qrCodeMessage })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerHTML = data.valid ? 
                    `ACCESSO CONSENTITO per ${data.user}` : 
                    'ACCESSO NEGATO';
            });
        },
        errorMessage => console.log(errorMessage)
    ).catch(err => console.log(err));
}

// Avvia la scansione quando la pagina è pronta
window.onload = startScan;