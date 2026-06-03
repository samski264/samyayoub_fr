import Image from "next/image";
import "./UserBloc.css";

const IMG = "/standardPlus_designSystem/images";

export default function UserBloc({
  userName = "Index Office",
  profileSrc = `${IMG}/dgn473f.webp`,
  bannerSrc = `${IMG}/ads350f.webp`,
  alt = "Index Office",
}) {
  return (
    <div className="userBloc">
      <div className="userBlocUserBloc">
        <Image
          className="userBlocImage"
          src={profileSrc}
          alt={alt}
          width={800}
          height={1200}
        />
        <h4 className="userBlocUserName">{userName}</h4>
      </div>
      <div className="userBlocBannerBlur" />
      <Image
        className="userBlocBanner"
        src={bannerSrc}
        alt="banner"
        width={1667}
        height={1667}
      />
      <div className="userBlocArrowButton">→</div>
    </div>
  );
}
