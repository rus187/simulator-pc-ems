import React, { useState } from "react";

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

const statuts = ["Bénéficiaire AVS", "Bénéficiaire AI"];

const cantons = [
  /* ... */
];
const regionsOfas = [
  /* ... */
];
const statuts = [
  /* ... */
];

export default function PCEMSPage1({ formData = {}, handleInputChange }) {
  const [situationCouple, setSituationCouple] = useState(
    formData.situationCouple || "avecConjoint",
  );
  const [repartitionCouple, setRepartitionCouple] = useState(
    formData.repartitionCouple || "unEnEMS",
  );

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f4f6fa",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#23408e",
          color: "#fff",
          padding: "32px 24px 20px 24px",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <h1 style={{ fontSize: 36, margin: 0 }}>Simulateur PC EMS 2025</h1>
        <div style={{ opacity: 0.9, marginTop: 6 }}>
          Estimation des prestations complémentaires selon la législation en
          vigueur dès le 1er janvier 2025
        </div>
        <div
          style={{
            position: "absolute",
            right: 36,
            top: 30,
            opacity: 0.7,
            fontSize: 15,
          }}
        >
          Version 1.0
        </div>
      </div>

      {/* ETAPES */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "28px 0 24px 0",
        }}
      >
        {[
          "Informations personnelles",
          "Fortune",
          "Revenus",
          "Charges",
          "Résultats",
        ].map((etape, i) => (
          <div
            key={etape}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 16px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: i === 0 ? "#23408e" : "#e3e8f3",
                color: i === 0 ? "#fff" : "#23408e",
                fontWeight: "bold",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                marginLeft: 7,
                fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? "#23408e" : "#8a94a6",
              }}
            >
              {etape}
            </span>
          </div>
        ))}
      </div>

      {/* CONTENU PRINCIPAL */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 3px 20px #23408e13",
          padding: 36,
          marginTop: 18,
        }}
      >
        <h2 style={{ color: "#23408e", fontSize: 27 }}>
          Informations personnelles
        </h2>
        <div style={{ display: "flex", gap: 32 }}>
          {/* Colonne 1 */}
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500 }}>Canton de domicile</label>
            <select style={selectStyle}>
              <option value="">Sélectionnez un canton</option>
              {cantons.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label style={{ fontWeight: 500, marginTop: 20, display: "block" }}>
              Statut AVS/AI
            </label>
            <select style={selectStyle}>
              <option value="">Sélectionnez un statut</option>
              {statuts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontWeight: 500 }}>Situation de couple</label>
              <div style={{ marginTop: 8 }}>
                <input
                  type="radio"
                  name="situationCouple"
                  value="avecConjoint"
                  checked={situationCouple === "avecConjoint"}
                  onChange={(e) => {
                    setSituationCouple(e.target.value);
                    handleInputChange && handleInputChange(e);
                  }}
                  style={{ accentColor: "#23408e" }}
                />{" "}
                Avec conjoint
                <input
                  type="radio"
                  name="situationCouple"
                  value="sansConjoint"
                  checked={situationCouple === "sansConjoint"}
                  onChange={(e) => {
                    setSituationCouple(e.target.value);
                    handleInputChange && handleInputChange(e);
                  }}
                  style={{ accentColor: "#23408e", marginLeft: 18 }}
                />{" "}
                Sans conjoint
              </div>
              {situationCouple === "avecConjoint" && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontWeight: 500 }}>
                    Répartition du couple
                  </label>
                  <select
                    name="repartitionCouple"
                    value={repartitionCouple}
                    onChange={(e) => {
                      setRepartitionCouple(e.target.value);
                      handleInputChange && handleInputChange(e);
                    }}
                    style={selectStyle}
                  >
                    <option value="unEnEMS">Un en EMS, un à domicile</option>
                    <option value="deuxEnEMS">Les deux en EMS</option>
                    <option value="deuxADomicile">Les deux à domicile</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {/* Colonne 2 */}
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500 }}>
              Région de loyer (selon l'OFAS)
            </label>
            <select style={selectStyle}>
              <option value="">Sélectionnez une région</option>
              {regionsOfas.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label style={{ fontWeight: 500, marginTop: 20, display: "block" }}>
              Âge du résident EMS
            </label>
            <input
              type="number"
              name="ageResident"
              value={formData.ageResident || ""}
              onChange={handleInputChange}
              style={inputStyle}
            />
            {situationCouple === "avecConjoint" && (
              <>
                <label
                  style={{ fontWeight: 500, marginTop: 20, display: "block" }}
                >
                  Âge du conjoint
                </label>
                <input
                  type="number"
                  name="ageConjoint"
                  value={formData.ageConjoint || ""}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #c1c8d9",
  fontSize: 16,
  marginTop: 7,
  marginBottom: 7,
};
const inputStyle = { ...selectStyle, width: "100%" };
