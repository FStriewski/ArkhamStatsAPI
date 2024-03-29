
export const postgresToDatestring = (date: string):string => {
    const year = +date.slice(0,4);
    const month = +date.slice(4,6);
    const day = +date.slice(6,8);
    const newdate = (new Date(year,month,day)).toString()
    return Date.parse(newdate).toString().slice(0,10)
}

export const ymdSlashtoDateString = (date: string):string => {
    const year = +date.slice(0,4);
    const month = +date.slice(5,7);
    const day = +date.slice(8,9);
    const newdate = (new Date(year,month,day)).toString()
    return Date.parse(newdate).toString().slice(0,10)
}

export const dateToYMD = (date: Date): string => date.toISOString().slice(0,10);

export const postgresToYMD = (date: string): string => {
    const year = date.slice(0,4);
    const month = date.slice(4,6);
    const day = date.slice(6,8);
    
    return `${year}-${month}-${day}`
}