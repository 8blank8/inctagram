export const userIsOver13 = (date: string) => {
    try {
        const [day, month, year] = date.split('.');
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const currentDate = new Date();
        const ageDiffMs = currentDate.getTime() - birthDate.getTime();
        const ageDate = new Date(ageDiffMs);
        const userAge = Math.abs(ageDate.getUTCFullYear() - 1970);

        return userAge >= 13;
    } catch (e) {
        console.log(e)
        return false
    }
}