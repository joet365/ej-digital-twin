import logo from "@/assets/conquer365-logo.png";

const Header = () => {
  return (
    <header className="w-full py-6 px-8 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <img 
          src={logo} 
          alt="Conquer365" 
          className="h-10 md:h-12"
        />
      </div>
    </header>
  );
};

export default Header;
