

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-3 text-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2">
          {/* Placeholder for logo */}
          <div  className="h-8 w-8 md:h-10 md:w-10"> <img
            src="/con_1.png"
            alt="ClimaQuest logo"
          
          /></div>
          <h2 className="text-lg font-semibold text-white tracking-wide">
            ClimaQuest
          </h2>
        </div>

        {/* Address */}
        <p className="text-sm text-gray-400">
          123 ClimaQuest Street, Accra, Ghana
        </p>
 
          
        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} ClimaQuest. All rights reserved. |
          Built by <span className="font-medium text-white">Ebenezer</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
