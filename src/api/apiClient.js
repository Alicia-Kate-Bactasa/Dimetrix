// Dimetrix API Client & Data Provider (Independent & Local)

export const INITIAL_SEED_INCIDENTS = [
  {
    id: "inc-official-meco-01",
    title: "Official Advisory — Lapu-Lapu City Center",
    type: "power_outage",
    status: "active",
    severity: "critical",
    area: "Lapu-Lapu City",
    barangay: "Basak",
    provider: "Mactan Grid",
    source_type: "official",
    verification_status: "official",
    source_url: "https://facebook.com/advisory-2026-09-01",
    description: "Utility crew dispatched for feeder tripoff impacting Basak, Gun-ob, and Pajo. Estimated restoration: 3 hours.",
    affected_households: 2800,
    verified: true,
    confirmations_count: 34,
    flag_count: 0,
    created_date: new Date(Date.now() - 1800000).toISOString(),
    start_time: new Date(Date.now() - 1800000).toISOString(),
    latitude: 10.3103,
    longitude: 124.0144
  },
  {
    id: "inc-official-veco-02",
    title: "Official Maintenance Advisory — Mandaue Industrial Sector",
    type: "scheduled_brownout",
    status: "scheduled",
    severity: "medium",
    area: "Mandaue City",
    barangay: "Subangdaku",
    provider: "Metro Grid",
    source_type: "official",
    verification_status: "official",
    source_url: "https://advisories.local/mandaue-sep04",
    description: "Scheduled distribution line maintenance along A.S. Fortuna St corridor from 9:00 AM to 5:00 PM.",
    affected_households: 1550,
    verified: true,
    confirmations_count: 18,
    flag_count: 0,
    created_date: new Date(Date.now() - 7200000).toISOString(),
    start_time: new Date(Date.now() - 7200000).toISOString(),
    latitude: 10.3301,
    longitude: 123.9392
  },
  {
    id: "inc-community-101",
    title: "Unscheduled Power Outage near IT Park Lahug",
    type: "power_outage",
    status: "active",
    severity: "high",
    area: "Cebu City",
    barangay: "Lahug",
    provider: "Metro Grid",
    source_type: "community",
    verification_status: "verified",
    reporter_name: "Alicia Bactasa",
    description: "Sparks observed on pole transformer near Salinas Drive entrance. Entire block out of power.",
    affected_households: 420,
    verified: true,
    confirmations_count: 14,
    flag_count: 0,
    created_date: new Date().toISOString(),
    start_time: new Date().toISOString(),
    latitude: 10.328,
    longitude: 123.905
  },
  {
    id: "inc-community-102",
    title: "Low Voltage Anomaly in Banilad Residential Area",
    type: "voltage_fluctuation",
    status: "ongoing",
    severity: "medium",
    area: "Cebu City",
    barangay: "Banilad",
    provider: "Metro Grid",
    source_type: "community",
    verification_status: "unverified",
    reporter_name: "Neighbor User",
    description: "Frequent brownout flickers and line voltage dropping below 180V across 3 street blocks.",
    affected_households: 180,
    verified: false,
    confirmations_count: 5,
    flag_count: 0,
    created_date: new Date(Date.now() - 3600000).toISOString(),
    start_time: new Date(Date.now() - 3600000).toISOString(),
    latitude: 10.342,
    longitude: 123.912
  },
  {
    id: "inc-community-103",
    title: "Fallen Pole blocking Cordova Access Road",
    type: "fallen_pole",
    status: "active",
    severity: "high",
    area: "Cordova",
    barangay: "Poblacion",
    provider: "Mactan Grid",
    source_type: "community",
    verification_status: "verified",
    reporter_name: "Barangay Watch",
    description: "Utility pole leaned over roadway following heavy gust. Emergency hotline notified.",
    affected_households: 310,
    verified: true,
    confirmations_count: 9,
    flag_count: 0,
    created_date: new Date(Date.now() - 5400000).toISOString(),
    start_time: new Date(Date.now() - 5400000).toISOString(),
    latitude: 10.2520,
    longitude: 123.9480
  },
  {
    id: "inc-community-104",
    title: "Power Restored in Guadalupe Block 4",
    type: "power_outage",
    status: "restored",
    severity: "low",
    area: "Cebu City",
    barangay: "Guadalupe",
    provider: "Metro Grid",
    source_type: "community",
    verification_status: "verified",
    reporter_name: "Resident Mod",
    description: "Main line fuse replaced; grid stability restored.",
    affected_households: 250,
    verified: true,
    confirmations_count: 8,
    flag_count: 0,
    created_date: new Date(Date.now() - 18000000).toISOString(),
    start_time: new Date(Date.now() - 18000000).toISOString(),
    latitude: 10.321,
    longitude: 123.882
  }
];

