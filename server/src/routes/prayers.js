const express = require('express');
const router = express.Router();

// Prayer library data - organized by denomination
const prayerLibrary = {
  catholic: {
    daily: [
      {
        id: 'morning-offering',
        title: 'Morning Offering',
        text: 'O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.'
      },
      {
        id: 'angelus',
        title: 'The Angelus',
        text: 'V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\n\nHail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to thy word.\n\nHail Mary...\n\nV. And the Word was made Flesh.\nR. And dwelt among us.\n\nHail Mary...\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection, through the same Christ Our Lord. Amen.'
      },
      {
        id: 'divine-mercy',
        title: 'Divine Mercy Chaplet',
        instructions: 'On the Our Father beads:\n"Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world."\n\nOn the Hail Mary beads:\n"For the sake of His sorrowful Passion, have mercy on us and on the whole world."\n\nConcluding prayer (3x):\n"Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world."'
      }
    ],
    rosary: {
      mysteries: {
        joyful: ['Annunciation', 'Visitation', 'Nativity', 'Presentation', 'Finding in the Temple'],
        luminous: ['Baptism of Jesus', 'Wedding at Cana', 'Proclamation of the Kingdom', 'Transfiguration', 'Institution of the Eucharist'],
        sorrowful: ['Agony in the Garden', 'Scourging at the Pillar', 'Crowning with Thorns', 'Carrying of the Cross', 'Crucifixion'],
        glorious: ['Resurrection', 'Ascension', 'Descent of the Holy Spirit', 'Assumption', 'Coronation of Mary']
      },
      prayers: {
        'apostles-creed': 'I believe in God, the Father Almighty, Creator of Heaven and earth; and in Jesus Christ, His only Son Our Lord, Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into Hell; the third day He rose again from the dead; He ascended into Heaven, and sitteth at the right hand of God, the Father almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body and life everlasting. Amen.',
        'our-father': 'Our Father, Who art in heaven, Hallowed be Thy Name. Thy Kingdom come. Thy Will be done, on earth as it is in Heaven. Give us this day our daily bread. And forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.',
        'hail-mary': 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
        'glory-be': 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
        'fatima-prayer': 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of Thy mercy.'
      }
    }
  },
  protestant: {
    daily: [
      {
        id: 'lords-prayer',
        title: "The Lord's Prayer",
        text: 'Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as in heaven. Give us today our daily bread. Forgive us our sins as we forgive those who sin against us. Lead us not into temptation but deliver us from evil. For the kingdom, the power, and the glory are yours now and forever. Amen.'
      },
      {
        id: 'morning-prayer',
        title: 'Morning Prayer',
        text: 'Lord God, almighty and everlasting Father, you have brought me in safety to this new day: Preserve me with your mighty power, that I may not fall into sin, nor be overcome by adversity; and in all I do direct me to the fulfilling of your purpose; through Jesus Christ my Lord. Amen.'
      },
      {
        id: 'evening-prayer',
        title: 'Evening Prayer',
        text: 'O Lord our God, what sins I have committed today, in word, deed, or thought, forgive me, for You are gracious and You love all mankind. Grant me peaceful and undisturbed sleep. Send me Your guardian angel to protect and guard me from every evil. For You are the guardian of our souls and bodies, and to You we give glory, Father, Son, and Holy Spirit, now and ever and unto ages of ages. Amen.'
      },
      {
        id: 'grace-before-meals',
        title: 'Grace Before Meals',
        text: 'Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.'
      }
    ],
    psalms: [
      { id: 23, title: 'Psalm 23', reference: 'The Lord is my shepherd...' },
      { id: 91, title: 'Psalm 91', reference: 'He who dwells in the shelter of the Most High...' },
      { id: 139, title: 'Psalm 139', reference: 'O Lord, you have searched me and known me...' }
    ]
  },
  orthodox: {
    daily: [
      {
        id: 'trisagion',
        title: 'Trisagion Prayers',
        text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.\n\nGlory to You, our God, glory to You.\n\nO Heavenly King, the Comforter, the Spirit of Truth, Who are everywhere and fill all things, Treasury of Blessings, and Giver of Life: Come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.\n\nHoly God, Holy Mighty, Holy Immortal, have mercy on us. (3x)\n\nGlory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.'
      },
      {
        id: 'jesus-prayer',
        title: 'Jesus Prayer',
        text: 'Lord Jesus Christ, Son of God, have mercy on me, a sinner.'
      }
    ]
  },
  common: [
    {
      id: 'serenity-prayer',
      title: 'Serenity Prayer',
      text: 'God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference. Living one day at a time, enjoying one moment at a time, accepting hardship as a pathway to peace. Amen.'
    }
  ]
};

// Get all prayers
router.get('/', (req, res) => {
  res.json(prayerLibrary);
});

// Get prayers by denomination
router.get('/:denomination', (req, res) => {
  const { denomination } = req.params;
  
  if (prayerLibrary[denomination]) {
    res.json(prayerLibrary[denomination]);
  } else {
    res.status(404).json({ error: 'Denomination not found' });
  }
});

module.exports = router;
