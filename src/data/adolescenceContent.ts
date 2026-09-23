import { EmotionItem, BrainFact, ScenarioPlaybook, CognitiveDistortion, JournalPrompt } from '../types';

export const EMOTIONS_DATA: EmotionItem[] = [
  // Anxiety & Fear
  {
    id: 'social-anxiety',
    name: 'Social Dread / Judged',
    category: 'anxiety',
    description: 'Feeling hyper-aware of how you look or speak, convinced others are secretly critiquing you.',
    bodySensations: ['Heart fluttering', 'Tight throat', 'Sweaty palms', 'Stomach knot'],
    healthyAction: 'Anchor your eyes on 3 blue objects in the room and remind yourself of the "Spotlight Effect": people are mostly focused on themselves.',
    copingQuote: 'You notice your flaws 100 times more closely than anyone else around you does.'
  },
  {
    id: 'test-panic',
    name: 'Academic Panic / Freeze',
    category: 'anxiety',
    description: 'Mental fog, panic before exams or deadlines, feeling like your entire future rests on one grade.',
    bodySensations: ['Racing heart', 'Shallow breathing', 'Cold extremities', 'Brain block'],
    healthyAction: 'Take 4 slow physiological sighs (two quick inhales through nose, long slow exhale through mouth) to reboot your nervous system.',
    copingQuote: 'A single test is an evaluation of one moment in time, not a measurement of your worth or capability.'
  },
  {
    id: 'imposter-syndrome',
    name: 'Imposter Syndrome',
    category: 'anxiety',
    description: 'Feeling like a fraud who just got lucky, fearing that you will be exposed as incompetent.',
    bodySensations: ['Chest tightness', 'Restless legs', 'Nausea'],
    healthyAction: 'List 2 concrete things you practiced or put effort into recently that got you here.',
    copingQuote: 'Everyone is improvising. Confidence is built through trial, not perfection.'
  },

  // Anger & Frustration
  {
    id: 'misunderstood-anger',
    name: 'Misunderstood / Invalidated',
    category: 'anger',
    description: 'Feeling like adults or peers refuse to listen to your actual point of view and reduce it to "just hormones" or "attitude".',
    bodySensations: ['Clenched jaw', 'Heat in face', 'Tense shoulders', 'Fists balling'],
    healthyAction: 'Step back physically into a quiet space. Write an unedited voice note or raw paragraph to release the steam before communicating.',
    copingQuote: 'Your feelings are valid, even if the person in front of you does not possess the capacity to understand them right now.'
  },
  {
    id: 'irritability-burnout',
    name: 'Snappy Irritability',
    category: 'anger',
    description: 'Everything and everyone feels grating, loud, or annoying, like your emotional fuse is 2 millimeters long.',
    bodySensations: ['Headache / temple pressure', 'Restlessness', 'Sensory sensitivity'],
    healthyAction: 'Put on noise-canceling headphones or step away for 10 minutes of complete silence and drink cold water.',
    copingQuote: 'Irritability is frequently exhausted sadness or sensory overload wearing armor.'
  },

  // Sadness & Loneliness
  {
    id: 'isolated-lonely',
    name: 'Isolated / Left Out',
    category: 'sadness',
    description: 'Seeing group chats, plans made without you, or feeling solitary in a crowded room.',
    bodySensations: ['Heavy chest', 'Hollow stomach', 'Slumped posture', 'Lump in throat'],
    healthyAction: 'Wrap yourself in a weighted blanket or cozy hoodie. Message one person who feels safe, or listen to grounding music.',
    copingQuote: 'Being left out stings because adolescent human brains are wired to crave community. It does not mean you are unlovable.'
  },
  {
    id: 'grief-change',
    name: 'Nostalgia / Fear of Growing Up',
    category: 'sadness',
    description: 'Mourning the simplicity of childhood, overwhelmed by adult expectations and shifting friendships.',
    bodySensations: ['Tired eyes', 'Lethargy', 'Aching muscles'],
    healthyAction: 'Acknowledge that transitions bring real grief. Allow yourself to enjoy a childhood comfort (favorite show, snack, or blanket) without guilt.',
    copingQuote: 'Growing up is not an eviction from joy; it is an expansion of your freedom and depth.'
  },

  // Overwhelm & Burnout
  {
    id: 'sensory-mental-overload',
    name: 'Sensory & Task Paralysis',
    category: 'overwhelm',
    description: 'So many notifications, assignments, and expectations that your brain shuts down and scrolling phone is the only defense.',
    bodySensations: ['Tension headaches', 'Eye strain', 'Frozen limbs', 'Numbness'],
    healthyAction: 'Do the "Micro-Step Rule": pick literally ONE tiny action (open a document, or drink one glass of water), set a timer for 3 minutes.',
    copingQuote: 'When everything is urgent, nothing is. Give yourself permission to pause the avalanche.'
  },

  // Confusion & Identity
  {
    id: 'identity-lost',
    name: 'Identity Confusion',
    category: 'confusion',
    description: 'Uncertainty about who you are, what you care about, your style, beliefs, or sexuality, shifting day by day.',
    bodySensations: ['Floating feeling', 'Low energy', 'Restless pacing'],
    healthyAction: 'Treat adolescence as a laboratory, not a courtroom. You are supposed to test out ideas, not have a final thesis.',
    copingQuote: 'You are not supposed to be finished yet. You are an evolving work of art.'
  },

  // Joy & Hope
  {
    id: 'creative-flow',
    name: 'Creative Spark & Connected',
    category: 'joy',
    description: 'Feeling inspired, connected with a close friend, laughing until your ribs hurt, or deep in flow.',
    bodySensations: ['Lightness in chest', 'Warm belly', 'Relaxed jaw', 'High energy'],
    healthyAction: 'Document this moment in your journal or a photo so your future self remembers how good reality can feel.',
    copingQuote: 'Hold onto this warmth. You built this feeling, and you will return to it again.'
  }
];

