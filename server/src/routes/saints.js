const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Saints library data - organized with detailed biographies
const saintsLibrary = [
  // Catholic Saints
  {
    id: 'francis-of-assisi',
    name: 'St. Francis of Assisi',
    title: 'Patron Saint of Animals and the Environment',
    tradition: 'Catholic',
    feastDay: 'October 4',
    born: '1181/1182',
    died: 'October 3, 1226',
    location: 'Assisi, Italy',
    biography: `St. Francis of Assisi was born Giovanni di Pietro di Bernardone in Assisi, Italy. The son of a wealthy cloth merchant, Francis lived a carefree youth filled with parties and dreams of knighthood. However, after experiencing visions and a profound conversion, he renounced his wealth and devoted his life to serving God and the poor.

Francis founded the Franciscan Order, emphasizing poverty, humility, and love for all of God's creation. He is famous for his love of animals and nature, often preaching to birds and taming wolves. His "Canticle of the Sun" is one of the most beautiful hymns to God's creation.

He received the stigmata (wounds of Christ) in 1224, becoming the first recorded person to bear these marks. Francis died in 1226 and was canonized just two years later in 1228. His legacy continues through the Franciscan orders and his profound influence on Christian spirituality, ecology, and social justice.`,
    patronage: 'Animals, ecology, merchants, Italy',
    attributes: 'Brown habit, birds, stigmata, wolf',
    image: '🕊️'
  },
  {
    id: 'teresa-of-avila',
    name: 'St. Teresa of Ávila',
    title: 'Doctor of the Church, Mystic and Reformer',
    tradition: 'Catholic',
    feastDay: 'October 15',
    born: 'March 28, 1515',
    died: 'October 4, 1582',
    location: 'Ávila, Spain',
    biography: `St. Teresa of Ávila was a prominent Spanish mystic, religious reformer, author, and theologian of the contemplative life. Born Teresa Sánchez de Cepeda y Ahumada into a noble family, she entered the Carmelite Monastery of the Incarnation in Ávila at age 20.

After years of illness and spiritual struggle, Teresa experienced profound mystical visions and ecstasies. She reformed the Carmelite Order, founding the Discalced (barefoot) Carmelites, emphasizing a return to the original contemplative and austere spirit of the order. She established seventeen convents throughout Spain despite opposition and hardship.

Teresa wrote extensively about prayer and the spiritual life. Her works, including "The Interior Castle" and "The Way of Perfection," are considered masterpieces of Christian mysticism and spiritual theology. She was the first woman to be declared a Doctor of the Church in 1970.

Her writings combine deep mystical insights with practical wisdom, humor, and common sense. She emphasized mental prayer, self-knowledge, and complete surrender to God's will.`,
    patronage: 'Headache sufferers, lacemakers, Spain',
    attributes: 'Carmelite habit, book, quill, dove',
    image: '📿'
  },
  {
    id: 'padre-pio',
    name: 'St. Pio of Pietrelcina (Padre Pio)',
    title: 'Priest and Stigmatist',
    tradition: 'Catholic',
    feastDay: 'September 23',
    born: 'May 25, 1887',
    died: 'September 23, 1968',
    location: 'Pietrelcina, Italy',
    biography: `St. Pio of Pietrelcina, known as Padre Pio, was an Italian Franciscan Capuchin friar and priest who bore the wounds of Christ (stigmata) for fifty years. Born Francesco Forgione, he entered the Capuchin order at age 15 and was ordained a priest in 1910.

In 1918, Padre Pio received the stigmata, which remained visible until his death. He was known for numerous mystical phenomena including bilocation, reading of souls in confession, miraculous healings, and the ability to convert hardened sinners. Thousands of people came from around the world to attend his Masses and receive his confession.

Despite facing skepticism and even temporary suspension from church authorities, Padre Pio remained obedient and humble. He spent long hours in the confessional, sometimes up to 19 hours a day, guiding souls back to God. He founded the Home for Relief of Suffering, a hospital in San Giovanni Rotondo.

His life was marked by intense suffering, which he accepted as participation in Christ's passion. He was known for his deep prayer life, celebration of the Mass, and devotion to Mary. Padre Pio was canonized by Pope John Paul II in 2002.`,
    patronage: 'Civil defense volunteers, stress relief, January blues',
    attributes: 'Brown habit, fingerless gloves, crucifix, stigmata',
    image: '✝️'
  },
  {
    id: 'mother-teresa',
    name: 'St. Teresa of Calcutta (Mother Teresa)',
    title: 'Missionary of Charity',
    tradition: 'Catholic',
    feastDay: 'September 5',
    born: 'August 26, 1910',
    died: 'September 5, 1997',
    location: 'Skopje, Macedonia (now North Macedonia)',
    biography: `St. Teresa of Calcutta, known worldwide as Mother Teresa, was born Agnes Gonxha Bojaxhiu in Skopje. She joined the Sisters of Loreto at age 18 and went to India as a missionary teacher. While teaching at a convent school in Calcutta, she experienced a "call within a call" to serve the poorest of the poor.

In 1950, she founded the Missionaries of Charity, a congregation dedicated to serving "the hungry, the naked, the homeless, the crippled, the blind, the lepers, all those people who feel unwanted, unloved, uncared for throughout society." The order grew to thousands of sisters operating in over 130 countries.

Mother Teresa's work included homes for the dying, orphanages, AIDS hospices, and charity centers worldwide. She won the Nobel Peace Prize in 1979, saying, "I accept the prize in the name of the poor." Despite her worldwide recognition, she maintained profound humility and simplicity.

Her life was marked by a "dark night of the soul" - a painful sense of God's absence that lasted for decades, revealed in her letters after her death. Yet she persevered in faith and service. She was canonized by Pope Francis in 2016.`,
    patronage: 'World Youth Day, Archdiocese of Calcutta',
    attributes: 'White sari with blue border, rosary',
    image: '🙏'
  },
  {
    id: 'thomas-aquinas',
    name: 'St. Thomas Aquinas',
    title: 'Doctor of the Church, "Angelic Doctor"',
    tradition: 'Catholic',
    feastDay: 'January 28',
    born: '1225',
    died: 'March 7, 1274',
    location: 'Roccasecca, Italy',
    biography: `St. Thomas Aquinas was an Italian Dominican friar and priest, one of the most influential theologians and philosophers in the history of the Church. Born into a noble family, Thomas joined the Dominican Order despite his family's opposition, who even imprisoned him to prevent his vocation.

Thomas studied under St. Albert the Great and became a master theologian and professor. His greatest work, the "Summa Theologica," is a comprehensive synthesis of Christian theology and philosophy, integrating faith and reason. He brilliantly incorporated Aristotelian philosophy with Christian doctrine, showing that faith and reason are complementary paths to truth.

His other major works include "Summa Contra Gentiles" and numerous commentaries on Scripture and Aristotle. Thomas wrote beautiful Eucharistic hymns including "Pange Lingua" and "Tantum Ergo," still used in Catholic liturgy today.

Despite his massive intellectual achievements, Thomas was known for his humility, prayer life, and devotion. Near the end of his life, after a mystical experience, he said his writings seemed "like straw" compared to what had been revealed to him. He was declared a Doctor of the Church and is the patron saint of students and scholars.`,
    patronage: 'Students, scholars, universities, booksellers',
    attributes: 'Dominican habit, book, sun on chest, quill',
    image: '📚'
  },
  {
    id: 'mary-magdalene',
    name: 'St. Mary Magdalene',
    title: 'Apostle to the Apostles',
    tradition: 'Both',
    feastDay: 'July 22',
    born: 'Unknown',
    died: 'Unknown (traditionally c. 63 AD)',
    location: 'Magdala, Galilee',
    biography: `St. Mary Magdalene was one of Jesus' most devoted disciples and the first witness to His resurrection. According to the Gospels, Jesus cast seven demons out of her, and she became one of His most faithful followers. She followed Jesus throughout His ministry, stood by Him during His crucifixion, and was the first to see Him risen from the dead.

On Easter Sunday morning, Mary Magdalene went to the tomb and found it empty. When Jesus appeared to her, she initially mistook Him for the gardener, but when He called her name, she recognized Him. Jesus then sent her to tell the apostles of His resurrection, earning her the title "Apostle to the Apostles."

In both Catholic and Orthodox traditions, Mary Magdalene is venerated as a saint and example of repentance, devotion, and evangelization. The Eastern tradition holds that she traveled to Ephesus with the Virgin Mary and St. John, and later to Rome where she met Emperor Tiberius.

She is often depicted with a red egg, symbolizing the resurrection. According to tradition, when she met the emperor and proclaimed "Christ is Risen," he questioned how this could be. She held up an egg and said, "just as this egg will bring forth life, so Christ rose from the tomb." The egg then miraculously turned red in her hand, confirming the truth of the resurrection.`,
    patronage: 'Converts, penitent women, perfumers, pharmacists',
    attributes: 'Red egg, alabaster jar of ointment, long hair',
    image: '🥚'
  },
  {
    id: 'patrick-of-ireland',
    name: 'St. Patrick',
    title: 'Patron Saint of Ireland, Missionary',
    tradition: 'Both',
    feastDay: 'March 17',
    born: 'c. 385',
    died: 'March 17, 461',
    location: 'Roman Britain',
    biography: `St. Patrick is the patron saint and national apostle of Ireland. Born in Roman Britain, he was captured by Irish raiders at age 16 and enslaved for six years as a shepherd. During his captivity, he grew close to God through prayer. After escaping and returning home, he experienced a vision calling him to return to Ireland as a missionary.

Patrick studied for the priesthood and was eventually ordained a bishop. He returned to Ireland around 432 AD and spent the next three decades evangelizing the Irish people. He used the three-leafed shamrock to explain the Holy Trinity to the pagan Irish, which became a lasting symbol of both St. Patrick and Ireland.

His missionary work was remarkably successful. He established monasteries, schools, and churches throughout Ireland, ordained priests, and converted thousands, including many from the ruling classes and druid priests. His approach was unique in incorporating existing Irish culture and symbols into Christian teaching rather than trying to eliminate them.

Patrick's autobiographical "Confession" reveals his humility and deep trust in God despite facing many dangers and oppositions. He is celebrated by both Catholic and Orthodox Christians. The traditional Irish blessing "May the road rise up to meet you" is often attributed to the spirit of his mission.`,
    patronage: 'Ireland, engineers, excluded people',
    attributes: 'Shamrock, bishop\'s vestments, staff, snake',
    image: '☘️'
  },
  
  // Orthodox Saints
  {
    id: 'nicholas-of-myra',
    name: 'St. Nicholas of Myra',
    title: 'Wonderworker, Protector of Children',
    tradition: 'Both',
    feastDay: 'December 6 (Western), December 19 (Eastern)',
    born: 'March 15, 270',
    died: 'December 6, 343',
    location: 'Patara, Lycia (modern-day Turkey)',
    biography: `St. Nicholas of Myra, also known as Nicholas the Wonderworker, was a 4th-century bishop famous for his generosity, love for children, and miraculous interventions. Born into a wealthy Christian family in Patara, he lost his parents to an epidemic and used his inheritance to help the poor and suffering.

The most famous story tells of him secretly providing gold for three poor sisters' dowries by throwing bags of gold through their window at night, saving them from destitution. This act of anonymous charity became the basis for the Santa Claus tradition.

As Bishop of Myra, Nicholas attended the Council of Nicaea in 325 AD, where tradition says he became so incensed by the heretic Arius's blasphemies that he struck him. Though temporarily removed from office for this, he was reinstated after the other bishops had visions confirming his holiness.

Known as the Wonderworker for his numerous miracles both during his lifetime and after his death, St. Nicholas is said to have calmed storms, multiplied grain during famine, and rescued sailors in distress. His relics, now in Bari, Italy, exude a miraculous liquid called manna.

He is one of the most universally beloved saints in both Eastern and Western Christianity, venerated as protector of children, sailors, merchants, and the falsely accused.`,
    patronage: 'Children, sailors, merchants, archers, repentant thieves',
    attributes: 'Bishop\'s vestments, three gold balls, three purses, children',
    image: '🎅'
  },
  {
    id: 'seraphim-of-sarov',
    name: 'St. Seraphim of Sarov',
    title: 'Great Ascetic and Wonderworker',
    tradition: 'Orthodox',
    feastDay: 'January 2 (Julian: January 15)',
    born: 'July 19, 1754',
    died: 'January 2, 1833',
    location: 'Kursk, Russia',
    biography: `St. Seraphim of Sarov was one of the most beloved Russian Orthodox saints, known for his deep prayer life, asceticism, and radiant joy. Born Prokhor Moshnin to a merchant family, he felt called to monastic life from childhood and entered Sarov monastery at age 19.

After years of community life, Seraphim withdrew to the forest for solitary prayer and asceticism. He spent three years in complete silence and stood on a rock praying for 1,000 nights like St. Simeon the Stylite. During this time, he was severely beaten by robbers but refused to testify against them, showing extraordinary forgiveness.

After his hermit years, Seraphim returned to the monastery and eventually opened his door to all visitors, offering spiritual counsel with the greeting "My joy!" His face often shone with divine light, and he was known for prophecy, healing, and numerous miracles. He emphasized the goal of Christian life: acquiring the Holy Spirit.

His conversation with Nicholas Motovilov, where his face blazed with divine light, is one of the most remarkable accounts of transfiguration in Christian literature. Seraphim strongly promoted devotion to the Mother of God and had several visions of the Virgin Mary. He died kneeling before an icon of the Theotokos.`,
    patronage: 'Sarov, Russia',
    attributes: 'White robe, prayer rope, bear, radiant light',
    image: '⭐'
  },
  {
    id: 'john-chrysostom',
    name: 'St. John Chrysostom',
    title: 'Archbishop of Constantinople, Doctor of the Church',
    tradition: 'Both',
    feastDay: 'September 13 (Western), November 13 (Eastern)',
    born: 'c. 347',
    died: 'September 14, 407',
    location: 'Antioch, Syria',
    biography: `St. John Chrysostom ("Golden-Mouth") was one of the greatest preachers and theologians of the early Church. Born in Antioch, he studied rhetoric and law but chose to pursue monastic life. He spent six years as a hermit in the mountains, damaging his health but deepening his spiritual life.

Returning to Antioch, John was ordained a priest and became famous for his eloquent preaching. His sermons were so powerful and beautiful that he earned the name "Chrysostom" (golden-mouthed). He preached against the abuse of wealth, corruption, and called both rich and poor to Christian virtue.

In 398, John was made Archbishop of Constantinople against his will. He immediately began reforming the church, living simply himself while using church wealth to build hospitals. His fearless criticism of the rich, powerful, and even the empress Eudoxia led to conflict and eventual exile.

John wrote extensive biblical commentaries and liturgical texts. The Divine Liturgy of St. John Chrysostom is the most celebrated liturgy in the Eastern Orthodox Church. Despite suffering in exile, he continued writing letters of encouragement. He died en route to a more remote exile, his last words being "Glory to God for all things."`,
    patronage: 'Preachers, speakers, epilepsy sufferers',
    attributes: 'Archbishop\'s vestments, book, quill, stars on omophorion',
    image: '📖'
  },
  {
    id: 'mary-of-egypt',
    name: 'St. Mary of Egypt',
    title: 'Model of Repentance',
    tradition: 'Both',
    feastDay: 'April 1 (Western), April 1 (Eastern - fifth Sunday of Lent)',
    born: 'c. 344',
    died: 'c. 421',
    location: 'Egypt',
    biography: `St. Mary of Egypt is one of the most powerful examples of repentance and transformation in Christian tradition. She lived a life of prostitution in Alexandria for 17 years, traveling to Jerusalem on a pilgrimage ship not to visit holy sites but to continue her sinful lifestyle.

At the Church of the Holy Sepulchre, Mary tried to enter but was prevented by an invisible force. After multiple attempts, she realized her sins were barring her entry. Looking up at an icon of the Virgin Mary, she experienced profound contrition and begged for forgiveness. Instantly, she was able to enter the church.

After venerating the True Cross, Mary heard a voice directing her to cross the Jordan River. She received Holy Communion, bought three loaves of bread, and went into the desert where she lived as a hermit for 47 years. The three loaves miraculously sustained her for years, and she spent her time in continuous prayer and penance.

Near the end of her life, the monk Zosimas encountered Mary walking above the ground and shining with holy light. She told him her story and asked him to return the following year with Holy Communion. When he returned, he found her body and, with the help of a lion, buried her in the desert. Her life shows that no one is beyond God's mercy and redemptive love.`,
    patronage: 'Penitents, reformed prostitutes',
    attributes: 'Long hair covering her body, three loaves, lion',
    image: '🏜️'
  },
  {
    id: 'basil-the-great',
    name: 'St. Basil the Great',
    title: 'Archbishop of Caesarea, Doctor of the Church',
    tradition: 'Both',
    feastDay: 'January 2 (Western), January 1 (Eastern)',
    born: 'c. 330',
    died: 'January 1, 379',
    location: 'Caesarea, Cappadocia (modern-day Turkey)',
    biography: `St. Basil the Great was one of the most distinguished theologians and Church Fathers of the 4th century. Born into a family of saints (his grandmother, parents, and siblings are all venerated as saints), he received the finest education in rhetoric, philosophy, and law in Athens where he befriended St. Gregory of Nazianzus.

Despite his brilliant education, Basil chose monastic life and established a form of monasticism that balanced prayer, manual work, and charitable service. His monastic rule became the foundation for Eastern monasticism and influenced Western monasticism through St. Benedict.

As Archbishop of Caesarea, Basil vigorously defended orthodox Christianity against Arianism during a time of great theological controversy. His theological writings, especially on the Holy Trinity and Holy Spirit, were crucial in formulating the Nicene Creed. His work "On the Holy Spirit" definitively established the divinity and personhood of the Holy Spirit.

Basil was also a pioneer of organized Christian charity. He established the "Basiliad," one of the first major charitable institutions - a complex including a hospital, hostel for travelers, and facilities for the poor and sick. His emphasis on social justice and care for the poor set an enduring example for Christian social teaching.`,
    patronage: 'Hospital administrators, reformers, exorcists',
    attributes: 'Archbishop\'s vestments, Gospel book, dove',
    image: '🕊️'
  },
  {
    id: 'anthony-the-great',
    name: 'St. Anthony the Great',
    title: 'Father of Monasticism',
    tradition: 'Both',
    feastDay: 'January 17',
    born: 'c. 251',
    died: 'January 17, 356',
    location: 'Herakleopolis, Egypt',
    biography: `St. Anthony the Great, also called Anthony of Egypt, is known as the "Father of Monasticism." Born to wealthy Christian parents, at age 20 he heard the Gospel reading "If you want to be perfect, go, sell your possessions and give to the poor" (Matthew 19:21). He took these words literally, gave away his inheritance, and dedicated himself to ascetic life.

Anthony lived as a hermit in various desert locations, including an abandoned fort where he lived for 20 years. During his solitude, he engaged in intense spiritual warfare, experiencing dramatic temptations from demons which have been depicted in countless works of Christian art. Through prayer, fasting, and perseverance, he overcame these trials and achieved extraordinary spiritual heights.

Despite seeking solitude, Anthony attracted numerous disciples who wanted to learn from him. This led to the formation of monastic communities under his guidance, establishing the monastic tradition that would spread throughout Christianity. His teachings emphasized prayer, humility, obedience, and the importance of spiritual combat.

St. Athanasius wrote Anthony's biography, "Life of Anthony," which became one of the most influential Christian texts, inspiring countless people to embrace monastic life. Anthony lived to the remarkable age of 105, spending his final years in prayer and counsel to visitors. His example established the pattern of Christian monasticism for centuries to come.`,
    patronage: 'Basket makers, gravediggers, hermits, monks',
    attributes: 'Tau cross, pig, bell, book, fire',
    image: '🔔'
  },
  {
    id: 'sergius-of-radonezh',
    name: 'St. Sergius of Radonezh',
    title: 'Abbot, Monastic Reformer',
    tradition: 'Orthodox',
    feastDay: 'September 25 (Julian: October 8)',
    born: 'May 3, 1314',
    died: 'September 25, 1392',
    location: 'Rostov, Russia',
    biography: `St. Sergius of Radonezh is one of the most venerated Russian saints and is considered the greatest of all Russian saints. Born Bartholomew, he was drawn to the spiritual life from childhood. After his parents' death, he and his brother established a small hermitage in the forest, dedicating it to the Holy Trinity.

Living in extreme poverty and solitude, Sergius spent years in prayer and labor. His holiness attracted other monks, and despite his preference for solitude, he established the Monastery of the Holy Trinity, which became one of the most important spiritual centers in Russia. He introduced communal monastic life (cenobitic) to Russia, requiring monks to live, work, and pray together.

Sergius was known for his deep humility, always serving others and performing the lowest tasks himself. He tamed a bear that lived near his hermitage, feeding it bread. He had numerous visions, including appearances of the Virgin Mary. His monastery became a center of national unity during troubled times.

Before the Battle of Kulikovo in 1380, Prince Dmitry Donskoy sought Sergius's blessing to fight the Mongol-Tatar forces. Sergius blessed him and sent two monks to accompany the army, contributing to the Russian victory that began the process of liberation from Tatar rule. Sergius died while praying, and miracles began immediately at his tomb.`,
    patronage: 'Russia, students',
    attributes: 'Monastic habit, bear, prayer rope, church',
    image: '🐻'
  },
  {
    id: 'cyril-methodius',
    name: 'Sts. Cyril and Methodius',
    title: 'Apostles to the Slavs, Equals-to-the-Apostles',
    tradition: 'Both',
    feastDay: 'February 14 (Western), May 11 (Eastern)',
    born: 'Cyril: c. 827, Methodius: c. 815',
    died: 'Cyril: February 14, 869, Methodius: April 6, 885',
    location: 'Thessalonica, Byzantine Empire',
    biography: `Sts. Cyril and Methodius were two brothers from Thessalonica who became missionaries to the Slavic peoples and are credited with creating the Glagolitic alphabet, the precursor to the Cyrillic script. Born into a wealthy family, both brothers were highly educated. Methodius initially pursued a political career while Cyril (born Constantine) became a scholar and professor.

Both eventually embraced monastic life. In 862, Prince Rastislav of Great Moravia requested missionaries who could teach Christianity in the Slavic language rather than Latin or Greek. The Byzantine Emperor sent Cyril and Methodius, who understood Slavic dialects from their childhood in Thessalonica.

Cyril created an alphabet for the Slavic language and translated the Gospels and liturgical texts into Old Church Slavonic. This was revolutionary - it was the first time a "barbarian" language was used for Christian worship, facing significant opposition from those who believed only Hebrew, Greek, and Latin were proper liturgical languages.

The brothers' work required approval from Rome. They journeyed to Rome carrying the relics of St. Clement, and Pope Adrian II approved the Slavonic liturgy. Cyril died in Rome and was buried in the Basilica of St. Clement. Methodius returned to continue the mission, eventually becoming Archbishop of Sirmium.

Their work laid the foundation for Slavic Christianity and culture. The Cyrillic alphabet, named after St. Cyril, is used today by over 250 million people.`,
    patronage: 'Europe (co-patrons), ecumenism, Slavic peoples',
    attributes: 'Book with Cyrillic script, church, Gospel',
    image: '📜'
  }
];

