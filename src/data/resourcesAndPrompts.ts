import { ResourceItem, GuidedPrompt } from '../types';

export const RESOURCE_LIBRARY: ResourceItem[] = [
  // Stress Management
  {
    id: 'res-stress-1',
    title: 'The Adolescent Nervous System: Why Stress Feels So Physical',
    summary: 'A clinical look into how the adolescent sympathetic nervous system triggers instant fight-or-flight, and why physical down-regulation techniques work faster than positive thinking.',
    category: 'stress',
    type: 'article',
    source: 'Child Mind Institute',
    url: 'https://childmind.org/article/signs-of-stress-in-teens/',
    readOrWatchTime: '6 min read',
    keyTakeaways: [
      'Stress in teenagers almost always presents somatically first (stomach drops, tight chest, jaw tension).',
      'The amygdala reacts before the prefrontal cortex can evaluate if a threat is actually life-or-death.',
      'Active physical exhalations (physiological sighs) signal safety to the brainstem faster than cognitive reasoning.'
    ],
    tags: ['Nervous System', 'Somatic Stress', 'Vagus Nerve'],
    featuredQuote: 'Your body is not overreacting because you are weak; it is executing an ancient survival sequence calibrated for physical danger.',
    overviewDetails: 'During adolescence, adrenal sensitivity is elevated. This guide explores the direct physiological pathway between school stress, social evaluation, and gut-brain signaling, offering three somatic resets that interrupt the cortisol loop.'
  },
  {
    id: 'res-stress-2',
    title: 'Mindfulness & Box Breathing for Acute Overwhelm',
    summary: 'Guided science-based grounding exercises developed by neuroscientists and clinicians specifically calibrated for young adults navigating burnout.',
    category: 'stress',
    type: 'video',
    source: 'Greater Good Science Center (UC Berkeley)',
    url: 'https://greatergood.berkeley.edu',
    readOrWatchTime: '8 min guide',
    embedVideoId: 'nmFUDkj1Aq0',
    keyTakeaways: [
      '4-4-4-4 Box Breathing stabilizes carbon dioxide levels in the bloodstream, slowing pulse rate within 90 seconds.',
      'Grounding the five senses interrupts catastrophic runaway thought loops.',
      'Practicing calm breathing during low-stress moments builds neurological reflex muscle for real crises.'
    ],
    tags: ['Breathwork', 'Panic Relief', 'Grounding'],
    featuredQuote: 'Breath is the only autonomic bodily function that you can also consciously control.',
    overviewDetails: 'UC Berkeley researchers demonstrate how controlled respiration directly communicates with the nucleus of the solitary tract in the brainstem, forcing the parasympathetic rest-and-digest response to initiate.'
  },
  {
    id: 'res-stress-3',
    title: 'The Jed Foundation: Managing Academic & Exam Burnout',
    summary: 'Comprehensive student mental health toolkit designed to recognize when healthy ambition morphs into debilitating academic anxiety and perfectionism.',
    category: 'stress',
    type: 'website',
    source: 'The Jed Foundation (JED)',
    url: 'https://jedfoundation.org/resource/understanding-academic-stress/',
    readOrWatchTime: 'Interactive Portal',
    keyTakeaways: [
      'Separating your human worth from GPA, test percentiles, or college admission metrics.',
      'How the "Freeze" response causes study paralysis and how 5-minute micro-steps break it.',
      'Establishing rigid study cutoff times to allow neurological memory consolidation during sleep.'
    ],
    tags: ['Academics', 'Perfectionism', 'Burnout'],
    featuredQuote: 'Burnout is not a badge of honor or proof that you cared enough. It is an engine running without oil.',
    overviewDetails: 'The Jed Foundation provides research-grounded strategies for high school and college students, helping youth navigate high expectations, parental pressure, and healthy pacing.'
  },

  // Identity Formation
  {
    id: 'res-identity-1',
    title: 'Who Am I Becoming? The Psychology of Adolescent Identity',
    summary: 'Exploring Erik Erikson\'s stage of "Identity vs. Role Confusion" and why experimenting with different styles, music, and interests is essential brain development.',
    category: 'identity',
    type: 'article',
    source: 'American Psychological Association (APA)',
    url: 'https://www.apa.org/topics/teens/identity-development',
    readOrWatchTime: '7 min read',
    keyTakeaways: [
      'Identity is not a fixed puzzle to be solved; it is an evolving collage constructed through trial and observation.',
      'Feeling like a "different person" around parents vs. friends is normal situational adaptation, not hypocrisy.',
      'Core values (honesty, creativity, kindness) are a much steadier anchor than temporary peer aesthetic trends.'
    ],
    tags: ['Self-Concept', 'Psychology', 'Erikson Stages'],
    featuredQuote: 'You are allowed to outgrow versions of yourself that were created just to survive uncomfortable environments.',
    overviewDetails: 'This APA synthesis covers how teenage neuroplasticity supports value exploration, debunking the myth that you have to choose a permanent lifelong identity before turning eighteen.'
  },
  {
    id: 'res-identity-2',
    title: 'The Philosophy & Neuroscience of Self-Discovery',
    summary: 'An animated philosophical and cognitive exploration into the question: Is there a "true self" hidden inside, or are we constantly authoring it?',
    category: 'identity',
    type: 'video',
    source: 'Crash Course Psychology / TED-Ed',
    url: 'https://www.youtube.com/user/crashcourse',
    readOrWatchTime: '11 min watch',
    embedVideoId: 'k2W0-z8EnaM',
    keyTakeaways: [
      'The "Narrative Self": how our brain weaves memories, choices, and hopes into a coherent story.',
      'Why self-criticism feels louder during puberty due to social evaluation brain networks.',
      'Replacing self-judgment with curiosity: "What does my reaction to this reveal about what I value?"'
    ],
    tags: ['Philosophy', 'Self-Discovery', 'Cognitive Science'],
    featuredQuote: 'You are not a statue being carved from marble; you are an author writing a story with unwritten chapters ahead.',
    overviewDetails: 'A visual, engaging breakdown of how identity is forged through experiences, internal reflections, and overcoming adversity rather than passive discovery.'
  },
  {
    id: 'res-identity-3',
    title: 'The Trevor Project & Youth Identity Exploration Guide',
    summary: 'A compassionate, evidence-based guide for adolescents exploring gender identity, sexual orientation, self-acceptance, and finding supportive communities.',
    category: 'identity',
    type: 'website',
    source: 'The Trevor Project',
    url: 'https://www.thetrevorproject.org/resources/guide/a-guide-to-being-you/',
    readOrWatchTime: 'Interactive Guide',
    keyTakeaways: [
      'Your identity is yours to define, label, or leave unlabeled on your own timeline.',
      'Finding chosen families and safe peer environments protects mental resilience.',
      'Practical safety plans for navigating unsupportive households or school climates.'
    ],
    tags: ['LGBTQ+', 'Self-Acceptance', 'Authenticity'],
    featuredQuote: 'There is nothing broken about you. You deserve to exist safely, authentically, and celebrated for who you are.',
    overviewDetails: 'Comprehensive educational resources on self-acceptance, allyship, and mental health from the leading organization dedicated to supporting LGBTQ+ young people.'
  },

  // Healthy Relationships
  {
    id: 'res-rel-1',
    title: 'Love is Respect: Recognizing Healthy Boundaries & Red Flags',
    summary: 'A straightforward, relatable breakdown of peer relationships, romantic crushes, setting emotional boundaries, and recognizing subtle manipulation.',
    category: 'relationships',
    type: 'website',
    source: 'Love is Respect (National Youth Dating Resource)',
    url: 'https://www.loveisrespect.org/',
    readOrWatchTime: 'Resource Hub',
    keyTakeaways: [
      'Healthy boundaries are not punishments; they are instructions on how to love and respect you.',
      'Digital boundaries: knowing that constant location sharing and instant reply demands are control tactics.',
      'The difference between healthy disagreement and emotional isolation.'
    ],
    tags: ['Boundaries', 'Red Flags', 'Dating & Friendships'],
    featuredQuote: 'If someone gets angry when you set a reasonable boundary, it shows how much they benefited from you having none.',
    overviewDetails: 'Offers relationship quizzes, script examples for tough conversations, and anonymous chat options for teens exploring dating, crushes, and healthy communication.'
  },
  {
    id: 'res-rel-2',
    title: 'Friendship Breakups & Toxic Group Dynamics',
    summary: 'Why losing a best friend in middle or high school hurts as deeply as physical grief, and how to navigate changing social cliques with integrity.',
    category: 'relationships',
    type: 'article',
    source: 'Teen Mental Health Org & Psychology Today',
    url: 'https://teenmentalhealth.org',
    readOrWatchTime: '5 min read',
    keyTakeaways: [
      'Adolescent peer rejection triggers identical neural circuits as physical physical pain.',
      'Outgrowing friendships is a natural byproduct of rapid, asymmetric identity maturation.',
      'How to disengage from passive-aggressive gossip circles without starting a war.'
    ],
    tags: ['Friendships', 'Grief', 'Cliques'],
    featuredQuote: 'Some friendships are meant to be chapters, not whole books. Cherish the good pages and know when to turn.',
    overviewDetails: 'Provides actionable frameworks for handling "friend breakups", de-escalating cafeteria drama, and cultivating friends who replenish your energy instead of draining it.'
  },
  {
    id: 'res-rel-3',
    title: 'De-escalating Arguments with Parents: Nonviolent Communication',
    summary: 'Clinical psychologist guide on how to be heard by defensive parents, avoid triggering door-slamming wars, and voice autonomy constructively.',
    category: 'relationships',
    type: 'video',
    source: 'UCLA Center for Adolescent Mental Health',
    url: 'https://www.semel.ucla.edu',
    readOrWatchTime: '9 min watch',
    embedVideoId: 'DgaeQkGZ7zU',
    keyTakeaways: [
      'Using "When X happened, I felt Y, because I need Z" instead of accusatory "You always..." statements.',
      'Calling for a 20-minute nervous system cool-off when vocal volumes elevate.',
      'Recognizing that parental over-control is often unmanaged parental fear for your safety.'
    ],
    tags: ['Family Conflict', 'Communication', 'Parenting Dynamics'],
    featuredQuote: 'You cannot force someone to understand you, but you can choose to communicate in a way you can always stand proud of.',
    overviewDetails: 'Explains parent-teen neurological friction and teaches tactical nonviolent conversational anchors that defuse tension.'
  },

  // Common Adolescent Concerns
  {
    id: 'res-concerns-1',
    title: 'The Social Media Comparison Trap & Dopamine Hijacking',
    summary: 'The neuroscience of the algorithmic feed: why infinite scrolling drains teen self-esteem, inflates social anxiety, and how to reclaim focus.',
    category: 'adolescent_concerns',
    type: 'article',
    source: 'Center for Humane Technology',
    url: 'https://www.humanetech.com/youth',
    readOrWatchTime: '6 min read',
    keyTakeaways: [
      'Algorithms are intentionally designed to weaponize teenage evolutionary desires for social belonging.',
      'Comparing your behind-the-scenes reality to someone else’s curated highlight reel is mathematically unfair.',
      'A 48-hour social media reset measurably lowers salivary cortisol and restores baseline dopamine.'
    ],
    tags: ['Social Media', 'Comparison', 'Dopamine'],
    featuredQuote: 'If an app is free, your attention, insecurities, and emotional reactions are the product being sold.',
    overviewDetails: 'Actionable tips on grayscale screen settings, notification hygiene, and breaking the late-night comparison spiral without becoming a social hermit.'
  },
  {
    id: 'res-concerns-2',
    title: 'Body Neutrality: Moving Beyond the Pressure to "Love" Your Body',
    summary: 'When toxic positivity fails: why body neutrality (respecting your body for what it does rather than how it looks) is the ultimate freedom during puberty.',
    category: 'adolescent_concerns',
    type: 'article',
    source: 'Nemours KidsHealth / National Eating Disorders Association',
    url: 'https://kidshealth.org/en/teens/body-image.html',
    readOrWatchTime: '5 min read',
    keyTakeaways: [
      'Puberty involves non-linear fat redistribution, bone growth, and hormonal fluctuations that you cannot control.',
      'Body neutrality: "My legs carried me to class today" is much healthier and more believable than forced compliments.',
      'Unfollowing accounts that trigger physical inadequacy or promote impossible aesthetic trends.'
    ],
    tags: ['Body Image', 'Puberty', 'Self-Respect'],
    featuredQuote: 'Your body is an instrument for experiencing this world, not an ornament to be evaluated by strangers.',
    overviewDetails: 'Written by adolescent pediatricians and nutrition therapists, this guide dismantles puberty shame and explains why body changes are vital biological milestones.'
  },
  {
    id: 'res-concerns-3',
    title: 'The Sleep Architecture Shift: Why You Cannot Sleep Before 11 PM',
    summary: 'The biological reason your internal clock shifted forward by two hours, why school start times fight biology, and sleep hacks that actually work.',
    category: 'adolescent_concerns',
    type: 'video',
    source: 'National Sleep Foundation & Stanford Medicine',
    url: 'https://www.sleepfoundation.org/teens-and-sleep',
    readOrWatchTime: '7 min watch',
    embedVideoId: 'gedoSfZvBgE',
    keyTakeaways: [
      'Adolescent melatonin release occurs roughly two hours later at night than in children or mature adults.',
      'Blue light from screens delays this already-delayed melatonin peak by an additional 60-90 minutes.',
      'Morning sunlight exposure directly sets your nighttime sleep timer.'
    ],
    tags: ['Sleep', 'Circadian Rhythm', 'Brain Health'],
    featuredQuote: 'You are not staying up late because you are lazy or defiant; your circadian pacemaker was biologically shifted by pubertal hormones.',
    overviewDetails: 'Medical insights on teenage sleep hygiene, memory consolidation during REM sleep, and small schedule adjustments that reduce morning grogginess.'
  }
];

