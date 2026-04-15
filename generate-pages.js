#!/usr/bin/env node
/**
 * PARASITE PAGE GENERATOR
 * =======================
 * Script à lancer avec Claude Code pour générer en masse
 * les pages parasites SEO pour GitHub Pages.
 * 
 * Usage avec Claude Code :
 * "Génère les pages parasites en utilisant le script generate-pages.js"
 * 
 * Le script crée les fichiers HTML optimisés SEO dans /guides/
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION : Tes sites et CTAs
// ============================================================
const SITES = {
    rendify: {
        url: 'https://rendify.fr',
        name: 'Rendify',
        cta: 'Simuler mon investissement gratuitement',
        ctaShort: 'Simulateur investissement locatif'
    },
    calculateur: {
        url: 'https://calculateur-travaux.fr',
        name: 'Calculateur Travaux',
        cta: 'Estimer le coût de mes travaux',
        ctaShort: 'Estimateur coût travaux'
    },
    score: {
        url: 'https://score-adresse.fr',
        name: 'Score Adresse',
        cta: 'Auditer une adresse gratuitement',
        ctaShort: 'Audit complet d\'une adresse'
    },
    indemnite: {
        url: 'https://indemnite-rupture.fr',
        name: 'Indemnité Rupture',
        cta: 'Calculer mes indemnités',
        ctaShort: 'Calculateur d\'indemnités'
    },
    bonnes: {
        url: 'https://bonnesastuces.fr',
        name: 'Bonnes Astuces',
        cta: 'Découvrir nos comparatifs',
        ctaShort: 'Guides et comparatifs'
    }
};

const GITHUB_BASE = 'https://guidesfr.github.io/guides-immo-france';

// ============================================================
// PAGES À GÉNÉRER
// ============================================================
const PAGES = [
    // --- INVESTISSEMENT LOCATIF (→ Rendify) ---
    {
        slug: 'rentabilite-locative',
        title: 'Comment Calculer la Rentabilité Locative d\'un Bien Immobilier en 2026',
        metaDesc: 'Formules de rentabilité brute, nette et nette-nette. Calculez précisément le rendement de votre investissement locatif avec notre guide et simulateur.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-guide-complet', 'villes-rentables-2026', 'micro-bic-vs-reel'],
        faqSchema: [
            { q: 'Comment calculer la rentabilité brute ?', a: 'Rentabilité brute = (loyer annuel / prix d\'achat) × 100. Exemple : un bien à 200 000 € loué 800 €/mois = (9 600 / 200 000) × 100 = 4,8 % brut.' },
            { q: 'Qu\'est-ce que la rentabilité nette-nette ?', a: 'La rentabilité nette-nette intègre la fiscalité (impôt sur le revenu + prélèvements sociaux) en plus des charges. C\'est le rendement réellement perçu par l\'investisseur après tout.' },
            { q: 'Quelle rentabilité viser pour un investissement locatif ?', a: 'En 2026, une rentabilité brute de 5-7 % est considérée comme correcte. Au-dessus de 7 % brut, c\'est un bon investissement. En dessous de 4 %, le cashflow sera probablement négatif.' }
        ]
    },
    {
        slug: 'lmnp-vs-location-nue',
        title: 'LMNP vs Location Nue : Comparatif Fiscal Complet 2026',
        metaDesc: 'Faut-il louer en meublé (LMNP) ou en location nue ? Comparatif détaillé de la fiscalité, de la rentabilité et des avantages de chaque régime.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-guide-complet', 'deficit-foncier', 'rentabilite-locative'],
        faqSchema: [
            { q: 'Est-ce plus rentable de louer en meublé ou en vide ?', a: 'En 2026, la location meublée (LMNP au réel) est fiscalement plus avantageuse dans la majorité des cas grâce à l\'amortissement, qui peut réduire l\'impôt à zéro pendant 10-15 ans. La location nue n\'offre pas cet avantage.' },
            { q: 'Quels sont les avantages de la location nue ?', a: 'La location nue offre un bail plus long (3 ans vs 1 an), des locataires souvent plus stables, moins de rotation, et la possibilité de créer un déficit foncier imputable sur le revenu global (jusqu\'à 10 700 €/an).' },
            { q: 'Peut-on passer de location nue à LMNP ?', a: 'Oui, au moment du renouvellement du bail ou du changement de locataire. Il faut meubler le logement selon le décret de 2015 et modifier le bail.' }
        ]
    },
    {
        slug: 'villes-rentables-2026',
        title: 'Top 10 des Villes les Plus Rentables pour Investir en 2026',
        metaDesc: 'Classement des villes françaises par rentabilité locative en 2026. Données DVF, prix au m², loyers moyens et rendements analysés.',
        targetSite: 'rendify',
        relatedSlugs: ['rentabilite-locative', 'lmnp-guide-complet', 'investir-studio-etudiant'],
        faqSchema: [
            { q: 'Quelle est la ville la plus rentable pour investir en 2026 ?', a: 'Les villes moyennes comme Saint-Étienne, Mulhouse et Le Mans offrent les meilleurs rendements bruts (7-10 %). Mais la rentabilité ne fait pas tout : la vacance locative et la liquidité du marché sont aussi des critères essentiels.' },
            { q: 'Faut-il investir à Paris en 2026 ?', a: 'Paris offre une sécurité patrimoniale mais des rendements faibles (2,5-3,5 % brut). L\'investissement y est pertinent pour la plus-value à long terme, moins pour le cashflow.' },
            { q: 'Comment choisir une ville pour investir ?', a: 'Les critères clés sont : la tension locative (demande > offre), la dynamique démographique (croissance population), la présence d\'universités/entreprises, le prix au m² encore accessible, et la qualité des transports.' }
        ]
    },
    {
        slug: 'micro-bic-vs-reel',
        title: 'Micro-BIC vs Réel en LMNP : Simulation Comparative 2026',
        metaDesc: 'Quel régime fiscal choisir en LMNP ? Simulation chiffrée micro-BIC vs régime réel avec amortissement. Trouvez le régime optimal pour votre situation.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-guide-complet', 'lmnp-vs-location-nue', 'deficit-foncier'],
        faqSchema: [
            { q: 'Quand le régime réel est-il plus avantageux que le micro-BIC ?', a: 'Le réel est presque toujours plus avantageux dès que vos charges + amortissement dépassent 50 % de vos recettes. En pratique, c\'est le cas pour la quasi-totalité des investissements financés à crédit.' },
            { q: 'Combien coûte un comptable pour le LMNP au réel ?', a: 'Un expert-comptable en ligne spécialisé LMNP coûte entre 300 et 600 € par an. Ce coût est lui-même déductible de vos revenus locatifs et donne droit à une réduction d\'impôt (CGA).' }
        ]
    },
    {
        slug: 'deficit-foncier',
        title: 'Déficit Foncier : Mécanisme, Calcul et Stratégie d\'Optimisation Fiscale',
        metaDesc: 'Comment utiliser le déficit foncier pour réduire vos impôts grâce aux travaux. Mécanisme, plafonds, conditions et simulation détaillée.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-vs-location-nue', 'renovation-energetique-dpe', 'prix-renovation-m2'],
        faqSchema: [
            { q: 'Qu\'est-ce que le déficit foncier ?', a: 'Le déficit foncier se crée quand les charges déductibles (travaux, intérêts, taxe foncière) dépassent les loyers perçus en location nue. Ce déficit est imputable sur le revenu global dans la limite de 10 700 €/an (21 400 € pour les travaux de rénovation énergétique).' },
            { q: 'Le déficit foncier fonctionne-t-il en LMNP ?', a: 'Non. Le déficit foncier est un mécanisme réservé à la location nue (revenus fonciers). En LMNP (BIC), c\'est l\'amortissement qui joue un rôle équivalent mais avec un mécanisme différent.' }
        ]
    },
    {
        slug: 'investir-studio-etudiant',
        title: 'Investir dans un Studio Étudiant : Rentabilité, Villes et Fiscalité 2026',
        metaDesc: 'Le studio étudiant est-il un bon investissement locatif ? Analyse de la rentabilité, meilleures villes étudiantes, fiscalité LMNP et pièges à éviter.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-guide-complet', 'villes-rentables-2026', 'rentabilite-locative'],
        faqSchema: [
            { q: 'Quelle rentabilité espérer sur un studio étudiant ?', a: 'Un studio étudiant bien situé dans une ville universitaire moyenne offre 6-9 % de rentabilité brute. Les petites surfaces (15-25 m²) ont les meilleurs rendements au m².' },
            { q: 'Quelles sont les meilleures villes pour un studio étudiant ?', a: 'Les villes avec un ratio étudiants/logements élevé et des prix accessibles : Rennes, Lille, Toulouse, Montpellier, Bordeaux, Lyon. Évitez Paris où les rendements sont trop faibles.' }
        ]
    },
    {
        slug: 'loi-le-meur-2024',
        title: 'Loi Le Meur 2024 : Tout Ce Qui Change pour la Location Meublée',
        metaDesc: 'Impact de la loi Le Meur sur le LMNP, les meublés de tourisme et Airbnb. Nouveaux abattements, pouvoirs des maires et DPE : ce que vous devez savoir.',
        targetSite: 'rendify',
        relatedSlugs: ['lmnp-guide-complet', 'micro-bic-vs-reel', 'lmnp-vs-location-nue'],
        faqSchema: [
            { q: 'La loi Le Meur supprime-t-elle le LMNP ?', a: 'Non. La loi Le Meur ne supprime pas le statut LMNP. Elle modifie principalement la fiscalité des meublés de tourisme non classés (Airbnb) et renforce les pouvoirs des maires. La location meublée longue durée est peu impactée.' },
            { q: 'Quel impact sur les propriétaires Airbnb ?', a: 'L\'abattement micro-BIC pour les meublés de tourisme non classés passe de 50 % à 30 %, et le plafond de recettes est abaissé à 15 000 €. Les maires peuvent aussi limiter la location à 90 jours/an en zone tendue.' }
        ]
    },

    // --- RÉNOVATION (→ Calculateur-travaux) ---
    {
        slug: 'prix-renovation-m2',
        title: 'Prix Rénovation Appartement au m² en 2026 : Barème Complet',
        metaDesc: 'Combien coûte une rénovation au m² en 2026 ? Barèmes actualisés par type de travaux : rafraîchissement, rénovation partielle, rénovation complète, gros œuvre.',
        targetSite: 'calculateur',
        relatedSlugs: ['renovation-salle-de-bain', 'renovation-energetique-dpe', 'maprimerénov-2026'],
        faqSchema: [
            { q: 'Quel est le prix moyen d\'une rénovation au m² en 2026 ?', a: 'En 2026, comptez 250-400 €/m² pour un rafraîchissement, 500-800 €/m² pour une rénovation partielle, 800-1 200 €/m² pour une rénovation complète, et 1 200-2 000 €/m² pour une rénovation lourde avec reprise du gros œuvre.' },
            { q: 'Comment estimer le budget de sa rénovation ?', a: 'Multipliez la surface par le prix au m² correspondant au niveau de rénovation souhaité. Ajoutez 10-15 % de marge pour les imprévus. Utilisez un estimateur en ligne pour un calcul plus précis.' }
        ]
    },
    {
        slug: 'renovation-salle-de-bain',
        title: 'Rénovation Salle de Bain : Budget Détaillé Poste par Poste en 2026',
        metaDesc: 'Combien coûte une rénovation de salle de bain en 2026 ? Budget détaillé : plomberie, carrelage, sanitaires, main d\'œuvre. Guide complet avec prix.',
        targetSite: 'calculateur',
        relatedSlugs: ['prix-renovation-m2', 'renovation-energetique-dpe', 'maprimerénov-2026'],
        faqSchema: [
            { q: 'Combien coûte une rénovation de salle de bain ?', a: 'En 2026, une rénovation complète de salle de bain coûte entre 5 000 € et 15 000 € selon la surface, les matériaux choisis et la complexité des travaux. Un simple rafraîchissement (peinture + accessoires) revient à 1 500-3 000 €.' },
            { q: 'Quels sont les postes les plus coûteux ?', a: 'La plomberie (déplacement des arrivées/évacuations) et le carrelage (pose + matériaux) représentent souvent 50-60 % du budget. La douche à l\'italienne est le poste qui fait le plus grimper le devis.' }
        ]
    },
    {
        slug: 'renovation-energetique-dpe',
        title: 'DPE F ou G : Combien Coûte une Rénovation Énergétique en 2026',
        metaDesc: 'Votre logement est classé F ou G au DPE ? Estimez le budget pour sortir du statut de passoire thermique : travaux, aides, calendrier d\'interdiction.',
        targetSite: 'calculateur',
        relatedSlugs: ['maprimerénov-2026', 'isolation-exterieure-prix', 'prix-renovation-m2'],
        faqSchema: [
            { q: 'Combien coûte la rénovation énergétique d\'une passoire thermique ?', a: 'Pour passer d\'un DPE G à D, comptez en moyenne 15 000 à 40 000 € selon la surface et les travaux nécessaires (isolation, chauffage, ventilation, menuiseries). Les aides (MaPrimeRénov, CEE) peuvent couvrir 40-80 % du montant.' },
            { q: 'Quand les passoires thermiques seront-elles interdites à la location ?', a: 'Les logements classés G sont interdits à la location depuis le 1er janvier 2025. Les logements classés F le seront à partir du 1er janvier 2028. Les logements classés E suivront en 2034.' }
        ]
    },
    {
        slug: 'maprimerénov-2026',
        title: 'MaPrimeRénov 2026 : Montants, Conditions et Simulation',
        metaDesc: 'Guide complet MaPrimeRénov 2026 : barèmes par revenus, travaux éligibles, montants des primes, cumul avec les CEE et simulation personnalisée.',
        targetSite: 'calculateur',
        relatedSlugs: ['renovation-energetique-dpe', 'isolation-exterieure-prix', 'prix-renovation-m2'],
        faqSchema: [
            { q: 'Qui a droit à MaPrimeRénov en 2026 ?', a: 'Tous les propriétaires (occupants et bailleurs) de logements construits depuis plus de 15 ans. Le montant de la prime dépend des revenus du foyer (4 catégories : bleu, jaune, violet, rose) et des travaux réalisés.' },
            { q: 'Peut-on cumuler MaPrimeRénov avec d\'autres aides ?', a: 'Oui. MaPrimeRénov est cumulable avec les CEE (Certificats d\'Économie d\'Énergie), l\'éco-PTZ (prêt à taux zéro), les aides locales et la TVA à 5,5 %. Le cumul peut couvrir jusqu\'à 80-90 % du coût des travaux pour les ménages modestes.' }
        ]
    },
    {
        slug: 'isolation-exterieure-prix',
        title: 'Isolation Thermique par l\'Extérieur (ITE) : Prix, Aides et Rentabilité 2026',
        metaDesc: 'Prix de l\'isolation par l\'extérieur en 2026, aides disponibles (MaPrimeRénov, CEE), rentabilité et gain de DPE. Guide complet de l\'ITE.',
        targetSite: 'calculateur',
        relatedSlugs: ['renovation-energetique-dpe', 'maprimerénov-2026', 'prix-renovation-m2'],
        faqSchema: [
            { q: 'Combien coûte une isolation par l\'extérieur ?', a: 'En 2026, l\'ITE coûte entre 120 et 220 €/m² de façade (pose + matériaux). Pour une maison de 100 m² au sol avec 150 m² de façade, comptez 18 000 à 33 000 € avant aides.' },
            { q: 'L\'isolation extérieure est-elle rentable ?', a: 'L\'ITE permet d\'économiser 25-40 % sur la facture de chauffage et de gagner 1 à 3 lettres de DPE. Avec les aides, le retour sur investissement se situe entre 8 et 15 ans. Pour un bien locatif, le gain de DPE augmente aussi la valeur du bien (effet valeur verte).' }
        ]
    },

    // --- SCORE ADRESSE ---
    {
        slug: 'verifier-adresse-achat',
        title: 'Comment Vérifier une Adresse Avant d\'Acheter un Bien Immobilier',
        metaDesc: 'Les 7 vérifications indispensables avant d\'acheter : prix DVF, DPE, risques naturels, nuisances, urbanisme, voisinage. Checklist complète.',
        targetSite: 'score',
        relatedSlugs: ['prix-m2-dvf', 'risques-naturels-adresse', 'dpe-adresse-consultation'],
        faqSchema: [
            { q: 'Que vérifier avant d\'acheter un appartement ou une maison ?', a: 'Les 7 points essentiels : le prix au m² réel du quartier (données DVF), le DPE du logement et de l\'immeuble, les risques naturels (inondation, séisme), le PLU et les projets d\'urbanisme, la qualité de l\'adresse (transports, commerces), l\'état de la copropriété (PV d\'AG), et les nuisances (bruit, pollution).' },
            { q: 'Comment connaître le vrai prix au m² d\'une rue ?', a: 'La base DVF (Demandes de Valeurs Foncières) publie tous les prix de vente réels enregistrés par les notaires. Vous pouvez consulter les dernières transactions rue par rue pour connaître le vrai prix du marché, pas les estimations des agences.' }
        ]
    },
    {
        slug: 'prix-m2-dvf',
        title: 'Prix au m² par Rue : Comprendre et Utiliser les Données DVF',
        metaDesc: 'Comment accéder aux vrais prix de vente immobilier par rue grâce aux données DVF. Guide d\'utilisation des Demandes de Valeurs Foncières.',
        targetSite: 'score',
        relatedSlugs: ['verifier-adresse-achat', 'villes-rentables-2026', 'risques-naturels-adresse'],
        faqSchema: [
            { q: 'Qu\'est-ce que la base DVF ?', a: 'DVF (Demandes de Valeurs Foncières) est une base de données publique qui recense toutes les transactions immobilières en France depuis 2014. Elle contient le prix de vente, la surface, le type de bien et l\'adresse exacte de chaque transaction.' },
            { q: 'Les données DVF sont-elles fiables ?', a: 'Oui, les données DVF sont les prix réels enregistrés chez les notaires. C\'est la source la plus fiable, contrairement aux estimations des sites d\'annonces qui se basent sur les prix demandés (souvent surévalués de 5-15 %).' }
        ]
    },
    {
        slug: 'risques-naturels-adresse',
        title: 'Risques Naturels par Adresse : Comment Vérifier Gratuitement',
        metaDesc: 'Vérifiez les risques naturels (inondation, séisme, radon, mouvement de terrain) de n\'importe quelle adresse en France. Guide Géorisques.',
        targetSite: 'score',
        relatedSlugs: ['verifier-adresse-achat', 'dpe-adresse-consultation', 'prix-m2-dvf'],
        faqSchema: [
            { q: 'Comment vérifier les risques naturels d\'une adresse ?', a: 'Le site Géorisques (georisques.gouv.fr) du Ministère de la Transition Écologique permet de consulter gratuitement tous les risques naturels et technologiques par adresse : inondation, mouvement de terrain, séisme, radon, installations industrielles.' },
            { q: 'Le vendeur doit-il informer l\'acheteur des risques ?', a: 'Oui. Le vendeur ou bailleur doit fournir un État des Risques et Pollutions (ERP) datant de moins de 6 mois. Ce document est obligatoire et doit être annexé à la promesse de vente ou au bail.' }
        ]
    },
    {
        slug: 'dpe-adresse-consultation',
        title: 'DPE par Adresse : Consulter le Diagnostic Énergétique de Votre Logement',
        metaDesc: 'Comment consulter le DPE d\'un logement par adresse. Base ADEME, interprétation des résultats et impact sur la valeur du bien.',
        targetSite: 'score',
        relatedSlugs: ['verifier-adresse-achat', 'renovation-energetique-dpe', 'risques-naturels-adresse'],
        faqSchema: [
            { q: 'Comment consulter le DPE d\'un logement ?', a: 'La base de l\'ADEME (observatoire-dpe.ademe.fr) recense tous les DPE réalisés depuis 2013. Vous pouvez rechercher par adresse pour consulter le diagnostic énergétique d\'un logement ou d\'un immeuble, avec la note de A à G et la consommation estimée.' },
            { q: 'Quel impact du DPE sur le prix d\'un bien ?', a: 'En 2026, un bien classé F ou G se vend en moyenne 10-20 % moins cher qu\'un bien classé D ou E (décote verte). À l\'inverse, un bien classé A ou B bénéficie d\'une prime de 5-10 %. L\'effet est encore plus marqué pour les locations.' }
        ]
    },

    // --- DROIT DU TRAVAIL (→ Indemnite-rupture) ---
    {
        slug: 'indemnite-licenciement-2026',
        title: 'Calcul Indemnité de Licenciement 2026 : Barème Légal et Conventionnel',
        metaDesc: 'Comment calculer votre indemnité de licenciement en 2026. Barème légal, conventions collectives, ancienneté et simulateur.',
        targetSite: 'indemnite',
        relatedSlugs: ['rupture-conventionnelle', 'indemnite-fin-cdd'],
        faqSchema: [
            { q: 'Comment est calculée l\'indemnité de licenciement ?', a: 'L\'indemnité légale est de 1/4 de mois de salaire par année d\'ancienneté pour les 10 premières années, puis 1/3 de mois par année au-delà. Le salaire de référence est la moyenne des 12 derniers mois ou des 3 derniers mois (le plus favorable).' },
            { q: 'L\'indemnité de licenciement est-elle imposable ?', a: 'L\'indemnité de licenciement est exonérée d\'impôt sur le revenu dans la limite du plus élevé de : 2 fois la rémunération annuelle brute, 50 % de l\'indemnité, ou le montant légal/conventionnel.' }
        ]
    },
    {
        slug: 'rupture-conventionnelle',
        title: 'Rupture Conventionnelle 2026 : Montant, Délai, Procédure Complète',
        metaDesc: 'Guide complet de la rupture conventionnelle : indemnité minimum, étapes de la procédure, délais, droit au chômage et simulation.',
        targetSite: 'indemnite',
        relatedSlugs: ['indemnite-licenciement-2026', 'indemnite-fin-cdd'],
        faqSchema: [
            { q: 'Quel est le montant minimum d\'une rupture conventionnelle ?', a: 'L\'indemnité de rupture conventionnelle ne peut pas être inférieure à l\'indemnité légale de licenciement : 1/4 de mois par année d\'ancienneté (10 premières années) puis 1/3 au-delà. En pratique, il est courant de négocier un montant supérieur.' },
            { q: 'A-t-on droit au chômage après une rupture conventionnelle ?', a: 'Oui. La rupture conventionnelle ouvre droit à l\'ARE (Allocation de Retour à l\'Emploi) dans les mêmes conditions qu\'un licenciement, après un délai de carence calculé en fonction de l\'indemnité perçue.' }
        ]
    },
    {
        slug: 'indemnite-fin-cdd',
        title: 'Indemnité de Fin de CDD : Calcul, Taux et Exceptions en 2026',
        metaDesc: 'Comment calculer la prime de précarité en fin de CDD. Taux de 10 %, exceptions, cas d\'exclusion et simulation.',
        targetSite: 'indemnite',
        relatedSlugs: ['rupture-conventionnelle', 'indemnite-licenciement-2026'],
        faqSchema: [
            { q: 'Quel est le montant de l\'indemnité de fin de CDD ?', a: 'La prime de précarité est égale à 10 % de la rémunération brute totale versée pendant le contrat (6 % si un accord de branche le prévoit). Elle est versée à la fin du CDD sauf exceptions (CDI proposé, faute grave, CDD d\'usage).' },
            { q: 'Dans quels cas la prime de précarité n\'est-elle pas due ?', a: 'La prime n\'est pas due si : l\'employeur propose un CDI aux mêmes conditions, le CDD est rompu pour faute grave, le salarié refuse un CDI, ou il s\'agit d\'un contrat saisonnier, d\'un CDD étudiant (jobs d\'été), ou d\'un CDD d\'usage.' }
        ]
    }
];

// ============================================================
// TEMPLATE HTML
// ============================================================
function generateHTML(page) {
    const site = SITES[page.targetSite];
    const relatedLinks = page.relatedSlugs
        .map(s => {
            const related = PAGES.find(p => p.slug === s);
            return related ? `<li><a href="${related.slug}.html">${related.title.split(':')[0].trim()}</a></li>` : '';
        })
        .filter(Boolean)
        .join('\n                ');

    const faqSchemaJSON = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": page.faqSchema.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
    }, null, 2);

    const faqHTML = page.faqSchema
        .map(f => `
            <div class="faq-item">
                <h3>${f.q}</h3>
                <p>${f.a}</p>
            </div>`)
        .join('');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.metaDesc}">
    <link rel="canonical" href="${GITHUB_BASE}/guides/${page.slug}.html">
    <style>
        :root{--primary:#1a365d;--accent:#2b6cb0;--bg:#f7fafc;--text:#2d3748;--light:#e2e8f0}
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;color:var(--text);background:var(--bg);line-height:1.8}
        .container{max-width:800px;margin:0 auto;padding:2rem 1.5rem}
        nav.breadcrumb{font-size:.85rem;color:#718096;margin-bottom:1.5rem}
        nav.breadcrumb a{color:var(--accent);text-decoration:none}
        h1{color:var(--primary);font-size:1.8rem;margin-bottom:1rem;line-height:1.3}
        .meta{color:#718096;font-size:.9rem;margin-bottom:2rem}
        h2{color:var(--primary);font-size:1.35rem;margin:2rem 0 1rem;padding-top:1rem;border-top:1px solid var(--light)}
        h3{color:var(--accent);font-size:1.1rem;margin:1.3rem 0 .6rem}
        p{margin-bottom:1rem}
        .content-placeholder{background:#fff;border:2px dashed var(--light);border-radius:8px;padding:2rem;margin:1.5rem 0;text-align:center;color:#a0aec0;font-style:italic}
        .faq-item{background:#fff;border:1px solid var(--light);border-radius:6px;padding:1.2rem;margin:.8rem 0}
        .faq-item h3{margin:0 0 .5rem;color:var(--primary)}
        .faq-item p{margin:0;font-size:.95rem}
        .cta-box{background:white;border:2px solid var(--accent);border-radius:8px;padding:1.5rem;margin:2rem 0;text-align:center}
        .cta-box a{display:inline-block;background:var(--accent);color:white;padding:.7rem 1.5rem;border-radius:6px;text-decoration:none;font-weight:600}
        .cta-box a:hover{background:var(--primary)}
        .related{background:white;border:1px solid var(--light);border-radius:8px;padding:1.5rem;margin-top:2rem}
        .related h3{margin-top:0;color:var(--primary)}
        .related ul{list-style:none;padding:0}
        .related li{margin-bottom:.5rem}
        .related a{color:var(--accent);text-decoration:none}
        footer{margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--light);color:#a0aec0;font-size:.85rem}
    </style>
    <script type="application/ld+json">
    ${faqSchemaJSON}
    </script>
</head>
<body>
    <div class="container">
        <nav class="breadcrumb"><a href="../index.html">Guides</a> → ${page.title.split(':')[0].trim()}</nav>

        <h1>${page.title}</h1>
        <p class="meta">Mis à jour en avril 2026</p>

        <div class="content-placeholder">
            ⚡ CONTENU À GÉNÉRER AVEC CLAUDE CODE ⚡<br>
            Instruction : "Génère le contenu complet (800-1200 mots) pour ${page.slug}.html<br>
            en suivant le style du guide LMNP. Cible SEO : ${page.title}"
        </div>

        <h2>Questions fréquentes</h2>
        ${faqHTML}

        <div class="cta-box">
            <p><strong>${site.cta}</strong></p>
            <a href="${site.url}" target="_blank" rel="noopener">${site.ctaShort} →</a>
        </div>

        <div class="related">
            <h3>Guides complémentaires</h3>
            <ul>
                ${relatedLinks}
                <li><a href="../index.html">← Tous les guides</a></li>
            </ul>
        </div>

        <footer>
            <p>Dernière mise à jour : avril 2026. Guide informatif, ne constitue pas un conseil professionnel.</p>
        </footer>
    </div>
</body>
</html>`;
}

// ============================================================
// GÉNÉRATION
// ============================================================
const guidesDir = path.join(__dirname, 'guides');
if (!fs.existsSync(guidesDir)) fs.mkdirSync(guidesDir, { recursive: true });

let generated = 0;
for (const page of PAGES) {
    const filePath = path.join(guidesDir, `${page.slug}.html`);
    // Ne pas écraser le guide LMNP déjà écrit manuellement
    if (page.slug === 'lmnp-guide-complet' && fs.existsSync(filePath)) {
        console.log(`⏭  ${page.slug}.html (déjà existant, skip)`);
        continue;
    }
    fs.writeFileSync(filePath, generateHTML(page));
    generated++;
    console.log(`✅ ${page.slug}.html`);
}

console.log(`\n🚀 ${generated} pages générées dans ./guides/`);
console.log(`📋 Total pages configurées : ${PAGES.length}`);
console.log(`\n📌 PROCHAINE ÉTAPE :`);
console.log(`   Utilise Claude Code pour remplir le contenu de chaque page :`);
console.log(`   "Génère le contenu SEO complet pour guides/[slug].html"`);
console.log(`\n📌 DÉPLOIEMENT :`);
console.log(`   1. Remplace guidesfr dans tous les fichiers par ton GitHub username`);
console.log(`   2. git init && git add . && git commit -m "initial"`);
console.log(`   3. Push vers GitHub, active GitHub Pages dans Settings`);
