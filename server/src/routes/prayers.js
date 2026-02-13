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
      },
      {
        id: 'act-of-contrition',
        title: 'Act of Contrition',
        text: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all-good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.'
      },
      {
        id: 'guardian-angel-prayer',
        title: 'Guardian Angel Prayer',
        text: 'Angel of God, my guardian dear, to whom God\'s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.'
      },
      {
        id: 'st-michael-prayer',
        title: 'Prayer to St. Michael the Archangel',
        text: 'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the Heavenly Host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.'
      },
      {
        id: 'memorare',
        title: 'The Memorare',
        text: 'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.'
      },
      {
        id: 'anima-christi',
        title: 'Anima Christi (Soul of Christ)',
        text: 'Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within Thy wounds hide me. Suffer me not to be separated from Thee. From the malicious enemy defend me. In the hour of my death call me, and bid me come unto Thee, that with Thy saints I may praise Thee forever and ever. Amen.'
      },
      {
        id: 'grace-before-meals',
        title: 'Grace Before Meals',
        text: 'Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.'
      },
      {
        id: 'grace-after-meals',
        title: 'Grace After Meals',
        text: 'We give Thee thanks, Almighty God, for all Thy benefits, Who livest and reignest world without end. May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.'
      },
      {
        id: 'night-prayer',
        title: 'Night Prayer',
        text: 'Now I lay me down to sleep, I pray the Lord my soul to keep. May God guard me through the night, and wake me with the morning light. Amen.\n\nVisit, we beseech Thee, O Lord, this dwelling, and drive far from it all snares of the enemy; let Thy holy angels dwell herein to preserve us in peace; and let Thy blessing be upon us always. Through Christ our Lord. Amen.'
      },
      {
        id: 'act-of-faith',
        title: 'Act of Faith',
        text: 'O my God, I firmly believe that Thou art one God in three Divine Persons, Father, Son and Holy Spirit. I believe that Thy divine Son became man and died for our sins, and that He will come to judge the living and the dead. I believe these and all the truths which the holy Catholic Church teaches, because Thou hast revealed them, Who canst neither deceive nor be deceived. Amen.'
      },
      {
        id: 'act-of-hope',
        title: 'Act of Hope',
        text: 'O my God, relying on Thy infinite goodness and promises, I hope to obtain pardon of my sins, the help of Thy grace, and life everlasting, through the merits of Jesus Christ, my Lord and Redeemer. Amen.'
      },
      {
        id: 'act-of-charity',
        title: 'Act of Charity (Love)',
        text: 'O my God, I love Thee above all things, with my whole heart and soul, because Thou art all-good and worthy of all love. I love my neighbor as myself for the love of Thee. I forgive all who have injured me, and ask pardon of all whom I have injured. Amen.'
      }
    ],
    saints: [
      {
        id: 'prayer-to-st-joseph',
        title: 'Prayer to St. Joseph',
        text: 'O St. Joseph, whose protection is so great, so strong, so prompt before the throne of God, I place in you all my interests and desires. O St. Joseph, assist me by your powerful intercession and obtain for me from your divine Son all spiritual blessings through Jesus Christ, our Lord; so that having engaged here below your heavenly power, I may offer my thanksgiving and homage to the most loving of Fathers. O St. Joseph, I never weary contemplating you and Jesus asleep in your arms; I dare not approach while He reposes near your heart. Press Him in my name and kiss His fine head for me, and ask Him to return the kiss when I draw my dying breath. St. Joseph, patron of departing souls, pray for us. Amen.'
      },
      {
        id: 'prayer-to-st-anthony',
        title: 'Prayer to St. Anthony',
        text: 'O Holy St. Anthony, gentlest of Saints, your love for God and charity for His creatures made you worthy when on earth to possess miraculous powers. Encouraged by this thought, I implore you to obtain for me the favor I seek in this novena. O gentle and loving St. Anthony, whose heart was ever full of human sympathy, whisper my petition into the ears of the sweet Infant Jesus, who loved to be folded in your arms; and the gratitude of my heart will ever be yours. Amen.'
      },
      {
        id: 'prayer-to-st-francis',
        title: 'Prayer of St. Francis',
        text: 'Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy.\n\nO divine Master, grant that I may not so much seek to be consoled as to console, to be understood as to understand, to be loved as to love. For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in dying that we are born to eternal life. Amen.'
      },
      {
        id: 'prayer-to-st-therese',
        title: 'Prayer to St. Therese of Lisieux',
        text: 'O Little Therese of the Child Jesus, please pick for me a rose from the heavenly gardens and send it to me as a message of love. O Little Flower of Jesus, ask God today to grant the favors I now place with confidence in your hands. St. Therese, help me to always believe, as you did, in God\'s great love for me, so that I might imitate your "Little Way" each day. Amen.'
      },
      {
        id: 'prayer-to-st-jude',
        title: 'Prayer to St. Jude',
        text: 'Most holy Apostle St. Jude, faithful servant and friend of Jesus, the Church honors and invokes you universally as the patron of hopeless cases, of things almost despaired of. Pray for me, I am so helpless and alone. Make use I implore you, of that particular privilege given to you, to bring visible and speedy help where help is almost despaired of. Come to my assistance in this great need that I may receive the consolation and help of heaven in all my necessities, tribulations, and sufferings, and that I may praise God with you and all the elect forever. I promise, O blessed St. Jude, to be ever mindful of this great favor, to always honor you as my special and powerful patron, and to gratefully encourage devotion to you. Amen.'
      },
      {
        id: 'prayer-to-st-padre-pio',
        title: 'Prayer to St. Padre Pio',
        text: 'O God, you gave Saint Pio of Pietrelcina, Capuchin priest, the great privilege of participating in a unique way in the passion of your Son, grant me through his intercession the grace which I ardently desire; and above all grant me the grace of living in conformity with the death of Jesus, to arrive at the glory of the resurrection. Glory be to the Father... Amen.'
      }
    ],
    litanies: [
      {
        id: 'litany-sacred-heart',
        title: 'Litany of the Sacred Heart of Jesus',
        text: 'Lord, have mercy on us. Christ, have mercy on us.\nLord, have mercy on us. Christ, hear us. Christ, graciously hear us.\n\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, One God, have mercy on us.\n\nHeart of Jesus, Son of the Eternal Father, have mercy on us.\nHeart of Jesus, formed by the Holy Spirit in the womb of the Virgin Mother, have mercy on us.\nHeart of Jesus, substantially united to the Word of God, have mercy on us.\nHeart of Jesus, of infinite majesty, have mercy on us.\nHeart of Jesus, Sacred Temple of God, have mercy on us.\nHeart of Jesus, Tabernacle of the Most High, have mercy on us.\nHeart of Jesus, House of God and Gate of Heaven, have mercy on us.\nHeart of Jesus, burning furnace of charity, have mercy on us.\nHeart of Jesus, abode of justice and love, have mercy on us.\nHeart of Jesus, full of goodness and love, have mercy on us.\nHeart of Jesus, abyss of all virtues, have mercy on us.\nHeart of Jesus, most worthy of all praise, have mercy on us.\nHeart of Jesus, King and center of all hearts, have mercy on us.\nHeart of Jesus, in Whom are all the treasures of wisdom and knowledge, have mercy on us.\nHeart of Jesus, in Whom dwells the fullness of divinity, have mercy on us.\nHeart of Jesus, in Whom the Father was well pleased, have mercy on us.\nHeart of Jesus, of Whose fullness we have all received, have mercy on us.\nHeart of Jesus, desire of the everlasting hills, have mercy on us.\nHeart of Jesus, patient and most merciful, have mercy on us.\nHeart of Jesus, enriching all who invoke Thee, have mercy on us.\nHeart of Jesus, fountain of life and holiness, have mercy on us.\nHeart of Jesus, propitiation for our sins, have mercy on us.\nHeart of Jesus, loaded down with opprobrium, have mercy on us.\nHeart of Jesus, bruised for our offenses, have mercy on us.\nHeart of Jesus, obedient unto death, have mercy on us.\nHeart of Jesus, pierced with a lance, have mercy on us.\nHeart of Jesus, source of all consolation, have mercy on us.\nHeart of Jesus, our life and resurrection, have mercy on us.\nHeart of Jesus, our peace and reconciliation, have mercy on us.\nHeart of Jesus, victim for our sins, have mercy on us.\nHeart of Jesus, salvation of those who trust in Thee, have mercy on us.\nHeart of Jesus, hope of those who die in Thee, have mercy on us.\nHeart of Jesus, delight of all the Saints, have mercy on us.\n\nLamb of God, Who takest away the sins of the world, spare us, O Lord.\nLamb of God, Who takest away the sins of the world, graciously hear us, O Lord.\nLamb of God, Who takest away the sins of the world, have mercy on us.\n\nV. Jesus, meek and humble of heart.\nR. Make our hearts like unto Thine.\n\nLet us pray: Almighty and eternal God, look upon the Heart of Thy most beloved Son and upon the praises and satisfaction which He offers Thee in the name of sinners; and being appeased, grant pardon to those who seek Thy mercy, in the name of the same Thy Son, Jesus Christ, Who liveth and reigneth with Thee, world without end. Amen.'
      },
      {
        id: 'litany-blessed-virgin',
        title: 'Litany of the Blessed Virgin Mary',
        text: 'Lord, have mercy on us. Christ, have mercy on us.\nLord, have mercy on us. Christ, hear us. Christ, graciously hear us.\n\nGod, the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, One God, have mercy on us.\n\nHoly Mary, pray for us.\nHoly Mother of God, pray for us.\nHoly Virgin of virgins, pray for us.\nMother of Christ, pray for us.\nMother of the Church, pray for us.\nMother of divine grace, pray for us.\nMother most pure, pray for us.\nMother most chaste, pray for us.\nMother inviolate, pray for us.\nMother undefiled, pray for us.\nMother most amiable, pray for us.\nMother most admirable, pray for us.\nMother of good counsel, pray for us.\nMother of our Creator, pray for us.\nMother of our Savior, pray for us.\nVirgin most prudent, pray for us.\nVirgin most venerable, pray for us.\nVirgin most renowned, pray for us.\nVirgin most powerful, pray for us.\nVirgin most merciful, pray for us.\nVirgin most faithful, pray for us.\nMirror of justice, pray for us.\nSeat of wisdom, pray for us.\nCause of our joy, pray for us.\nSpiritual vessel, pray for us.\nVessel of honor, pray for us.\nSingular vessel of devotion, pray for us.\nMystical rose, pray for us.\nTower of David, pray for us.\nTower of ivory, pray for us.\nHouse of gold, pray for us.\nArk of the covenant, pray for us.\nGate of heaven, pray for us.\nMorning star, pray for us.\nHealth of the sick, pray for us.\nRefuge of sinners, pray for us.\nComfort of the afflicted, pray for us.\nHelp of Christians, pray for us.\nQueen of Angels, pray for us.\nQueen of Patriarchs, pray for us.\nQueen of Prophets, pray for us.\nQueen of Apostles, pray for us.\nQueen of Martyrs, pray for us.\nQueen of Confessors, pray for us.\nQueen of Virgins, pray for us.\nQueen of all Saints, pray for us.\nQueen conceived without original sin, pray for us.\nQueen assumed into heaven, pray for us.\nQueen of the most holy Rosary, pray for us.\nQueen of families, pray for us.\nQueen of peace, pray for us.\n\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray: Grant, we beseech Thee, O Lord God, that we Thy servants may enjoy perpetual health of mind and body; and by the glorious intercession of the Blessed Mary, ever Virgin, be delivered from present sorrow, and obtain eternal joy. Through Christ our Lord. Amen.'
      }
    ],
    devotional: [
      {
        id: 'act-of-spiritual-communion',
        title: 'Act of Spiritual Communion',
        text: 'My Jesus, I believe that You are present in the Most Holy Sacrament. I love You above all things, and I desire to receive You into my soul. Since I cannot at this moment receive You sacramentally, come at least spiritually into my heart. I embrace You as if You were already there and unite myself wholly to You. Never permit me to be separated from You. Amen.'
      },
      {
        id: 'sacred-heart-consecration',
        title: 'Consecration to the Sacred Heart',
        text: 'O Sacred Heart of Jesus, to Thee I consecrate and offer up my person and my life, my actions, trials, and sufferings, that my entire being may henceforth only be employed in loving, honoring and glorifying Thee. This is my irrevocable will, to belong entirely to Thee, and to do all for Thy love, renouncing with my whole heart all that can displease Thee.\n\nI take Thee, O Sacred Heart, for the sole object of my love, the protection of my life, the pledge of my salvation, the remedy of my frailty and inconstancy, the reparation for all the defects of my life, and my secure refuge at the hour of my death. Be Thou, O Most Merciful Heart, my justification before God Thy Father, and screen me from His anger which I have so justly merited. I fear all from my own weakness and malice, but placing my entire confidence in Thee, O Heart of Love, I hope all from Thine infinite Goodness. Annihilate in me all that can displease or resist Thee. Imprint Thy pure love so deeply in my heart that I may never forget Thee or be separated from Thee.\n\nI beseech Thee, through Thine infinite Goodness, grant that my name be engraved upon Thy Heart, for in this I place all my happiness and all my glory, to live and to die as one of Thy devoted servants. Amen.'
      },
      {
        id: 'immaculate-heart-consecration',
        title: 'Consecration to the Immaculate Heart of Mary',
        text: 'O Immaculate Heart of Mary, Queen of Heaven and Earth, and tender Mother of men, in accordance with thy ardent wish made known at Fatima, I consecrate to thee myself, my brethren, my country and the whole human race.\n\nReign over us and teach us how to make the Heart of thy Son, Our Lord Jesus Christ, reign and triumph in us, even as it has reigned and triumphed in thee.\n\nReign over us, dearest Mother, that we may be thine in prosperity, in adversity, in joy and in sorrow, in health and in sickness, in life and in death.\n\nO most compassionate Heart of Mary, Queen of Virgins, watch over our minds and our hearts and preserve them from the deluge of impurity which thou didst lament so sorrowfully at Fatima. We want to be pure like thee. We want to atone for the many crimes committed against Jesus and thee. We want to call down upon our country and the whole world the peace of God in justice and charity.\n\nTherefore we now promise to imitate thy virtues by the practice of the Christian life without regard to human respect. We resolve to receive Holy Communion on the first Saturday of every month and to offer thee five decades of the Rosary each day, together with our sacrifices, in a spirit of reparation. Amen.'
      },
      {
        id: 'st-gertrude-prayer',
        title: 'St. Gertrude\'s Prayer for the Souls in Purgatory',
        text: 'Eternal Father, I offer Thee the Most Precious Blood of Thy Divine Son, Jesus, in union with the Masses said throughout the world today, for all the Holy Souls in Purgatory, for sinners everywhere, for sinners in the universal Church, those in my own home and within my family. Amen.'
      },
      {
        id: 'regina-caeli',
        title: 'Regina Caeli (Queen of Heaven)',
        text: 'V. Queen of Heaven, rejoice, alleluia.\nR. For He whom you did merit to bear, alleluia.\nV. Has risen, as he said, alleluia.\nR. Pray for us to God, alleluia.\nV. Rejoice and be glad, O Virgin Mary, alleluia.\nR. For the Lord has truly risen, alleluia.\n\nLet us pray: O God, who gave joy to the world through the resurrection of Thy Son, our Lord Jesus Christ, grant we beseech Thee, that through the intercession of the Virgin Mary, His Mother, we may obtain the joys of everlasting life. Through the same Christ our Lord. Amen.'
      },
      {
        id: 'salve-regina',
        title: 'Salve Regina (Hail Holy Queen)',
        text: 'Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ. Amen.'
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
