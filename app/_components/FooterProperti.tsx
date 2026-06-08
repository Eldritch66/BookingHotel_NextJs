export default function FooterProperti() {
  return (
    <footer className="w-full flex flex-col px-12 sm:flex-row items-center justify-between sm:px-20 py-5 text-[10px] tracking-widest uppercase text-[#9b8b7a] gap-3 mt-16">
      <span>© 2024 Nginapin. Cozy place to stay.</span>
      <div className="flex gap-8">
        {["Privacy", "Terms", "Contact"].map((item) => (
          <div
            key={item}
            className="hover:text-[#8b5e3c] transition-colors duration-200"
          >
            {item.toLowerCase()}
          </div>
        ))}
      </div>
    </footer>
  );
}
