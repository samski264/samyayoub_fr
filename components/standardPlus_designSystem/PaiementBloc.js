import "./PaiementBloc.css";
import Image from "next/image";

const IMG = "/standardPlus_designSystem/images";

export default function PaiementBloc({
  price = "240.00",
  serie = "8/32",
  printingTime = "2h30",
  imageSrc = `${IMG}/nkelbdxi_0.webp`,
  imageAlt = "product image",
}) {
  return (
    <div className="paiementBloc">
      <div className="paiement">

        <div className="paimentItems">
          <h3 className="white priceAmount">
            {price} <span className="priceDevise">euros</span>
          </h3>
        </div>

        <div className="spacer20" />

        <div className="paimentItems">
          <div>
            <h6>Série</h6>
            <h5 className="white">{serie}</h5>
          </div>
          <div>
            <h6>Temps d'impression</h6>
            <h5 className="white">{printingTime}</h5>
          </div>
        </div>

        <div className="spacer20" />
        <div className="spacer20" />

        <button className="buyButton">Acheter</button>

        <div className="paiementImageLayer" />
        <Image
          className="paiementImageBackground"
          src={imageSrc}
          alt={imageAlt}
          width={2560}
          height={1440}
        />
      </div>
    </div>
  );
}
