import Login from "./Login";
import Navbar from "./Navigation";

function Header() {
  return (
    <header className="hidden px-4 py-5 sm:flex justify-between items-center mx-auto w-full max-w-[1800px] h-16 rounded-xl sticky top-0 z-50 bg-white/90 backdrop-blur-sm  border-gray-200">
      <Navbar />
      <Login />
    </header>
  );
}

export default Header;
