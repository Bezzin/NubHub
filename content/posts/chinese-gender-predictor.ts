import type { Post } from '@/content/types';

export const chineseGenderPredictor: Post = {
  slug: 'chinese-gender-predictor',
  path: '/blog/chinese-gender-predictor',
  collection: 'blog',
  title: 'Chinese Gender Predictor: Does It Actually Work?',
  metaTitle: 'Chinese Gender Predictor: Does It Work?',
  description:
    'The Chinese gender predictor claims 70% accuracy from a 700-year-old chart, but studies show it performs at about chance. Here is the history and the honest truth.',
  excerpt:
    'A 700-year-old chart, the mother\'s age and the month of conception — the Chinese gender predictor is fun, but does it actually work? We examine the evidence.',
  category: "Old wives' tales",
  keywords: [
    'chinese gender predictor',
    'chinese gender chart',
    'chinese calendar gender prediction',
    'does the chinese gender predictor work',
    'chinese gender predictor accuracy',
    'ancient chinese gender chart',
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
  readingMinutes: 7,
  heroEmoji: '🏮',
  keyTakeaways: [
    'The <strong>Chinese gender predictor</strong> is a chart said to be over 700 years old that uses the mother\'s age at conception and the month of conception to predict sex.',
    'It claims about <strong>70% accuracy</strong>, but when tested in studies, it performs at roughly <strong>chance (~50%)</strong> — no better than a coin flip.',
    'The chart has <strong>no biological basis</strong>: there is no known mechanism by which the mother\'s age or the month of conception would influence fetal sex.',
    'The sex of a baby is determined at fertilisation by whether the sperm carries an <strong>X or Y chromosome</strong> — not by the calendar.',
    'It is a fun cultural tradition to enjoy, but for a real early prediction use <strong>nub theory (~85–90%)</strong> or <strong>NIPT (~96–99%)</strong>.',
  ],
  intro:
    '<p><strong>No, the Chinese gender predictor does not actually work. Despite claims of 70% accuracy from a chart said to be over 700 years old, studies that have tested it find it performs at roughly chance (~50%) — no better than flipping a coin.</strong> It is a lovely cultural tradition to enjoy for fun, but it has no biological basis and should not be relied on for prediction.</p>',
  sections: [
    {
      id: 'what-is-it',
      heading: 'What is the Chinese gender predictor?',
      html:
        '<p><strong>The Chinese gender predictor is a chart that cross-references the mother\'s age at conception with the month of conception to predict whether the baby is a boy or a girl.</strong> It is often called the "Chinese gender calendar" or "Chinese conception chart."</p>' +
        '<p>According to legend, the chart was found in a <strong>700-year-old royal tomb</strong> near Beijing and was used by the Qing dynasty imperial family to predict the sex of their children. The story adds to its mystique — but there is no historical evidence that the chart is actually that old, and no documented provenance linking it to any specific tomb or dynasty.</p>' +
        '<p>The chart itself is a simple grid. You find the mother\'s age (usually calculated using the Chinese lunar age, which adds a year or two to your Western age) along one axis and the month of conception along the other, and the cell where they intersect tells you "boy" or "girl."</p>',
    },
    {
      id: 'does-it-work',
      heading: 'Does the Chinese gender predictor actually work?',
      html:
        '<p><strong>No. When tested in studies, the Chinese gender predictor performs at about chance (~50%).</strong> A study published in the <em>Canadian Medical Association Journal</em> tested the chart against actual birth records and found it was correct about 50% of the time — exactly what you would expect from random guessing (<a href="https://www.cmaj.ca/content/160/12/1795" target="_blank" rel="noopener nofollow">CMAJ, 1999</a>).</p>' +
        '<p>This should not be surprising. The chart\'s two inputs — the mother\'s age and the month of conception — have <strong>no known biological relationship to fetal sex</strong>. The sex of a baby is determined at the moment of fertilisation by whether the sperm carries an X chromosome (girl) or a Y chromosome (boy). The father\'s sperm decides it; the mother\'s age and the calendar date play no role.</p>',
    },
    {
      id: 'why-claimed-70-percent',
      heading: 'Why does it claim 70% accuracy?',
      html:
        '<p>The "70%" figure that circulates online is a <strong>self-reported success rate</strong> from parenting forums and websites, not from any scientific study. When actual birth records are checked against the chart, the success rate drops to chance.</p>' +
        '<p>The persistence of the 70% claim comes from the same confirmation bias that fuels many old wives\' tales: when the chart is right (which it will be about half the time), people remember and share it; when it is wrong, people forget. This creates a survivorship bias in online discussions that makes the chart seem more accurate than it is.</p>' +
        '<p>Some websites also adjust the claimed accuracy retroactively, counting "near misses" or using different versions of the chart (lunar vs Gregorian calendar, different age calculations) to inflate the apparent success rate.</p>',
    },
    {
      id: 'lunar-vs-gregorian',
      heading: 'Does it matter whether you use lunar or Gregorian dates?',
      html:
        '<p>The original chart was designed around the <strong>Chinese lunar calendar</strong>, so you are supposed to convert your age and conception month to lunar equivalents. Some modern versions of the chart use Western (Gregorian) dates directly, which is a simplification.</p>' +
        '<p>Does using the correct lunar dates improve accuracy? <strong>No.</strong> Whether you use lunar or Gregorian dates, the chart still performs at chance, because the underlying method has no biological basis. Adjusting the calendar system cannot fix a method that does not work.</p>' +
        '<p>If anything, the confusion between lunar and Gregorian dates adds noise — two parents using the same chart with different date conventions may get different predictions for the same pregnancy. This is a sign of an unreliable method, not a precise one.</p>',
    },
    {
      id: 'how-it-compares',
      heading: 'How does the Chinese gender predictor compare to real methods?',
      html:
        '<p>Here is how the Chinese gender predictor stacks up against methods with actual evidence:</p>' +
        '<table><thead><tr><th>Method</th><th>Earliest</th><th>Accuracy</th><th>Evidence</th></tr></thead><tbody>' +
        '<tr><td>Chinese gender predictor</td><td>Any time</td><td>~chance (~50%)</td><td>Tested and debunked (CMAJ 1999)</td></tr>' +
        '<tr><td>Nub theory</td><td>~12 weeks</td><td>~85–90%</td><td>Multiple peer-reviewed studies</td></tr>' +
        '<tr><td>NIPT blood test</td><td>~10 weeks</td><td>~96–99%</td><td>Validated (JAMA 2011)</td></tr>' +
        '<tr><td>20-week anatomy scan</td><td>~18–20 weeks</td><td>~95–99%</td><td>Clinical standard</td></tr>' +
        '</tbody></table>' +
        '<p>The Chinese gender predictor is a cultural tradition, not a medical tool. For a real early prediction from your 12-week scan, see our <a href="/nub-theory">guide to nub theory</a>. For the earliest reliable answer, read about <a href="/blog/nipt-vs-nub-theory">NIPT vs nub theory</a>.</p>',
    },
    {
      id: 'should-you-use-it',
      heading: 'Should you use the Chinese gender predictor?',
      html:
        '<p><strong>For fun — absolutely. For prediction — no.</strong> The Chinese gender predictor is a lovely, ancient cultural tradition that connects you to centuries of parents who have wondered the same thing you are wondering. Enjoy it, share it with family, put it in your pregnancy journal.</p>' +
        '<p>Just do not paint the nursery based on it. It is correct about half the time, which means it is wrong about half the time. Treat it as a guessing game, not a prediction.</p>' +
        '<p>If you want a real early glimpse with evidence behind it, <strong>nub theory</strong> reads the genital tubercle angle on your 12-week scan at roughly 85–90% accuracy. NubHub pairs AI with a specialist review for up to 94% verified accuracy, with results in about <strong>2 hours</strong>, at <strong>£9.97</strong>, with a <strong>money-back guarantee</strong>. See <a href="/how-our-ai-works">how our AI works</a> or check our <a href="/faq">FAQ</a>.</p>',
    },
  ],
  faq: [
    {
      question: 'Does the Chinese gender predictor work?',
      answer:
        'No. When tested against actual birth records in a study published in the Canadian Medical Association Journal (1999), it performed at about chance (~50%), no better than a coin flip. It has no biological basis — the mother\'s age and the month of conception do not influence fetal sex.',
    },
    {
      question: 'How accurate is the Chinese gender predictor?',
      answer:
        'About 50% — the same as random guessing. The "70%" figure that circulates online comes from self-reported forum posts, not scientific studies. When actual birth records are checked, the accuracy drops to chance.',
    },
    {
      question: 'How old is the Chinese gender predictor?',
      answer:
        'According to legend, the chart is over 700 years old and was found in a royal tomb near Beijing. However, there is no documented historical evidence confirming this provenance, and the chart\'s origins are uncertain. It remains a popular cultural tradition.',
    },
    {
      question: 'Do you need to use the Chinese lunar calendar?',
      answer:
        'The original chart was designed around the Chinese lunar calendar, so you are supposed to convert your age and conception month. However, whether you use lunar or Gregorian dates does not change the accuracy — the chart performs at chance either way because the method has no biological basis.',
    },
    {
      question: 'What determines a baby\'s sex — the calendar or biology?',
      answer:
        'Biology. The sex of a baby is determined at fertilisation by whether the sperm carries an X chromosome (girl) or a Y chromosome (boy). The father\'s sperm decides it; the mother\'s age and the month of conception play no role.',
    },
    {
      question: 'Is the Chinese gender predictor better than nub theory?',
      answer:
        'No. Nub theory is backed by multiple peer-reviewed studies and is roughly 85–90% accurate at 12–13 weeks. The Chinese gender predictor performs at chance (~50%) and has no scientific support. Nub theory is a real prediction; the Chinese chart is a fun tradition.',
    },
  ],
  citations: [
    {
      label:
        'Lo KK, Lo KSK. Does the Chinese lunar calendar method of sex prediction work? CMAJ. 1999;160(12):1795.',
      url: 'https://www.cmaj.ca/content/160/12/1795',
    },
    {
      label:
        'Efrat Z, Akinfenwa OO, Nicolaides KH. First-trimester determination of fetal gender by ultrasound. Ultrasound Obstet Gynecol. 1999;13(5):305–307.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10380292/',
    },
    {
      label:
        'Devaney SA, Bianchi DW, et al. Noninvasive fetal sex determination using cell-free fetal DNA: meta-analysis. JAMA. 2011;306(6):627–636.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4526182/',
    },
  ],
  relatedSlugs: [
    'nub-theory',
    'old-wives-tales-gender-prediction',
    'nub-theory-vs-ramzi-vs-skull',
    'gender-prediction-heart-rate',
  ],
};