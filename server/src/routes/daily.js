const express = require('express');
const router = express.Router();

// Church calendar data and utilities

/**
 * Calculate Easter Sunday date for a given year (using Computus algorithm)
 * @param {number} year - The year to calculate Easter for
 * @returns {Date} Easter Sunday date
 */
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Get the liturgical season for a given date and denomination
 * @param {Date} date - The date to check
 * @param {string} denomination - The denomination (catholic, orthodox, protestant)
 * @returns {Object} Season information including name, color, and description
 */
function getLiturgicalSeason(date, denomination) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Calculate key dates
  const easter = calculateEaster(year);
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);
  
  const adventStart = getAdventStart(year);
  const christmasDay = new Date(year, 11, 25);
  const epiphany = new Date(year, 0, 6);
  const baptismOfLord = getFirstSundayAfter(epiphany);
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  
  const christmasEnd = new Date(year, 0, 13); // Baptism of the Lord approximately
  
  // Check each season in order
  if (date >= adventStart && date < christmasDay) {
    return {
      season: 'Advent',
      color: 'Purple',
      description: 'Season of preparation for Christmas',
      focus: 'Awaiting the coming of Christ'
    };
  }
  
  if ((date >= christmasDay && month === 11) || (month === 0 && date <= christmasEnd)) {
    return {
      season: 'Christmas',
      color: 'White',
      description: 'Celebration of the birth of Jesus Christ',
      focus: 'The Incarnation of God'
    };
  }
  
  if (date >= ashWednesday && date < easter) {
    return {
      season: 'Lent',
      color: 'Purple',
      description: 'Season of fasting and preparation for Easter',
      focus: 'Repentance, prayer, and fasting'
    };
  }
  
  if (date >= easter && date < pentecost) {
    return {
      season: 'Easter',
      color: 'White',
      description: 'Celebration of the Resurrection of Jesus Christ',
      focus: 'The victory of life over death'
    };
  }
  
  // Default to Ordinary Time
  return {
    season: 'Ordinary Time',
    color: 'Green',
    description: 'The regular season of growth in faith',
    focus: 'Growing in discipleship and Christian living'
  };
}

/**
 * Get the first Sunday of Advent (4th Sunday before Christmas)
 */
function getAdventStart(year) {
  const christmas = new Date(year, 11, 25);
  const dayOfWeek = christmas.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
  const fourthSunday = new Date(christmas);
  fourthSunday.setDate(christmas.getDate() - daysUntilSunday);
  fourthSunday.setDate(fourthSunday.getDate() - 21); // 3 weeks before
  return fourthSunday;
}

/**
 * Get the first Sunday after a date
 */
function getFirstSundayAfter(date) {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  if (dayOfWeek !== 0) {
    result.setDate(result.getDate() + (7 - dayOfWeek));
  }
  return result;
}

/**
 * Check for major feast days
 */
function getMajorFeast(date, denomination) {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Universal Christian feasts
  if (month === 11 && day === 25) {
    return { name: 'Christmas', type: 'solemnity' };
  }
  if (month === 0 && day === 1) {
    return { name: 'Solemnity of Mary, Mother of God', type: 'solemnity' };
  }
  if (month === 0 && day === 6) {
    return { name: 'Epiphany', type: 'solemnity' };
  }
  
  const easter = calculateEaster(year);
  if (date.toDateString() === easter.toDateString()) {
    return { name: 'Easter Sunday', type: 'solemnity' };
  }
  
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  if (date.toDateString() === ascension.toDateString()) {
    return { name: 'Ascension of the Lord', type: 'solemnity' };
  }
  
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  if (date.toDateString() === pentecost.toDateString()) {
    return { name: 'Pentecost', type: 'solemnity' };
  }
  
  // Catholic-specific feasts
  if (denomination === 'catholic') {
    if (month === 7 && day === 15) {
      return { name: 'Assumption of Mary', type: 'solemnity' };
    }
    if (month === 10 && day === 1) {
      return { name: 'All Saints Day', type: 'solemnity' };
    }
    if (month === 11 && day === 8) {
      return { name: 'Immaculate Conception', type: 'solemnity' };
    }
  }
  
  // Protestant celebrations
  if (denomination === 'protestant') {
    if (month === 9 && day === 31) {
      return { name: 'Reformation Day', type: 'celebration' };
    }
  }
  
  // Orthodox feasts (using Gregorian calendar approximations)
  if (denomination === 'orthodox') {
    if (month === 0 && day === 7) {
      return { name: 'Nativity of Christ (Orthodox)', type: 'feast' };
    }
    if (month === 7 && day === 6) {
      return { name: 'Transfiguration', type: 'feast' };
    }
    if (month === 8 && day === 14) {
      return { name: 'Exaltation of the Holy Cross', type: 'feast' };
    }
  }
  
  return null;
}

