// export function formatTime(seconds: number) {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     const paddedMins = String(mins).padStart(2, '0');
//     const paddedSecs = String(secs).padStart(2, '0');
//     return `${paddedMins}:${paddedSecs}`;
// }

export function parseSkipTime(timeString: string) {
    const parseTime = (timeStr: string) => {
        if (timeStr.includes(':')) {
            const [minutes, seconds] = timeStr.split(':').map(Number);
            return minutes * 60 + seconds;
        } else {
            return Number(timeStr) * 60;
        }
    };

    const ranges = timeString.split(",").map(range => {
        const [start, end] = range.split("-").map(parseTime);
        return { start, end };
    });

    const { start, end } = ranges[0] || { start: 0, end: 0 };

    if (end < 1200 && start === 0) {
        return { start: 5, end: end - 5 };
    }
    return { start, end };
}

export const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
}

export function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    } else {
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
}
