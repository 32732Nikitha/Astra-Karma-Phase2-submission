import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LoginPage from "./LoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AdminOverview from "./components/admin/AdminOverview";
import IncidentControl from "./components/admin/IncidentControl";
import FraudDetection from "./components/admin/FraudDetection";
import MapMonitoring from "./components/admin/MapMonitoring";
import ReportIncident from "./components/manager/ReportIncident";
import IncidentHistory from "./components/manager/IncidentHistory";
import WorkerDelivery from "./components/worker/WorkerDelivery";

const pageMeta = {
  overview:   { title: "Admin Overview",     subtitle: "Risk Intelligence Dashboard" },
  incidents:  { title: "Incident Control",   subtitle: "Manage reported risk events" },
  fraud:      { title: "Fraud Detection",    subtitle: "Validate payout claims" },
  map:        { title: "Map Monitoring",     subtitle: "Live tracking" },
  report:     { title: "Report Incident",    subtitle: "Submit new curfew or protest" },
  history:    { title: "Incident History",   subtitle: "Your reported events" },
  delivery:   { title: "My Delivery",        subtitle: "Active route and safety" },
};

function Dashboard() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState(
    user?.role === "admin" ? "overview" : user?.role === "manager" ? "report" : "delivery"
  );
  const [newIncidents, setNewIncidents] = useState([]);

  const meta = pageMeta[activeTab] || { title: "DevTrails", subtitle: "" };

  const renderContent = () => {
    if (user?.role === "admin") {
      if (activeTab === "overview")  return <AdminOverview />;
      if (activeTab === "incidents") return <IncidentControl />;
      if (activeTab === "fraud")     return <FraudDetection />;
      if (activeTab === "map")       return <MapMonitoring />;
    }
    if (user?.role === "manager") {
      if (activeTab === "report")    return <ReportIncident onSubmit={(inc) => { setNewIncidents(p => [inc, ...p]); setActiveTab("history"); }} />;
      if (activeTab === "history")   return <IncidentHistory newIncidents={newIncidents} />;
    }
    return <WorkerDelivery />;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 bg-off-white">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function AppInner() {
  const { user } = useApp();
  return user ? <Dashboard /> : <LoginPage />;
}

// THIS IS THE CRITICAL EXPORT FOR main.jsx
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}