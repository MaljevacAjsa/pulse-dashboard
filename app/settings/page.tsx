"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Settings {
  notifications: boolean;
  weeklyReports: boolean;
  compactTable: boolean;
}

const defaultSettings: Settings = {
  notifications: true,
  weeklyReports: true,
  compactTable: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("pulse-settings");

    if (savedSettings) {
      try {
        const parsedSettings: Settings = JSON.parse(savedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("pulse-settings", JSON.stringify(settings));
  }, [settings, isLoaded]);

  function toggleSetting(key: keyof Settings) {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8FC] md:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="text-sm font-medium text-violet-600">PREFERENCES</p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">Settings</h1>

            <p className="mt-2 text-gray-500">
              Manage your application preferences.
            </p>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control which updates you want to receive.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive application notifications.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.notifications}
                  onClick={() => toggleSetting("notifications")}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings.notifications ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      settings.notifications ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <h3 className="font-medium text-gray-900">Weekly reports</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Enable weekly analytics reports.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.weeklyReports}
                  onClick={() => toggleSetting("weeklyReports")}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings.weeklyReports ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      settings.weeklyReports ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>

            <p className="mt-1 text-sm text-gray-500">
              Customize how your data is displayed.
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Compact table</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Use a more compact table layout.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.compactTable}
                onClick={() => toggleSetting("compactTable")}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  settings.compactTable ? "bg-violet-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    settings.compactTable ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Reset to default
            </button>
          </div>

          <p className="mt-4 text-right text-xs text-gray-400">
            Your preferences are saved automatically.
          </p>
        </div>
      </main>
    </div>
  );
}
