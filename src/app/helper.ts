export const MONTH_NAME_MAP: Record<string, string> = {
    "jan": "January", "feb": "February", "mar": "March", "apr": "April",
    "may": "May", "jun": "June", "jul": "July", "aug": "August",
    "sep": "September", "oct": "October", "nov": "November", "dec": "December"
}
export const MONTHS_IN_YEAR = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

export const SEASON_TO_MONTH_MAP: Record<string, string[]> = {
    "spring": ["mar", "apr", "may", "jun"],
    "summer": ["jun", "jul", "aug", "sep"],
    "fall": ["sep", "oct", "nov", "dec"],
    "winter": ["dec", "jan", "feb", "mar"]
}

export const getMonthName = (monthNumber: number) => {
    const monthIndex = monthNumber - 1;
    return MONTH_NAME_MAP[MONTHS_IN_YEAR[monthIndex]];
}

export const getMonthShortName = (monthNumber: number) => {
    return MONTHS_IN_YEAR[monthNumber].charAt(0).toUpperCase() + MONTHS_IN_YEAR[monthNumber].slice(1);
}

export const getMonthNumber = (monthName: string) => {
    return Object.keys(MONTH_NAME_MAP).findIndex(key => MONTH_NAME_MAP[key] === monthName);
}