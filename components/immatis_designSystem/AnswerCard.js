import styles from "./css/AnswerCard.module.css";

// Carte de sortie (accueil et résultat) : le chiffre, le champ lu, la règle.
export default function AnswerCard({
  label = "Voie d'homologation",
  status = "Concluant",
  tone = "ok",
  value = "AVDT",
  consequence = "Pas de passage en RTI.",
  field = "K absent · 15 / 15 champs harmonisés",
  rule = "Sans numéro de réception K, tout dépend des champs : tous présents, voie AVDT. Un seul absent, et c'est la RTI.",
}) {
  const estimate = tone === "estimate";

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <p>{label}</p>
        <span className={estimate ? `${styles.badge} ${styles.estimate}` : styles.badge}>
          <span className={styles.dot} aria-hidden="true" />
          {status}
        </span>
      </header>
      <div className={estimate ? `${styles.cardValue} ${styles.estimate}` : styles.cardValue}>
        <p className={styles.figure}>{value}</p>
        <p>{consequence}</p>
      </div>
      <div className={styles.trace}>
        <div>
          <p className={styles.traceLabel}>Champ lu</p>
          <p className={styles.traceValue}>{field}</p>
        </div>
        <div>
          <p className={styles.traceLabel}>Règle appliquée</p>
          <p className={styles.rule}>{rule}</p>
        </div>
      </div>
    </article>
  );
}
