export const generateUniqueUsername = () => {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 100);
    return `user_${timestamp}_${randomSuffix}`;
};