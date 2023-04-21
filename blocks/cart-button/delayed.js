function showCart(){
    var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(itemsInCart.join(';')) + "&size=200x200";
    // Set QR code image URL
    document.getElementById("qrCode").src = qrCodeUrl;
    // Show overlay
    document.getElementById("qrOverlay").style.display = "flex";
    hideMoreDetailOverlay();
}
function createCartOverLay(){
    var QrDiv = document.createElement('div');
    QrDiv.innerHTML='<div class=\"overlay\" id=\"qrOverlay\"> <div class=\"overlay-content\"> <span class=\"overlay-close\" onclick=\"hideCartOverlay()\">&#10006;</span> <h2>Order Here</h2> <img src=\"\" alt=\"QR Code\" id=\"qrCode\" class=\"qr-code\"></div></div>';
    document.querySelector('main').append(QrDiv);
    hideCartOverlay();   
  }
function hideCartOverlay() {
    // Hide overlay
    document.getElementById("qrOverlay").style.display = "none";
  }
createCartOverLay();