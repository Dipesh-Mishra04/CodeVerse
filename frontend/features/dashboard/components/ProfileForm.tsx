'use client';

import { UserProfile } from "@/features/dashboard/types";

interface ProfileFormProps {
  profile: UserProfile;
  onProfileChange: (next: UserProfile) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  statusMessage: string;
}

export default function ProfileForm({
  profile,
  onProfileChange,
  onSave,
  saving,
  statusMessage,
}: ProfileFormProps) {
  const setField = (field: keyof UserProfile, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <p className="text-sm text-neutral-400">
            Build your coding profile like LeetCode and keep it updated.
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {statusMessage ? (
        <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {statusMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Full Name" value={profile.full_name} onChange={(v) => setField("full_name", v)} />
        <FormInput label="Email" value={profile.email} onChange={(v) => setField("email", v)} />
        <FormInput
          label="Date of Birth"
          type="date"
          value={profile.date_of_birth}
          onChange={(v) => setField("date_of_birth", v)}
        />
        <FormInput label="College" value={profile.college} onChange={(v) => setField("college", v)} />
        <FormInput label="Course" value={profile.course} onChange={(v) => setField("course", v)} />
        <FormInput label="Year" value={profile.graduation_year} onChange={(v) => setField("graduation_year", v)} />
        <FormInput
          label="Profile Photo URL"
          value={profile.profile_photo_url}
          onChange={(v) => setField("profile_photo_url", v)}
        />
        <FormInput label="GitHub URL" value={profile.github_url} onChange={(v) => setField("github_url", v)} />
        <FormInput
          label="LinkedIn URL"
          value={profile.linkedin_url}
          onChange={(v) => setField("linkedin_url", v)}
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-neutral-300">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setField("bio", e.target.value)}
          rows={4}
          placeholder="Tell others about your goals, interests, and coding journey..."
          className="w-full rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500/40 focus:outline-none"
        />
      </div>
    </section>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500/40 focus:outline-none"
      />
    </div>
  );
}
