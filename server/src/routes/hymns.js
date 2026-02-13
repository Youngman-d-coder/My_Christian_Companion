const express = require('express');
const router = express.Router();

// Hymn library data - organized by denomination and category
const hymnLibrary = {
  traditional: {
    classic: [
      {
        id: 'amazing-grace',
        title: 'Amazing Grace',
        author: 'John Newton',
        year: 1779,
        denomination: 'All',
        category: 'Grace & Salvation',
        youtubeLink: 'https://www.youtube.com/watch?v=CDdvReNKKuk',
        lyricsLink: 'https://hymnary.org/text/amazing_grace_how_sweet_the_sound',
        firstLine: 'Amazing grace, how sweet the sound',
        description: 'One of the most beloved hymns in Christianity, written by former slave trader John Newton.'
      },
      {
        id: 'how-great-thou-art',
        title: 'How Great Thou Art',
        author: 'Carl Boberg, Stuart K. Hine',
        year: 1885,
        denomination: 'All',
        category: 'Praise & Worship',
        youtubeLink: 'https://www.youtube.com/watch?v=Cc3X8mAGIqk',
        lyricsLink: 'https://hymnary.org/text/o_lord_my_god_when_i_in_awesome_wonder',
        firstLine: 'O Lord my God, when I in awesome wonder',
        description: 'A beloved hymn expressing awe at God\'s creation and the sacrifice of Christ.'
      },
      {
        id: 'great-is-thy-faithfulness',
        title: 'Great Is Thy Faithfulness',
        author: 'Thomas Chisholm',
        year: 1923,
        denomination: 'All',
        category: 'Faith & Trust',
        youtubeLink: 'https://www.youtube.com/watch?v=fAqwezN85KU',
        lyricsLink: 'https://hymnary.org/text/great_is_thy_faithfulness_o_god_my_fathe',
        firstLine: 'Great is Thy faithfulness, O God my Father',
        description: 'A hymn celebrating God\'s unchanging nature and daily mercies.'
      },
      {
        id: 'it-is-well',
        title: 'It Is Well With My Soul',
        author: 'Horatio Spafford',
        year: 1873,
        denomination: 'All',
        category: 'Comfort & Peace',
        youtubeLink: 'https://www.youtube.com/watch?v=zY5o9mP22V0',
        lyricsLink: 'https://hymnary.org/text/when_peace_like_a_river_attendeth_my_way',
        firstLine: 'When peace like a river attendeth my way',
        description: 'Written after the tragic loss of Spafford\'s four daughters at sea.'
      },
      {
        id: 'holy-holy-holy',
        title: 'Holy, Holy, Holy',
        author: 'Reginald Heber',
        year: 1826,
        denomination: 'All',
        category: 'Trinity & Holiness',
        youtubeLink: 'https://www.youtube.com/watch?v=f7FAKFhq4dQ',
        lyricsLink: 'https://hymnary.org/text/holy_holy_holy_lord_god_almighty_early',
        firstLine: 'Holy, holy, holy! Lord God Almighty',
        description: 'A majestic hymn celebrating the Trinity and holiness of God.'
      },
      {
        id: 'blessed-assurance',
        title: 'Blessed Assurance',
        author: 'Fanny Crosby',
        year: 1873,
        denomination: 'All',
        category: 'Assurance & Joy',
        youtubeLink: 'https://www.youtube.com/watch?v=OQqCOWqHDBg',
        lyricsLink: 'https://hymnary.org/text/blessed_assurance_jesus_is_mine',
        firstLine: 'Blessed assurance, Jesus is mine',
        description: 'A hymn of confidence in salvation and joy in the Lord.'
      }
    ],
    christmas: [
      {
        id: 'silent-night',
        title: 'Silent Night',
        author: 'Joseph Mohr',
        year: 1818,
        denomination: 'All',
        category: 'Christmas',
        youtubeLink: 'https://www.youtube.com/watch?v=qK2bD1l2XYs',
        lyricsLink: 'https://hymnary.org/text/silent_night_holy_night_all_is_calm_all',
        firstLine: 'Silent night, holy night',
        description: 'The most beloved Christmas carol, originally written in German.'
      },
      {
        id: 'o-come-all-ye-faithful',
        title: 'O Come, All Ye Faithful',
        author: 'John Francis Wade',
        year: 1743,
        denomination: 'All',
        category: 'Christmas',
        youtubeLink: 'https://www.youtube.com/watch?v=_dYBCc4QPQM',
        lyricsLink: 'https://hymnary.org/text/o_come_all_ye_faithful_joyful_and_triump',
        firstLine: 'O come, all ye faithful, joyful and triumphant',
        description: 'An invitation to worship the newborn King.'
      },
      {
        id: 'hark-the-herald',
        title: 'Hark! The Herald Angels Sing',
        author: 'Charles Wesley',
        year: 1739,
        denomination: 'All',
        category: 'Christmas',
        youtubeLink: 'https://www.youtube.com/watch?v=SXBNRcKko4I',
        lyricsLink: 'https://hymnary.org/text/hark_the_herald_angels_sing_glory_to_the',
        firstLine: 'Hark! The herald angels sing',
        description: 'A joyful proclamation of Christ\'s birth and its significance.'
      },
      {
        id: 'joy-to-the-world',
        title: 'Joy to the World',
        author: 'Isaac Watts',
        year: 1719,
        denomination: 'All',
        category: 'Christmas',
        youtubeLink: 'https://www.youtube.com/watch?v=IYHNfRqHu8s',
        lyricsLink: 'https://hymnary.org/text/joy_to_the_world_the_lord_is_come',
        firstLine: 'Joy to the world! The Lord is come',
        description: 'A triumphant celebration of Christ coming to Earth.'
      }
    ],
    easter: [
      {
        id: 'christ-the-lord-is-risen',
        title: 'Christ the Lord Is Risen Today',
        author: 'Charles Wesley',
        year: 1739,
        denomination: 'All',
        category: 'Easter',
        youtubeLink: 'https://www.youtube.com/watch?v=fqM8iDE_-yA',
        lyricsLink: 'https://hymnary.org/text/christ_the_lord_is_risen_today_alleluia',
        firstLine: 'Christ the Lord is risen today, Alleluia',
        description: 'The quintessential Easter hymn celebrating Christ\'s resurrection.'
      },
      {
        id: 'up-from-the-grave',
        title: 'Up From the Grave He Arose',
        author: 'Robert Lowry',
        year: 1874,
        denomination: 'All',
        category: 'Easter',
        youtubeLink: 'https://www.youtube.com/watch?v=O0dWrtmJQgU',
        lyricsLink: 'https://hymnary.org/text/low_in_the_grave_he_lay_jesus_my_savior',
        firstLine: 'Low in the grave He lay, Jesus my Savior',
        description: 'A triumphant declaration of Christ\'s victory over death.'
      }
    ]
  },
  catholic: {
    marian: [
      {
        id: 'hail-holy-queen',
        title: 'Hail, Holy Queen',
        author: 'Traditional',
        year: 1000,
        denomination: 'Catholic',
        category: 'Marian',
        youtubeLink: 'https://www.youtube.com/watch?v=FhC-NdBPsyQ',
        lyricsLink: 'https://en.wikipedia.org/wiki/Salve_Regina',
        firstLine: 'Hail, holy Queen, mother of mercy',
        description: 'Ancient Marian antiphon, part of the Salve Regina.'
      },
      {
        id: 'immaculate-mary',
        title: 'Immaculate Mary',
        author: 'Traditional',
        year: 1800,
        denomination: 'Catholic',
        category: 'Marian',
        youtubeLink: 'https://www.youtube.com/watch?v=dLTZXxqJF9w',
        lyricsLink: 'https://hymnary.org/text/immaculate_mary_your_praises_we_sing',
        firstLine: 'Immaculate Mary, your praises we sing',
        description: 'A beloved Marian hymn honoring the Immaculate Conception.'
      }
    ],
    liturgical: [
      {
        id: 'holy-god-we-praise',
        title: 'Holy God, We Praise Thy Name',
        author: 'Ignaz Franz',
        year: 1774,
        denomination: 'Catholic',
        category: 'Praise',
        youtubeLink: 'https://www.youtube.com/watch?v=d7fW8aq9uU8',
        lyricsLink: 'https://hymnary.org/text/holy_god_we_praise_thy_name_lord_of_all',
        firstLine: 'Holy God, we praise Thy Name',
        description: 'Based on the ancient Te Deum, a hymn of praise and thanksgiving.'
      },
      {
        id: 'tantum-ergo',
        title: 'Tantum Ergo',
        author: 'St. Thomas Aquinas',
        year: 1264,
        denomination: 'Catholic',
        category: 'Eucharistic',
        youtubeLink: 'https://www.youtube.com/watch?v=EqfihN0k9aY',
        lyricsLink: 'https://en.wikipedia.org/wiki/Tantum_ergo',
        firstLine: 'Tantum ergo Sacramentum',
        description: 'Traditional Eucharistic hymn used during Benediction.'
      }
    ]
  },
  protestant: {
    reformation: [
      {
        id: 'mighty-fortress',
        title: 'A Mighty Fortress Is Our God',
        author: 'Martin Luther',
        year: 1529,
        denomination: 'Protestant',
        category: 'Reformation',
        youtubeLink: 'https://www.youtube.com/watch?v=YbKPfVDsyoM',
        lyricsLink: 'https://hymnary.org/text/a_mighty_fortress_is_our_god_a_bulwark',
        firstLine: 'A mighty fortress is our God',
        description: 'Martin Luther\'s most famous hymn, often called the "Battle Hymn of the Reformation".'
      }
    ],
    contemporary: [
      {
        id: 'in-christ-alone',
        title: 'In Christ Alone',
        author: 'Keith Getty, Stuart Townend',
        year: 2001,
        denomination: 'Protestant',
        category: 'Contemporary',
        youtubeLink: 'https://www.youtube.com/watch?v=16KYvfIE00g',
        lyricsLink: 'https://hymnary.org/text/in_christ_alone_my_hope_is_found',
        firstLine: 'In Christ alone my hope is found',
        description: 'Modern hymn expressing the core doctrines of the Christian faith.'
      },
      {
        id: 'cornerstone',
        title: 'My Hope Is Built on Nothing Less (Cornerstone)',
        author: 'Edward Mote',
        year: 1834,
        denomination: 'Protestant',
        category: 'Faith & Trust',
        youtubeLink: 'https://www.youtube.com/watch?v=a2qLoqjEqfE',
        lyricsLink: 'https://hymnary.org/text/my_hope_is_built_on_nothing_less',
        firstLine: 'My hope is built on nothing less',
        description: 'A declaration of faith built on Christ alone.'
      }
    ],
    gospel: [
      {
        id: 'old-rugged-cross',
        title: 'The Old Rugged Cross',
        author: 'George Bennard',
        year: 1912,
        denomination: 'Protestant',
        category: 'Gospel',
        youtubeLink: 'https://www.youtube.com/watch?v=kXDKoZXCXTk',
        lyricsLink: 'https://hymnary.org/text/on_a_hill_far_away_stood_an_old_rugged',
        firstLine: 'On a hill far away stood an old rugged cross',
        description: 'A powerful gospel hymn about the cross and its redemptive power.'
      },
      {
        id: 'because-he-lives',
        title: 'Because He Lives',
        author: 'Bill and Gloria Gaither',
        year: 1971,
        denomination: 'Protestant',
        category: 'Gospel',
        youtubeLink: 'https://www.youtube.com/watch?v=xYkyRUsl-0w',
        lyricsLink: 'https://hymnary.org/text/god_sent_his_son_they_called_him_jesus',
        firstLine: 'God sent His Son, they called Him Jesus',
        description: 'An inspiring gospel song about hope and assurance in Christ.'
      }
    ]
  },
  orthodox: {
    byzantine: [
      {
        id: 'christ-is-risen',
        title: 'Christ Is Risen from the Dead',
        author: 'Traditional Byzantine',
        year: 800,
        denomination: 'Orthodox',
        category: 'Paschal',
        youtubeLink: 'https://www.youtube.com/watch?v=xMbFn_QUJEI',
        lyricsLink: 'https://en.wikipedia.org/wiki/Paschal_troparion',
        firstLine: 'Christ is risen from the dead',
        description: 'The primary Paschal troparion sung throughout the Easter season in Orthodox churches.'
      },
      {
        id: 'holy-god-trisagion',
        title: 'Holy God (Trisagion Hymn)',
        author: 'Traditional',
        year: 400,
        denomination: 'Orthodox',
        category: 'Liturgical',
        youtubeLink: 'https://www.youtube.com/watch?v=9CkFRhY8pAQ',
        lyricsLink: 'https://en.wikipedia.org/wiki/Trisagion',
        firstLine: 'Holy God, Holy Mighty, Holy Immortal',
        description: 'Ancient hymn sung in Divine Liturgy, honoring the Holy Trinity.'
      }
    ],
    troparion: [
      {
        id: 'o-gladsome-light',
        title: 'O Gladsome Light',
        author: 'Traditional',
        year: 200,
        denomination: 'Orthodox',
        category: 'Vespers',
        youtubeLink: 'https://www.youtube.com/watch?v=1V4fSN0N_-Q',
        lyricsLink: 'https://en.wikipedia.org/wiki/Phos_Hilaron',
        firstLine: 'O gladsome light of the holy glory',
        description: 'One of the oldest Christian hymns still in use, sung at Vespers.'
      }
    ]
  },
  contemporary: {
    worship: [
      {
        id: '10000-reasons',
        title: '10,000 Reasons (Bless the Lord)',
        author: 'Matt Redman, Jonas Myrin',
        year: 2011,
        denomination: 'All',
        category: 'Contemporary Worship',
        youtubeLink: 'https://www.youtube.com/watch?v=XtwIT8JjddM',
        lyricsLink: 'https://www.azlyrics.com/lyrics/mattredman/10000reasonsblessthelordomysoul.html',
        firstLine: 'Bless the Lord, O my soul',
        description: 'Modern worship anthem encouraging continual praise to God.'
      },
      {
        id: 'what-a-beautiful-name',
        title: 'What a Beautiful Name',
        author: 'Ben Fielding, Brooke Ligertwood',
        year: 2016,
        denomination: 'All',
        category: 'Contemporary Worship',
        youtubeLink: 'https://www.youtube.com/watch?v=nQWFzMvCfLE',
        lyricsLink: 'https://www.azlyrics.com/lyrics/hillsongunited/whatabeautifulname.html',
        firstLine: 'You were the Word at the beginning',
        description: 'Powerful worship song exalting the name of Jesus.'
      },
      {
        id: 'way-maker',
        title: 'Way Maker',
        author: 'Sinach',
        year: 2015,
        denomination: 'All',
        category: 'Contemporary Worship',
        youtubeLink: 'https://www.youtube.com/watch?v=29IWPv5eQZ0',
        lyricsLink: 'https://www.azlyrics.com/lyrics/sinach/waymaker.html',
        firstLine: 'You are here, moving in our midst',
        description: 'Contemporary worship song declaring God\'s active presence and power.'
      }
    ]
  },
  spirituals: {
    traditional: [
      {
        id: 'swing-low',
        title: 'Swing Low, Sweet Chariot',
        author: 'Wallace Willis',
        year: 1865,
        denomination: 'All',
        category: 'Spiritual',
        youtubeLink: 'https://www.youtube.com/watch?v=JErXjaVI_IQ',
        lyricsLink: 'https://hymnary.org/text/swing_low_sweet_chariot',
        firstLine: 'Swing low, sweet chariot',
        description: 'Classic African American spiritual expressing hope for heaven.'
      },
      {
        id: 'were-you-there',
        title: 'Were You There',
        author: 'Traditional Spiritual',
        year: 1800,
        denomination: 'All',
        category: 'Spiritual',
        youtubeLink: 'https://www.youtube.com/watch?v=ORLNdm3AE2A',
        lyricsLink: 'https://hymnary.org/text/were_you_there_when_they_crucified_my_lo',
        firstLine: 'Were you there when they crucified my Lord',
        description: 'Poignant spiritual reflecting on Christ\'s crucifixion.'
      }
    ]
  }
};

