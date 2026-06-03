import "./Vitrine.css";

const IMG = "/standardPlus_designSystem/images";

const categories = [
  { label: "Luminaires", img: `${IMG}/gc58vueh_0.webp` },
];

export default function Vitrine() {
  return (
    <>
      <h2 className="homePageToptext">
        Découvrez et achetez facilement des objets de designers talentueux.
      </h2>
      <div className="homePageCatalogCta">
        {categories.map(({ label, img }) => (
          <div key={label} className="ctaBloc">
            <h3 className="homePageCatalogCtaBloc">
              <span>{label}</span>
              <span className="homePageCatalogCtaArrow">→</span>
            </h3>
            <div
              className="homePageCatalogCtaImage"
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