const getStoredReports = () => {
  try {
    const raw = localStorage.getItem('dimetrix_user_reports');
    if (!raw) {
      localStorage.setItem('dimetrix_user_reports', JSON.stringify(INITIAL_SEED_INCIDENTS));
      return INITIAL_SEED_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SEED_INCIDENTS;
  }
};

const saveReports = (reports) => {
  try {
    localStorage.setItem('dimetrix_user_reports', JSON.stringify(reports));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
};

const getStoredIdentities = () => {
  try {
    return JSON.parse(localStorage.getItem('dimetrix_identities') || '[]');
  } catch (e) {
    return [];
  }
};

export const apiClient = {
  entities: {
    Incident: {
      list: async (sort = "-created_date", limit = 200) => {
        const local = getStoredReports();
        return local;
      },
      create: async (data) => {
        const stored = getStoredReports();
        
        const created = {
          id: data.id || "inc-" + Date.now(),
          created_date: new Date().toISOString(),
          start_time: data.start_time || new Date().toISOString(),
          source_type: data.source_type || "community",
          verification_status: data.verification_status || (data.verified ? "verified" : "unverified"),
          confirmations_count: data.confirmations_count || 1,
          flag_count: 0,
          ...data
        };

        const updated = [created, ...stored.filter(i => i.id !== created.id)];
        saveReports(updated);
        return created;
      },
      update: async (id, updates) => {
        const stored = getStoredReports();
        let updatedItem = null;
        const updated = stored.map((item) => {
          if (item.id === id) {
            updatedItem = { ...item, ...updates };
            return updatedItem;
          }
          return item;
        });
        saveReports(updated);
        return updatedItem;
      },
      delete: async (id) => {
        const stored = getStoredReports();
        const filtered = stored.filter((i) => i.id !== id);
        saveReports(filtered);
        return { success: true, id };
      },
      addConfirmation: async (id) => {
        const stored = getStoredReports();
        let target = null;
        const updated = stored.map((item) => {
          if (item.id === id) {
            const count = (item.confirmations_count || 1) + 1;
            target = { ...item, confirmations_count: count };
            return target;
          }
          return item;
        });
        saveReports(updated);
        return target;
      },
      flagIncident: async (id, reason = "False Report") => {
        const stored = getStoredReports();
        let target = null;
        const updated = stored.map((item) => {
          if (item.id === id) {
            const flags = (item.flag_count || 0) + 1;
            target = { ...item, flag_count: flags };
            return target;
          }
          return item;
        });
        saveReports(updated);
        return target;
      },
      purgeRestored: async () => {
        const stored = getStoredReports();
        const filtered = stored.filter((i) => i.status !== "restored");
        saveReports(filtered);
        return filtered;
      },
      resetDefaults: async () => {
        saveReports(INITIAL_SEED_INCIDENTS);
        return INITIAL_SEED_INCIDENTS;
      }
    },
    Identity: {
      create: async (data) => {
        const stored = getStoredIdentities();
        const created = {
          id: "id-" + Date.now(),
          created_date: new Date().toISOString(),
          ...data
        };
        const updated = [created, ...stored];
        try {
          localStorage.setItem('dimetrix_identities', JSON.stringify(updated));
        } catch (e) {}
        return created;
      }
    }
  },
  auth: {
    me: async () => {
      try {
        const user = localStorage.getItem('dimetrix_user');
        if (user) return JSON.parse(user);
      } catch (e) {}
      return {
        id: 'usr-dev-01',
        email: 'alicia@dimetrix.io',
        full_name: 'Alicia Bactasa',
        role: 'admin',
        is_verified: true
      };
    },
    resetPasswordRequest: async (email) => {
      return { success: true, email };
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      return { success: true };
    }
  }
};

export default apiClient;