// Get all saints or filter by tradition
router.get('/', (req, res) => {
  try {
    const { tradition } = req.query;
    
    let filteredSaints = saintsLibrary;
    
    if (tradition && tradition !== 'all') {
      if (tradition === 'both') {
        filteredSaints = saintsLibrary.filter(saint => saint.tradition === 'Both');
      } else {
        filteredSaints = saintsLibrary.filter(saint => 
          saint.tradition.toLowerCase() === tradition.toLowerCase() || 
          saint.tradition === 'Both'
        );
      }
    }
    
    // Return summary list for browsing
    const saintsSummary = filteredSaints.map(saint => ({
      id: saint.id,
      name: saint.name,
      title: saint.title,
      tradition: saint.tradition,
      feastDay: saint.feastDay,
      image: saint.image
    }));
    
    res.json(saintsSummary);
  } catch (error) {
    logger.error('Error fetching saints:', error);
    res.status(500).json({ message: 'Error fetching saints data' });
  }
});

// Get specific saint by ID
router.get('/:id', (req, res) => {
  try {
    const saint = saintsLibrary.find(s => s.id === req.params.id);
    
    if (!saint) {
      return res.status(404).json({ message: 'Saint not found' });
    }
    
    res.json(saint);
  } catch (error) {
    logger.error('Error fetching saint:', error);
    res.status(500).json({ message: 'Error fetching saint data' });
  }
});

module.exports = router;