export const BRAIN_FACTS: BrainFact[] = [
  {
    id: 'pfc-amygdala-gap',
    title: 'The Prefrontal Cortex Gap',
    subtitle: 'Why your emotional engine runs faster than your brakes',
    scienceExplanation: 'The brain matures from the back to the front. The amygdala (the emotional alarm system) is fully powered by early puberty, while the prefrontal cortex (responsible for rational judgment, impulse control, and long-term consequences) continues wiring until around age 25. This creates an evolutionary gap where you feel emotions with supreme intensity.',
    realWorldImpact: 'You might react explosively to a casual comment, feel crushing sadness that feels like the end of the world, or make impulsive decisions that make total sense in the moment but feel baffling the next day.',
    actionableTip: 'When you feel a sudden surge of rage or dread, give yourself a mandatory 90-second timeout. Neurochemically, a pure adrenaline surge washes through your bloodstream in about 90 seconds if not refueled by racing thoughts.',
    mythBuster: 'Myth: "Teens are just irrational and dramatic." Truth: Your neural hardware is in the most active synaptic remodeling phase of your entire life.',
    iconName: 'Brain'
  },
  {
    id: 'dopamine-sensitivity',
    title: 'Dopamine Sensitivity & Thrill Seeking',
    subtitle: 'Why ordinary life can feel so boring and adventures feel magnetic',
    scienceExplanation: 'During adolescence, the brain produces more dopamine receptors in the limbic system. Baseline dopamine is lower than in adults, but peaks are significantly higher. This makes routine tasks feel painfully dull, while novelty, music, video games, crushes, and risk-taking produce euphoric highs.',
    realWorldImpact: 'You might find schoolwork or chores physically draining to start, while listening to your favorite song gives you full-body chills, or texting someone new keeps you awake for hours.',
    actionableTip: 'Use "dopamine pairing": attach a boring task (studying chemistry) to a high-dopamine stimulus (lo-fi beats, favorite warm drink, or working with a study buddy).',
    mythBuster: 'Myth: "You have an attention problem." Truth: Your brain is biologically primed to explore the world and seek independence from the family nest.',
    iconName: 'Sparkles'
  },
  {
    id: 'circadian-shift',
    title: 'The 2-Hour Melatonin Shift',
    subtitle: 'Why you cannot sleep at 10 PM and cannot wake at 6 AM',
    scienceExplanation: 'During puberty, the biological clock shifts forward by roughly two hours. In adults and children, melatonin (the sleep hormone) begins secreting around 8:30–9:30 PM. In teenagers, melatonin does not release until around 10:45 PM–11:30 PM, and remains in the bloodstream well past 7:30 AM.',
    realWorldImpact: 'Being forced to wake up at 6:00 AM for high school is neurochemically equivalent to asking an adult to wake up at 4:00 AM every single morning.',
    actionableTip: 'Get 5-10 minutes of direct outdoor sunlight in your eyes within 30 minutes of waking up. Sunlight halts lingering melatonin and sets your circadian timer for better sleep that night.',
    mythBuster: 'Myth: "Teens stay up late because they are undisciplined." Truth: It is documented chronobiology. The delayed sleep phase is a cross-species biological phenomenon.',
    iconName: 'Moon'
  },
  {
    id: 'social-pain-wiring',
    title: 'The Social Rejection Radar',
    subtitle: 'Why feeling left out hurts physically',
    scienceExplanation: 'Functional MRI brain scans reveal that social exclusion activates the anterior cingulate cortex—the exact same brain region that registers physical physical pain like a broken bone. To an evolutionary adolescent, social ostracization meant vulnerability and death.',
    realWorldImpact: 'Being left on "read", not being invited to a hangout, or getting an awkward laugh in the hallway does not just hurt your feelings; your brain interprets it as an existential threat.',
    actionableTip: 'Ground yourself with somatic reassurance: put a hand flat over your heart or stomach, take a slow breath, and say: "My brain is trying to protect me, but I am physically safe right here."',
    mythBuster: 'Myth: "You care too much about what other kids think." Truth: Evolution literally designed your brain to scan for social alignment to ensure survival.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'synaptic-pruning',
    title: 'Synaptic Pruning: The Brain Sculptor',
    subtitle: 'Use it or lose it: carving your adult superpowers',
    scienceExplanation: 'During your teenage years, the brain conducts massive "synaptic pruning"—eliminating unused neural connections while heavily insulating (myelinating) pathways that you practice frequently, making those signals travel up to 100 times faster.',
    realWorldImpact: 'Skills, habits, emotional responses, and creative interests you nurture now will become deeply ingrained cognitive pathways for the rest of your life.',
    actionableTip: 'Whatever you practice right now—whether curiosity, self-compassion, guitar playing, problem-solving, or rumination—is what your brain will hardwire for adulthood. Choose one healthy habit to feed daily.',
    mythBuster: 'Myth: "Intelligence and habits are fixed at birth." Truth: Adolescence is the second and final massive window of hyper-plasticity in human development.',
    iconName: 'Compass'
  }
];

