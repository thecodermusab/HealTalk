import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Building, Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardHome() {
  const platformStats = {
    totalPsychologists: 45,
    activePsychologists: 38,
    pendingApprovals: 7,
    totalPatients: 1234,
    activePatients: 892,
    totalHospitals: 12,
    totalAppointments: 3456,
    thisMonthAppointments: 287,
    totalRevenue: 1567890,
    thisMonthRevenue: 128500,
  };

  const recentActivities = [
    {
      id: 1,
      type: "approval",
      text: "Dr. Ayşe Demir approved",
      time: "2 hours ago",
      icon: CheckCircle,
      bgClass: "bg-success/10",
      iconClass: "text-success"
    },
    {
      id: 2,
      type: "registration",
      text: "New hospital added: Memorial Ankara",
      time: "5 hours ago",
      icon: Building,
      bgClass: "bg-primary/10",
      iconClass: "text-primary"
    },
    {
      id: 3,
      type: "pending",
      text: "3 psychologists awaiting approval",
      time: "Yesterday",
      icon: AlertCircle,
      bgClass: "bg-accent/10",
      iconClass: "text-accent"
    },
  ];

  const topPsychologists = [
    { id: 1, name: "Dr. Ahmet Yılmaz", appointments: 45, rating: 4.8, earnings: 20250 },
    { id: 2, name: "Dr. Ayşe Demir", appointments: 38, rating: 4.9, earnings: 19000 },
    { id: 3, name: "Dr. Mehmet Kaya", appointments: 35, rating: 4.7, earnings: 15750 },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/dashboard/psychologists">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
                {platformStats.pendingApprovals > 0 && (
                  <span className="px-2 py-1 bg-accent text-background text-xs font-semibold rounded-full">
                    {platformStats.pendingApprovals} pending
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {platformStats.totalPsychologists}
              </div>
              <div className="text-sm text-text-secondary">Total Psychologists</div>
              <div className="text-xs text-success mt-1">
                {platformStats.activePsychologists} active
              </div>
            </div>
          </Link>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="text-secondary" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {platformStats.totalPatients.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">Total Patients</div>
            <div className="text-xs text-success mt-1">
              {platformStats.activePatients} active this month
            </div>
          </div>

          <Link href="/admin/dashboard/hospitals">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Building className="text-accent" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {platformStats.totalHospitals}
              </div>
              <div className="text-sm text-text-secondary">Partner Hospitals</div>
            </div>
          </Link>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-success" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {platformStats.totalAppointments.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">Total Appointments</div>
            <div className="text-xs text-success mt-1">
              {platformStats.thisMonthAppointments} this month
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-2xl p-8 mb-8 text-background">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={32} />
            <div>
              <div className="text-sm text-background/80">Total Platform Revenue</div>
              <div className="text-4xl font-bold">₺{platformStats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-background/80">This Month</div>
              <div className="text-xl font-bold">₺{platformStats.thisMonthRevenue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-background/80">Growth</div>
              <div className="text-xl font-bold">+12.5%</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Psychologists */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Top Psychologists This Month</h3>
            <div className="space-y-4">
              {topPsychologists.map((psy, index) => (
                <div key={psy.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{psy.name}</div>
                    <div className="text-sm text-text-secondary">
                      {psy.appointments} appointments • {psy.rating} ★
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">₺{psy.earnings.toLocaleString()}</div>
                    <div className="text-xs text-text-secondary">earnings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bgClass}`}>
                    <activity.icon className={activity.iconClass} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{activity.text}</div>
                    <div className="text-xs text-text-secondary">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
