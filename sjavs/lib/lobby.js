function generateRandomId(length) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        randomId += letters[randomIndex];
    }
    return randomId;
}

function createLobby() {
    
}