const express = require('express');
const router = express.Router();

// Nigerian Catholic Order of Mass
const orderOfMass = {
  english: {
    introductoryRites: {
      title: 'INTRODUCTORY RITES',
      steps: [
        {
          step: 'Entrance',
          text: 'The priest and ministers enter, and the people stand.'
        },
        {
          step: 'Sign of the Cross',
          priest: 'In the name of the Father, and of the Son, and of the Holy Spirit.',
          people: 'Amen.'
        },
        {
          step: 'Greeting',
          priest: 'The grace of our Lord Jesus Christ, and the love of God, and the communion of the Holy Spirit be with you all.',
          people: 'And with your spirit.'
        },
        {
          step: 'Penitential Act',
          priest: 'Brethren, let us acknowledge our sins, and so prepare ourselves to celebrate the sacred mysteries.',
          all: 'I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do, through my fault, through my fault, through my most grievous fault; therefore I ask blessed Mary ever-Virgin, all the Angels and Saints, and you, my brothers and sisters, to pray for me to the Lord our God.'
        },
        {
          step: 'Kyrie',
          text: 'Lord, have mercy. Christ, have mercy. Lord, have mercy.'
        },
        {
          step: 'Gloria',
          text: 'Glory to God in the highest, and on earth peace to people of good will. We praise you, we bless you, we adore you, we glorify you, we give you thanks for your great glory, Lord God, heavenly King, O God, almighty Father.'
        },
        {
          step: 'Collect (Opening Prayer)',
          text: 'The priest says the opening prayer for the day.'
        }
      ]
    },
    liturgyOfTheWord: {
      title: 'LITURGY OF THE WORD',
      steps: [
        {
          step: 'First Reading',
          text: 'Usually from the Old Testament'
        },
        {
          step: 'Responsorial Psalm',
          text: 'Response to the First Reading'
        },
        {
          step: 'Second Reading',
          text: 'From the New Testament Letters'
        },
        {
          step: 'Gospel Acclamation',
          people: 'Alleluia, Alleluia, Alleluia'
        },
        {
          step: 'Gospel Reading',
          priest: 'The Lord be with you.',
          people: 'And with your spirit.',
          priest: 'A reading from the holy Gospel according to [Matthew/Mark/Luke/John].',
          people: 'Glory to you, O Lord.'
        },
        {
          step: 'After Gospel',
          priest: 'The Gospel of the Lord.',
          people: 'Praise to you, Lord Jesus Christ.'
        },
        {
          step: 'Homily',
          text: 'The priest gives the homily'
        },
        {
          step: 'Profession of Faith (Creed)',
          text: 'I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible...'
        },
        {
          step: 'Prayer of the Faithful',
          text: 'Universal prayers for the Church and the world'
        }
      ]
    },
    liturgyOfTheEucharist: {
      title: 'LITURGY OF THE EUCHARIST',
      steps: [
        {
          step: 'Preparation of the Gifts',
          text: 'Bread and wine are brought to the altar'
        },
        {
          step: 'Prayer over the Offerings',
          priest: 'Blessed are you, Lord God of all creation...',
          people: 'Blessed be God forever.'
        },
        {
          step: 'Prayer over the Gifts',
          priest: 'Pray, brethren, that my sacrifice and yours may be acceptable to God, the almighty Father.',
          people: 'May the Lord accept the sacrifice at your hands for the praise and glory of his name, for our good and the good of all his holy Church.'
        },
        {
          step: 'Eucharistic Prayer',
          priest: 'The Lord be with you.',
          people: 'And with your spirit.',
          priest: 'Lift up your hearts.',
          people: 'We lift them up to the Lord.',
          priest: 'Let us give thanks to the Lord our God.',
          people: 'It is right and just.'
        },
        {
          step: 'Holy, Holy, Holy',
          all: 'Holy, Holy, Holy Lord God of hosts. Heaven and earth are full of your glory. Hosanna in the highest. Blessed is he who comes in the name of the Lord. Hosanna in the highest.'
        },
        {
          step: 'Consecration',
          text: 'The priest consecrates the bread and wine'
        },
        {
          step: 'Mystery of Faith',
          priest: 'The mystery of faith.',
          people: 'We proclaim your Death, O Lord, and profess your Resurrection until you come again.'
        },
        {
          step: 'The Lord\'s Prayer',
          all: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.'
        },
        {
          step: 'Sign of Peace',
          priest: 'The peace of the Lord be with you always.',
          people: 'And with your spirit.',
          priest: 'Let us offer each other the sign of peace.'
        },
        {
          step: 'Lamb of God',
          all: 'Lamb of God, you take away the sins of the world, have mercy on us. Lamb of God, you take away the sins of the world, have mercy on us. Lamb of God, you take away the sins of the world, grant us peace.'
        },
        {
          step: 'Communion',
          priest: 'Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb.',
          people: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.'
        }
      ]
    },
    concludingRites: {
      title: 'CONCLUDING RITES',
      steps: [
        {
          step: 'Final Blessing',
          priest: 'The Lord be with you.',
          people: 'And with your spirit.',
          priest: 'May almighty God bless you, the Father, and the Son, and the Holy Spirit.',
          people: 'Amen.'
        },
        {
          step: 'Dismissal',
          priest: 'Go forth, the Mass is ended.',
          people: 'Thanks be to God.'
        }
      ]
    }
  }
};