// Get all hymns
router.get('/', (req, res) => {
  res.json(hymnLibrary);
});

// Get hymns by category (traditional, catholic, protestant, orthodox, contemporary, spirituals)
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  
  if (hymnLibrary[category]) {
    res.json(hymnLibrary[category]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Search hymns by title, author, or first line
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  const searchTerm = q.toLowerCase();
  const results = [];
  
  // Search through all categories and subcategories
  Object.entries(hymnLibrary).forEach(([categoryKey, category]) => {
    Object.entries(category).forEach(([subCategoryKey, hymns]) => {
      hymns.forEach(hymn => {
        if (
          hymn.title.toLowerCase().includes(searchTerm) ||
          hymn.author.toLowerCase().includes(searchTerm) ||
          hymn.firstLine.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            ...hymn,
            category: categoryKey,
            subCategory: subCategoryKey
          });
        }
      });
    });
  });
  
  res.json(results);
});

// Get featured/popular hymns
router.get('/featured', (req, res) => {
  const featured = [
    hymnLibrary.traditional.classic[0], // Amazing Grace
    hymnLibrary.traditional.classic[1], // How Great Thou Art
    hymnLibrary.traditional.christmas[0], // Silent Night
    hymnLibrary.protestant.contemporary[0], // In Christ Alone
    hymnLibrary.contemporary.worship[0], // 10,000 Reasons
    hymnLibrary.traditional.classic[3] // It Is Well
  ];
  
  res.json(featured);
});

module.exports = router;
