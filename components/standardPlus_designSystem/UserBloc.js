import Image from "next/image";
import Link from "next/link";
import "./UserBloc.css";

const IMG = "/standardPlus_designSystem/images";

export default function UserBloc({
  userName = "Index Office",
  profileSrc = `${IMG}/dgn473f.jpg`,
  bannerSrc = `${IMG}/ds350f.jpg`,
  href = "/samy",
  alt = "Index Office",
}) {
  return (
    <Link className="userBloc" href={href}>
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
    </Link>
  );
}
