import PCEMSPage1 from "./PCEMSPage1";

import React, { useState } from "react";
import { ChevronRight, Info, HelpCircle, Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PCEMSSimulator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1 - Informations personnelles
    canton: "",
    regionLoyer: "",
    statutAVSAI: "",
    ageResident: "",
    situationCouple: "avecConjoint",
    repartitionCouple: "unEnEMS",
    ageConjoint: "",
    // Page 2 - Fortune
    fortuneMobiliere: "",
    residencePrincipale: "",
    optionResidence: "habiteeParBeneficiaire",
    autresBiensImmobiliers: "",
    beneficiaireAPI: false,
    // Page 3 - Revenus
    renteAVSResident: "",
    renteAVSConjoint: "",
    renteLPPResident: "",
    renteLPPConjoint: "",
    autresRentesResident: "",
    autresRentesConjoint: "",
    tauxInteretBancaire: "",
    rendementLocatif: "",
    revenuActiviteResident: "",
    revenuActiviteConjoint: "",
    aidesFamiliales: "",
    // Page 4 - Charges
    tarifJournalierEMS: "",
    primeAssuranceMaladie: "",
    primeAssuranceMaladieConjoint: "",
    montantDepensesPersonnelles: "",
    montantBesoinsVitaux: "",
    fraisLogement: "",
    fraisAccessoiresLogement: "",
    forfaitBesoinsSpeciaux: "",
    nbEnfantsMoins11ans: "",
    nbEnfantsPlus11ans: "",
    // Page 5 - Résultats
    besoinsFinanciersConjoint: "",
    tauxImputationFortune: "20", // Par défaut 20% pour les personnes en EMS
  });

  const cantons = [
    "Argovie (AG)",
    "Appenzell Rhodes-Extérieures (AR)",
    "Appenzell Rhodes-Intérieures (AI)",
    "Bâle-Campagne (BL)",
    "Bâle-Ville (BS)",
    "Berne (BE)",
    "Fribourg (FR)",
    "Genève (GE)",
    "Glaris (GL)",
    "Grisons (GR)",
    "Jura (JU)",
    "Lucerne (LU)",
    "Neuchâtel (NE)",
    "Nidwald (NW)",
    "Obwald (OW)",
    "Saint-Gall (SG)",
    "Schaffhouse (SH)",
    "Schwyz (SZ)",
    "Soleure (SO)",
    "Tessin (TI)",
    "Thurgovie (TG)",
    "Uri (UR)",
    "Valais (VS)",
    "Vaud (VD)",
    "Zoug (ZG)",
    "Zurich (ZH)",
  ];

  const regionsLoyer = [
    "Région 1 - Grands centres urbains",
    "Région 2 - Villes et agglomérations",
    "Région 3 - Zones rurales",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Validation spéciale pour le taux d'imputation
    if (name === "tauxImputationFortune") {
      const taux = parseFloat(value);
      if (!isNaN(taux)) {
        // Limiter entre 10% et 20%
        newValue = Math.min(20, Math.max(10, taux)).toString();
      }
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };

      // Si on change la situation de couple ou la répartition, vérifier l'option résidence
      if (
        (name === "situationCouple" || name === "repartitionCouple") &&
        updated.optionResidence === "occupeeParConjoint"
      ) {
        if (
          updated.situationCouple !== "avecConjoint" ||
          updated.repartitionCouple !== "unEnEMS"
        ) {
          updated.optionResidence = "habiteeParBeneficiaire";
        }
      }

      // Si on change la répartition du couple, ajuster le taux d'imputation par défaut
      if (name === "repartitionCouple") {
        if (newValue === "unEnEMS" || newValue === "deuxEnEMS") {
          updated.tauxImputationFortune = "20"; // 20% par défaut pour EMS
        }
      }

      return updated;
    });
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNewSimulation = () => {
    setCurrentPage(1);
    setFormData({
      // Page 1 - Informations personnelles
      canton: "",
      regionLoyer: "",
      statutAVSAI: "",
      ageResident: "",
      situationCouple: "avecConjoint",
      repartitionCouple: "unEnEMS",
      ageConjoint: "",
      // Page 2 - Fortune
      fortuneMobiliere: "",
      residencePrincipale: "",
      optionResidence: "habiteeParBeneficiaire",
      autresBiensImmobiliers: "",
      beneficiaireAPI: false,
      // Page 3 - Revenus
      renteAVSResident: "",
      renteAVSConjoint: "",
      renteLPPResident: "",
      renteLPPConjoint: "",
      autresRentesResident: "",
      autresRentesConjoint: "",
      tauxInteretBancaire: "",
      rendementLocatif: "",
      revenuActiviteResident: "",
      revenuActiviteConjoint: "",
      aidesFamiliales: "",
      // Page 4 - Charges
      tarifJournalierEMS: "",
      primeAssuranceMaladie: "",
      primeAssuranceMaladieConjoint: "",
      montantDepensesPersonnelles: "",
      montantBesoinsVitaux: "",
      fraisLogement: "",
      fraisAccessoiresLogement: "",
      forfaitBesoinsSpeciaux: "",
      nbEnfantsMoins11ans: "",
      nbEnfantsPlus11ans: "",
      // Page 5 - Résultats
      besoinsFinanciersConjoint: "",
      tauxImputationFortune: "20",
    });
  };

  // Calculs pour la fortune
  const calculateFortune = () => {
    const fortuneMobiliere = parseFloat(formData.fortuneMobiliere) || 0;
    const residencePrincipale = parseFloat(formData.residencePrincipale) || 0;
    const autresBiens = parseFloat(formData.autresBiensImmobiliers) || 0;

    // Abattement sur la résidence principale
    let abattement = 0;
    if (formData.optionResidence === "habiteeParBeneficiaire") {
      abattement = 300000; // Abattement standard
    } else if (formData.optionResidence === "occupeeParConjoint") {
      abattement = 300000; // Abattement pour conjoint à domicile
    }
    // Si nonOccupee, l'abattement reste à 0

    if (formData.beneficiaireAPI) {
      abattement = Math.max(abattement, 300000); // Abattement API
    }

    const residenceApresAbattement = Math.max(
      0,
      residencePrincipale - abattement
    );

    // Règle 2025: Exonération du logement principal si fortune mobilière ≤ 200'000 CHF
    let residencePourCalcul = residenceApresAbattement;
    let exonerationResidence = 0;
    let residenceExoneree = false;

    if (
      fortuneMobiliere <= 200000 &&
      residenceApresAbattement > 0 &&
      (formData.optionResidence === "habiteeParBeneficiaire" ||
        formData.optionResidence === "occupeeParConjoint")
    ) {
      // Le logement principal est exonéré
      exonerationResidence = residenceApresAbattement;
      residencePourCalcul = 0;
      residenceExoneree = true;
    }

    // Fortune totale avant franchise
    const fortuneTotale = fortuneMobiliere + residencePourCalcul + autresBiens;

    // Franchise légale
    const franchise =
      formData.situationCouple === "sansConjoint" ? 30000 : 50000;

    // Fortune prise en compte après franchise
    const fortunePriseEnCompte = Math.max(0, fortuneTotale - franchise);

    return {
      abattement,
      residenceApresAbattement,
      residencePourCalcul,
      exonerationResidence,
      fortuneTotale,
      franchise,
      fortunePriseEnCompte,
      residenceExoneree,
    };
  };

  const fortuneCalculs = calculateFortune();

  // Calculs pour les revenus
  const calculateRevenus = () => {
    // Rentes AVS/AI (mensuelles converties en annuelles)
    const rentesAVSAI =
      ((parseFloat(formData.renteAVSResident) || 0) +
        (parseFloat(formData.renteAVSConjoint) || 0)) *
      12;

    // Rentes LPP (mensuelles converties en annuelles)
    const rentesLPP =
      ((parseFloat(formData.renteLPPResident) || 0) +
        (parseFloat(formData.renteLPPConjoint) || 0)) *
      12;

    // Autres rentes (mensuelles converties en annuelles)
    const autresRentes =
      ((parseFloat(formData.autresRentesResident) || 0) +
        (parseFloat(formData.autresRentesConjoint) || 0)) *
      12;

    // Revenus immobiliers
    // Calcul des intérêts sur la fortune mobilière
    const tauxInteret = parseFloat(formData.tauxInteretBancaire) || 0;
    const fortuneMobiliere = parseFloat(formData.fortuneMobiliere) || 0;
    const interetsBancaires = (fortuneMobiliere * tauxInteret) / 100;

    // Rendement locatif (mensuel converti en annuel)
    const rendementLocatif = (parseFloat(formData.rendementLocatif) || 0) * 12;

    // Total des revenus immobiliers (pour compatibilité)
    const revenusImmobiliers = interetsBancaires + rendementLocatif;

    // Revenus d'activité lucrative (avec franchise de 1000 CHF/mois par personne)
    const revenuActiviteResident =
      (parseFloat(formData.revenuActiviteResident) || 0) * 12;
    const revenuActiviteConjoint =
      (parseFloat(formData.revenuActiviteConjoint) || 0) * 12;

    // Application de la franchise de 1000 CHF/mois (12000 CHF/an) par personne
    const franchiseActivite = 12000;
    const revenuActiviteResidentNet = Math.max(
      0,
      revenuActiviteResident - franchiseActivite
    );
    const revenuActiviteConjointNet = Math.max(
      0,
      revenuActiviteConjoint - franchiseActivite
    );

    const revenusActiviteLucrative =
      revenuActiviteResidentNet + revenuActiviteConjointNet;

    // Les aides familiales ne sont pas prises en compte dans le calcul PC
    const aidesFamiliales = (parseFloat(formData.aidesFamiliales) || 0) * 12;

    // Total des revenus annuels (sans les aides familiales)
    const totalRevenusAnnuels =
      rentesAVSAI +
      rentesLPP +
      autresRentes +
      revenusImmobiliers +
      revenusActiviteLucrative;

    return {
      rentesAVSAI,
      rentesLPP,
      autresRentes,
      revenusImmobiliers,
      revenusActiviteLucrative,
      totalRevenusAnnuels,
      interetsBancaires,
      rendementLocatif,
      revenuActiviteResident,
      revenuActiviteConjoint,
      aidesFamiliales,
    };
  };

  const revenusCalculs = calculateRevenus();

  // Calculs pour les charges
  const calculateCharges = () => {
    // Tarif EMS annuel
    const tarifEMSAnnuel = (parseFloat(formData.tarifJournalierEMS) || 0) * 365;

    // Assurance maladie annuelle
    const assuranceMaladie =
      ((parseFloat(formData.primeAssuranceMaladie) || 0) +
        (parseFloat(formData.primeAssuranceMaladieConjoint) || 0)) *
      12;

    // Dépenses personnelles (montant forfaitaire mensuel converti en annuel)
    let depensesPersonnelles = 0;
    if (formData.repartitionCouple === "unEnEMS") {
      depensesPersonnelles =
        (parseFloat(formData.montantDepensesPersonnelles) || 0) * 12;
    } else if (formData.repartitionCouple === "deuxEnEMS") {
      depensesPersonnelles =
        (parseFloat(formData.montantDepensesPersonnelles) || 0) * 2 * 12;
    }

    // Calcul automatique des besoins vitaux
    let besoinsVitaux = 0;
    if (formData.situationCouple === "sansConjoint") {
      besoinsVitaux = 20670; // Personne seule
    } else {
      besoinsVitaux = 31005; // Couple
    }

    // Ajouter les montants pour les enfants
    const nbEnfantsMoins11 = parseInt(formData.nbEnfantsMoins11ans) || 0;
    const nbEnfantsPlus11 = parseInt(formData.nbEnfantsPlus11ans) || 0;
    besoinsVitaux += nbEnfantsMoins11 * 7590 + nbEnfantsPlus11 * 10815;

    // Frais de logement et accessoires (mensuels convertis en annuels)
    const fraisLogement = (parseFloat(formData.fraisLogement) || 0) * 12;
    const fraisAccessoires =
      (parseFloat(formData.fraisAccessoiresLogement) || 0) * 12;
    const fraisLogementTotal = fraisLogement + fraisAccessoires;

    // Forfait besoins spécifiques
    const besoinsSpecifiques =
      (parseFloat(formData.forfaitBesoinsSpeciaux) || 0) * 12;

    // Total des charges annuelles reconnues
    const totalChargesAnnuelles =
      tarifEMSAnnuel +
      assuranceMaladie +
      depensesPersonnelles +
      besoinsVitaux +
      fraisLogementTotal +
      besoinsSpecifiques;

    return {
      tarifEMSAnnuel,
      assuranceMaladie,
      depensesPersonnelles,
      besoinsVitaux,
      fraisLogementTotal,
      besoinsSpecifiques,
      totalChargesAnnuelles,
    };
  };

  const chargesCalculs = calculateCharges();

  // Calculs pour les PC
  const calculatePC = () => {
    // Déterminer le taux d'imputation selon la situation
    let tauxImputation = 0.1; // Par défaut 10% (1/10) pour les bénéficiaires AVS à domicile

    // Si la personne est en EMS, utiliser le taux défini (par défaut 20%)
    if (
      formData.repartitionCouple === "deuxEnEMS" ||
      (formData.situationCouple === "sansConjoint" &&
        formData.tarifJournalierEMS)
    ) {
      tauxImputation = parseFloat(formData.tauxImputationFortune) / 100 || 0.2;
    }

    // Pour les couples avec un conjoint en EMS
    if (
      formData.situationCouple === "avecConjoint" &&
      formData.repartitionCouple === "unEnEMS"
    ) {
      // Selon la loi, pour les couples séparés, la fortune est imputée pour 3/4 au conjoint en home
      // et pour 1/4 au conjoint à domicile, mais ici on utilise le taux cantonal pour simplifier
      tauxImputation = parseFloat(formData.tauxImputationFortune) / 100 || 0.2;
    }

    // Pour les bénéficiaires AI, le taux reste 1/15 (environ 6.67%)
    if (formData.statutAVSAI === "ai") {
      tauxImputation = 1 / 15;
    }

    // Imputation de la fortune
    const imputationFortune =
      fortuneCalculs.fortunePriseEnCompte * tauxImputation;

    // Total des revenus déterminants (incluant l'imputation de la fortune)
    const totalRevenusAvecImputation =
      revenusCalculs.totalRevenusAnnuels + imputationFortune;

    // Calcul des PC annuelles
    const pcAnnuelles = Math.max(
      0,
      chargesCalculs.totalChargesAnnuelles - totalRevenusAvecImputation
    );
    const pcMensuelles = pcAnnuelles / 12;

    // Répartition entre conjoints
    let pcResident = pcAnnuelles;
    let pcConjoint = 0;

    if (
      formData.situationCouple === "avecConjoint" &&
      formData.repartitionCouple === "unEnEMS"
    ) {
      // Si un conjoint est en EMS et l'autre à domicile
      // Les PC sont calculées pour chaque conjoint selon ses besoins spécifiques
      // Répartition simplifiée basée sur les charges respectives
      const chargesResident =
        (chargesCalculs.tarifEMSAnnuel || 0) +
        (chargesCalculs.depensesPersonnelles || 0) +
        (chargesCalculs.assuranceMaladie || 0) * 0.5;
      const chargesConjoint =
        (chargesCalculs.besoinsVitaux || 0) * 0.5 +
        (chargesCalculs.fraisLogementTotal || 0) +
        (chargesCalculs.assuranceMaladie || 0) * 0.5;

      const totalChargesReparties = chargesResident + chargesConjoint;
      if (totalChargesReparties > 0) {
        pcResident = Math.round(
          pcAnnuelles * (chargesResident / totalChargesReparties)
        );
        pcConjoint = pcAnnuelles - pcResident; // Pour s'assurer que le total reste correct
      }
    }

    return {
      tauxImputation,
      imputationFortune,
      totalRevenusAvecImputation,
      pcAnnuelles,
      pcMensuelles,
      pcResident,
      pcConjoint,
    };
  };

  const pcCalculs = calculatePC();

  // Calcul automatique du déficit de budget
  const calculateDeficitBudget = () => {
    // Revenus totaux SANS revenus immobiliers du bien principal et SANS imputation de la fortune
    // On inclut uniquement les intérêts de la fortune mobilière, pas le rendement locatif
    const revenusCalculDeficit =
      revenusCalculs.rentesAVSAI +
      revenusCalculs.rentesLPP +
      revenusCalculs.autresRentes +
      revenusCalculs.revenusActiviteLucrative +
      revenusCalculs.interetsBancaires + // Intérêts de la fortune mobilière uniquement
      pcCalculs.pcAnnuelles;

    // Dépenses totales SANS les besoins vitaux
    let depensesCalculDeficit = 0;

    // Toujours inclure l'assurance maladie
    depensesCalculDeficit += chargesCalculs.assuranceMaladie || 0;

    // Frais EMS et dépenses personnelles si applicable
    if (formData.tarifJournalierEMS) {
      depensesCalculDeficit += chargesCalculs.tarifEMSAnnuel || 0;
    }
    if (formData.montantDepensesPersonnelles) {
      depensesCalculDeficit += chargesCalculs.depensesPersonnelles || 0;
    }

    // Frais de logement si applicable
    if (formData.fraisLogement || formData.fraisAccessoiresLogement) {
      depensesCalculDeficit += chargesCalculs.fraisLogementTotal || 0;
    }

    // Besoins spécifiques si applicable
    depensesCalculDeficit += chargesCalculs.besoinsSpecifiques || 0;

    // Calcul du déficit (Dépenses - Revenus)
    const deficit = depensesCalculDeficit - revenusCalculDeficit;

    // Retourner le déficit annuel (on l'affichera en mensuel dans l'interface)
    return Math.max(0, deficit);
  };

  const deficitBudget = calculateDeficitBudget();

  // Données pour le graphique
  const generateChartData = () => {
    const fortuneSansBien = parseFloat(formData.fortuneMobiliere) || 0;
    const depensesAnnuelles =
      (parseFloat(formData.besoinsFinanciersConjoint) || 0) * 12 +
      deficitBudget; // déficit déjà en annuel

    const data = [];
    let capitalRestant = fortuneSansBien;

    for (let annee = 0; annee <= 10; annee++) {
      data.push({
        annee: annee,
        fortune: Math.max(0, capitalRestant),
        sansDepenses: fortuneSansBien,
      });
      capitalRestant -= depensesAnnuelles;
    }

    return data;
  };

  const chartData = generateChartData();

  // Fonction d'export PDF via impression
  const exportToPDF = () => {
    try {
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open(
        "",
        "PRINT",
        "height=650,width=900,top=100,left=150"
      );
      if (!printWindow) {
        alert("Veuillez autoriser les pop-ups pour exporter en PDF");
        return;
      }

      const date = new Date().toLocaleDateString("fr-CH");

      // Construire le contenu HTML avec styles pour l'impression
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Simulation PC EMS 2025 - ${date}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
              
              .page-break {
                page-break-after: always;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .header {
              background-color: #003366;
              color: white;
              padding: 30px;
              margin: -20px -20px 30px -20px;
              text-align: center;
            }
            
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            
            .header p {
              margin: 0;
              font-size: 14px;
              opacity: 0.9;
            }
            
            .result-box {
              background-color: #e6f4ff;
              border: 2px solid #0066cc;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            
            .result-box h2 {
              color: #003366;
              margin: 0 0 10px 0;
              font-size: 18px;
            }
            
            .result-amount {
              font-size: 32px;
              font-weight: bold;
              color: #003366;
              margin: 10px 0;
            }
            
            .section {
              margin: 30px 0;
            }
            
            .section h2 {
              color: #003366;
              font-size: 20px;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid #003366;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              background-color: white;
            }
            
            th {
              background-color: #003366;
              color: white;
              padding: 10px;
              text-align: left;
              font-weight: bold;
            }
            
            td {
              padding: 8px 10px;
              border-bottom: 1px solid #e0e0e0;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .label {
              font-weight: bold;
              width: 60%;
            }
            
            .value {
              text-align: right;
              width: 40%;
            }
            
            .total-row {
              background-color: #e6f4ff !important;
              font-weight: bold;
            }
            
            .total-row td {
              border-top: 2px solid #003366;
              border-bottom: 2px solid #003366;
              padding: 12px 10px;
            }
            
            .note-box {
              background-color: #fff9e6;
              border: 1px solid #ffc107;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              font-size: 12px;
            }
            
            .warning-box {
              background-color: #ffe6e6;
              border: 1px solid #dc3545;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              font-size: 12px;
              color: #721c24;
            }
            
            .footer-text {
              text-align: center;
              font-size: 10px;
              color: #666;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            
            .copyright {
              font-size: 9px;
              margin-top: 10px;
            }
            
            .button-container {
              text-align: center;
              margin: 20px 0;
            }
            
            .print-button {
              background-color: #0066cc;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 16px;
              border-radius: 4px;
              cursor: pointer;
            }
            
            .print-button:hover {
              background-color: #0052a3;
            }
          </style>
        </head>
        <body>
          <div class="button-container no-print">
            <button class="print-button" onclick="window.print()">Imprimer / Sauvegarder en PDF</button>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Cliquez sur le bouton ci-dessus puis sélectionnez "Enregistrer en PDF" dans la boîte de dialogue d'impression
            </p>
          </div>
          
          <div class="header">
            <h1>Simulateur PC EMS 2025</h1>
            <p>Estimation des prestations complémentaires selon la législation en vigueur dès le 1er janvier 2025</p>
          </div>
          
          <p style="text-align: right; color: #666;">Date de simulation: ${date}</p>
          
          <div class="result-box">
            <h2>Droit mensuel aux prestations complémentaires</h2>
            <div class="result-amount">${pcCalculs.pcMensuelles.toLocaleString(
              "fr-CH",
              { minimumFractionDigits: 0, maximumFractionDigits: 0 }
            )} CHF / mois</div>
            <p style="margin: 5px 0; color: #666;">soit ${pcCalculs.pcAnnuelles.toLocaleString(
              "fr-CH"
            )} CHF par année</p>
          </div>
          
          <div class="section">
            <h2>1. Informations personnelles</h2>
            <table>
              <tr>
                <td class="label">Canton de domicile</td>
                <td class="value">${formData.canton || "Non renseigné"}</td>
              </tr>
              <tr>
                <td class="label">Région de loyer</td>
                <td class="value">${
                  formData.regionLoyer || "Non renseigné"
                }</td>
              </tr>
              <tr>
                <td class="label">Statut AVS/AI</td>
                <td class="value">${
                  formData.statutAVSAI === "avs"
                    ? "Bénéficiaire AVS"
                    : formData.statutAVSAI === "ai"
                    ? "Bénéficiaire AI"
                    : "Non renseigné"
                }</td>
              </tr>
              <tr>
                <td class="label">Âge du résident EMS</td>
                <td class="value">${
                  formData.ageResident || "Non renseigné"
                } ans</td>
              </tr>
              <tr>
                <td class="label">Situation de couple</td>
                <td class="value">${
                  formData.situationCouple === "avecConjoint"
                    ? "Avec conjoint"
                    : "Sans conjoint"
                }</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>2. Fortune</h2>
            <table>
              <tr>
                <td class="label">Fortune mobilière</td>
                <td class="value">${(
                  parseFloat(formData.fortuneMobiliere) || 0
                ).toLocaleString("fr-CH")} CHF</td>
              </tr>
              <tr>
                <td class="label">Résidence principale</td>
                <td class="value">${(
                  parseFloat(formData.residencePrincipale) || 0
                ).toLocaleString("fr-CH")} CHF</td>
              </tr>
              <tr class="total-row">
                <td class="label">Fortune prise en compte</td>
                <td class="value">${fortuneCalculs.fortunePriseEnCompte.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>3. Revenus annuels</h2>
            <table>
              <tr>
                <td class="label">Rentes AVS/AI</td>
                <td class="value">${revenusCalculs.rentesAVSAI.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
              <tr>
                <td class="label">Rentes LPP</td>
                <td class="value">${revenusCalculs.rentesLPP.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
              <tr class="total-row">
                <td class="label">Total des revenus annuels</td>
                <td class="value">${revenusCalculs.totalRevenusAnnuels.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>4. Charges reconnues</h2>
            <table>
              <tr>
                <td class="label">Assurance maladie</td>
                <td class="value">${chargesCalculs.assuranceMaladie.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
              <tr>
                <td class="label">Besoins vitaux</td>
                <td class="value">${chargesCalculs.besoinsVitaux.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
              <tr class="total-row">
                <td class="label">Total des charges annuelles</td>
                <td class="value">${chargesCalculs.totalChargesAnnuelles.toLocaleString(
                  "fr-CH"
                )} CHF</td>
              </tr>
            </table>
          </div>
          
          <div class="footer-text">
            <p><strong>Important:</strong> Cette simulation est purement indicative. Seuls les organes PC cantonaux sont compétents pour la décision finale d'octroi des prestations.</p>
            <p class="copyright">© ${new Date().getFullYear()} PatrimoineEMS - Tous droits réservés</p>
          </div>
        </body>
        </html>
      `;

      // Écrire le contenu dans la nouvelle fenêtre
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Focus sur la fenêtre
      printWindow.focus();

      // Attendre un court instant puis déclencher l'impression
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert(
        "Une erreur est survenue lors de l'export PDF. Veuillez réessayer."
      );
    }
  };

  return <PCEMSPage1 />;
};

export default PCEMSSimulator;