export const GUIDED_PROMPTS_DATA: GuidedPrompt[] = [
  // 1. Self-Discovery & Identity
  {
    id: 'prompt-discovery-1',
    title: 'Unmasking: Who Am I When Nobody Is Watching?',
    category: 'self-discovery',
    coreQuestion: 'What parts of my personality, interests, or humor do I hide around peers to fit in, and what would happen if I let them breathe?',
    whyItMatters: 'Teens spend massive cognitive energy playing roles (the chill one, the funny one, the perfect student). Writing down the parts you conceal begins the process of genuine self-integration.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Role I Play',
        promptText: 'Describe the "mask" or personality trait you most frequently perform around school or friend groups:',
        placeholder: 'e.g., I act like I don\'t care about grades, or I pretend to agree with everyone\'s music taste so I don\'t stick out...'
      },
      {
        step: 2,
        title: 'The Hidden Truth',
        promptText: 'What is something you genuinely love, feel, or believe that you keep quietly to yourself?',
        placeholder: 'e.g., I actually love reading fantasy novels for hours, or I get really affected when people make fun of someone...'
      },
      {
        step: 3,
        title: 'The Gentle Permission',
        promptText: 'What is one low-stakes way you could express a tiny piece of this real self this week?',
        placeholder: 'e.g., Mention my real favorite band to Jordan, or allow myself to not laugh at a joke that felt mean.'
      }
    ],
    suggestedAction: 'Pick one friend or quiet moment today where you don’t automatically conform or minimize your true opinion.',
    affirmation: 'I do not have to shrink myself into a generic template to be worthy of love and community.'
  },
  {
    id: 'prompt-discovery-2',
    title: 'My Top 3 Non-Negotiable Core Values',
    category: 'self-discovery',
    coreQuestion: 'When you strip away popularity, grades, and clothes, what three principles do you want your life to be built on?',
    whyItMatters: 'Clear values act as an internal GPS. When faced with confusing peer pressure, knowing your core values makes decisions almost automatic.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Candidate Values',
        promptText: 'Look through these words: Kindness, Loyalty, Honesty, Creativity, Courage, Humor, Independence, Curiosity. Which 3 resonate deepest?',
        placeholder: 'e.g., 1. Loyalty, 2. Creativity, 3. Honesty...'
      },
      {
        step: 2,
        title: 'The Memory That Proves It',
        promptText: 'Think of a recent time you felt proud of an action you took. Which value were you living in that moment?',
        placeholder: 'e.g., When I sat next to the new kid who was eating alone. That was living my value of kindness.'
      },
      {
        step: 3,
        title: 'The Realignment',
        promptText: 'Where in your life right now is your daily routine out of alignment with these values?',
        placeholder: 'e.g., I value creativity, but I spend 3 hours a day scrolling TikTok instead of drawing or writing.'
      }
    ],
    suggestedAction: 'Write down your three values on a sticky note or in your phone notes where you see it each morning.',
    affirmation: 'My values guide my choices, and my choices build my character.'
  },

  // 2. Coping Strategies & Emotional Regulation
  {
    id: 'prompt-coping-1',
    title: 'The Emotional Fire Alarm (What Does My Body Need?)',
    category: 'coping',
    coreQuestion: 'When a strong emotion hits like a wave, what physical signals does your body send, and what soothing input does it need first?',
    whyItMatters: 'Emotions are physiological events before they are logical thoughts. Decoding bodily distress stops emotional spirals in their tracks.',
    stepPrompts: [
      {
        step: 1,
        title: 'Map the Physical Heat',
        promptText: 'When you feel intense anxiety, anger, or sadness, where do you feel it in your body first?',
        placeholder: 'e.g., My throat gets tight like I cannot swallow, and my stomach feels like a washing machine.'
      },
      {
        step: 2,
        title: 'The Primitive Need',
        promptText: 'Does your nervous system need expelling energy (movement, shaking, yelling into a pillow) or quiet soothing (cold water, heavy blanket, darkness)?',
        placeholder: 'e.g., When angry I need fast walking; when anxious I need a cold face wash and zero noise.'
      },
      {
        step: 3,
        title: 'The Emergency Care Protocol',
        promptText: 'Write a 3-step emergency checklist your future self can follow when your brain goes offline:',
        placeholder: '1. Drink a glass of ice water. 2. Take 3 deep sighs. 3. Lay on the floor for 5 minutes with headphones on.'
      }
    ],
    suggestedAction: 'Save your 3-step emergency checklist in your Sanctuary journal notes.',
    affirmation: 'My intense emotions are not emergencies; they are sensations passing through my body like weather.'
  },
  {
    id: 'prompt-coping-2',
    title: 'Dissolving Shame: The Mistake vs. Identity Shift',
    category: 'coping',
    coreQuestion: 'What recent embarrassing moment or mistake has been looping in your mind, and how can we untangle "I did something awkward" from "I am fundamentally broken"?',
    whyItMatters: 'Guilt says "I made a bad choice." Shame says "I am a bad person." Developing the skill to separate behavior from self-worth is the core of resilience.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Looping Memory',
        promptText: 'What is the specific moment or faux pas that makes you cringe or feel guilty right now?',
        placeholder: 'e.g., I gave the wrong answer in class and someone giggled, or I replied awkwardly to my crush\'s text.'
      },
      {
        step: 2,
        title: 'The Reality Check',
        promptText: 'Will this moment matter in 6 months? Has anyone else in the room probably already forgotten about it?',
        placeholder: 'e.g., In 6 months literally nobody will remember. People only care about their own awkward moments.'
      },
      {
        step: 3,
        title: 'The Compassionate Redirection',
        promptText: 'What would you say to your favorite person in the world if they came to you crying over this exact thing?',
        placeholder: 'e.g., I would tell them: "You are human, everyone blunders, and one awkward 10-second moment doesn\'t define you."'
      }
    ],
    suggestedAction: 'Physically stretch your arms, roll your shoulders back, and take a long sigh out to drop the physical weight of that memory.',
    affirmation: 'I am allowed to be messy, awkward, and learning as I grow. Perfection is a myth.'
  },

  // 3. Goal Setting & Future Self
  {
    id: 'prompt-goals-1',
    title: 'The 1-Year Future Self Letter',
    category: 'goals',
    coreQuestion: 'If you could talk to yourself exactly one year from today, what quiet victories do you hope you have achieved, and what courage did it take?',
    whyItMatters: 'Adolescent brains often struggle with long-term time horizons. Visualizing your future self builds neurological motivation and reduces daily panic.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Emotional Atmosphere',
        promptText: 'How do you want to FEEL inside your mind one year from now (e.g. calmer, more confident, freer, curious)?',
        placeholder: 'e.g., I want to wake up without immediate dread in my chest, and feel comfortable in my own skin.'
      },
      {
        step: 2,
        title: 'One Mountain Conquered',
        promptText: 'What is one specific challenge or fear you are facing today that you hope you have conquered or made peace with by then?',
        placeholder: 'e.g., Having the courage to audition for the play, or finally setting boundaries with friends who make me feel small.'
      },
      {
        step: 3,
        title: 'The Micro-Habit Starting Today',
        promptText: 'What is one ridiculously small daily habit (2-5 minutes) that will get you 1% closer to that future self?',
        placeholder: 'e.g., Putting my phone across the room at 10 PM, or writing one honest sentence in this journal each night.'
      }
    ],
    suggestedAction: 'Commit to your 2-minute micro-habit starting tonight.',
    affirmation: 'I am quietly building the person I want to be, one tiny choice at a time.'
  },
  {
    id: 'prompt-goals-2',
    title: 'Decoupling Ambition From Perfectionism',
    category: 'goals',
    coreQuestion: 'Where is fear of getting a B, making a mistake, or looking silly stopping you from trying something you secretly care about?',
    whyItMatters: 'Perfectionism is not the pursuit of excellence; it is the fear of shame. Healthy ambition allows for messy first drafts and learning curves.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Paralyzed Dream',
        promptText: 'What is something you would love to try or pursue if you knew 100% that nobody would judge you or see you fail?',
        placeholder: 'e.g., Learning guitar, joining track, writing poetry, starting a small YouTube channel or project...'
      },
      {
        step: 2,
        title: 'The Worst-Case Scenario Audit',
        promptText: 'What is the absolute worst thing that could happen if you tried and it went terribly?',
        placeholder: 'e.g., I wouldn\'t be great at first, maybe someone rolls their eyes, but I would still have my room, my pets, my life.'
      },
      {
        step: 3,
        title: 'The "Glorious B-" Permission Slip',
        promptText: 'Write a permission slip to yourself to do this thing imperfectly just for the joy of doing it:',
        placeholder: 'e.g., I hereby give myself permission to be a beginner at guitar and play terrible notes for 3 months.'
      }
    ],
    suggestedAction: 'Take one tiny, clumsy 10-minute action toward that interest today.',
    affirmation: 'Being bad at something is the first necessary step toward being good at something.'
  },

  // 4. Healthy Relationships & Boundaries
  {
    id: 'prompt-rel-1',
    title: 'The Energy Audit: Fulfilling vs. Draining Friendships',
    category: 'relationships',
    coreQuestion: 'When you leave an interaction with your friend group, do you feel energized and accepted, or exhausted and on edge?',
    whyItMatters: 'Adolescent social circles often reward popularity over genuine emotional safety. Auditing your emotional energy helps you invest in authentic connections.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Green Light Connections',
        promptText: 'Who in your life makes you feel like you can be 100% weird, honest, and relaxed without getting mocked?',
        placeholder: 'e.g., Maya and my cousin. Around them I don\'t have to filter my thoughts or watch my posture.'
      },
      {
        step: 2,
        title: 'The Yellow / Red Light Drains',
        promptText: 'Who in your circle leaves you feeling constantly evaluated, gossiped about, or walking on eggshells?',
        placeholder: 'e.g., The soccer group chat. If you miss one hangout or disagree, they ice you out.'
      },
      {
        step: 3,
        title: 'The Boundary Step',
        promptText: 'What is one gentle boundary you can set to protect your emotional peace this week?',
        placeholder: 'e.g., Mute the group chat after 9 PM, or say "I already have plans" when I need a quiet recharge night.'
      }
    ],
    suggestedAction: 'Send a quick appreciative message to one person who makes you feel safe to be yourself.',
    affirmation: 'I deserve friendships where my nervous system feels safe to rest.'
  },

  // 5. Common Adolescent Challenges
  {
    id: 'prompt-chal-1',
    title: 'The 2 AM Comparison Spiral Antidote',
    category: 'challenges',
    coreQuestion: 'What did you see online or at school today that made you feel inadequate, and what is the real context behind that image?',
    whyItMatters: 'Social comparison triggers the brain\'s social exclusion alarm. Unpacking the illusion restores grounded perspective.',
    stepPrompts: [
      {
        step: 1,
        title: 'The Triggering Image or Post',
        promptText: 'What specific post, story, or interaction sparked your feeling of "everyone else has it together except me"?',
        placeholder: 'e.g., Seeing photos of a huge beach trip that looked like a movie, with everyone dressed perfectly.'
      },
      {
        step: 2,
        title: 'The Off-Camera Reality',
        promptText: 'What was hidden behind that photo (lighting, 50 retakes, arguing beforehand, underlying insecurities)?',
        placeholder: 'e.g., They probably took 40 shots to get one good angle, someone was stressed about curfew, and it\'s only a 2-second snapshot.'
      },
      {
        step: 3,
        title: 'Grounded Gratitude',
        promptText: 'Name two real, tangible things in your own immediate physical environment that you are deeply glad exist right now:',
        placeholder: 'e.g., My warm bed and soft blanket, and the hot tea I made 10 minutes ago.'
      }
    ],
    suggestedAction: 'Put your phone in another room or out of arm\'s reach for the next 30 minutes.',
    affirmation: 'I refuse to compare my messy, authentic journey to someone else’s staged snapshot.'
  }
];
