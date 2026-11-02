import styles from "./css/FieldRead.module.css";

// Bloc « champ lu » des articles : le code harmonisé, son libellé, un exemple.
export default function FieldRead({
  code = "D.2",
  label = "Numéro de réception par type · Typgenehmigungsnummer",
  example = "Exemple de valeur attendue : e1*2007/46*0458*11. Une case vide, un tiret ou « – » : le champ est absent.",
}) {
  return (
    <aside className={styles.field}>
      <p className={styles.fieldLabel}>Champ lu sur le certificat</p>
      <div className={styles.fieldRow}>
        <p className={styles.fieldCode}>{code}</p>
        <div>
          <p className={styles.fieldName}>{label}</p>
          <p className={styles.fieldExample}>{example}</p>
        </div>
      </div>
    </aside>
  );
}
