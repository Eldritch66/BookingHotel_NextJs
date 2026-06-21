import { IoLocationSharp } from "react-icons/io5";

export default function HeaderDetailPage({
  title,
  city,
  province,
  name,
  description_full,
}: {
  title: string;
  city: string;
  province: string;
  name: string;
  description_full: string;
}) {
  return (
    <header className="flex gap-2 flex-col">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-400 flex flex-row items-center gap-1">
        <IoLocationSharp size={18} /> {province}, {city}, Indonesia
      </p>

      <div className="flex items-center gap-2 border border-gray-200 bg-blue-50 px-4 py-1 rounded-lg">
        <span className="text-base font-sans font-semibold tracking-wide">
          {name}
        </span>
      </div>
      <p className="text-base text-gray-600 w-full md:w-[80%] text-pretty">
        {description_full}
      </p>
    </header>
  );
}
