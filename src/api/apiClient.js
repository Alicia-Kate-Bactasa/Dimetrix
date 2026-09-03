// Dimetrix API Client — fetch-based (Next.js)

const API_BASE = "/api";

export const INITIAL_SEED_INCIDENTS = []; // No longer needed, kept for backward compat

export const apiClient = {
  entities: {
    Incident: {
      list: async (sort = "-created_date", limit = 200) => {
        const res = await fetch(`${API_BASE}/incidents`);
        if (!res.ok) throw new Error("Failed to fetch incidents");
        return res.json();
      },
      create: async (data) => {
        const res = await fetch(`${API_BASE}/incidents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create incident");
        return res.json();
      },
      update: async (id, updates) => {
        const res = await fetch(`${API_BASE}/incidents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update incident");
        return res.json();
      },
      delete: async (id) => {
        const res = await fetch(`${API_BASE}/incidents/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete incident");
        return res.json();
      },
      addConfirmation: async (id) => {
        const res = await fetch(`${API_BASE}/incidents/${id}/confirm`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to confirm incident");
        return res.json();
      },
      flagIncident: async (id, reason = "False Report") => {
        const res = await fetch(`${API_BASE}/incidents/${id}/flag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        });
        if (!res.ok) throw new Error("Failed to flag incident");
        return res.json();
      },
      purgeRestored: async () => {
        const res = await fetch(`${API_BASE}/incidents/purge-restored`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to purge");
        return res.json();
      },
      resetDefaults: async () => {
        const res = await fetch(`${API_BASE}/incidents/seed`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to seed");
        return res.json();
      },
    },
    Identity: {
      create: async (data) => {
        return { id: "id-" + Date.now(), ...data };
      },
    },
  },
  auth: {
    register: async ({ name, email, password }) => {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        let detail = "Registration failed";
        try { detail = (await res.json()).error || detail; } catch (_) {}
        throw new Error(detail);
      }
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_BASE}/user`);
      if (!res.ok) return null;
      return res.json();
    },
    resetPasswordRequest: async (email) => {
      return { success: true, email };
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      return { success: true };
    },
  },
};

export default apiClient;
