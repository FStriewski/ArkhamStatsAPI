export type SingleDatePoint = {
    // date: string;
    [index: string]: any;
}

export type Mode = MODE.ABSOLUTE | MODE.RELATIVE;

export enum MODE {
    ABSOLUTE = "ABSOLUTE",
    RELATIVE = "RELATIVE",
}