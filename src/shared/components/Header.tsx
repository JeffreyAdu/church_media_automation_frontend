import { useAuth } from "../contexts/AuthContext";
import { LogOut, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  const initials = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name[0]}${(user.user_metadata.last_name?.[0] || "").toUpperCase()}`
    : displayName[0]?.toUpperCase() || "U";

  return (
    <header className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-400" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500">
          Welcome back!
        </span>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-orange-500">
                {initials}
              </span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-300">
              {displayName}
            </span>
            <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-[#141414] rounded-xl shadow-2xl shadow-black/40 border border-white/10 py-1 z-20">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-white break-all mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
