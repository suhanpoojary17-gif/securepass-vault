const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-[#E8ECEF] flex items-center justify-between px-6">

      <h2 className="text-xl font-semibold text-[#001E2B]">
        SecurePass Vault
      </h2>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">
          Welcome Back 👋
        </span>

        <div className="w-10 h-10 rounded-full bg-[#00ED64] flex items-center justify-center font-bold text-[#001E2B]">
          S
        </div>

      </div>

    </div>
  );
};

export default Navbar;