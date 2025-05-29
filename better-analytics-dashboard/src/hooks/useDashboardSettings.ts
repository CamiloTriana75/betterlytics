"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { DashboardSettings, DashboardSettingsUpdate } from "@/entities/dashboardSettings";
import { getDashboardSettingsAction, updateDashboardSettingsAction, resetDashboardSettingsAction } from "@/app/actions/dashboardSettings";

interface UseDashboardSettingsReturn {
  settings: DashboardSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  updateSetting: <K extends keyof DashboardSettingsUpdate>(key: K, value: DashboardSettingsUpdate[K]) => void;
  saveSettings: (newSettings?: Partial<DashboardSettingsUpdate>) => Promise<{ success: boolean }>;
  resetSettings: () => Promise<{ success: boolean }>;
  refreshSettings: () => Promise<void>;
}

export function useDashboardSettings(dashboardId: string): UseDashboardSettingsReturn {
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState<DashboardSettingsUpdate>({});
  const [isSaving, startTransition] = useTransition();

  const loadDashboardSettings = async () => {
    try {
      setIsLoading(true);
      const dashboardSettings = await getDashboardSettingsAction(dashboardId);
      setSettings(dashboardSettings);
      setPendingUpdates({});
    } catch (error) {
      console.error("Failed to load dashboard settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardId) {
      loadDashboardSettings();
    }
  }, [dashboardId]);

  const updateSetting = <K extends keyof DashboardSettingsUpdate>(
    key: K, 
    value: DashboardSettingsUpdate[K]
  ) => {
    setPendingUpdates(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (newSettings?: Partial<DashboardSettingsUpdate>): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const settingsToSave = newSettings || pendingUpdates;
          const updatedSettings = await updateDashboardSettingsAction(dashboardId, settingsToSave);
          setSettings(updatedSettings);
          setPendingUpdates({});
          resolve({ success: true });
        } catch (error) {
          console.error("Failed to save dashboard settings:", error);
          resolve({ success: false });
        }
      });
    });
  };

  const resetSettings = async (): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const resetSettings = await resetDashboardSettingsAction(dashboardId);
          setSettings(resetSettings);
          setPendingUpdates({});
          resolve({ success: true });
        } catch (error) {
          console.error("Failed to reset dashboard settings:", error);
          resolve({ success: false });
        }
      });
    });
  };

  const refreshSettings = async () => {
    await loadDashboardSettings();
  };

  const effectiveSettings = useMemo(() => {
    return settings ? { ...settings, ...pendingUpdates } : null;
  }, [settings, pendingUpdates]);

  return {
    settings: effectiveSettings,
    isLoading,
    isSaving,
    updateSetting,
    saveSettings,
    resetSettings,
    refreshSettings,
  };
} 