// Nigerian Catholic Daily Readings Information
const readingsInfo = {
  description: 'Daily Mass readings for Nigerian Catholics follow the Roman Catholic Lectionary cycle used worldwide.',
  sources: [
    {
      name: 'Catholic Bishops\' Conference of Nigeria (CBCN)',
      website: 'https://cbcn-ng.org',
      description: 'Official website of the Catholic Bishops\' Conference of Nigeria'
    },
    {
      name: 'USCCB Daily Readings',
      website: 'https://bible.usccb.org/daily-bible-reading',
      description: 'United States Conference of Catholic Bishops - provides daily readings in English'
    },
    {
      name: 'Universalis',
      website: 'https://universalis.com',
      description: 'Complete daily liturgy including readings, prayers, and breviary'
    }
  ],
  note: 'Nigerian Catholics follow the same lectionary cycle as the universal Catholic Church. Daily readings are organized in a three-year cycle for Sundays (Years A, B, C) and a two-year cycle for weekdays (Years I and II).'
};

// Liturgy of the Hours (Breviary) Information
const liturgyOfHours = {
  description: 'The Liturgy of the Hours (Divine Office/Breviary) is the official set of daily prayers prescribed by the Catholic Church to be recited at specific times of the day.',
  hours: [
    {
      name: 'Office of Readings',
      time: 'During the night or early morning',
      description: 'Longer readings from Scripture and the Fathers of the Church'
    },
    {
      name: 'Morning Prayer (Lauds)',
      time: 'At dawn',
      description: 'Sanctifies the morning and the beginning of the day\'s work'
    },
    {
      name: 'Daytime Prayer',
      time: 'Mid-morning, midday, or mid-afternoon',
      description: 'Brief prayer sanctifying different parts of the day',
      variants: ['Terce (9 AM)', 'Sext (Noon)', 'None (3 PM)']
    },
    {
      name: 'Evening Prayer (Vespers)',
      time: 'At sunset',
      description: 'Thanksgiving for the day and its work'
    },
    {
      name: 'Night Prayer (Compline)',
      time: 'Before retiring',
      description: 'Peaceful ending to the day, entrusting oneself to God'
    }
  ],
  structure: {
    hymn: 'Opening hymn appropriate to the hour',
    psalms: 'Usually three psalms or portions of longer psalms',
    reading: 'Short reading from Scripture',
    responsory: 'Response to the reading',
    canticle: 'Gospel canticle (Benedictus for Morning Prayer, Magnificat for Evening Prayer)',
    intercessions: 'Prayers for the Church and the world',
    ourFather: 'The Lord\'s Prayer',
    concludingPrayer: 'Prayer appropriate to the hour',
    blessing: 'Final blessing (for Morning and Evening Prayer)'
  },
  resources: [
    {
      name: 'Divine Office',
      website: 'https://divineoffice.org',
      description: 'Free online Liturgy of the Hours in English'
    },
    {
      name: 'iBreviary',
      description: 'Mobile app for the complete Liturgy of the Hours',
      platforms: ['iOS', 'Android']
    },
    {
      name: 'Universalis',
      website: 'https://universalis.com',
      description: 'Complete daily office with options for different rites'
    }
  ],
  nigerianNote: 'Nigerian Catholics use the standard Roman Breviary. Some religious communities and dioceses may have approved local adaptations incorporating Nigerian languages and customs.'
};