/**
 * Get appropriate Bible verses for the season/feast
 */
function getSeasonalVerse(season, feast, denomination) {
  // If there's a major feast, prioritize feast verses
  if (feast) {
    const feastVerses = {
      'Christmas': {
        verse: 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
        reference: 'Isaiah 9:6'
      },
      'Easter Sunday': {
        verse: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.',
        reference: 'Matthew 28:6'
      },
      'Pentecost': {
        verse: 'And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.',
        reference: 'Acts 2:4'
      },
      'Epiphany': {
        verse: 'Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee.',
        reference: 'Isaiah 60:1'
      },
      'Ascension of the Lord': {
        verse: 'And when he had spoken these things, while they beheld, he was taken up; and a cloud received him out of their sight.',
        reference: 'Acts 1:9'
      },
      'Assumption of Mary': {
        verse: 'And Mary said, My soul doth magnify the Lord, And my spirit hath rejoiced in God my Saviour.',
        reference: 'Luke 1:46-47'
      },
      'All Saints Day': {
        verse: 'After this I beheld, and, lo, a great multitude, which no man could number, of all nations, and kindreds, and people, and tongues, stood before the throne, and before the Lamb.',
        reference: 'Revelation 7:9'
      },
      'Reformation Day': {
        verse: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.',
        reference: 'Ephesians 2:8-9'
      },
      'Transfiguration': {
        verse: 'And was transfigured before them: and his face did shine as the sun, and his raiment was white as the light.',
        reference: 'Matthew 17:2'
      },
      'Exaltation of the Holy Cross': {
        verse: 'But God forbid that I should glory, save in the cross of our Lord Jesus Christ.',
        reference: 'Galatians 6:14'
      }
    };
    
    if (feastVerses[feast.name]) {
      return feastVerses[feast.name];
    }
  }
  
  // Season-based verses
  const seasonalVerses = {
    'Advent': [
      {
        verse: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
        reference: 'Isaiah 7:14'
      },
      {
        verse: 'The Spirit of the Lord God is upon me; because the Lord hath anointed me to preach good tidings unto the meek.',
        reference: 'Isaiah 61:1'
      },
      {
        verse: 'Prepare ye the way of the Lord, make straight in the desert a highway for our God.',
        reference: 'Isaiah 40:3'
      }
    ],
    'Christmas': [
      {
        verse: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
        reference: 'John 1:14'
      },
      {
        verse: 'Glory to God in the highest, and on earth peace, good will toward men.',
        reference: 'Luke 2:14'
      }
    ],
    'Lent': [
      {
        verse: 'Create in me a clean heart, O God; and renew a right spirit within me.',
        reference: 'Psalm 51:10'
      },
      {
        verse: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',
        reference: '1 John 1:9'
      },
      {
        verse: 'For godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death.',
        reference: '2 Corinthians 7:10'
      }
    ],
    'Easter': [
      {
        verse: 'I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.',
        reference: 'John 11:25'
      },
      {
        verse: 'But now is Christ risen from the dead, and become the firstfruits of them that slept.',
        reference: '1 Corinthians 15:20'
      },
      {
        verse: 'Thanks be to God, which giveth us the victory through our Lord Jesus Christ.',
        reference: '1 Corinthians 15:57'
      }
    ],
    'Ordinary Time': [
      {
        verse: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
        reference: 'Proverbs 3:5-6'
      },
      {
        verse: 'I can do all things through Christ which strengtheneth me.',
        reference: 'Philippians 4:13'
      },
      {
        verse: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
        reference: 'Matthew 6:33'
      },
      {
        verse: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
        reference: 'Romans 8:28'
      },
      {
        verse: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.',
        reference: 'Joshua 1:9'
      }
    ]
  };
  
  const verses = seasonalVerses[season] || seasonalVerses['Ordinary Time'];
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
}