export const SCENARIO_PLAYBOOKS: ScenarioPlaybook[] = [
  {
    id: 'talking-to-parents',
    category: 'family',
    title: 'Telling Parents You Are Struggling Mentally',
    dilemma: 'You are anxious, depressed, or burned out, but you worry your parents will freak out, confiscate your phone, lecture you, or dismiss it with "you have nothing to be sad about".',
    whyItsHard: 'Parents often react from unmanaged panic or defensiveness rather than listening calmly.',
    practicalSteps: [
      'Pick a neutral time (not during an existing argument, not in a rush before school).',
      'If speaking face-to-face makes you choke up, write a letter, text, or email first.',
      'Frame it as teamwork: "I am sharing this because I trust you and need support, not because I am trying to upset you."',
      'Clearly tell them what you need: listening, a doctor/therapist visit, or just understanding.'
    ],
    scripts: [
      {
        approach: 'Direct & Gentle Conversation',
        description: 'Best for an in-person quiet moment (e.g. during a calm car ride).',
        scriptText: '“Hey Mom/Dad, can we talk for 5 minutes without problem-solving right away? Lately I’ve been feeling really overwhelmed and low, and it’s getting hard for me to carry alone. I don’t expect you to have all the answers, but I wanted to be honest with you. Could we look into speaking with a counselor or therapist?”'
      },
      {
        approach: 'Text Message or Note',
        description: 'Best if you feel too choked up, scared, or emotional to speak out loud.',
        scriptText: '“Hey, I’m sending this as a message because saying it out loud makes me freeze up. I’ve been struggling a lot with my mental health and anxiety recently. It’s affecting my sleep and focus. I love you and I want you to know what’s going on with me. Can we talk about seeing someone professional to help me work through it?”'
      }
    ],
    whatNotToDo: [
      'Don’t drop the bomb during a heated argument about chores or grades.',
      'Don’t bottle it up until you completely collapse; asking for help is a sign of intelligence, not defeat.'
    ]
  },
  {
    id: 'toxic-friendship-drama',
    category: 'friends',
    title: 'Navigating Gossip, Group Exclusion & Toxic Friends',
    dilemma: 'A friend or group is subtly putting you down, leaving you out of group chats, or talking behind your back, but you fear being completely alone if you walk away.',
    whyItsHard: 'Fear of isolation makes us tolerate disrespect that erodes our self-worth.',
    practicalSteps: [
      'Notice how your body feels after spending time with them (drained, anxious, small vs. energized and safe).',
      'Step back gradually rather than starting an explosive confrontation if they are volatile.',
      'Invest energy in parallel hobbies or one-on-one friendships outside that clique.',
      'Remember: being alone temporarily is far healthier than being surrounded by people who make you feel alone.'
    ],
    scripts: [
      {
        approach: 'Calm Boundary Setting',
        description: 'When someone makes a backhanded joke or insults you in front of others.',
        scriptText: '“What makes you say that?” (Pause and look them in the eyes). Or simply: “I know you’re trying to be funny, but that actually wasn’t cool. Let’s not do that.”'
      },
      {
        approach: 'Graceful Distance',
        description: 'When you decide to decline invitations without creating war.',
        scriptText: '“Thanks for thinking of me, but I have other commitments this afternoon. Catch you next week at school!”'
      }
    ],
    whatNotToDo: [
      'Don’t retaliate with revenge rumors or screenshot wars online.',
      'Don’t beg to be included by people who consistently show you where they stand.'
    ]
  },
  {
    id: 'school-panic-freeze',
    category: 'school',
    title: 'Managing Test Dread, Presentations & Academic Burnout',
    dilemma: 'Your mind blanks before a presentation, your heart hammers, or the mountain of homework causes total paralysis.',
    whyItsHard: 'Your sympathetic nervous system treats a math test like a charging predator.',
    practicalSteps: [
      'Engage physical grounding (press both feet firmly flat into the floor, feel the solid chair supporting your spine).',
      'Lower the stakes: Your life trajectory is never determined by a single 45-minute exam.',
      'Chunk tasks into microscopic 15-minute bursts with a 5-minute break.'
    ],
    scripts: [
      {
        approach: 'Email to Teacher for Extension / Support',
        description: 'When you are in a crisis and physically cannot finish work on time.',
        scriptText: '“Dear [Teacher Name], I am writing to let you know that I am currently experiencing significant personal health/anxiety challenges that have severely impacted my ability to complete [Assignment] to my usual standard. I care very much about your class. Would it be possible to discuss a brief extension until [Date] so I can turn in quality work? Thank you for your understanding.”'
      }
    ],
    whatNotToDo: [
      'Don’t stay up past 2 AM studying; REM sleep is when memory consolidation occurs. Pulling an all-nighter guarantees poorer cognitive recall.'
    ]
  },
  {
    id: 'social-media-comparison',
    category: 'self',
    title: 'Breaking Free from the 2 AM Comparison Spiral',
    dilemma: 'Scrolling TikTok or Instagram, seeing everyone else looking effortlessly attractive, popular, and successful, leaving you feeling defective.',
    whyItsHard: 'Algorithms are monetized by hijacking your evolutionary social comparison circuitry.',
    practicalSteps: [
      'Remember: You are comparing your unedited behind-the-scenes raw footage to everyone else’s hyper-filtered highlight reel.',
      'Conduct a ruthless feed audit: unfollow or mute any account that leaves you feeling worse about your body or life.',
      'Charge your phone outside your reach across the room or outside your bedroom at night.'
    ],
    scripts: [
      {
        approach: 'Self-Talk Reset',
        description: 'Repeat mentally when the comparison pit begins.',
        scriptText: '“This photo took 40 takes, intentional studio lighting, posing tricks, and editing. I am looking at a manufactured marketing product, not a benchmark for my human existence.”'
      }
    ],
    whatNotToDo: [
      'Don’t body-check in the mirror immediately after consuming beauty influencer content.'
    ]
  }
];

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'catastrophizing',
    name: 'Catastrophizing (Snowballing)',
    description: 'Jumping straight from a minor setback to an unimaginable worst-case disaster.',
    teenExample: '“I got a C- on this chemistry quiz. I won’t get into college, my parents will disown me, and my entire future is ruined.”',
    challengeQuestion: 'What is the most likely middle-ground outcome instead of the absolute catastrophic extreme?',
    replacementExample: '“This quiz grade is disappointing, but it is one quiz out of dozens. I can ask the teacher for review questions tomorrow.”'
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    description: 'Assuming you know what other people are thinking about you, and concluding it is always negative.',
    teenExample: '“Alex walked past me in the hallway and barely said hi. They definitely think I’m annoying and don’t want to be friends anymore.”',
    challengeQuestion: 'Could there be 3 alternative explanations that have zero to do with me (e.g. they failed a test, have a headache, or are distracted)?',
    replacementExample: '“Alex might be stressed about something of their own. I cannot read minds, and I won’t invent reasons to hurt my own feelings.”'
  },
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing (Black & White Thinking)',
    description: 'Viewing yourself, your performance, or events as either 100% perfect or a total catastrophic failure.',
    teenExample: '“I stuttered during my presentation intro. I completely ruined the whole thing.”',
    challengeQuestion: 'Is it possible that something can be flawed and still valuable, respectable, or successful?',
    replacementExample: '“I had a shaky start, but I delivered the rest of my points clearly. Progress is messy, not flawless.”'
  },
  {
    id: 'personalization',
    name: 'Personalization (Self-Blame)',
    description: 'Believing that other people’s bad moods, conflicts, or distance are entirely your fault.',
    teenExample: '“My mom is grumpy tonight. I must have done something wrong to make her mad.”',
    challengeQuestion: 'Am I taking responsibility for someone else’s adult emotional regulation?',
    replacementExample: '“Other people have their own stress, fatigue, and bad days. I am responsible for my behavior, not for their mood.”'
  }
];

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: 'p1',
    category: 'Emotions',
    question: 'What is one emotion I felt today that I tried to suppress or hide from people? What was that emotion trying to tell me?'
  },
  {
    id: 'p2',
    category: 'Adolescence & Growth',
    question: 'In what ways have I changed in the past 12 months that I feel proud of, even if nobody else noticed?'
  },
  {
    id: 'p3',
    category: 'Boundaries',
    question: 'Is there a situation right now where I am saying "yes" to please someone else when my gut is screaming "no"?'
  },
  {
    id: 'p4',
    category: 'Unspoken Words',
    question: 'What is something I desperately wish my parents or teachers understood about what it feels like to be my age right now?'
  },
  {
    id: 'p5',
    category: 'Self-Compassion',
    question: 'If my best friend made the exact mistake I am currently beating myself up for, what gentle words would I say to them?'
  }
];

