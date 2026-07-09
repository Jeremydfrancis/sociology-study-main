import { useState, useEffect } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`;

// Color system — per published memory research recommendations:
//
// Background #F8F7F2 / Text #2D2D2D:
//   Soft off-white with charcoal text. Spence et al. (2006, Psychological Science):
//   color on near-white bg improved recognition memory vs pure white or dark backgrounds.
//   Warm tint reduces glare without sacrificing contrast.
//
// Blue #1E5AA8 — headings, interactive elements, sustained focus:
//   Associated with focused cognitive performance and attention maintenance.
//   Reserved for questions, buttons, and theory-category labels.
//
// Red #C62828 — errors, critical facts:
//   PMC (2022, Color Education study): red produces strongest memory encoding
//   for detail-recall tasks. Seeing an error in red = stronger correction trace.
//   Also used for the Deviance & Crime topic — highest exam-weight content.
//
// Yellow/Amber #F9A825 — definitions, missed questions, key terms:
//   Peak luminosity (~555nm) — reason highlighters are yellow.
//   Used for missed-question review button and definition-heavy topic (Research Methods).
//
// Green #2E7D32 — correct answers, examples, supporting info:
//   Semantic congruence "go/correct" signal. Forest green (not teal) is
//   less visually fatiguing for long sessions (Better Homes & Gardens / Küller 2009).
//
// Consistent color coding > specific colors (Sanocki & Sulman, Cognition 2010):
//   Blue = theories, Red = critical, Yellow = definitions, Green = examples.
//   Same mapping applies to topic badges AND feedback states.
const C = {
  bg: "#F8F7F2", // soft off-white
  surface: "#FFFFFF", // white cards
  surfaceAlt: "#EEEEE8", // warm grey hover
  border: "#DEDCD4", // light warm border
  borderLight: "#C8C6BE", // stronger border
  blue: "#1E5AA8", // deep blue — focus, interactive, headings
  blueDim: "rgba(30,90,168,0.09)",
  green: "#2E7D32", // forest green — correct, examples
  greenDim: "rgba(46,125,50,0.08)",
  greenDark: "#E8F5E9", // light green — correct choice background
  red: "#C62828", // research red — errors, critical facts
  redDim: "rgba(198,40,40,0.08)",
  redDark: "#FFEBEE", // light red — incorrect choice background
  amber: "#F57F17", // deep amber — definitions, missed questions
  amberDim: "rgba(245,127,23,0.10)",
  text: "#2D2D2D", // charcoal — main text
  textSub: "#555555", // medium grey
  textMuted: "#8A8A8A", // light grey
};

// Topic color mapping follows the psychology course coding system:
// Blue = economy/institutions · Purple = politics/power · Red = collective behavior
// Green = marriage/family · Teal = education · Amber = science/health
const TOPIC_CFG = {
  "Economy & Work": { c: "#1565C0", bg: "rgba(21,101,192,0.08)", icon: "💼" },
  "Politics & Government": {
    c: "#6A1B9A",
    bg: "rgba(106,27,154,0.08)",
    icon: "🏛️",
  },
  "Collective Behavior & Movements": {
    c: "#C62828",
    bg: "rgba(198,40,40,0.08)",
    icon: "📢",
  },
  "Marriage & Family": { c: "#2E7D32", bg: "rgba(46,125,50,0.08)", icon: "👨‍👩‍👧" },
  Education: { c: "#00695C", bg: "rgba(0,105,92,0.08)", icon: "🎓" },
  "Science, Health & Paradigms": {
    c: "#F57F17",
    bg: "rgba(245,127,23,0.10)",
    icon: "🔬",
  },
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QUESTIONS = [
  {
    id: 1,
    topic: "Marriage & Family",
    q: "A family consisting of a mother, a father, and their biological children is known as a(n) ____________ family.",
    choices: [
      "Polygamous",
      "Polyandrous",
      "Extended",
      "Nuclear",
    ],
    correct: "Nuclear",
    exp: "A nuclear family consists of one or two parents and their children living as a single household unit. It's distinct from an extended family (which includes grandparents, aunts, and uncles) and from polygamous/polyandrous arrangements (multiple spouses).",
  },
  {
    id: 2,
    topic: "Marriage & Family",
    q: "In what year were laws prohibiting interracial marriage struck down in the United States?",
    choices: [
      "1865",
      "1915",
      "1937",
      "1967",
    ],
    correct: "1967",
    exp: "Loving v. Virginia (1967) struck down state anti-miscegenation laws, ruling that bans on interracial marriage violated the Equal Protection and Due Process Clauses of the Fourteenth Amendment.",
  },
  {
    id: 3,
    topic: "Economy & Work",
    q: "As a social institution, the economy ________",
    choices: [
      "Produces goods and services.",
      "Guides the consumption of goods and services.",
      "Distributes goods and services.",
      "All of these responses are correct.",
    ],
    correct: "All of these responses are correct.",
    exp: "As a social institution, the economy encompasses the full cycle of production, distribution, and consumption of goods and services — not just one stage of it.",
  },
  {
    id: 4,
    topic: "Economy & Work",
    q: "Which social institution do most sociologists claim has the greatest effect on society as a whole?",
    choices: [
      "The family",
      "The economy",
      "The political system",
      "Religion",
    ],
    correct: "The economy",
    exp: "Many sociologists argue the economy has the broadest ripple effects on society — shaping employment, standard of living, and access to resources, and even the shape of other institutions like family and politics — since every group depends on economic production and distribution to survive.",
  },
  {
    id: 5,
    topic: "Economy & Work",
    q: "The development of agriculture was set in motion by ________",
    choices: [
      "Changes in the church.",
      "Using animals to pull the plow.",
      "The discovery of writing.",
      "The discovery of oil.",
    ],
    correct: "Using animals to pull the plow.",
    exp: "The Agricultural Revolution accelerated once humans harnessed animal power (the plow) to cultivate land far more efficiently than by hand, enabling surplus production and settled societies.",
  },
  {
    id: 6,
    topic: "Economy & Work",
    q: "The text describes three technological revolutions that transformed all of social life. Which of the following is NOT one of them?",
    choices: [
      "The Agricultural Revolution",
      "The Industrial Revolution",
      "The Immigration Revolution",
      "The Information Revolution",
    ],
    correct: "The Immigration Revolution",
    exp: "The three major technological revolutions are the Agricultural, Industrial, and Information Revolutions. Immigration is a demographic and social process, not a technological revolution.",
  },
  {
    id: 7,
    topic: "Economy & Work",
    q: "The postindustrial economy is defined by ________",
    choices: [
      "The spread of factories.",
      "Mass production of goods and services.",
      "Manufacturing of raw materials.",
      "Service work largely based on computer technology.",
    ],
    correct: "Service work largely based on computer technology.",
    exp: "A postindustrial economy shifts from manufacturing to service and information work — jobs centered on knowledge, technology, and computer-based tasks rather than physical production.",
  },
  {
    id: 8,
    topic: "Economy & Work",
    q: "Which of the following statements about the Information Revolution is NOT correct?",
    choices: [
      "There was a shift from making tangible products to generating ideas.",
      "There was a shift from mechanical skills to literacy skills.",
      "There was a shift from farming to turning raw materials into finished products.",
      "There was a shift from working in factories to working almost anywhere.",
    ],
    correct: "There was a shift from farming to turning raw materials into finished products.",
    exp: "That shift — from farming to manufacturing finished products — describes the earlier Industrial Revolution, not the Information Revolution. The Information Revolution shifted work from factories to knowledge-based, mobile, idea-generating labor.",
  },
  {
    id: 9,
    topic: "Economy & Work",
    q: "Which sector of the economy generates raw materials directly from the natural environment?",
    choices: [
      "Primary sector",
      "Secondary sector",
      "Tertiary sector",
      "None of the other responses is correct.",
    ],
    correct: "Primary sector",
    exp: "The primary sector extracts raw materials directly from nature (farming, fishing, mining, forestry). The secondary sector transforms those materials into finished goods; the tertiary sector provides services.",
  },
  {
    id: 10,
    topic: "Economy & Work",
    q: "The concept of “global economy” refers to ________",
    choices: [
      "Economic activity that moves across national borders.",
      "The fact that only a few countries now contribute to the global economy.",
      "The fact that economic output is under the control of global political leadership.",
      "All of these responses are correct.",
    ],
    correct: "Economic activity that moves across national borders.",
    exp: "A global economy is one in which production, trade, and finance cross national boundaries, tying nations' economic fortunes together — not one controlled by a single body or limited to a few countries.",
  },
  {
    id: 11,
    topic: "Economy & Work",
    q: "Capitalism is an economic system in which there is ________",
    choices: [
      "Government control of production.",
      "Private ownership of property.",
      "Pursuit of collective goals.",
      "All of these responses are correct.",
    ],
    correct: "Private ownership of property.",
    exp: "Capitalism is defined by private (rather than state) ownership of property and the means of production, with individuals pursuing profit in a market economy.",
  },
  {
    id: 12,
    topic: "Economy & Work",
    q: "The social thinker whose ideas provide the greatest support for the operation of a free-market economy was ________",
    choices: [
      "Thorstein Veblen.",
      "Adam Smith.",
      "Karl Marx.",
      "Max Weber.",
    ],
    correct: "Adam Smith.",
    exp: "Adam Smith, in The Wealth of Nations (1776), argued that an 'invisible hand' of self-interested exchange in free markets efficiently allocates resources — the foundational argument for laissez-faire capitalism.",
  },
  {
    id: 13,
    topic: "Economy & Work",
    q: "Socialism is an economic system in which there is ________",
    choices: [
      "Collective control of production.",
      "Private ownership of property.",
      "Pursuit of individual profit.",
      "All of these responses are correct.",
    ],
    correct: "Collective control of production.",
    exp: "Socialism calls for collective or state control over the means of production and distribution, in contrast to capitalism's private ownership and individual profit motive.",
  },
  {
    id: 14,
    topic: "Economy & Work",
    q: "Contrasted with socialist economic systems, capitalist economic systems typically ________",
    choices: [
      "Generate more economic inequality.",
      "Generate less economic inequality.",
      "Generate about the same level of inequality.",
      "Do not generate any social equality.",
    ],
    correct: "Generate more economic inequality.",
    exp: "Because capitalism allows private accumulation of wealth and rewards competitive success unevenly, it tends to produce greater income and wealth inequality than systems built on collective ownership and redistribution.",
  },
  {
    id: 15,
    topic: "Politics & Government",
    q: "Politics is a social institution that is defined in terms of a society's ________",
    choices: [
      "Distribution of power, goals, and decision making.",
      "Technology.",
      "Income distribution.",
      "Means of production.",
    ],
    correct: "Distribution of power, goals, and decision making.",
    exp: "As a social institution, politics concerns how power is distributed and exercised — who makes decisions, sets goals, and governs collective life.",
  },
  {
    id: 16,
    topic: "Politics & Government",
    q: "Max Weber defined power as ________",
    choices: [
      "Simply a reflection of wealth.",
      "The ability to achieve desired ends, despite resistance.",
      "The operation of a government.",
      "The source of all bureaucracy.",
    ],
    correct: "The ability to achieve desired ends, despite resistance.",
    exp: "Weber's classic definition: power is the ability of an individual or group to achieve their aims even against the resistance of others — distinct from mere wealth or formal government office.",
  },
  {
    id: 17,
    topic: "Politics & Government",
    q: "People who attract followers, including Mahatma Gandhi and Martin Luther King, display ________",
    choices: [
      "Traditional authority.",
      "Rational-legal authority.",
      "Charismatic authority.",
      "Power rather than authority.",
    ],
    correct: "Charismatic authority.",
    exp: "Weber's charismatic authority rests on the exceptional personal qualities of a leader that inspire devotion, as opposed to traditional authority (custom) or rational-legal authority (rules and offices).",
  },
  {
    id: 18,
    topic: "Politics & Government",
    q: "The concept “authoritarian” refers to a political system that ________",
    choices: [
      "Is well legitimated.",
      "Relies on more than one kind of authority.",
      "Denies most people participation in government.",
      "Has free elections.",
    ],
    correct: "Denies most people participation in government.",
    exp: "Authoritarian systems concentrate power in the state or a small elite and exclude the broader population from meaningful participation in governance.",
  },
  {
    id: 19,
    topic: "Politics & Government",
    q: "Which dimension of power shows the promotion of the actor's will in such a way that it can not be contradicted or reversed?",
    choices: [
      "First",
      "Second",
      "Third",
      "Huh?",
    ],
    correct: "Third",
    exp: "Steven Lukes' third (radical) dimension of power is the most insidious: it shapes people's very wants and beliefs so thoroughly that they don't even perceive grounds for objection — power so total it can't be contradicted or reversed, unlike the first dimension (visible decision-making) or the second (agenda-setting).",
  },
  {
    id: 20,
    topic: "Politics & Government",
    q: "___________________ is a legal-rational organization or mode of administration that governs with reference to rules and roles and emphasizes meritocracy.",
    choices: [
      "Democracy",
      "Communism",
      "Theocracy",
      "Bureaucracy",
    ],
    correct: "Bureaucracy",
    exp: "Weber's bureaucracy is a rule-governed, hierarchical administrative structure where positions are filled based on merit and defined by formal roles rather than personal loyalty or tradition.",
  },
  {
    id: 21,
    topic: "Politics & Government",
    q: "Which is a characteristic of Bureaucracy?",
    choices: [
      "Division of labor",
      "Authority hierarchy",
      "Impersonality",
      "All of these",
    ],
    correct: "All of these",
    exp: "Weber's ideal-type bureaucracy features division of labor, a clear hierarchy of authority, and impersonality (decisions based on rules, not personal relationships) — all simultaneously.",
  },
  {
    id: 22,
    topic: "Politics & Government",
    q: "_______guarantee personal freedom without state interference; _________are rights to participate in politics, hold office, or vote; _____guarantee protection by the state.",
    choices: [
      "Civil rights; Political rights; Social rights",
      "Political rights; Civil Rights; Special Rights",
      "Social Rights; Mandated Rights; Civil Rights",
    ],
    correct: "Civil rights; Political rights; Social rights",
    exp: "T.H. Marshall's classic typology: civil rights protect individual freedom from state interference (speech, religion); political rights allow participation in governance (voting, office); social rights guarantee a baseline of welfare and protection from the state.",
  },
  {
    id: 23,
    topic: "Politics & Government",
    q: "Anti-discrimination laws are examples of giving minority groups___________",
    choices: [
      "Special rights",
      "Civil rights",
      "Social rights",
      "Right rights",
    ],
    correct: "Civil rights",
    exp: "Anti-discrimination laws protect individuals' basic civil rights — equal treatment and freedom from interference or exclusion based on group membership.",
  },
  {
    id: 24,
    topic: "Politics & Government",
    q: "According to a 2-tiered approach to the political spectrum, ____________ favor government involvement in economic policy making.",
    choices: [
      "Liberals",
      "Conservatives",
      "Libertarians",
      "Anarchists",
    ],
    correct: "Liberals",
    exp: "In the common two-dimensional (economic/social) model of the political spectrum, liberals are associated with favoring greater government intervention in economic policy (regulation, redistribution), while conservatives and libertarians favor less.",
  },
  {
    id: 25,
    topic: "Economy & Work",
    q: "Which is a Social Subsystem of the Economy?",
    choices: [
      "Property",
      "Technology",
      "Division of labor",
      "Organization of work",
      "All of these",
    ],
    correct: "All of these",
    exp: "Sociologists analyze the economy as made up of interlocking subsystems — property relations, technology, division of labor, and the organization of work — that together structure economic life.",
  },
  {
    id: 26,
    topic: "Economy & Work",
    q: "The concept by George Ritzer that states post-industrial society and institutions have focused on becoming more efficient, controllable, and predictable is called:",
    choices: [
      "Coca-colonialization",
      "Americanization",
      "Cultural Imperialism",
      "McDonaldization",
    ],
    correct: "McDonaldization",
    exp: "Ritzer's McDonaldization thesis describes how efficiency, calculability, predictability, and control — principles pioneered by fast-food chains — have come to dominate institutions far beyond the restaurant industry.",
  },
  {
    id: 27,
    topic: "Collective Behavior & Movements",
    q: "A _____ identity is an aspect of your identity (such as race) that doesn't change and that determines at least one group to which you belong.",
    choices: [
      "Static",
      "Manifest",
      "Dynamic",
      "Achieved",
    ],
    correct: "Static",
    exp: "A static identity is fixed rather than chosen or earned — like race or sex assigned at birth — and automatically places you within a given social category, in contrast to an achieved identity you earn through action.",
  },
  {
    id: 28,
    topic: "Collective Behavior & Movements",
    q: "Who coined the term “Cult of the Individual” more than a hundred years before society launched into depths of self-obsession and narcissism?",
    choices: [
      "Merton",
      "Marx",
      "Durkheim",
      "Addams",
    ],
    correct: "Durkheim",
    exp: "Émile Durkheim described the 'cult of the individual' in the late 1800s — the idea that in modern, differentiated societies, the individual person (rather than the collective) becomes a kind of sacred object, a precursor to modern individualism and self-focus.",
  },
  {
    id: 29,
    topic: "Collective Behavior & Movements",
    q: "Mobs and riots belong to what category of crowd behavior?",
    choices: [
      "Conventional",
      "Casual",
      "Expressive",
      "None of these",
    ],
    correct: "None of these",
    exp: "Mobs and riots are classified as acting crowds — emotionally charged and oriented toward a violent or destructive goal — a category distinct from casual crowds (people incidentally in the same place), conventional crowds (planned, norm-following gatherings like a concert audience), and expressive crowds (gathered to release emotion, e.g., at a festival). Since 'acting' isn't among the answer choices, none of the given options is correct.",
  },
  {
    id: 30,
    topic: "Collective Behavior & Movements",
    q: "_________________ action takes place when members of a group are face to face.",
    choices: [
      "Expressive crowds",
      "Mass collectives",
      "Crowd Collectives",
      "Flash mobs",
    ],
    correct: "Crowd Collectives",
    exp: "Crowd behavior (a 'localized collectivity') requires people to be physically co-present and face to face, unlike mass behavior — a 'dispersed collectivity' where participants share a common interest or reaction without ever being in the same place (e.g., a viral rumor or nationwide fad).",
  },
  {
    id: 31,
    topic: "Collective Behavior & Movements",
    q: "______________________ theory explains when collective action happens when people with similar ideas and tendencies gather in the same place.",
    choices: [
      "Convergence",
      "Emergent",
      "Contagion",
      "Mass Behavior",
    ],
    correct: "Convergence",
    exp: "Convergence theory holds that crowds form when like-minded individuals — who already share similar attitudes or predispositions — come together in the same place, rather than the crowd itself creating those shared feelings (as contagion theory would argue).",
  },
  {
    id: 32,
    topic: "Collective Behavior & Movements",
    q: "What type of movement seeks to make radical change across an entire society, dissatisfied with the existing social order — radical change that is tailored to their ideological beliefs?",
    choices: [
      "Reformative",
      "Redemptive",
      "Revolutionary",
      "Escapist",
    ],
    correct: "Revolutionary",
    exp: "Revolutionary (transformative) movements seek total, radical change to the entire social order, rejecting the status quo altogether — unlike reformative movements, which push for limited change within the existing system.",
  },
  {
    id: 33,
    topic: "Collective Behavior & Movements",
    q: "Social movements can be partially identified by which of these foci?",
    choices: [
      "Radical Social Change",
      "Target Entire Society",
      "Target Particular Subgroups",
      "Limited Social Change",
      "All of these",
    ],
    correct: "All of these",
    exp: "Aberle's typology classifies social movements along two dimensions — how much change they seek (limited vs. radical) and who they target (specific subgroups vs. the whole society) — so all four factors are used to identify a movement's type.",
  },
  {
    id: 34,
    topic: "Collective Behavior & Movements",
    q: "_____ presents facts in such a way that implicates a problem that is in need of a solution.",
    choices: [
      "Propaganda",
      "Fake newsing",
      "Framing",
      "Foxing",
    ],
    correct: "Framing",
    exp: "Framing is the strategic presentation of facts and issues to highlight a problem and suggest that action or a solution is needed — a key tool social movements use to mobilize support.",
  },
  {
    id: 35,
    topic: "Collective Behavior & Movements",
    q: "What kind of movement called national attention to the Flint Water Crisis?",
    choices: [
      "Regressive",
      "Grassroots",
      "Reformative",
      "Revolutionary",
    ],
    correct: "Grassroots",
    exp: "The Flint Water Crisis gained national attention largely through grassroots activism — local residents, especially mothers, organizing and demanding accountability from the bottom up rather than through top-down institutional channels.",
  },
  {
    id: 36,
    topic: "Marriage & Family",
    q: "What might a sociologist say about people's selection of marriage partners?",
    choices: [
      "People marry because they fall in love.",
      "When it comes to romance, it is all a matter of personal taste.",
      "Typically, a person marries someone of similar social position.",
      "When it comes to love, opposites attract.",
    ],
    correct: "Typically, a person marries someone of similar social position.",
    exp: "Sociologists point to the pattern of homogamy — people tend to marry others similar in class, education, religion, and ethnicity — showing that social structure, not just personal feeling, shapes our romantic choices.",
  },
  {
    id: 37,
    topic: "Marriage & Family",
    q: "______________ is the 1967 Supreme Court case that ended anti-miscegenation laws (laws that said that interracial couples could not marry).",
    choices: [
      "Brown vs. Board of Education",
      "Roe v. Wade",
      "Loving v. Virginia",
      "Obergefell v. Hodges",
    ],
    correct: "Loving v. Virginia",
    exp: "Loving v. Virginia (1967) struck down state bans on interracial marriage as unconstitutional, ending legal anti-miscegenation laws nationwide.",
  },
  {
    id: 38,
    topic: "Marriage & Family",
    q: "In 2016, the United States Supreme Court [ruled that] the fundamental right to marry extends to same-sex couples; same-sex marriage bans are unconstitutional under the __________",
    choices: [
      "Librul conspiracy",
      "Fourteenth Amendment",
      "First Amendment",
      "Second Amendment",
    ],
    correct: "Fourteenth Amendment",
    exp: "Obergefell v. Hodges held that the fundamental right to marry is guaranteed to same-sex couples under the Due Process and Equal Protection Clauses of the Fourteenth Amendment.",
  },
  {
    id: 39,
    topic: "Marriage & Family",
    q: "What is a kinship network?",
    choices: [
      "Systems of relationships between people related by blood and marriage",
      "Households with multiple generations",
      "A television channel",
      "A form of land acquisition",
    ],
    correct: "Systems of relationships between people related by blood and marriage",
    exp: "A kinship network is the web of relationships — by blood, marriage, or adoption — that connects individuals to a broader network of relatives, shaping obligations, support, and identity.",
  },
  {
    id: 40,
    topic: "Marriage & Family",
    q: "The institution of family is:",
    choices: [
      "Fluid",
      "Personal",
      "Abstract",
      "All of these",
    ],
    correct: "Fluid",
    exp: "Sociologists emphasize that 'family' is a fluid, historically and culturally variable institution — its form and definition change over time and across societies, rather than being one fixed, universal arrangement.",
  },
  {
    id: 41,
    topic: "Marriage & Family",
    q: "What was popularized as the American Standard for a family in the mid-20th Century?",
    choices: [
      "A nuclear family",
      "Unmarried cohabitation",
      "Child marriage",
      "Polyamory",
    ],
    correct: "A nuclear family",
    exp: "The mid-20th-century 'American Standard' idealized the nuclear family — breadwinner father, homemaker mother, and their children — as the normative family form, even though it never represented all American households.",
  },
  {
    id: 42,
    topic: "Marriage & Family",
    q: "In our film on the changing methods of parenthood, what did the elephant family represent?",
    choices: [
      "Child-led families",
      "Parent-led families",
      "Natural selection",
      "An admonishment of the trophy hunting phenomenon",
    ],
    correct: "Parent-led families",
    exp: "The elephant family was used to illustrate a parent-led, multigenerational caregiving model — adult elephants (mothers and other female relatives) closely guide and protect the young. If your course framed this differently, double-check your lecture notes — this example is specific to your class film and harder to verify from outside sources.",
  },
  {
    id: 43,
    topic: "Education",
    q: "The Hidden Curriculum ....",
    choices: [
      "Serves to form a more cohesive society",
      "Has been used to impose the values of a dominant culture on outsiders or minorities.",
      "Is the focus of conflict theorists",
      "All of the above",
    ],
    correct: "All of the above",
    exp: "The hidden curriculum — the unstated norms and values schools teach alongside academics — functions in multiple, sometimes contradictory ways: functionalists see it as building social cohesion, while conflict theorists study how it imposes dominant cultural values on marginalized groups. Both are true simultaneously.",
  },
  {
    id: 44,
    topic: "Education",
    q: "The Functionalist view of Education stresses",
    choices: [
      "Inequality among students which affects outcome",
      "Ways education supports the operation of modern society",
      "Ways that language is limited in the pursuit of truth",
      "The mechanics of Darwinism.",
    ],
    correct: "Ways education supports the operation of modern society",
    exp: "Functionalists analyze education in terms of the functions it performs for society as a whole — socialization, social integration, sorting/allocating talent, and innovation — that keep modern society running smoothly.",
  },
  {
    id: 45,
    topic: "Education",
    q: "What was the name of the report which showed that family background and integration with peers and community had correlative effects on educational achievement?",
    choices: [
      "The school report",
      "The Coleman report",
      "The Watergate report",
      "None of these",
    ],
    correct: "The Coleman report",
    exp: "The 1966 Coleman Report found that a student's family background and peer/community environment were more strongly linked to educational achievement than school funding or resources — a landmark and controversial finding in the sociology of education.",
  },
  {
    id: 46,
    topic: "Education",
    q: "________ is Formal instruction under the direction of specially trained teachers.",
    choices: [
      "Private education",
      "Homeschooling",
      "Schooling",
      "Self-schooling",
    ],
    correct: "Schooling",
    exp: "Schooling refers specifically to formal instruction delivered by trained teachers in a structured setting, as distinct from the broader concept of 'education' (all the ways people acquire knowledge over a lifetime).",
  },
  {
    id: 47,
    topic: "Education",
    q: "Which topic is an issue for Symbolic Interactionists regarding education?",
    choices: [
      "Rewarded behaviors",
      "The function of education in society",
      "The role of family education background in student success",
      "Teacher salary analysis",
    ],
    correct: "Rewarded behaviors",
    exp: "Symbolic interactionists study education at the micro level — day-to-day classroom interactions, like which behaviors teachers notice and reward, and how labeling and expectations shape a student's self-concept.",
  },
  {
    id: 48,
    topic: "Education",
    q: "Which refers to the knowledge and skills that make someone more productive and bankable?",
    choices: [
      "Soft skills",
      "STEM knowledge",
      "Indoctrination",
      "Human Capital",
    ],
    correct: "Human Capital",
    exp: "Human capital refers to the education, skills, and knowledge that increase an individual's economic value and productivity — a concept central to why societies invest in schooling.",
  },
  {
    id: 49,
    topic: "Education",
    q: "Which topic is an issue for Conflict theorists regarding education?",
    choices: [
      "Textbook content analysis",
      "“Tracking” and grouping students by ability",
      "Neither a nor b",
      "Both A and B",
    ],
    correct: "Both A and B",
    exp: "Conflict theorists examine how education reproduces inequality — both through biased textbook content (whose perspectives and histories get included) and through tracking/ability grouping, which can channel students of different backgrounds into unequal educational and occupational paths.",
  },
  {
    id: 50,
    topic: "Education",
    q: "Licensing, educational credentialing, certification, association representation, and unionization are forms of:",
    choices: [
      "Elitism",
      "Degree inflation",
      "Social closure",
      "Degree inversion",
    ],
    correct: "Social closure",
    exp: "Social closure describes how groups (professions, unions) restrict access to opportunities and resources — through licensing, credentialing requirements, and organized representation — to protect their own status and limit competition.",
  },
  {
    id: 51,
    topic: "Science, Health & Paradigms",
    q: "___________________________ is the idea that science follows objective rules of evidence and is unaffected by the personal beliefs or values of scientists.",
    choices: [
      "Pseudo-science",
      "Political science",
      "Pure science",
      "Normative science",
    ],
    correct: "Pure science",
    exp: "Pure science is the ideal that scientific inquiry is guided purely by objective evidence and method, free from the personal values or biases of the researcher — an ideal real science often falls short of, but still aspires to.",
  },
  {
    id: 52,
    topic: "Science, Health & Paradigms",
    q: "Which is not an example of a paradigm shift?",
    choices: [
      "Understanding gender as non-binary",
      "Expanding feminism beyond white middle class goals",
      "The application of Intersectionality to studies of social inequality",
      "All of these",
    ],
    correct: "All of these",
    exp: "Trick question: understanding gender as non-binary, expanding feminism beyond white middle-class concerns, and applying intersectionality to inequality are all genuine paradigm shifts in sociology — meaning none of them is the exception, so 'all of these' is the only defensible choice.",
  },
  {
    id: 53,
    topic: "Science, Health & Paradigms",
    q: "________________ is the systematic repression and denial of the contribution of woman scientists in research, whose work is often attributed to their male colleagues.",
    choices: [
      "The Matthew Effect",
      "The Hawthorne effect",
      "The Matilda Effect",
      "The Socratic Method",
    ],
    correct: "The Matilda Effect",
    exp: "The Matilda Effect names the pattern of women scientists' contributions being downplayed, overlooked, or credited to male colleagues — a gendered counterpart to the Matthew Effect (where already-famous scientists get disproportionate credit).",
  },
  {
    id: 54,
    topic: "Science, Health & Paradigms",
    q: "As a global epidemic still, in 2013 which region had vastly more people living with HIV?",
    choices: [
      "North America",
      "South America",
      "Sub-Saharan Africa",
      "Russia",
    ],
    correct: "Sub-Saharan Africa",
    exp: "Sub-Saharan Africa has long borne the greatest global burden of HIV, accounting for the large majority of people living with HIV worldwide, including in 2013 — driven by factors like limited healthcare access, poverty, and stigma.",
  },
  {
    id: 55,
    topic: "Science, Health & Paradigms",
    q: "What advances caused the shift in fatal illnesses throughout the 20th century?",
    choices: [
      "Vaccines",
      "Better Ventilation",
      "Health Education",
      "All of these",
    ],
    correct: "All of these",
    exp: "The 20th-century epidemiological transition — from infectious disease to chronic illness as the leading cause of death — resulted from a combination of advances: vaccines, improved sanitation/ventilation, and public health education, not any single factor alone.",
  },
];

const TOPICS = ["All Topics", ...Object.keys(TOPIC_CFG)];
const LABELS = ["A", "B", "C", "D"];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [topicFilter, setTopicFilter] = useState("All Topics");
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState(new Set());
  const [choices, setChoices] = useState([]);
  const [showExp, setShowExp] = useState(false);
  const [topicStats, setTopicStats] = useState({});
  const [hover, setHover] = useState(null);

  const q = queue[qIdx];
  const answered = selected !== null;
  const isCorrect = answered && selected === q?.correct;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (q) {
      setChoices(shuffle(q.choices));
      setSelected(null);
      setShowExp(false);
    }
  }, [qIdx, queue.length]);

  const startQuiz = (reviewMissed = false) => {
    const base = reviewMissed
      ? QUESTIONS.filter((q) => missed.has(q.id))
      : topicFilter === "All Topics"
        ? [...QUESTIONS]
        : QUESTIONS.filter((q) => q.topic === topicFilter);
    setQueue(shuffle(base));
    setQIdx(0);
    setScore(0);
    setTotal(0);
    if (!reviewMissed) {
      setMissed(new Set());
      setTopicStats({});
    }
    setScreen("quiz");
  };

  const handleSelect = (choice) => {
    if (answered) return;
    setSelected(choice);
    setTotal((t) => t + 1);
    const ok = choice === q.correct;
    if (ok) setScore((s) => s + 1);
    else setMissed((prev) => new Set([...prev, q.id]));
    setTopicStats((prev) => ({
      ...prev,
      [q.topic]: {
        correct: (prev[q.topic]?.correct || 0) + (ok ? 1 : 0),
        total: (prev[q.topic]?.total || 0) + 1,
      },
    }));
    setTimeout(() => setShowExp(true), 350);
  };

  const handleNext = () => {
    if (qIdx < queue.length - 1) setQIdx((i) => i + 1);
    else setScreen("results");
  };

  const body = {
    fontFamily: "'DM Sans', sans-serif",
    background: C.bg,
    color: C.text,
    minHeight: "100vh",
    margin: 0,
  };
  const heading = { fontFamily: "'Outfit', sans-serif" };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") {
    const count =
      topicFilter === "All Topics"
        ? QUESTIONS.length
        : QUESTIONS.filter((q) => q.topic === topicFilter).length;
    return (
      <div style={body}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.bg}; }`}</style>

        {/* Nav */}
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            padding: "18px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                ...heading,
                fontWeight: 900,
                fontSize: 18,
                color: C.blue,
              }}
            >
              SOC 101
            </span>
            <span style={{ marginLeft: 10, fontSize: 13, color: C.textMuted }}>
              Introduction to Sociology
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.textSub,
              background: C.surfaceAlt,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            {QUESTIONS.length} questions · Final Exam
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
          {/* Hero */}
          <div style={{ marginBottom: 44 }}>
            <div
              style={{
                ...heading,
                fontWeight: 900,
                fontSize: 46,
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            >
              <br />
              <span style={{ color: C.blue }}>Final Exam</span>
            </div>
            <div
              style={{
                fontSize: 17,
                color: C.textSub,
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              Quiz yourself, get instant feedback, and automatically review what
              you missed.
            </div>
          </div>

          {/* Topic Filter */}
          <div style={{ marginBottom: 36 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Filter by topic
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOPICS.map((t) => {
                const cfg = TOPIC_CFG[t];
                const active = topicFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTopicFilter(t)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                      border: active
                        ? `2px solid ${t === "All Topics" ? C.blue : cfg.c}`
                        : `1px solid ${C.border}`,
                      background: active
                        ? t === "All Topics"
                          ? C.blueDim
                          : cfg.bg
                        : C.surface,
                      color: active
                        ? t === "All Topics"
                          ? C.blue
                          : cfg.c
                        : C.textSub,
                    }}
                  >
                    {cfg && cfg.icon + " "}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginBottom: 44 }}>
            <button
              onClick={() => startQuiz(false)}
              style={{
                width: "100%",
                padding: "18px 24px",
                background: `linear-gradient(135deg, ${C.blue} 0%, #1565C0 100%)`,
                border: "none",
                borderRadius: 14,
                color: "#FFFFFF",
                ...heading,
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(30,90,168,0.22)",
                marginBottom: 12,
                letterSpacing: "0.01em",
              }}
            >
              Start Quiz — {count} Questions →
            </button>
            {missed.size > 0 && (
              <button
                onClick={() => startQuiz(true)}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: "transparent",
                  border: `1px solid ${C.amber}40`,
                  borderRadius: 14,
                  color: C.amber,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                📋 Review Missed Questions ({missed.size})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    const progress = (qIdx + 1) / queue.length;
    const cfg = TOPIC_CFG[q?.topic] || {};
    const pct = total > 0 ? Math.round((score / total) * 100) : null;
    const scoreColor =
      pct === null
        ? C.textMuted
        : pct >= 70
          ? C.green
          : pct >= 50
            ? C.amber
            : C.red;

    return (
      <div style={body}>
        <style>{`* { box-sizing: border-box; } body { background: ${C.bg}; }`}</style>

        {/* Sticky top bar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 10,
          }}
        >
          <div style={{ height: 4, background: C.border }}>
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${C.blue}, #1565C0)`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div
            style={{
              padding: "10px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, color: C.textSub }}>
              <span style={{ color: C.text, fontWeight: 600 }}>{qIdx + 1}</span>
              <span style={{ color: C.textMuted }}> / {queue.length}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor }}>
              {pct !== null ? `${score}/${total} · ${pct}%` : "Ready"}
            </div>
            <button
              onClick={() => setScreen("home")}
              style={{
                background: "none",
                border: "none",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 13,
                padding: "4px 8px",
              }}
            >
              ← Home
            </button>
          </div>
        </div>

        <div
          style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px 60px" }}
        >
          {/* Topic badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 14px",
              borderRadius: 20,
              background: cfg.bg,
              border: `1px solid ${cfg.c}40`,
              marginBottom: 28,
            }}
          >
           
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: cfg.c,
                letterSpacing: "0.04em",
              }}
            >
              {q?.topic}
            </span>
          </div>

          {/* Question */}
          <div
            style={{
              ...heading,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.45,
              marginBottom: 32,
              color: C.blue,
            }}
          >
            {q?.q}
          </div>

          {/* Choices */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 28,
            }}
          >
            {choices.map((choice, i) => {
              const isSelected = selected === choice;
              const isCorrectChoice = choice === q?.correct;
              let bg = hover === i && !answered ? C.surfaceAlt : C.surface;
              let border = hover === i && !answered ? C.borderLight : C.border;
              let color = C.text;
              let labelBg = C.border;
              let labelColor = C.textSub;
              let icon = null;

              if (answered) {
                if (isCorrectChoice) {
                  bg = C.greenDark;
                  border = C.green;
                  color = C.green;
                  labelBg = C.green;
                  labelColor = "#FFFFFF";
                  icon = "✓";
                } else if (isSelected) {
                  bg = C.redDark;
                  border = C.red;
                  color = C.red;
                  labelBg = C.red;
                  labelColor = "#FFFFFF";
                  icon = "✗";
                } else {
                  color = C.textMuted;
                  border = C.border;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(choice)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  disabled={answered}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "15px 18px",
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 12,
                    color,
                    textAlign: "left",
                    cursor: answered ? "default" : "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.55,
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      background: labelBg,
                      color: labelColor,
                      transition: "all 0.2s",
                      marginTop: 1,
                    }}
                  >
                    {answered
                      ? isCorrectChoice
                        ? "✓"
                        : isSelected
                          ? "✗"
                          : LABELS[i]
                      : LABELS[i]}
                  </span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExp && (
            <div
              style={{
                background: isCorrect
                  ? "rgba(46,125,50,0.07)"
                  : "rgba(198,40,40,0.06)",
                border: `1px solid ${isCorrect ? C.green + "40" : C.red + "40"}`,
                borderRadius: 12,
                padding: "18px 22px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isCorrect ? C.green : C.amber,
                  marginBottom: 8,
                }}
              >
                {isCorrect ? "✓ Correct!" : "✗ Not quite — here's why:"}
              </div>
              {!isCorrect && (
                <div
                  style={{
                    fontSize: 14,
                    color: C.green,
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  Correct answer: {q.correct}
                </div>
              )}
              <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65 }}>
                {q?.exp}
              </div>
            </div>
          )}

          {/* Next */}
          {answered && (
            <button
              onClick={handleNext}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 12,
                background: isCorrect
                  ? `linear-gradient(135deg, #2E7D32, #1B5E20)`
                  : `linear-gradient(135deg, ${C.blue}, #1565C0)`,
                border: "none",
                color: "#FFFFFF",
                ...heading,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: isCorrect
                  ? "0 4px 20px rgba(46,125,50,0.22)"
                  : "0 4px 20px rgba(30,90,168,0.22)",
              }}
            >
              {qIdx < queue.length - 1 ? "Next Question →" : "See Results →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === "results") {
    const pct = Math.round((score / queue.length) * 100);
    const grade =
      pct >= 90
        ? "A"
        : pct >= 80
          ? "B"
          : pct >= 70
            ? "C"
            : pct >= 60
              ? "D"
              : "F";
    const gradeColor = pct >= 80 ? C.green : pct >= 70 ? C.amber : C.red;
    const tagline =
      pct >= 90
        ? "Exam ready! 🌟"
        : pct >= 80
          ? "Strong work!"
          : pct >= 70
            ? "Almost there"
            : pct >= 60
              ? "Keep grinding"
              : "More review needed";

    return (
      <div style={body}>
        <style>{`* { box-sizing: border-box; } body { background: ${C.bg}; }`}</style>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
          {/* Score hero */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                ...heading,
                fontSize: 100,
                fontWeight: 900,
                color: gradeColor,
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {pct}%
            </div>
            <div style={{ fontSize: 18, color: C.textSub, marginBottom: 10 }}>
              {score} of {queue.length} correct
            </div>
            <div
              style={{
                ...heading,
                fontSize: 26,
                fontWeight: 700,
                color: gradeColor,
              }}
            >
              {tagline}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "inline-block",
                background: gradeColor + "20",
                border: `1px solid ${gradeColor}40`,
                color: gradeColor,
                fontWeight: 700,
                fontSize: 20,
                padding: "6px 24px",
                borderRadius: 20,
              }}
            >
              Grade {grade}
            </div>
          </div>

          {/* Topic Breakdown */}
          {Object.keys(topicStats).length > 0 && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "24px 28px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textMuted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 22,
                }}
              >
                Topic breakdown
              </div>
              {Object.entries(TOPIC_CFG).map(([topic, cfg]) => {
                const stat = topicStats[topic];
                if (!stat) return null;
                const tp = Math.round((stat.correct / stat.total) * 100);
                const barColor =
                  tp >= 70 ? C.green : tp >= 50 ? C.amber : C.red;
                return (
                  <div key={topic} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 7,
                      }}
                    >
                      <div style={{ fontSize: 14, color: C.text }}>
                        <span style={{ marginRight: 6 }}>{cfg.icon}</span>
                        {topic}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: barColor,
                        }}
                      >
                        {stat.correct}/{stat.total} ({tp}%)
                      </div>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: C.border,
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${tp}%`,
                          background: barColor,
                          borderRadius: 3,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    {tp < 70 && (
                      <div
                        style={{
                          fontSize: 11,
                          color: C.textMuted,
                          marginTop: 4,
                        }}
                      >
                        ⚠ Focus here — below passing threshold
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {missed.size > 0 && (
              <button
                onClick={() => startQuiz(true)}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  background: C.amberDim,
                  border: `1px solid ${C.amber}60`,
                  color: C.amber,
                  ...heading,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Review {missed.size} Missed Questions →
              </button>
            )}
            <button
              onClick={() => startQuiz(false)}
              style={{
                padding: "16px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${C.blue}, #1565C0)`,
                border: "none",
                color: "#FFFFFF",
                ...heading,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Start Over
            </button>
            <button
              onClick={() => setScreen("home")}
              style={{
                padding: "14px",
                borderRadius: 12,
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textSub,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
