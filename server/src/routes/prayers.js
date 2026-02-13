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
      },
      {
        id: 'morning-prayers',
        title: 'Orthodox Morning Prayers',
        text: 'Having risen from sleep, I thank Thee, O Holy Trinity, for through Thy great goodness and patience Thou wast not angered with me, an idler and sinner, neither hast Thou destroyed me in my sins, but hast shown Thy usual love for mankind. And when I was prostrate in despair, Thou hast raised me to keep the morning watch and glorify Thy power. Enlighten now my mind\'s eye and open my mouth to study Thy words and understand Thy commandments, and to do Thy will, and sing to Thee in heartfelt adoration, and praise Thy most holy name of Father, Son, and Holy Spirit, now and ever, and unto ages of ages. Amen.\n\nCome, let us worship God our King.\nCome, let us worship and fall down before Christ, our King and our God.\nCome, let us worship and fall down before Christ Himself, our King and our God.'
      },
      {
        id: 'evening-prayers',
        title: 'Orthodox Evening Prayers',
        text: 'O Lord our God, if during this day I have sinned, whether in word or deed or thought, forgive me all, for Thou art good and lovest mankind. Grant me peaceful and undisturbed sleep, and deliver me from all influence and temptation of the evil one. Raise me up again in proper time that I may glorify Thee, for Thou art blessed with Thine only-begotten Son and Thy most holy, gracious, and life-creating Spirit, now and ever and unto ages of ages. Amen.\n\nO most glorious ever-virgin, blessed Theotokos, present our prayer to thy Son and our God, and pray that He may save our souls through thee.\n\nAll my hope I place in thee, O Mother of God; keep me under thy protection.'
      },
      {
        id: 'prayer-before-meals',
        title: 'Prayer Before Meals',
        text: 'Our Father, Who art in the heavens, hallowed be Thy Name. Thy Kingdom come, Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we forgive our debtors; and lead us not into temptation, but deliver us from the evil one.\n\nThrough the prayers of our holy Fathers, O Lord Jesus Christ our God, have mercy on us. Amen.\n\nThe eyes of all look to Thee with hope, and Thou givest them their food in due season; Thou openest Thy hand and fillest every living thing with Thy favor.\n\nGlory to the Father, and to the Son, and to the Holy Spirit, now and ever, and unto ages of ages. Amen.'
      },
      {
        id: 'prayer-after-meals',
        title: 'Prayer After Meals',
        text: 'We thank Thee, O Christ our God, that Thou hast satisfied us with Thy earthly gifts; deprive us not of Thy heavenly kingdom, but as Thou camest among Thy disciples, O Savior, and gavest them peace, come to us and save us.\n\nGlory to the Father, and to the Son, and to the Holy Spirit, now and ever, and unto ages of ages. Amen.\n\nLord, have mercy. (3x)'
      },
      {
        id: 'nicene-creed',
        title: 'The Nicene Creed',
        text: 'I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.\n\nAnd in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages. Light of Light; true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made; Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried. And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father; and He shall come again with glory to judge the living and the dead; Whose Kingdom shall have no end.\n\nAnd in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshipped and glorified; Who spoke by the prophets.\n\nIn one Holy, Catholic, and Apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead and the life of the world to come. Amen.'
      },
      {
        id: 'prayer-of-st-ephraim',
        title: 'Prayer of St. Ephraim the Syrian',
        text: 'O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.\n\nBut give rather the spirit of chastity, humility, patience, and love to Thy servant.\n\nYea, O Lord and King, grant me to see my own sins and not to judge my brother, for blessed art Thou unto ages of ages. Amen.'
      },
      {
        id: 'prayer-to-theotokos',
        title: 'Prayer to the Most Holy Theotokos',
        text: 'O most holy Lady Theotokos, light of my darkened soul, my hope, protection, comfort, my refuge and my joy, I thank thee that thou hast enabled me, who am unworthy, to be a partaker of the pure Body and precious Blood of thy Son. But do thou who gavest birth to the true Light, enlighten the spiritual eyes of my heart. O thou who didst conceive the fountain of immortality, give me life. O loving Mother of the merciful God, have mercy on me and grant me compunction and contrition in my heart, humility in my thoughts, and the recall of my reasoning powers from captivity. And make me worthy, until my last breath, to receive without condemnation the sanctification of the most pure Mysteries for the healing of soul and body. And grant me tears of repentance and confession, that I may praise and glorify thee all the days of my life, for thou art blessed and glorified unto the ages. Amen.'
      },
      {
        id: 'communion-prayers',
        title: 'Prayers Before Holy Communion',
        text: 'I believe, O Lord, and I confess that Thou art truly the Christ, the Son of the living God, Who came into the world to save sinners, of whom I am first. I believe also that this is truly Thine own most pure Body and that this is truly Thine own precious Blood. Therefore, I pray Thee, have mercy upon me and forgive my transgressions, voluntary and involuntary, in word and in deed, known and unknown. And make me worthy, without condemnation, to partake of Thy most pure Mysteries for the remission of sins and for life eternal. Amen.\n\nOf Thy Mystical Supper, O Son of God, accept me today as a communicant; for I will not speak of Thy Mystery to Thine enemies, neither like Judas will I give Thee a kiss; but like the thief will I confess Thee: Remember me, O Lord, in Thy Kingdom.\n\nMay the communion of Thy Holy Mysteries be neither to my judgment nor to my condemnation, O Lord, but to the healing of soul and body. Amen.'
      },
      {
        id: 'akathist-hymn-opening',
        title: 'Opening of the Akathist Hymn',
        text: 'To thee, the Champion Leader, we thy servants dedicate a feast of victory and of thanksgiving as ones rescued out of sufferings, O Theotokos: but as thou art one with might which is invincible, from all dangers that can be do thou deliver us, that we may cry to thee: Rejoice, O unwedded Bride!'
      }
    ],
    liturgical: [
      {
        id: 'lords-prayer-orthodox',
        title: "The Lord's Prayer (Orthodox)",
        text: 'Our Father, Who art in the heavens, hallowed be Thy Name. Thy Kingdom come, Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we forgive our debtors; and lead us not into temptation, but deliver us from the evil one.'
      },
      {
        id: 'theotokion',
        title: 'Theotokion',
        text: 'It is truly meet to bless thee, O Theotokos, ever blessed and most pure and the Mother of our God. More honorable than the Cherubim and more glorious beyond compare than the Seraphim. Without defilement thou gavest birth to God the Word, true Theotokos, we magnify thee.'
      },
      {
        id: 'doxology',
        title: 'Glory to God in the Highest',
        text: 'Glory to God in the highest, and on earth peace, good will among men. We praise Thee, we bless Thee, we worship Thee, we glorify Thee, we give thanks to Thee for Thy great glory. O Lord, heavenly King, God the Father Almighty; O Lord, the only-begotten Son, Jesus Christ; and O Holy Spirit. O Lord God, Lamb of God, Son of the Father, Who takest away the sin of the world, have mercy on us, Thou Who takest away the sins of the world. Receive our prayer, Thou Who sittest at the right hand of the Father, and have mercy on us. For Thou only art holy, Thou only art the Lord, O Jesus Christ, to the Glory of God the Father. Amen.'
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
