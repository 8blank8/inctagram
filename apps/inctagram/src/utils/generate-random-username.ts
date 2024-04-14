export const generateUniqueUsername = () => {
    var minLength = 6;
    var maxLength = 30;
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    var username = '';

    var usernameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    username = '';
    for (var i = 0; i < usernameLength; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        username += characters[randomIndex];
    }

    return username;
}