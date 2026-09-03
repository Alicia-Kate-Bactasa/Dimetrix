"use client";
// Auth protection is handled by middleware.js
// This component is kept for backward compatibility
export default function ProtectedRoute({ children }) {
  return children || null;
}
