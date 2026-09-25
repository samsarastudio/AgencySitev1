import Image from "next/image";
export function Logo() {
  return (
    <span className="logo-lockup">
      <Image
        src="/inmoment-mark.svg"
        alt=""
        width={44}
        height={41}
        className="logo-mark"
      />
      <span className="wordmark">
        inmoment<small>SERVICES</small>
      </span>
    </span>
  );
}
