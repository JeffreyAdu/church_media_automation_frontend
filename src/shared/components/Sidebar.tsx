import { NavLink } from "react-router-dom";
import { LayoutDashboard, Radio, Settings, X } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "YouTube Channels", href: "/app/agents", icon: Radio },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0f0f0f] border-r border-white/5 flex-col">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/5">
          <img
            src="/images/favicon-32x32.png"
            alt="PodcastFlow AI"
            className="w-8 h-8 rounded-lg"
          />
          <h1 className="text-lg font-bold text-white tracking-tight">
            Podcast<span className="text-orange-500">Flow</span>
            <span className="text-orange-400 text-sm ml-1 font-semibold">
              AI
            </span>
          </h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/favicon-32x32.png"
              alt="PodcastFlow AI"
              className="w-8 h-8 rounded-lg"
            />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Podcast<span className="text-orange-500">Flow</span>
              <span className="text-orange-400 text-sm ml-1 font-semibold">
                AI
              </span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
