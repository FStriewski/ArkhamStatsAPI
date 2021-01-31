export enum SCALE {
  DAY = 'DAY',
  MONTH = 'MONTH'
}

export enum MODE {
  DIST = 'DIST',
  SUM = 'SUM'
}

export const YEARS = [
  {
    label: '2016',
    startDate: new Date('2016-01-01'),
    endDate: new Date('2016-12-31')
  },
  {
    label: '2017',
    startDate: new Date('2017-01-01'),
    endDate: new Date('2017-12-31')
  },
  {
    label: '2018',
    startDate: new Date('2018-01-01'),
    endDate: new Date('2018-12-31')
  },
  {
    label: '2019',
    startDate: new Date('2019-01-01'),
    endDate: new Date('2019-12-31')
  },
  {
    label: '2020',
    startDate: new Date('2020-01-01'),
    endDate: new Date('2020-12-31')
  },
  {
    label: '2021',
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31')
  }
];

export enum KEYLISTCLASS {
  GUARDIAN = 'guardian',
  SEEKER = 'seeker',
  ROGUE = 'rogue',
  SURIVOR = 'survivor',
  MYSTIC = 'mystic',
  NEUTRAL = 'neutral',
  ALL = 'all'
}

export const factionMembers: { [key: string]: string[] } = {
  guardian: [
    '01001',
    '02001',
    '03001',
    '04001',
    '98010',
    '06001',
    '07001',
    '60101'
  ],
  seeker: [
    '01002',
    '02002',
    '03002',
    '04002',
    '05002',
    '06002',
    '07002',
    '98007',
    '60201'
  ],
  rogue: [
    '01003',
    '02003',
    '03003',
    '04003',
    '05003',
    '06003',
    '07003',
    '60301'
  ],
  survivor: [
    '01005',
    '02005',
    '03005',
    '04005',
    '05005',
    '06005',
    '98013',
    '60501'
  ],
  mystic: [
    '01004',
    '02004',
    '03004',
    '04004',
    '05004',
    '05006',
    '06004',
    '98016',
    '60401'
  ],
  neutral: ['03006']
};

export enum KEYLISTINVESTIGATOR {
  I01001 = '01001',
  I02001 = '02001',
  I03001 = '03001',
  I04001 = '04001',
  I05001 = '05001',
  I06001 = '06001',
  I01002 = '01002',
  I02002 = '02002',
  I03002 = '03002',
  I04002 = '04002',
  I05002 = '05002',
  I06002 = '06002',
  I07002 = '07002',
  I01003 = '01003',
  I02003 = '02003',
  I03003 = '03003',
  I04003 = '04003',
  I05003 = '05003',
  I06003 = '06003',
  I07003 = '07003',
  I01004 = '01004',
  I02004 = '02004',
  I03004 = '03004',
  I04004 = '04004',
  I05004 = '05004',
  I06004 = '06004',
  I01005 = '01005',
  I02005 = '02005',
  I03005 = '03005',
  I04005 = '04005',
  I05005 = '05005',
  I06005 = '06005',
  I60101 = '60101',
  I60201 = '60201',
  I60301 = '60301',
  I60401 = '60401',
  I60501 = '60501',
  I98007 = '98007',
  I98010 = '98010',
  I98013 = '98013',
  I98016 = '98016',
  I03006 = '03006'
}

export enum SPAN {
  SINGLEYEAR = 'SINGLEYEAR',
  MULTIYEAR = 'MULTIYEAR'
}
