import axios from "axios";

export type ScheduleAnime = {
    anime_id: number;
    title: string;
    episodes: {
        next_date: number;
    };
    poster: {
        fullsize: string;
        big: string;
        small: string;
        medium: string;
        huge: string;
        mega: string;
    },
};

export type ScheduleSectionType = {
    title: string;
    data: ScheduleAnime[][];
};

const WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const NUM_COLUMNS = 3;

export const getYummySchedule = async () => {
    try {
        const res = await axios.get('https://api.yani.tv/anime/schedule');

        if (res.status !== 200 || !Array.isArray(res.data.response)) {
            throw new Error("[YummyAPI] Некорректный ответ от сервера");
        }

        const data: ScheduleAnime[] = res.data.response || [];
        const now = Math.floor(Date.now() / 1000);

        const scheduleByDay: Record<string, ScheduleAnime[]> = Object.fromEntries(
            WEEK_DAYS.map(day => [day, []])
        );

        data.forEach(anime => {
            if (anime.episodes?.next_date && anime.episodes.next_date > now) {
                const date = new Date(anime.episodes.next_date * 1000);
                const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
                const dayName = WEEK_DAYS[dayIndex];
                scheduleByDay[dayName].push(anime);
            }
        });

        const sectionsData: ScheduleSectionType[] = WEEK_DAYS.map(day => {
            const items = scheduleByDay[day];
            const chunked: ScheduleAnime[][] = [];
            for (let i = 0; i < items.length; i += NUM_COLUMNS) {
                chunked.push(items.slice(i, i + NUM_COLUMNS));
            }
            return { title: day, data: chunked };
        }).filter(s => s.data.length > 0);

        return sectionsData;
    } catch (error) {
        console.error('[YummyAPI] Ошибка расписания:', error);
        return [];
    }
};