export const CRISIS_RESOURCES = [
  {
    name: 'Crisis Text Line',
    action: 'Text HOME to 741741',
    description: 'Free, 24/7 crisis support via text message from anywhere in the US and Canada (UK: 85258).',
    badge: 'Text 24/7',
    contact: '741741'
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    action: 'Call or Text 988',
    description: 'Free, confidential support for anyone in suicidal crisis or emotional distress in the USA & Canada.',
    badge: 'Call / Text',
    contact: '988'
  },
  {
    name: 'The Trevor Project',
    action: 'Call 1-866-488-7386 or Text START to 678-678',
    description: 'Trained counselors specializing in LGBTQ+ youth mental health, suicide prevention, and community support.',
    badge: 'LGBTQ+ Safe Space',
    contact: '1-866-488-7386'
  },
  {
    name: 'Teen Line',
    action: 'Call 800-852-8336 or Text TEEN to 839863',
    description: 'A confidential hotline where teenagers talk to trained teen listeners who truly get it (6-10 PM PST).',
    badge: 'Peer to Peer',
    contact: '800-852-8336'
  },
  {
    name: 'International Resources (Befrienders Worldwide / IASP)',
    action: 'findahelpline.com',
    description: 'Free, confidential mental health and crisis support services available in over 130 countries worldwide.',
    badge: 'Global Directory',
    contact: 'https://findahelpline.com'
  }
];
