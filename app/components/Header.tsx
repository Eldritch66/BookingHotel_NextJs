import Login from "./Login";
import Navbar from "./navigation";

function Header() {
  return (
    <header className=" px-4 py-5">
      <div className="flex justify-between items-center mx-auto w-full max-w-7xl h-16">
        <Navbar />
        <Login />
      </div>
    </header>
  );
}

export default Header;
