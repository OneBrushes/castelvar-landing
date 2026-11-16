// Traducción de la landing (español, catalán, francés e inglés). Sin dependencias.
// - El texto en español está en el HTML; aquí solo van las otras lenguas (y los textos que genera app.js).
// - Marcado en el HTML: data-i18n="clave" (texto), data-i18n-html="clave" (con etiquetas) y
//   data-i18n-attr="alt:clave;aria-label:clave2" (atributos).
// - Idioma: ?lang=xx en la URL > el elegido en el pie (se recuerda) > idioma del dispositivo > español.
// - Si falta una traducción se muestra el texto en español.
(function () {
  "use strict";
  var STORE_KEY = "castelvar-lang";

  var FLAGS = {
    es: '<svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
    ca: '<svg viewBox="0 0 27 18" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="27" height="18" fill="#FCDD09"/><path d="M0 3h27M0 7h27M0 11h27M0 15h27" stroke="#DA121A" stroke-width="2"/></svg>',
    fr: '<svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>',
    en: '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  };
  var LANGS = [
    { code: "es", name: "Español" },
    { code: "ca", name: "Català" },
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
  ];

  var DICT = {
    // Español: solo los textos que genera app.js (el resto se lee del HTML)
    es: {
      "js.waMsg": "Hola, me interesa una carpa industrial. ¿Podéis darme información?",
      "js.callTo": "Llamar al",
      "js.respond": "te respondemos en {t}",
      "js.thanksTime": "en {t}",
      "js.footerForm": "Formulario de presupuesto",
      "js.region": "Barcelona · Cataluña",
      "js.badSize": "Medida no válida",
      "js.needName": "Indica tu nombre",
      "js.needContact": "Indica un teléfono o un email",
      "js.badEmail": "Email no válido",
      "js.badPhone": "Teléfono no válido",
      "js.needConsent": "Debes aceptar la política de privacidad",
      "js.notConfigured": "El formulario aún no está configurado. Llámanos o escríbenos, por favor.",
      "js.sending": "Enviando…",
      "js.sendFail": "No se ha podido enviar. Inténtalo de nuevo.",
      "js.offline": "No hay conexión. Revisa tu internet e inténtalo de nuevo.",
      "js.urgent": "¿Urgente?",
      "js.projectAlt": "Obra de Castelvar",
    },

    ca: {
      "meta.title": "Castelvar · Carpes i naus industrials clau en mà",
      "meta.desc": "Carpes d'alumini i naus tèxtils per a magatzem, indústria i agricultura. Enginyers, càlcul segons l'Eurocodi, transport i muntatge amb preu tancat. Demana pressupost sense compromís.",
      "meta.ogdesc": "Enginyeria, fabricació, transport i muntatge amb preu tancat. Demana pressupost sense compromís.",
      skip: "Anar al formulari de pressupost",
      "top.note": "Enginyeria i muntatge de carpes industrials",
      "a11y.home": "Castelvar, inici",
      "a11y.mainnav": "Principal",
      "nav.solutions": "Solucions",
      "nav.tech": "Tècnica",
      "nav.process": "Com treballem",
      "nav.projects": "Obres",
      "nav.faq": "Preguntes",
      "cta.quote": "Demana pressupost",
      "hero.eyebrow": "Carpes i naus industrials clau en mà",
      "hero.title": "Més espai cobert, sense obra i amb <span>preu tancat</span>",
      "hero.lead": "Som enginyers. Calculem, subministrem, transportem i muntem carpes d'alumini i naus tèxtils per a magatzem, indústria i agricultura a tot Catalunya.",
      "hero.q1": "Enginyers especialitzats",
      "hero.q2": "Sense llicència*",
      "hero.qnote": "*Segons l'ajuntament i l'ús. T'assessorem amb els permisos.",
      "hero.q3": "Muntatge en 2 a 6 dies",
      "hero.c1": "Càlcul estructural segons l'Eurocodi per a la teva ubicació",
      "hero.c2": "Transport, muntatge i posada en obra inclosos",
      "hero.c3": "Un únic interlocutor de principi a fi",
      "quote.title": "Demana el teu pressupost",
      "quote.free": "Gratuït i sense compromís",
      "form.s1": "1 · Per a què la necessites?",
      "uc.storage": "📦 Magatzem / logística",
      "uc.industry": "🏭 Indústria / taller",
      "uc.agri": "🌾 Agrícola / ramadera",
      "uc.wood": "🌲 Fusta / materials",
      "uc.temp": "⛺ Temporal / esdeveniments",
      "uc.other": "✳️ Un altre ús",
      "btn.continue": "Continua",
      "btn.back": "Enrere",
      "btn.send": "Envia la sol·licitud",
      "form.s2": "2 · Mides i ubicació",
      "f.width": "Amplada aprox. (m)",
      "f.length": "Llargada aprox. (m)",
      "ph.width": "p. ex. 15",
      "ph.length": "p. ex. 30",
      "sizes.label": "Habituals:",
      "sizes.aria": "Mides habituals",
      "sizes.unknown": "No ho sé",
      "f.city": "Població de l'obra",
      "f.province": "Província",
      "opt.other": "Una altra",
      "f.when": "Per a quan?",
      "tf.asap": "Com més aviat millor",
      "tf.1-3": "D'aquí a 1–3 mesos",
      "tf.3-6": "D'aquí a 3–6 mesos",
      "tf.info": "Només m'estic informant",
      "form.s3": "3 · Com et contactem?",
      "f.name": "Nom *",
      "f.company": "Empresa",
      "f.phone": "Telèfon",
      "f.email": "Correu electrònic",
      "f.msg": "Alguna cosa més (opcional)",
      "ph.msg": "Terreny, accessos, portes, tancaments…",
      consent: 'Accepto la <a href="privacidad.html" target="_blank">política de privacitat</a>. Només farem servir les teves dades per respondre\'t.',
      "thanks.title": "Sol·licitud rebuda!",
      "thanks.text": "Un enginyer revisarà el teu cas i et contactarà",
      "quote.foot": "🔒 No cedim les teves dades a tercers.",
      "as.aria": "Per què confiar en nosaltres",
      "as.1t": "Enginyers",
      "as.1s": "Projecte i càlcul propis",
      "as.2t": "Eurocodi",
      "as.2s": "Neu i vent (EN 1991)",
      "as.3t": "Preu tancat",
      "as.3s": "Transport i muntatge inclosos",
      "as.4t": "Clau en mà",
      "as.4s": "Un sol interlocutor",
      "sol.kicker": "Solucions",
      "sol.title": "Una carpa per a cada necessitat",
      "sol.lead": "Estructures modulars d'alumini o acer galvanitzat amb lona tècnica de PVC, a mida del teu espai i del teu ús.",
      "c1.alt": "Interior d'una carpa magatzem amb prestatgeries de palets i una carretilla elevadora",
      "c1.title": "Carpes magatzem",
      "c1.text": "Amplia la teva capacitat d'emmagatzematge sense obra: palets, estoc, zones de càrrega i expedició cobertes.",
      "link.quote": "Demana pressupost →",
      "c2.alt": "Nau tèxtil a dues aigües amb porta enrotllable i un camió carregant palets",
      "c2.title": "Naus industrials",
      "c2.text": "Producció, tallers i zones de procés amb portes enrotllables, canalons i il·luminació.",
      "c3.alt": "Cobert d'arc obert amb bales de palla i un tractor",
      "c3.title": "Carpes agrícoles i ramaderes",
      "c3.text": "Coberts per a maquinària, palla i farratge, i naus ventilades per al bestiar.",
      "sol.also": "<span>També:</span> assecatge i aplec de fusta · materials de construcció · estructures temporals per a obres i campanyes",
      "gan.alt": "Interior d'una carpa ramadera amb vedells sobre llit de palla, menjadores laterals i lluerna zenital",
      "gan.kicker": "Ramaderia",
      "gan.title": "Naus per a vedells i bestiar",
      "gan.lead": "Un espai ampli, lluminós i ventilat, muntat en pocs dies i sense obra.",
      "gan.1t": "Llum natural",
      "gan.1s": "Lluerna zenital i finestres laterals per a un interior clar durant el dia.",
      "gan.2t": "Ventilació",
      "gan.2s": "Reixes als testers i finestres practicables per renovar l'aire.",
      "gan.3t": "Sense pilars interiors",
      "gan.3s": "L'arc deixa tota la superfície lliure per a corrals, menjadores i pas de maquinària.",
      "gan.4t": "Ampliable",
      "gan.4s": "Afegeix mòduls de llargada quan creixi l'explotació.",
      "gan.cta": "Pressupost per a la meva explotació",
      "tec.kicker": "Tècnica",
      "tec.title": "Enginyeria darrere de cada carpa",
      "tec.lead": "No venem una capsa: dimensionem l'estructura per al lloc on estarà i t'ho deixem per escrit.",
      "tec.1t": "Càlcul segons l'Eurocodi",
      "tec.1s": "Càrregues de neu (EN 1991-1-3) i vent (EN 1991-1-4) segons la ubicació de la teva obra.",
      "tec.2t": "Documentació tècnica",
      "tec.2s": "Plànols i memòria de càlcul de l'estructura per al teu expedient.",
      "tec.3t": "Materials",
      "tec.3s": "Perfils d'alumini o acer galvanitzat i lona de PVC d'alta resistència.",
      "tec.4t": "A mida",
      "tec.4s": "Amplades de 10 a 20 m i llargada ampliable per mòduls; portes, tancaments i accessoris.",
      "tec.alt": "Placa d'ancoratge d'acer galvanitzat cargolada a la solera",
      "tec.cap": "Placa d'ancoratge galvanitzada cargolada a la solera",
      "tec.cfg": "Configura la teva carpa",
      "dt.1": "Estructura",
      "dd.1": "Alumini o acer galvanitzat",
      "dt.2": "Coberta",
      "dd.2": "Lona tècnica de PVC",
      "dt.3": "Tancaments",
      "dd.3": "Lona, panell o mixtos",
      "dt.4": "Accessos",
      "dd.4": "Portes enrotllables o corredisses",
      "dt.5": "Extres",
      "dd.5": "Canalons, il·luminació, ventilació",
      "dt.6": "Ancoratge",
      "dd.6": "Sobre solera de formigó o asfalt",
      "tec.cta": "Calcula la meva carpa",
      "proc.kicker": "Com treballem",
      "proc.title": "De la idea a la carpa muntada",
      "proc.1t": "Sol·licitud",
      "proc.1s": "Ens expliques l'ús, les mides i la ubicació. Amb això ja t'orientem.",
      "proc.2t": "Estudi tècnic",
      "proc.2s": "Revisem l'emplaçament i calculem l'estructura.",
      "proc.3t": "Pressupost tancat",
      "proc.3s": "Preu tot inclòs i termini. El pots signar en línia.",
      "proc.4t": "Fabricació i enviament",
      "proc.4s": "T'informem de cada pas: fabricació, transport i duana.",
      "proc.5t": "Muntatge i lliurament",
      "proc.5s": "Muntem i et lliurem la carpa a punt per fer servir.",
      "proc.alt": "Muntatge a l'obra: una grua col·loca un arc de l'estructura mentre tres operaris el guien",
      "proc.cap": "Muntatge a l'obra amb el nostre equip: arcs, corretges i lona.",
      "proc.cta": "Comença la meva sol·licitud",
      "ba.kicker": "Sense obra",
      "ba.title": "De solar buit a nau coberta en pocs dies",
      "ba.lead": "Arrossega per comparar. Sense fonaments profunds ni obra civil llarga: s'ancora al terreny preparat i es munta.",
      "ba.altAfter": "Després: carpa blanca muntada al costat d'una masia entre oliveres",
      "ba.altBefore": "Abans: la mateixa parcel·la buida al costat de la masia",
      "ba.before": "Abans",
      "ba.after": "Després",
      "ba.range": "Compara abans i després",
      "app.kicker": "Aplicacions",
      "app.title": "Una estructura, molts usos",
      "g1.alt": "Carpa d'arc amb moll de càrrega i carretilla",
      "g1.cap": "Magatzem amb zona de càrrega",
      "g2.alt": "Interior de carpa a dues aigües amb prestatgeries i carretilla",
      "g2.cap": "Logística i paqueteria",
      "g3.alt": "Carpa d'arc amb aplec de fusta i palets de maó",
      "g3.cap": "Fusta i materials",
      "g4.alt": "Interior de carpa agrícola amb tractor, bales i maquinària",
      "g4.cap": "Maquinària i farratge",
      "g5.alt": "Carpa blanca a dues aigües al camp",
      "g5.cap": "Coberta a dues aigües",
      "g6.alt": "Carpa ramadera amb vedells a l'entrada",
      "g6.cap": "Ramaderia",
      "lic.title": "I els permisos?",
      "lic.text": "Depèn de l'ajuntament, de l'ús i de si la instal·lació és temporal o permanent. Et diem què necessites en el teu cas i et facilitem la documentació tècnica de l'estructura per tramitar-ho.",
      "ref.kicker": "Obres",
      "ref.title": "Alguns dels nostres projectes",
      "op.kicker": "Opinions",
      "op.title": "El que diuen els nostres clients",
      "faq.kicker": "Preguntes freqüents",
      "faq.title": "El que més ens pregunten",
      "faq.q1": "Què inclou el preu?",
      "faq.a1": "Estructura, lona, els accessoris que triïs, transport fins a l'obra i muntatge. Tot queda detallat al pressupost.",
      "faq.q2": "Quina fonamentació cal?",
      "faq.a2": "Normalment s'ancora sobre una solera de formigó o asfalt existent. Si no n'hi ha, t'indiquem les alternatives segons el terreny.",
      "faq.q3": "Aguanta el vent i la neu?",
      "faq.a3": "L'estructura es calcula per a les càrregues de neu i vent de la teva ubicació segons l'Eurocodi, i et lliurem el càlcul.",
      "faq.q4": "Es pot desmuntar, ampliar o traslladar?",
      "faq.a4": "Sí. Són estructures modulars: es poden ampliar amb més mòduls, desmuntar o portar a una altra ubicació.",
      "faq.q5": "Quant es triga?",
      "faq.a5": "El termini depèn de la mida i de la fabricació, i te'l donem tancat al pressupost. El muntatge a l'obra és qüestió de dies.",
      "faq.q6": "On treballeu?",
      "faq.a6": "Principalment a Catalunya. Si la teva obra és en una altra zona, consulta'ns.",
      "cta.title": "Tens un projecte al cap?",
      "cta.text": "Explica'ns-ho en un minut i un enginyer et respon.",
      "foot.about": "Enginyeria, subministrament i muntatge de carpes i naus industrials a Catalunya.",
      "foot.contact": "Contacte",
      "foot.company": "Empresa",
      "foot.legal": "Legal",
      "foot.notice": "Avís legal",
      "foot.privacy": "Política de privacitat",
      "foot.rights": "Tots els drets reservats",
      "foot.lang": "Idioma",
      "mb.aria": "Contacte ràpid",
      "mb.call": "Truca",
      "wa.aria": "Escriu-nos per WhatsApp",
      "js.waMsg": "Hola, m'interessa una carpa industrial. Em podeu donar informació?",
      "js.callTo": "Truca al",
      "js.respond": "et responem en {t}",
      "js.thanksTime": "en {t}",
      "js.footerForm": "Formulari de pressupost",
      "js.region": "Barcelona · Catalunya",
      "js.badSize": "Mida no vàlida",
      "js.needName": "Indica el teu nom",
      "js.needContact": "Indica un telèfon o un correu electrònic",
      "js.badEmail": "Correu electrònic no vàlid",
      "js.badPhone": "Telèfon no vàlid",
      "js.needConsent": "Has d'acceptar la política de privacitat",
      "js.notConfigured": "El formulari encara no està configurat. Truca'ns o escriu-nos, si us plau.",
      "js.sending": "Enviant…",
      "js.sendFail": "No s'ha pogut enviar. Torna-ho a provar.",
      "js.offline": "No hi ha connexió. Revisa la connexió a internet i torna-ho a provar.",
      "js.urgent": "Urgent?",
      "js.projectAlt": "Obra de Castelvar",
    },

    fr: {
      "meta.title": "Castelvar · Tentes et bâtiments industriels clés en main",
      "meta.desc": "Tentes en aluminium et bâtiments textiles pour le stockage, l'industrie et l'agriculture. Ingénieurs, calcul selon l'Eurocode, transport et montage à prix ferme. Demandez un devis sans engagement.",
      "meta.ogdesc": "Ingénierie, fabrication, transport et montage à prix ferme. Demandez un devis sans engagement.",
      skip: "Aller au formulaire de devis",
      "top.note": "Ingénierie et montage de tentes industrielles",
      "a11y.home": "Castelvar, accueil",
      "a11y.mainnav": "Principale",
      "nav.solutions": "Solutions",
      "nav.tech": "Technique",
      "nav.process": "Notre méthode",
      "nav.projects": "Réalisations",
      "nav.faq": "FAQ",
      "cta.quote": "Demander un devis",
      "hero.eyebrow": "Tentes et bâtiments industriels clés en main",
      "hero.title": "Plus d'espace couvert, sans travaux et à <span>prix ferme</span>",
      "hero.lead": "Nous sommes ingénieurs. Nous calculons, fournissons, transportons et montons des tentes en aluminium et des bâtiments textiles pour le stockage, l'industrie et l'agriculture dans toute la Catalogne.",
      "hero.q1": "Ingénieurs spécialisés",
      "hero.q2": "Sans permis*",
      "hero.qnote": "*Selon la mairie et l'usage. Nous vous conseillons pour les autorisations.",
      "hero.q3": "Montage en 2 à 6 jours",
      "hero.c1": "Calcul structurel selon l'Eurocode pour votre emplacement",
      "hero.c2": "Transport, montage et mise en service inclus",
      "hero.c3": "Un interlocuteur unique du début à la fin",
      "quote.title": "Demandez votre devis",
      "quote.free": "Gratuit et sans engagement",
      "form.s1": "1 · Pour quel usage ?",
      "uc.storage": "📦 Stockage / logistique",
      "uc.industry": "🏭 Industrie / atelier",
      "uc.agri": "🌾 Agricole / élevage",
      "uc.wood": "🌲 Bois / matériaux",
      "uc.temp": "⛺ Temporaire / événements",
      "uc.other": "✳️ Autre usage",
      "btn.continue": "Continuer",
      "btn.back": "Retour",
      "btn.send": "Envoyer la demande",
      "form.s2": "2 · Dimensions et emplacement",
      "f.width": "Largeur approx. (m)",
      "f.length": "Longueur approx. (m)",
      "ph.width": "ex. 15",
      "ph.length": "ex. 30",
      "sizes.label": "Courantes :",
      "sizes.aria": "Dimensions courantes",
      "sizes.unknown": "Je ne sais pas",
      "f.city": "Commune du chantier",
      "f.province": "Province",
      "opt.other": "Autre",
      "f.when": "Pour quand ?",
      "tf.asap": "Dès que possible",
      "tf.1-3": "D'ici 1 à 3 mois",
      "tf.3-6": "D'ici 3 à 6 mois",
      "tf.info": "Je me renseigne seulement",
      "form.s3": "3 · Comment vous contacter ?",
      "f.name": "Nom *",
      "f.company": "Entreprise",
      "f.phone": "Téléphone",
      "f.email": "E-mail",
      "f.msg": "Autre chose ? (facultatif)",
      "ph.msg": "Terrain, accès, portes, bardages…",
      consent: 'J\'accepte la <a href="privacidad.html" target="_blank">politique de confidentialité</a>. Vos données ne serviront qu\'à vous répondre.',
      "thanks.title": "Demande reçue !",
      "thanks.text": "Un ingénieur étudiera votre projet et vous contactera",
      "quote.foot": "🔒 Vos données ne sont jamais cédées à des tiers.",
      "as.aria": "Pourquoi nous faire confiance",
      "as.1t": "Ingénieurs",
      "as.1s": "Étude et calcul en interne",
      "as.2t": "Eurocode",
      "as.2s": "Neige et vent (EN 1991)",
      "as.3t": "Prix ferme",
      "as.3s": "Transport et montage inclus",
      "as.4t": "Clés en main",
      "as.4s": "Un seul interlocuteur",
      "sol.kicker": "Solutions",
      "sol.title": "Une tente pour chaque besoin",
      "sol.lead": "Structures modulaires en aluminium ou en acier galvanisé avec bâche technique en PVC, sur mesure pour votre espace et votre usage.",
      "c1.alt": "Intérieur d'une tente de stockage avec des rayonnages à palettes et un chariot élévateur",
      "c1.title": "Tentes de stockage",
      "c1.text": "Augmentez votre capacité de stockage sans travaux : palettes, stock, zones de chargement et d'expédition couvertes.",
      "link.quote": "Demander un devis →",
      "c2.alt": "Bâtiment textile à deux pans avec porte enroulable et un camion chargeant des palettes",
      "c2.title": "Bâtiments industriels",
      "c2.text": "Production, ateliers et zones de process avec portes enroulables, gouttières et éclairage.",
      "c3.alt": "Abri en arc ouvert avec des bottes de paille et un tracteur",
      "c3.title": "Tentes agricoles et d'élevage",
      "c3.text": "Abris pour le matériel, la paille et le fourrage, et bâtiments ventilés pour le bétail.",
      "sol.also": "<span>Aussi :</span> séchage et stockage du bois · matériaux de construction · structures temporaires pour chantiers et campagnes",
      "gan.alt": "Intérieur d'une tente d'élevage avec des veaux sur litière de paille, des mangeoires latérales et un puits de lumière",
      "gan.kicker": "Élevage",
      "gan.title": "Bâtiments pour veaux et bétail",
      "gan.lead": "Un espace vaste, lumineux et ventilé, monté en quelques jours et sans travaux.",
      "gan.1t": "Lumière naturelle",
      "gan.1s": "Puits de lumière en toiture et fenêtres latérales pour un intérieur clair toute la journée.",
      "gan.2t": "Ventilation",
      "gan.2s": "Grilles sur les pignons et fenêtres ouvrantes pour renouveler l'air.",
      "gan.3t": "Sans poteaux intérieurs",
      "gan.3s": "L'arc laisse toute la surface libre pour les parcs, les mangeoires et le passage des engins.",
      "gan.4t": "Extensible",
      "gan.4s": "Ajoutez des modules en longueur quand votre exploitation s'agrandit.",
      "gan.cta": "Un devis pour mon exploitation",
      "tec.kicker": "Technique",
      "tec.title": "L'ingénierie derrière chaque tente",
      "tec.lead": "Nous ne vendons pas une boîte : nous dimensionnons la structure pour son emplacement réel, et nous vous le remettons par écrit.",
      "tec.1t": "Calcul selon l'Eurocode",
      "tec.1s": "Charges de neige (EN 1991-1-3) et de vent (EN 1991-1-4) selon l'emplacement de votre chantier.",
      "tec.2t": "Documentation technique",
      "tec.2s": "Plans et note de calcul de la structure pour votre dossier.",
      "tec.3t": "Matériaux",
      "tec.3s": "Profilés en aluminium ou en acier galvanisé et bâche PVC haute résistance.",
      "tec.4t": "Sur mesure",
      "tec.4s": "Largeurs de 10 à 20 m et longueur extensible par modules ; portes, bardages et accessoires.",
      "tec.alt": "Platine d'ancrage en acier galvanisé boulonnée à la dalle",
      "tec.cap": "Platine d'ancrage galvanisée boulonnée à la dalle",
      "tec.cfg": "Configurez votre tente",
      "dt.1": "Structure",
      "dd.1": "Aluminium ou acier galvanisé",
      "dt.2": "Couverture",
      "dd.2": "Bâche technique en PVC",
      "dt.3": "Bardage",
      "dd.3": "Bâche, panneaux ou mixte",
      "dt.4": "Accès",
      "dd.4": "Portes enroulables ou coulissantes",
      "dt.5": "Options",
      "dd.5": "Gouttières, éclairage, ventilation",
      "dt.6": "Ancrage",
      "dd.6": "Sur dalle béton ou enrobé",
      "tec.cta": "Calculer ma tente",
      "proc.kicker": "Notre méthode",
      "proc.title": "De l'idée à la tente montée",
      "proc.1t": "Demande",
      "proc.1s": "Vous nous indiquez l'usage, les dimensions et l'emplacement. Cela suffit pour vous orienter.",
      "proc.2t": "Étude technique",
      "proc.2s": "Nous étudions le site et calculons la structure.",
      "proc.3t": "Devis ferme",
      "proc.3s": "Prix tout compris et délai. Vous pouvez le signer en ligne.",
      "proc.4t": "Fabrication et expédition",
      "proc.4s": "Nous vous informons à chaque étape : fabrication, transport et douane.",
      "proc.5t": "Montage et livraison",
      "proc.5s": "Nous montons et vous livrons la tente prête à l'emploi.",
      "proc.alt": "Montage sur chantier : une grue pose un arc de la structure guidé par trois ouvriers",
      "proc.cap": "Montage sur chantier par notre équipe : arcs, pannes et bâche.",
      "proc.cta": "Commencer ma demande",
      "ba.kicker": "Sans travaux",
      "ba.title": "D'un terrain vide à un bâtiment couvert en quelques jours",
      "ba.lead": "Faites glisser pour comparer. Pas de fondations profondes ni de longs travaux de génie civil : la structure s'ancre sur le terrain préparé et se monte.",
      "ba.altAfter": "Après : tente blanche montée à côté d'un mas entouré d'oliviers",
      "ba.altBefore": "Avant : la même parcelle vide à côté du mas",
      "ba.before": "Avant",
      "ba.after": "Après",
      "ba.range": "Comparer avant et après",
      "app.kicker": "Applications",
      "app.title": "Une structure, de nombreux usages",
      "g1.alt": "Tente en arc avec quai de chargement et chariot",
      "g1.cap": "Entrepôt avec zone de chargement",
      "g2.alt": "Intérieur de tente à deux pans avec rayonnages et chariot",
      "g2.cap": "Logistique et messagerie",
      "g3.alt": "Tente en arc avec stock de bois et palettes de briques",
      "g3.cap": "Bois et matériaux",
      "g4.alt": "Intérieur de tente agricole avec tracteur, bottes et matériel",
      "g4.cap": "Matériel et fourrage",
      "g5.alt": "Tente blanche à deux pans dans la campagne",
      "g5.cap": "Toiture à deux pans",
      "g6.alt": "Tente d'élevage avec des veaux à l'entrée",
      "g6.cap": "Élevage",
      "lic.title": "Et les autorisations ?",
      "lic.text": "Cela dépend de la mairie, de l'usage et du caractère temporaire ou permanent de l'installation. Nous vous disons ce qu'il vous faut dans votre cas et vous fournissons la documentation technique de la structure pour les démarches.",
      "ref.kicker": "Réalisations",
      "ref.title": "Quelques-uns de nos projets",
      "op.kicker": "Avis",
      "op.title": "Ce que disent nos clients",
      "faq.kicker": "Questions fréquentes",
      "faq.title": "Les questions qu'on nous pose le plus",
      "faq.q1": "Que comprend le prix ?",
      "faq.a1": "La structure, la bâche, les accessoires choisis, le transport jusqu'au chantier et le montage. Tout est détaillé dans le devis.",
      "faq.q2": "Quelles fondations faut-il ?",
      "faq.a2": "En général, la structure s'ancre sur une dalle en béton ou en enrobé existante. À défaut, nous vous indiquons les alternatives selon le terrain.",
      "faq.q3": "Résiste-t-elle au vent et à la neige ?",
      "faq.a3": "La structure est calculée pour les charges de neige et de vent de votre emplacement selon l'Eurocode, et nous vous remettons la note de calcul.",
      "faq.q4": "Peut-on la démonter, l'agrandir ou la déplacer ?",
      "faq.a4": "Oui. Ce sont des structures modulaires : on peut les agrandir avec des modules supplémentaires, les démonter ou les installer ailleurs.",
      "faq.q5": "Quels sont les délais ?",
      "faq.a5": "Le délai dépend des dimensions et de la fabrication ; il est fixé dans le devis. Le montage sur chantier ne prend que quelques jours.",
      "faq.q6": "Où intervenez-vous ?",
      "faq.a6": "Principalement en Catalogne. Si votre chantier se trouve ailleurs, contactez-nous.",
      "cta.title": "Vous avez un projet en tête ?",
      "cta.text": "Décrivez-le-nous en une minute et un ingénieur vous répond.",
      "foot.about": "Ingénierie, fourniture et montage de tentes et bâtiments industriels en Catalogne.",
      "foot.contact": "Contact",
      "foot.company": "Société",
      "foot.legal": "Informations légales",
      "foot.notice": "Mentions légales",
      "foot.privacy": "Politique de confidentialité",
      "foot.rights": "Tous droits réservés",
      "foot.lang": "Langue",
      "mb.aria": "Contact rapide",
      "mb.call": "Appeler",
      "wa.aria": "Écrivez-nous sur WhatsApp",
      "js.waMsg": "Bonjour, je suis intéressé par une tente industrielle. Pouvez-vous me donner des informations ?",
      "js.callTo": "Appeler le",
      "js.respond": "réponse sous {t}",
      "js.thanksTime": "sous {t}",
      "js.footerForm": "Formulaire de devis",
      "js.region": "Barcelone · Catalogne",
      "js.badSize": "Dimension non valide",
      "js.needName": "Indiquez votre nom",
      "js.needContact": "Indiquez un téléphone ou un e-mail",
      "js.badEmail": "E-mail non valide",
      "js.badPhone": "Téléphone non valide",
      "js.needConsent": "Vous devez accepter la politique de confidentialité",
      "js.notConfigured": "Le formulaire n'est pas encore configuré. Appelez-nous ou écrivez-nous, s'il vous plaît.",
      "js.sending": "Envoi en cours…",
      "js.sendFail": "L'envoi a échoué. Veuillez réessayer.",
      "js.offline": "Pas de connexion. Vérifiez votre accès à internet et réessayez.",
      "js.urgent": "Urgent ?",
      "js.projectAlt": "Réalisation Castelvar",
    },

    en: {
      "meta.title": "Castelvar · Turnkey industrial tents and buildings",
      "meta.desc": "Aluminium tents and fabric buildings for storage, industry and agriculture. Engineers, Eurocode structural design, transport and installation at a fixed price. Request a free, no-obligation quote.",
      "meta.ogdesc": "Engineering, manufacturing, transport and installation at a fixed price. Request a free, no-obligation quote.",
      skip: "Skip to the quote form",
      "top.note": "Industrial tent engineering and installation",
      "a11y.home": "Castelvar, home",
      "a11y.mainnav": "Main",
      "nav.solutions": "Solutions",
      "nav.tech": "Engineering",
      "nav.process": "How we work",
      "nav.projects": "Projects",
      "nav.faq": "FAQ",
      "cta.quote": "Get a quote",
      "hero.eyebrow": "Turnkey industrial tents and buildings",
      "hero.title": "More covered space, no construction work and a <span>fixed price</span>",
      "hero.lead": "We are engineers. We design, supply, transport and install aluminium tents and fabric buildings for storage, industry and agriculture throughout Catalonia.",
      "hero.q1": "Specialist engineers",
      "hero.q2": "No permit needed*",
      "hero.qnote": "*Depends on the local council and use. We advise you on permits.",
      "hero.q3": "Installed in 2–6 days",
      "hero.c1": "Structural design to Eurocode for your location",
      "hero.c2": "Transport, installation and commissioning included",
      "hero.c3": "A single point of contact from start to finish",
      "quote.title": "Get your quote",
      "quote.free": "Free and no obligation",
      "form.s1": "1 · What do you need it for?",
      "uc.storage": "📦 Storage / logistics",
      "uc.industry": "🏭 Industry / workshop",
      "uc.agri": "🌾 Agriculture / livestock",
      "uc.wood": "🌲 Timber / materials",
      "uc.temp": "⛺ Temporary / events",
      "uc.other": "✳️ Other use",
      "btn.continue": "Continue",
      "btn.back": "Back",
      "btn.send": "Send request",
      "form.s2": "2 · Size and location",
      "f.width": "Approx. width (m)",
      "f.length": "Approx. length (m)",
      "ph.width": "e.g. 15",
      "ph.length": "e.g. 30",
      "sizes.label": "Common sizes:",
      "sizes.aria": "Common sizes",
      "sizes.unknown": "Not sure",
      "f.city": "Site town",
      "f.province": "Province",
      "opt.other": "Other",
      "f.when": "When do you need it?",
      "tf.asap": "As soon as possible",
      "tf.1-3": "In 1–3 months",
      "tf.3-6": "In 3–6 months",
      "tf.info": "Just looking for information",
      "form.s3": "3 · How can we reach you?",
      "f.name": "Name *",
      "f.company": "Company",
      "f.phone": "Phone",
      "f.email": "Email",
      "f.msg": "Anything else? (optional)",
      "ph.msg": "Ground, access, doors, side walls…",
      consent: 'I accept the <a href="privacidad.html" target="_blank">privacy policy</a>. We will only use your data to reply to you.',
      "thanks.title": "Request received!",
      "thanks.text": "An engineer will review your project and get back to you",
      "quote.foot": "🔒 We never share your data with third parties.",
      "as.aria": "Why trust us",
      "as.1t": "Engineers",
      "as.1s": "In-house design and calculations",
      "as.2t": "Eurocode",
      "as.2s": "Snow and wind (EN 1991)",
      "as.3t": "Fixed price",
      "as.3s": "Transport and installation included",
      "as.4t": "Turnkey",
      "as.4s": "One point of contact",
      "sol.kicker": "Solutions",
      "sol.title": "A tent for every need",
      "sol.lead": "Modular aluminium or galvanised steel structures with technical PVC fabric, tailored to your space and your use.",
      "c1.alt": "Inside a storage tent with pallet racking and a forklift",
      "c1.title": "Storage tents",
      "c1.text": "Expand your storage capacity without construction work: pallets, stock, covered loading and dispatch areas.",
      "link.quote": "Get a quote →",
      "c2.alt": "Gable-roof fabric building with a roller door and a lorry loading pallets",
      "c2.title": "Industrial buildings",
      "c2.text": "Production, workshops and process areas with roller doors, gutters and lighting.",
      "c3.alt": "Open arch shelter with straw bales and a tractor",
      "c3.title": "Agricultural and livestock tents",
      "c3.text": "Shelters for machinery, straw and fodder, and ventilated buildings for livestock.",
      "sol.also": "<span>Also:</span> timber drying and storage · building materials · temporary structures for construction sites and seasonal campaigns",
      "gan.alt": "Inside a livestock tent with calves on straw bedding, side feeders and a ridge skylight",
      "gan.kicker": "Livestock",
      "gan.title": "Buildings for calves and livestock",
      "gan.lead": "A spacious, bright and well-ventilated space, installed in days with no construction work.",
      "gan.1t": "Natural light",
      "gan.1s": "A ridge skylight and side windows keep the interior bright during the day.",
      "gan.2t": "Ventilation",
      "gan.2s": "Gable vents and opening windows to refresh the air.",
      "gan.3t": "No interior columns",
      "gan.3s": "The arch leaves the whole floor free for pens, feeders and machinery access.",
      "gan.4t": "Expandable",
      "gan.4s": "Add length modules as your farm grows.",
      "gan.cta": "Get a quote for my farm",
      "tec.kicker": "Engineering",
      "tec.title": "Engineering behind every tent",
      "tec.lead": "We don't sell a box: we size the structure for the exact site where it will stand, and put it in writing.",
      "tec.1t": "Eurocode design",
      "tec.1s": "Snow (EN 1991-1-3) and wind (EN 1991-1-4) loads for your site's location.",
      "tec.2t": "Technical documentation",
      "tec.2s": "Drawings and structural calculation report for your permit file.",
      "tec.3t": "Materials",
      "tec.3s": "Aluminium or galvanised steel profiles and high-strength PVC fabric.",
      "tec.4t": "Made to measure",
      "tec.4s": "Widths from 10 to 20 m and modular length; doors, side walls and accessories.",
      "tec.alt": "Galvanised steel base plate bolted to the concrete slab",
      "tec.cap": "Galvanised base plate bolted to the slab",
      "tec.cfg": "Configure your tent",
      "dt.1": "Structure",
      "dd.1": "Aluminium or galvanised steel",
      "dt.2": "Roof",
      "dd.2": "Technical PVC fabric",
      "dt.3": "Side walls",
      "dd.3": "Fabric, panels or mixed",
      "dt.4": "Access",
      "dd.4": "Roller or sliding doors",
      "dt.5": "Extras",
      "dd.5": "Gutters, lighting, ventilation",
      "dt.6": "Anchoring",
      "dd.6": "On a concrete or asphalt slab",
      "tec.cta": "Design my tent",
      "proc.kicker": "How we work",
      "proc.title": "From idea to finished tent",
      "proc.1t": "Request",
      "proc.1s": "Tell us the use, size and location. That's enough for us to advise you.",
      "proc.2t": "Technical study",
      "proc.2s": "We review the site and calculate the structure.",
      "proc.3t": "Fixed quote",
      "proc.3s": "All-inclusive price and lead time. You can sign it online.",
      "proc.4t": "Manufacturing and shipping",
      "proc.4s": "We keep you updated at every step: manufacturing, transport and customs.",
      "proc.5t": "Installation and handover",
      "proc.5s": "We install the tent and hand it over ready to use.",
      "proc.alt": "On-site installation: a crane lifts an arch of the structure while three workers guide it",
      "proc.cap": "On-site installation by our team: arches, purlins and fabric.",
      "proc.cta": "Start my request",
      "ba.kicker": "No construction work",
      "ba.title": "From empty plot to covered building in days",
      "ba.lead": "Drag to compare. No deep foundations or lengthy civil works: it is anchored to the prepared ground and assembled.",
      "ba.altAfter": "After: white tent installed next to a farmhouse among olive trees",
      "ba.altBefore": "Before: the same empty plot next to the farmhouse",
      "ba.before": "Before",
      "ba.after": "After",
      "ba.range": "Compare before and after",
      "app.kicker": "Applications",
      "app.title": "One structure, many uses",
      "g1.alt": "Arch tent with loading dock and forklift",
      "g1.cap": "Warehouse with loading area",
      "g2.alt": "Inside a gable tent with racking and a forklift",
      "g2.cap": "Logistics and parcels",
      "g3.alt": "Arch tent storing timber and pallets of bricks",
      "g3.cap": "Timber and materials",
      "g4.alt": "Inside an agricultural tent with a tractor, bales and machinery",
      "g4.cap": "Machinery and fodder",
      "g5.alt": "White gable tent in the countryside",
      "g5.cap": "Gable roof",
      "g6.alt": "Livestock tent with calves at the entrance",
      "g6.cap": "Livestock",
      "lic.title": "What about permits?",
      "lic.text": "It depends on the local council, the use and whether the installation is temporary or permanent. We tell you what you need in your case and provide the structure's technical documentation for the application.",
      "ref.kicker": "Projects",
      "ref.title": "Some of our projects",
      "op.kicker": "Reviews",
      "op.title": "What our clients say",
      "faq.kicker": "Frequently asked questions",
      "faq.title": "What people ask us most",
      "faq.q1": "What does the price include?",
      "faq.a1": "Structure, fabric, the accessories you choose, transport to the site and installation. Everything is itemised in the quote.",
      "faq.q2": "What foundations are needed?",
      "faq.a2": "It is usually anchored to an existing concrete or asphalt slab. If there isn't one, we suggest alternatives depending on the ground.",
      "faq.q3": "Can it withstand wind and snow?",
      "faq.a3": "The structure is designed for the snow and wind loads at your location according to the Eurocode, and we give you the calculations.",
      "faq.q4": "Can it be dismantled, extended or moved?",
      "faq.a4": "Yes. They are modular structures: they can be extended with more modules, dismantled or moved to another location.",
      "faq.q5": "How long does it take?",
      "faq.a5": "Lead time depends on the size and manufacturing, and is fixed in the quote. On-site installation takes just a few days.",
      "faq.q6": "Where do you work?",
      "faq.a6": "Mainly in Catalonia. If your site is elsewhere, get in touch.",
      "cta.title": "Have a project in mind?",
      "cta.text": "Tell us about it in a minute and an engineer will get back to you.",
      "foot.about": "Engineering, supply and installation of industrial tents and buildings in Catalonia.",
      "foot.contact": "Contact",
      "foot.company": "Company",
      "foot.legal": "Legal",
      "foot.notice": "Legal notice",
      "foot.privacy": "Privacy policy",
      "foot.rights": "All rights reserved",
      "foot.lang": "Language",
      "mb.aria": "Quick contact",
      "mb.call": "Call",
      "wa.aria": "Message us on WhatsApp",
      "js.waMsg": "Hello, I'm interested in an industrial tent. Could you send me some information?",
      "js.callTo": "Call",
      "js.respond": "we reply within {t}",
      "js.thanksTime": "within {t}",
      "js.footerForm": "Quote form",
      "js.region": "Barcelona · Catalonia",
      "js.badSize": "Invalid size",
      "js.needName": "Please enter your name",
      "js.needContact": "Please enter a phone number or an email",
      "js.badEmail": "Invalid email",
      "js.badPhone": "Invalid phone number",
      "js.needConsent": "You must accept the privacy policy",
      "js.notConfigured": "The form is not set up yet. Please call or write to us.",
      "js.sending": "Sending…",
      "js.sendFail": "Couldn't send. Please try again.",
      "js.offline": "No connection. Check your internet and try again.",
      "js.urgent": "Urgent?",
      "js.projectAlt": "Castelvar project",
    },
  };

  var CODES = LANGS.map(function (l) { return l.code; });
  var current = "es";
  var listeners = [];

  function store(v) {
    try {
      if (v === undefined) return localStorage.getItem(STORE_KEY);
      localStorage.setItem(STORE_KEY, v);
    } catch (e) {
      return null;
    }
  }
  function normalize(tag) {
    var c = String(tag || "").toLowerCase().split(/[-_]/)[0];
    return CODES.indexOf(c) >= 0 ? c : null;
  }
  function detect() {
    var fromUrl = normalize(new URLSearchParams(location.search).get("lang"));
    if (fromUrl) {
      store(fromUrl);
      return fromUrl;
    }
    var saved = normalize(store());
    if (saved) return saved;
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < prefs.length; i++) {
      var c = String(prefs[i] || "").toLowerCase().split(/[-_]/)[0];
      if (CODES.indexOf(c) >= 0) return c;
      // Aranés → catalán; gallego, euskera, portugués e italiano → español
      if (c === "oc") return "ca";
      if (["gl", "eu", "pt", "it"].indexOf(c) >= 0) return "es";
    }
    // Cualquier otro idioma (alemán, neerlandés…) → inglés
    return prefs.length && prefs[0] ? "en" : "es";
  }

  // Guarda el texto original (español) de cada elemento la primera vez
  function original(el, slot, read) {
    if (!el.__i18n) el.__i18n = {};
    if (!(slot in el.__i18n)) el.__i18n[slot] = read();
    return el.__i18n[slot];
  }
  function lookup(lang, key) {
    var d = DICT[lang];
    return d && Object.prototype.hasOwnProperty.call(d, key) ? d[key] : null;
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var es = original(el, "text", function () { return el.textContent; });
      var v = lang === "es" ? null : lookup(lang, el.dataset.i18n);
      el.textContent = v == null ? es : v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var es = original(el, "html", function () { return el.innerHTML; });
      var v = lang === "es" ? null : lookup(lang, el.dataset.i18nHtml);
      el.innerHTML = v == null ? es : v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split(";").forEach(function (pair) {
        var p = pair.split(":");
        var attr = p[0].trim();
        var key = (p[1] || "").trim();
        if (!attr || !key) return;
        var es = original(el, "@" + attr, function () { return el.getAttribute(attr) || ""; });
        var v = lang === "es" ? null : lookup(lang, key);
        el.setAttribute(attr, v == null ? es : v);
      });
    });
  }

  function t(key, vars) {
    var s = lookup(current, key);
    if (s == null) s = lookup("es", key);
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    return s;
  }
  // Valor de config.js que puede ser texto o { es, ca, fr, en }
  function pick(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[current] || v.es || "";
    return v || "";
  }

  function set(lang, remember) {
    lang = normalize(lang) || "es";
    current = lang;
    if (remember) store(lang);
    apply(lang);
    updateSwitcher();
    listeners.forEach(function (fn) { fn(lang); });
  }

  // ---------- Selector de idioma (pie) ----------
  var root, btn, menu;
  function langInfo(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }
  function updateSwitcher() {
    if (!root) return;
    var info = langInfo(current);
    btn.querySelector(".lang-flag").innerHTML = FLAGS[info.code];
    btn.querySelector(".lang-name").textContent = info.name;
    btn.setAttribute("aria-label", t("foot.lang") + ": " + info.name);
    menu.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.lang === current ? "true" : "false");
    });
  }
  function open(focusFirst) {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    var target = menu.querySelector('[aria-checked="true"]') || menu.querySelector("button");
    if (focusFirst && target) target.focus();
  }
  function close(refocus) {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus();
  }
  function buildSwitcher() {
    root = document.getElementById("lang");
    if (!root) return;
    btn = root.querySelector(".lang-btn");
    menu = root.querySelector(".lang-menu");
    menu.innerHTML = LANGS.map(function (l) {
      return (
        '<li role="none"><button type="button" role="menuitemradio" lang="' + l.code + '" data-lang="' + l.code + '">' +
        '<span class="lang-flag">' + FLAGS[l.code] + "</span><span>" + l.name + "</span></button></li>"
      );
    }).join("");
    btn.addEventListener("click", function () {
      if (menu.hidden) open(false);
      else close(false);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        open(true);
      }
    });
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (!b) return;
      set(b.dataset.lang, true);
      close(true);
    });
    menu.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(menu.querySelectorAll("button"));
      var i = items.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(i + 1) % items.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length].focus();
      } else if (e.key === "Tab") {
        close(false);
      }
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !root.contains(e.target)) close(false);
    });
  }

  window.I18N = {
    t: t,
    pick: pick,
    set: set,
    lang: function () { return current; },
    onChange: function (fn) { listeners.push(fn); },
  };

  buildSwitcher();
  set(detect(), false);
})();
