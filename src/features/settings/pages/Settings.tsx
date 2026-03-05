import { useState } from "react";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  Loader2,
  CheckCircle2,
  Settings as SettingsIcon,
  User,
  Lock,
  Mail,
  Building2,
  Info,
} from "lucide-react";

export default function Settings() {
  const { user, updatePassword, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(
    user?.user_metadata?.first_name || "",
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.last_name || "",
  );
  const [orgName, setOrgName] = useState(
    user?.user_metadata?.organization_name || "",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const inputCls =
    "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        organization_name: orgName,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await updatePassword(newPassword);
      setPasswordSaved(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-orange-500" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Information */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-[#141414] rounded-xl border border-white/5 p-6"
      >
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-orange-500" />
          Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-600" />
              <input
                id="email"
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              Contact support to change your email address
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Organization Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className={inputCls}
                placeholder="Your organization name"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              saving ||
              (firstName === (user?.user_metadata?.first_name || "") &&
                lastName === (user?.user_metadata?.last_name || "") &&
                orgName === (user?.user_metadata?.organization_name || ""))
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handleChangePassword}
        className="bg-[#141414] rounded-xl border border-white/5 p-6"
      >
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Lock className="h-4.5 w-4.5 text-orange-500" />
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {passwordError}
            </div>
          )}

          {passwordSaved && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Password updated successfully
            </div>
          )}

          <button
            type="submit"
            disabled={passwordSaving || !newPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            {passwordSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>

      {/* About */}
      <div className="bg-[#141414] rounded-xl border border-white/5 p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="h-4.5 w-4.5 text-orange-500" />
          About
        </h2>
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            <span className="text-gray-500">Version:</span>{" "}
            <span className="text-white font-mono text-xs bg-white/5 px-2 py-0.5 rounded-md">
              1.0.0
            </span>
          </p>
          <p>
            <span className="text-gray-500">Platform:</span>{" "}
            <span className="text-white">PodcastFlow</span>
          </p>
          <p className="mt-4 leading-relaxed text-gray-500">
            Automatically convert YouTube videos to podcast episodes with audio
            processing, RSS feed generation, and distribution to Spotify, Apple
            Podcasts, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