// Nigerian Catholic Missal Information
const missalInfo = {
  description: 'The Roman Missal contains the prayers, Scripture readings, and instructions for celebrating Mass throughout the liturgical year.',
  currentEdition: 'Roman Missal, Third Edition (2011)',
  parts: [
    {
      name: 'Order of Mass',
      description: 'The unchanging parts of the Mass (Ordinary)'
    },
    {
      name: 'Proper of Seasons',
      description: 'Prayers and readings for Sundays and major feasts throughout the year'
    },
    {
      name: 'Proper of Saints',
      description: 'Prayers and readings for saints\' feast days'
    },
    {
      name: 'Commons',
      description: 'Prayers for various types of saints when there is no specific proper'
    },
    {
      name: 'Ritual Masses',
      description: 'Masses for sacraments and special occasions'
    },
    {
      name: 'Masses for Various Needs',
      description: 'Prayers for specific intentions'
    },
    {
      name: 'Votive Masses',
      description: 'Masses in honor of mysteries or saints'
    }
  ],
  nigerianAdaptations: {
    note: 'The Catholic Bishops\' Conference of Nigeria may approve certain adaptations for local use',
    examples: [
      'Incorporation of Nigerian cultural elements in music and gestures',
      'Use of local languages (Igbo, Yoruba, Hausa) for parts of the Mass',
      'Inclusion of prayers for Nigerian intentions and needs',
      'Celebration of Nigerian saints and blessed persons'
    ]
  }
};

// Sample Sunday readings structure (for reference)
const sundayReadingsStructure = {
  note: 'Actual readings change weekly according to the liturgical calendar',
  cycle: 'Three-year cycle: Year A (Matthew), Year B (Mark), Year C (Luke)',
  structure: {
    firstReading: 'Usually from the Old Testament (Acts during Easter)',
    responsorialPsalm: 'Psalm response to the first reading',
    secondReading: 'From the New Testament letters',
    gospelAcclamation: 'Verse before the Gospel',
    gospel: 'From one of the four Gospels'
  },
  whereToFind: 'Visit USCCB.org or other Catholic liturgy websites for current readings'
};

// API Routes

// Get Order of Mass
router.get('/mass/order', (req, res) => {
  const { language = 'english' } = req.query;
  
  if (orderOfMass[language]) {
    res.json(orderOfMass[language]);
  } else {
    res.status(404).json({ 
      error: 'Language not found',
      availableLanguages: Object.keys(orderOfMass)
    });
  }
});

// Get Daily Readings Information
router.get('/readings/daily', (req, res) => {
  res.json(readingsInfo);
});

// Get Sunday Readings Structure
router.get('/readings/sunday', (req, res) => {
  res.json(sundayReadingsStructure);
});

// Get Liturgy of Hours Information
router.get('/breviary', (req, res) => {
  res.json(liturgyOfHours);
});

// Get Missal Information
router.get('/missal', (req, res) => {
  res.json(missalInfo);
});

// Get all Nigerian liturgical resources
router.get('/', (req, res) => {
  res.json({
    orderOfMass: {
      description: 'Structure and prayers of the Catholic Mass',
      endpoint: '/api/nigerian/mass/order'
    },
    dailyReadings: {
      description: 'Information about daily Mass readings',
      endpoint: '/api/nigerian/readings/daily'
    },
    sundayReadings: {
      description: 'Structure of Sunday Mass readings',
      endpoint: '/api/nigerian/readings/sunday'
    },
    breviary: {
      description: 'Liturgy of the Hours (Divine Office)',
      endpoint: '/api/nigerian/breviary'
    },
    missal: {
      description: 'Information about the Roman Missal',
      endpoint: '/api/nigerian/missal'
    }
  });
});

module.exports = router;
