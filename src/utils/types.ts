export type SingleDatePoint = {
    [ key in  KEYLISTCLASS | KEYLISTINVESTIGATOR] : number} & {
    date: string;
    }

export type Mode = MODE.ABSOLUTE | MODE.RELATIVE;

export enum MODE {
    ABSOLUTE = "ABSOLUTE",
    RELATIVE = "RELATIVE",
}

export enum KEYLISTCLASS {
   GUARDIAN = 'guardian',
	SEEKER = 'seeker',
	ROGUE = 'rogue',
	SURIVOR = 'survivor',
	MYSTIC ='mystic',
    NEUTRAL ='neutral',
    ALL = 'all'
}

export enum KEYLISTINVESTIGATOR {
    I01001 =    "01001", 
    I02001 =    "02001", 
    I03001 =    "03001", 
    I04001 =    "04001", 
    I05001 =    "05001", 
    I06001 =    "06001", 
    I01002 =    "01002", 
    I02002 =    "02002", 
    I03002 =    "03002", 
    I04002 =    "04002", 
    I05002 =    "05002", 
    I06002 =    "06002", 
    I07002 =    "07002", 
    I01003 =    "01003", 
    I02003 =    "02003", 
    I03003 =    "03003", 
    I04003 =    "04003", 
    I05003 =    "05003", 
    I06003 =    "06003", 
    I07003 =    "07003", 
    I01004 =    "01004", 
    I02004 =    "02004", 
    I03004 =    "03004", 
    I04004 =    "04004", 
    I05004 =    "05004", 
    I06004 =    "06004", 
    I01005 =    "01005", 
    I02005 =    "02005", 
    I03005 =    "03005", 
    I04005 =    "04005", 
    I05005 =    "05005", 
    I06005 =    "06005", 
    I60101 =    "60101", 
    I60201 =    "60201", 
    I60301 =    "60301", 
    I60401 =    "60401", 
    I60501 =    "60501", 
    I98007 =    "98007", 
    I98010 =    "98010", 
    I98013 =    "98013", 
    I98016 =    "98016", 
    I03006 =    "03006", 
}
