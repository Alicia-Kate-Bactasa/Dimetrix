// Dimetrix API Client & Data Provider (Independent & Local)

const getStoredReports = () => {
  try {
    return JSON.parse(localStorage.getItem('dimetrix_user_reports') || '[]');
  } catch (e) {
    return [];
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
          ...data
        };
        const updated = [created, ...stored];
        try {
          localStorage.setItem('dimetrix_user_reports', JSON.stringify(updated));
        } catch (e) {}
        return created;
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
        role: 'admin'
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
