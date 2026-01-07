export const isBase64 = (str) => {
    const base64RegExp = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64RegExp.test(str);
}