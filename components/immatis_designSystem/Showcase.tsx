'use client'

import AnswerCard from './AnswerCard'
import Dropzone from './Dropzone'
import FieldRead from './FieldRead'
import LandscapeStrip from './LandscapeStrip'
import { aquawax, parabole } from './fonts'
import styles from './tokens.module.css'

export default function Showcase() {
  return (
    <div
      className={`${aquawax.variable} ${parabole.variable} ${styles.root} flex w-full max-w-[480px] flex-col items-center gap-[28px] border-[0.5px] border-[#c9c9c9] mb-[60px] lg:max-w-[927px] lg:gap-[36px] lg:mb-[100px]`}
    >
      <div className={styles.depot}>
        <div className={styles.canvas}>
          <LandscapeStrip />
        </div>
        <Dropzone
          className="relative z-[1]"
          inputId="immatis-demo"
          formats="Carte grise allemande, belge ou néerlandaise · jusqu'à 3 volets · PDF, JPG ou PNG"
          onFiles={() => {}}
          onExample={() => {
            window.open('https://immatis.com/example', '_blank', 'noopener,noreferrer')
          }}
        />
      </div>
      <div className={styles.pieces}>
        <AnswerCard
          label="Voie d'immatriculation"
          status="Concluant"
          value="AVDT"
          consequence="Pas d'étape COC."
          field="15 / 15 champs harmonisés · J = M1"
          rule="Document UE harmonisé, définitif, catégorie M1 : voie AVDT."
        />
        <FieldRead />
      </div>
    </div>
  )
}
