export const formatDate = (date: any) => {
    let jsDate: Date;

    if (date?.toDate) {
        jsDate = date.toDate();
    } else {
        jsDate = new Date(date);
    }

    const day = String(jsDate.getDate()).padStart(2, "0");
    const month = String(jsDate.getMonth() + 1).padStart(2, "0");
    const year = jsDate.getFullYear();

    return `${day}.${month}.${year}`;
};