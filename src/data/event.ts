/**
 * Everything that changes year to year lives here.
 * For 2027: update the fields, set status, and swap zeffyUrl for the new event link.
 *
 * status:
 *   'open'     – registration open, big Register button
 *   'soldout'  – shows "Sold out" in place of the button, sponsorships still open
 *   'past'     – tournament over; site points to photos and next year's sponsorship
 */
export const event = {
  edition: 19,
  year: 2026,
  status: 'past' as 'open' | 'soldout' | 'past',
  date: '2026-06-08',
  dateLabel: 'Monday, June 8, 2026',
  checkIn: '7:30 am',
  shotgun: '9:00 am',
  course: 'Waverly Woods Golf Course',
  courseTown: 'Marriottsville, MD',
  format: 'Four-person scramble',
  zeffyUrl: 'https://www.zeffy.com/en-US/ticketing/the-19th-annual-afhc-golf-classic',
  fees: {
    team: 680,
    golfer: 170,
    lateTeam: 740,
    lateGolfer: 185,
    lateAfter: 'May 17',
    closes: 'June 1, 2026',
  },
  includes: ['Round of golf', 'Continental breakfast', 'Luncheon', 'Drink tickets'],
  schedule: [
    { time: '7:30 am', what: 'Check-in opens. Driving range open.' },
    { time: '8:30 am', what: 'Welcome remarks, announcements and rules.' },
    { time: '8:45 am', what: 'Golfers head to carts and starting holes.' },
    { time: '9:00 am', what: 'Play begins.' },
    { time: '2:00 pm', what: 'Play ends (approx.) and the luncheon begins.' },
    { time: '4:00 pm', what: 'Post-golf JEWEL Network Social.' },
  ],
  teeBoxes: [
    { who: 'Men', tee: 'White', yards: 6304 },
    { who: 'Seniors (65+)', tee: 'Gold', yards: 5606 },
    { who: 'Women', tee: 'Red', yards: 4834 },
  ],
  prizes: [
    '1st place team: trophies and gift cards',
    '2nd place team: trophies and gift cards',
    'Closest to the pin: gift cards',
    'Longest drive: gift cards',
    'GPS rangefinder raffle',
    '50/50 raffle',
    'Additional prize raffles',
  ],
  // Next event, shown when status is 'past'. Leave dateLabel empty until it's set.
  next: { year: 2027, dateLabel: '' },
};

export const org = {
  name: 'Alpha Foundation of Howard County, Inc.',
  short: 'AFHC',
  chapter: 'Alpha Phi Alpha Fraternity, Inc., Kappa Phi Lambda Chapter',
  mailing: 'P.O. Box 2694, Columbia, MD 21045',
  foundationUrl: 'https://www.alphafoundationhc.org/',
  chapterUrl: 'http://apakpl.org',
  social: [
    { label: 'Facebook', url: 'https://www.facebook.com/KPLaphia' },
    { label: 'Instagram', url: 'https://www.instagram.com/kpl_aphia/' },
    { label: 'X (Twitter)', url: 'https://twitter.com/AlphasKPL_HoCo' },
  ],
};

export const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
