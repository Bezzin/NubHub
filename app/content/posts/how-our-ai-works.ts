import type { Post } from '@/content/types';

export const howOurAiWorks: Post = {
  slug: 'how-our-ai-works',
  path: '/how-our-ai-works',
  collection: 'page',
  title: 'How Our AI Predicts Baby Gender From Your Ultrasound',
  metaTitle: 'AI Gender Prediction From Ultrasound | NubHub',
  description:
    'How does AI predict baby gender from an ultrasound? NubHub’s AI reads your 12-week nub for angle, shape and clarity, then a specialist confirms it in ~2 hours.',
  excerpt:
    'AI reads the nub consistently; a specialist catches the edge cases. Here is exactly how NubHub combines both — plus what the research really says.',
  category: 'Technology',
  keywords: [
    'ai gender prediction',
    'ai gender prediction from ultrasound',
    'ai baby gender prediction',
    'how does ai predict baby gender',
    'ai nub theory',
    'ai ultrasound gender',
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
  readingMinutes: 9,
  heroEmoji: '🤖',
  keyTakeaways: [
    'AI predicts baby gender by measuring the <strong>genital tubercle (“nub”)</strong> on a 12-week scan — its angle, shape, stacking and image clarity — and returning a <strong>confidence score</strong>.',
    'Human-only nub reading is <strong>subjective and inconsistent</strong>: two readers can disagree on the same scan. AI is consistent and never fatigues.',
    'The honest answer to “human eyes beat AI” is <strong>neither alone — it is AI plus a human specialist</strong>, who catches the edge cases a model can miss.',
    'Peer-reviewed deep-learning models have classified fetal sex from ultrasound with up to <strong>96–98% accuracy on research datasets</strong> — emerging research, not regulated medicine.',
    'NubHub reports <strong>94% verified service accuracy</strong> via AI plus a specialist review, delivered in about <strong>2 hours</strong>.',
    'This is an <strong>early, for-entertainment estimate</strong>, not a medical or diagnostic test.',
  ],
  intro:
    '<p><strong>AI predicts baby gender by analysing the genital tubercle — the “nub” — on a clear 12–13 week ultrasound. A model trained on thousands of nub images measures the nub’s angle, shape, stacking and image clarity together, then produces a confidence score. At NubHub a nub theory specialist reviews and confirms that result before it reaches you.</strong></p>',
  sections: [
    {
      id: 'how-ai-predicts-gender',
      heading: 'How does AI predict baby gender from an ultrasound?',
      html:
        '<p>AI predicts baby gender the same way an expert sonographer does — by reading the <strong>genital tubercle</strong> on a side-on (mid-sagittal) 12-week scan — but it does it consistently and at scale. The classic measurement comes from <a href="https://pubmed.ncbi.nlm.nih.gov/10380292/" target="_blank" rel="noopener nofollow">Efrat et al. (1999)</a>: a nub angled more than <strong>30°</strong> from the lower body suggests a boy, while a nub lying <strong>parallel or under 10°</strong> suggests a girl. Angles between 10° and 30° are indeterminate.</p>' +
        '<p>Instead of eyeballing that angle, NubHub’s model evaluates several signals at once — the precise tubercle angle, the shape of the nub, the “stacking” sign, and how clear the image actually is — and combines them into a single <strong>confidence score</strong>. If you want the underlying method explained from scratch, start with our <a href="/nub-theory">complete guide to nub theory</a>.</p>',
    },
    {
      id: 'problem-with-human-reading',
      heading: 'What’s wrong with human-only nub reading?',
      html:
        '<p>Nothing is wrong with a skilled reader — the problem is that human reading alone is <strong>subjective and inconsistent</strong>. Show the same blurry 12-week scan to two experienced readers and they can genuinely disagree, because the nub is only a few pixels wide and the angle is a judgement call.</p>' +
        '<ul>' +
        '<li><strong>Subjectivity:</strong> where one reader sees a 28° “girl-ish” nub, another sees 32° and calls a boy.</li>' +
        '<li><strong>Fatigue:</strong> a person reading their hundredth scan of the day is not as sharp as on their first.</li>' +
        '<li><strong>Inconsistency:</strong> the same reader can even call the same image differently on a different day.</li>' +
        '</ul>' +
        '<p>That variability is exactly why honest accuracy for nub reading sits around <strong>85–90% at 12–13 weeks</strong> with a clear image (<a href="https://pubmed.ncbi.nlm.nih.gov/26663411/" target="_blank" rel="noopener nofollow">Manzanares et al., 2016</a>) rather than the “99%” some sites claim. Untrained guessing at home is far less reliable still. Our <a href="/blog/nub-theory-accuracy">accuracy guide</a> breaks the numbers down.</p>',
    },
    {
      id: 'how-nubhub-ai-reads',
      heading: 'How does NubHub’s AI read your nub?',
      html:
        '<p>The process is deliberately simple for you and rigorous behind the scenes:</p>' +
        '<ol>' +
        '<li><strong>Upload your 12-week scan.</strong> A clear mid-sagittal (side-profile) image works best — see our <a href="/blog/how-to-read-12-week-scan">guide to reading a 12-week scan</a> for what that looks like.</li>' +
        '<li><strong>The AI analyses it.</strong> The model assesses the nub’s angle, shape, stacking and overall image clarity <em>together</em>, rather than one factor in isolation.</li>' +
        '<li><strong>It produces a confidence score.</strong> A crisp, well-angled nub scores high; a blurry or awkwardly positioned one scores lower and is flagged.</li>' +
        '<li><strong>A specialist reviews and confirms.</strong> A nub theory specialist checks the AI’s reading, catches edge cases, and confirms the call.</li>' +
        '<li><strong>You get your result in ~2 hours.</strong> Backed by our money-back guarantee.</li>' +
        '</ol>' +
        '<p>Because the model gives a confidence score rather than a flat yes/no, you also learn <em>how sure</em> the reading is — which a single human glance rarely tells you.</p>',
    },
    {
      id: 'ai-plus-human',
      heading: 'Why does AI plus a human beat either one alone?',
      html:
        '<p>The common objection is “human eyes beat AI.” Treated fairly, the honest answer is: <strong>it is not AI versus humans — it is AI <em>and</em> a human specialist, which is more reliable than either alone.</strong></p>' +
        '<p>Each side covers the other’s weakness. AI is <strong>consistent and never fatigues</strong> — it applies the same measurement to every scan, all day, without drift. A human specialist brings <strong>judgement on edge cases</strong> the model hasn’t seen cleanly — an unusual fetal position, a cord mistaken for a nub, a borderline angle. Pairing a tireless, consistent measurer with an experienced reviewer is simply more dependable than relying on either by itself.</p>' +
        '<p>That is why NubHub reports a <strong>94% verified service accuracy</strong> for the combined AI-plus-specialist review — above the ~85–90% typical of human-only reading.</p>',
    },
    {
      id: 'what-research-says',
      heading: 'What does the research say about AI in fetal ultrasound?',
      html:
        '<p>AI for fetal-sex classification is a genuine and <strong>emerging</strong> research area, not yet a regulated clinical tool. The strongest published result so far comes from a 2024 study in <em>Expert Systems with Applications</em>: a DenseNet201 deep-learning model reached <strong>96.27% accuracy</strong> classifying fetal sex from ultrasound images, rising to <strong>97.82%</strong> when combined with a linear SVM, on a dataset of <strong>4,400 expert-labelled images</strong> (<a href="https://www.sciencedirect.com/science/article/abs/pii/S0957417423030105" target="_blank" rel="noopener nofollow">Expert Systems with Applications, 2024</a>). A separate, smaller model reported <strong>89.1% accuracy on 501 images</strong>.</p>' +
        '<p>Two honest caveats matter here. First, these are <strong>research datasets</strong>, not regulated medical devices — promising signals, not proven medicine. Second, real-world scans vary far more than a curated dataset, which is precisely why NubHub keeps a human specialist in the loop. We frame AI as a powerful, improving tool — never as a diagnostic one.</p>',
    },
    {
      id: 'vs-free-apps',
      heading: 'Is AI better than a free app or a DIY guess?',
      html:
        '<p>For a genuinely confident reading, yes. A DIY guess has no method and no second opinion; most free apps are thin novelty tools with no expert check and no accountability. NubHub adds the two things that actually move accuracy: a <strong>consistent AI measurement</strong> and a <strong>human specialist confirmation</strong>.</p>' +
        '<table><thead><tr><th>What you get</th><th>DIY guess</th><th>Free app</th><th>NubHub (AI + specialist)</th></tr></thead><tbody>' +
        '<tr><td>Consistency</td><td>None</td><td>Varies</td><td>High (same model every scan)</td></tr>' +
        '<tr><td>Expert check</td><td>No</td><td>No</td><td>Yes — specialist review</td></tr>' +
        '<tr><td>Confidence score</td><td>No</td><td>Rarely</td><td>Yes</td></tr>' +
        '<tr><td>Typical accuracy</td><td>Low / chance</td><td>Unverified</td><td>94% verified service accuracy</td></tr>' +
        '<tr><td>Turnaround</td><td>Instant but unreliable</td><td>Instant</td><td>~2 hours</td></tr>' +
        '<tr><td>Guarantee</td><td>No</td><td>No</td><td>Money-back guarantee</td></tr>' +
        '</tbody></table>' +
        '<p>If you simply want to see boy-nub vs girl-nub features for yourself, our <a href="/blog/nub-theory-boy-vs-girl">boy vs girl nub guide</a> walks through labelled examples.</p>',
    },
    {
      id: 'privacy',
      heading: 'How is your scan handled and kept private?',
      html:
        '<p>Your scan is handled through a <strong>private flow</strong> and used only to produce your prediction. We do not share or publish your scan without your permission, and it is never sold or posted to social channels on your behalf.</p>' +
        '<p>In short: your image goes in, the AI and a specialist read it, your result comes back to you — and that is the full extent of how the scan is used.</p>',
    },
    {
      id: 'disclaimer',
      heading: 'Is this a medical test?',
      html:
        '<p><strong>No.</strong> NubHub’s AI is an <strong>entertainment service</strong>, not a medical or diagnostic tool. It offers an early, for-fun estimate of your baby’s sex from the nub — it does not diagnose anything and is not a substitute for clinical care.</p>' +
        '<p>The medically validated methods remain <strong>NIPT</strong> (a blood test from around 10 weeks) and the <strong>20-week anatomy scan</strong>. Treat your NubHub result as an exciting early glimpse to enjoy while you wait for those. Questions? See our <a href="/faq">FAQ</a>.</p>',
    },
  ],
  faq: [
    {
      question: 'Can AI predict baby gender from ultrasound?',
      answer:
        'Yes — AI can estimate baby gender by measuring the genital tubercle (the “nub”) on a clear 12–13 week ultrasound. It reads the nub’s angle, shape, stacking and image clarity, then returns a confidence score. It is an early estimate, not a medical diagnosis.',
    },
    {
      question: 'How accurate is AI gender prediction?',
      answer:
        'Peer-reviewed models have reached up to 96–98% on research datasets, but those are curated images, not real-world conditions. NubHub reports 94% verified service accuracy by combining AI with a human specialist review of every scan.',
    },
    {
      question: 'Is AI better than nub theory?',
      answer:
        'AI is not a replacement for nub theory — it is a more consistent way of applying it. Nub theory is the method (reading the genital tubercle angle); AI measures it the same way every time, and a specialist confirms the result.',
    },
    {
      question: 'Don’t human eyes beat AI for reading a nub?',
      answer:
        'On a tricky edge case, an experienced human can spot things a model misses — which is why we keep a specialist in the loop. But humans are also subjective and fatigue, while AI is consistent. The most reliable reading is AI plus a human, not either alone.',
    },
    {
      question: 'Is AI gender prediction free?',
      answer:
        'Free apps exist but typically have no expert check and no verified accuracy. NubHub costs £9.97 for an AI reading plus a specialist confirmation, delivered in about 2 hours and backed by a money-back guarantee.',
    },
    {
      question: 'How long does an AI gender prediction take?',
      answer:
        'About 2 hours. You upload your 12-week scan, the AI analyses the nub and produces a confidence score, a nub theory specialist reviews and confirms it, and your result is delivered to you.',
    },
    {
      question: 'What does the research say about AI in fetal ultrasound?',
      answer:
        'A 2024 study reported 96.27% accuracy (97.82% with an added SVM) classifying fetal sex from 4,400 expert-labelled ultrasound images; a smaller model reported 89.1% on 501 images. These are emerging research datasets, not regulated clinical tools.',
    },
    {
      question: 'Is AI gender prediction a medical diagnosis?',
      answer:
        'No. NubHub’s AI is an entertainment service that gives an early, for-fun estimate. It is not a diagnostic tool. The medically validated methods are NIPT (from ~10 weeks) and the 20-week anatomy scan.',
    },
  ],
  citations: [
    {
      label:
        'Determination and classification of fetal sex on ultrasound images with deep learning (DenseNet201; 96.27%, 97.82% with linear SVM; 4,400 images). Expert Systems with Applications. 2024;240.',
      url: 'https://www.sciencedirect.com/science/article/abs/pii/S0957417423030105',
    },
    {
      label:
        'Efrat Z, Akinfenwa OO, Nicolaides KH. First-trimester determination of fetal gender by ultrasound. Ultrasound Obstet Gynecol. 1999;13(5):305–307.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10380292/',
    },
    {
      label:
        'Manzanares S, et al. Accuracy of fetal sex determination on ultrasound in the first trimester. J Clin Ultrasound. 2016;44(5):272–277.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26663411/',
    },
  ],
  relatedSlugs: ['nub-theory', 'nub-theory-accuracy', 'nub-theory-boy-vs-girl', 'faq'],
};
