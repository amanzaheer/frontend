import { PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function ContactButton({ phone, className }) {
  return (
    <Link
      className={`btnPrimary rounded-full w-fit py-4 flex items-center text-left gap-2 lg:gap-5 ${className}`}
      title="Click to call us"
      href={`tel:${phone}`}
    >
      <span>
        <PhoneIcon
          title="phone icon"
          alt="phone icon"
          className="h-7 lg:h-10"
        />
      </span>
      <span>
        <p className="uppercase text-sm lg:text-base font-bold">
          CLICK TO CALL
        </p>
        <p className="text-xl lg:text-2xl lg:-mt-1 font-bold">{phone}</p>
      </span>
    </Link>
  );
}