/**
 * Get a spiritual quote appropriate for the season/feast
 */
function getSeasonalQuote(season, feast, denomination) {
  if (feast) {
    const feastQuotes = {
      'Christmas': 'The Son of God became man so that man might become a son of God. - St. Athanasius',
      'Easter Sunday': 'Christ is risen! He is risen indeed! Let us rejoice in His victory over sin and death.',
      'Pentecost': 'Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.',
      'Epiphany': 'The Magi teach us to seek Christ with perseverance, and to worship Him with humble hearts.',
      'Reformation Day': 'The just shall live by faith. - Martin Luther',
      'All Saints Day': 'The saints are the true interpreters of Holy Scripture. - St. Francis de Sales',
      'Lent': 'Prayer, fasting, and almsgiving are the three pillars of the spiritual life during Lent.'
    };
    
    if (feastQuotes[feast.name]) {
      return feastQuotes[feast.name];
    }
  }
  
  const seasonalQuotes = {
    'Advent': [
      'Advent is a time of waiting, but not of passivity. It is a time of active preparation.',
      'Let us prepare our hearts as a dwelling place for the coming of Christ.',
      'The season of Advent means there is something on the horizon the likes of which we have never seen before. - Max Lucado'
    ],
    'Christmas': [
      'God loved the world so much that He gave His only Son, that we might have eternal life.',
      'The light shines in the darkness, and the darkness has not overcome it.',
      'Christmas is not just a day, but a way of living. - Unknown'
    ],
    'Lent': [
      'Lent is a time to renew wherever we are in that process of conversion. - Pope Francis',
      'True fasting is a matter of the heart, not just the stomach.',
      'Let us use this time of Lent to grow in holiness and draw closer to God.'
    ],
    'Easter': [
      'The resurrection gives my life meaning and direction and the opportunity to start over no matter what my circumstances. - Robert Flatt',
      'Easter says you can put truth in a grave, but it will not stay there. - Clarence W. Hall',
      'Christ has risen! Death is conquered! Sin is defeated! Rejoice and be glad!'
    ],
    'Ordinary Time': [
      'In the ordinary moments of life, God is working extraordinary grace.',
      'Every day is a gift from God. Use it to grow in faith, hope, and love.',
      'Do small things with great love. - St. Mother Teresa',
      'Pray, hope, and do not worry. - St. Padre Pio',
      'Be who God meant you to be and you will set the world on fire. - St. Catherine of Siena'
    ]
  };
  
  const quotes = seasonalQuotes[season] || seasonalQuotes['Ordinary Time'];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// API endpoint to get daily content
router.get('/', (req, res) => {
  try {
    const { denomination = 'other', date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Get liturgical information
    const season = getLiturgicalSeason(targetDate, denomination);
    const feast = getMajorFeast(targetDate, denomination);
    
    // Get appropriate verse and quote
    const verse = getSeasonalVerse(season.season, feast, denomination);
    const quote = getSeasonalQuote(season.season, feast, denomination);
    
    // Prepare response
    const response = {
      date: targetDate.toISOString(),
      denomination,
      liturgicalInfo: {
        season: season.season,
        color: season.color,
        description: season.description,
        focus: season.focus,
        feast: feast ? {
          name: feast.name,
          type: feast.type
        } : null
      },
      verse: {
        text: verse.verse,
        reference: verse.reference
      },
      quote
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting daily content:', error);
    res.status(500).json({ 
      error: 'Failed to get daily content',
      message: error.message 
    });
  }
});

module.exports = router;
