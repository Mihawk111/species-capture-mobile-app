var Buffer = require('buffer/').Buffer;
function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}
function btoa(str) {
  return Buffer.from(str, 'binary').toString('base64');
}

exports.base64ToBlob = (base64) => {
    // const byteCharacters = atob(base64);
    const byteCharacters = Buffer.from(base64, 'base64').toString('binary');
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpg' }); // Adjust the type as needed (e.g., 'image/png')
    // return new Blob([byteArray]); // Adjust the type as needed (e.g., 'image/png')
}