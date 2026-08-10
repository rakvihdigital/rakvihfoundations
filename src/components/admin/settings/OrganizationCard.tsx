"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SectionTitle from "./SectionTitle";

export default function OrganizationCard() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [organization, setOrganization] = useState({
    id: "",
    organization_name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logo: "",
  });

  useEffect(() => {
    fetchOrganization();
  }, []);

  async function fetchOrganization() {
    setLoading(true);

    const { data, error } = await supabase
      .from("organization_settings")
      .select("*")
      .single();

    if (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setOrganization({
        id: data.id,
        organization_name: data.organization_name || "",
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
        logo: data.logo || "",
      });
    }

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("organization_settings")
      .update({
        organization_name: organization.organization_name,
        email: organization.email,
        phone: organization.phone,
        website: organization.website,
        address: organization.address,
        logo: organization.logo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organization.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    alert("Organization updated successfully.");
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 text-xs">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[620px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm overflow-hidden flex flex-col">
      <SectionTitle
        title="Organization"
        subtitle="Manage organization details."
      />
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-br from-[#6B7328] to-[#FFC107] p-3">
          <Building2 className="h-6 w-6 text-white" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {organization.organization_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Organization Settings
          </p>
        </div>
      </div>
      <div
        className="
    flex-1
    overflow-y-auto
    min-h-0
    pr-2
    space-y-4
    text-xs
    scrollbar-thin
    scrollbar-thumb-[#FFC107]
    scrollbar-track-transparent
  "
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Organization Name
          </label>
          <input
            value={organization.organization_name}
            onChange={(e) =>
              setOrganization({
                ...organization,
                organization_name: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Email
          </label>
          <input
            value={organization.email}
            onChange={(e) =>
              setOrganization({
                ...organization,
                email: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Phone
          </label>
          <input
            value={organization.phone}
            onChange={(e) =>
              setOrganization({
                ...organization,
                phone: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Website
          </label>
          <input
            value={organization.website}
            onChange={(e) =>
              setOrganization({
                ...organization,
                website: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Address
          </label>
          <textarea
            rows={3}
            value={organization.address}
            onChange={(e) =>
              setOrganization({
                ...organization,
                address: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
          />
        </div>

        {/* Your Exact Gradient Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
