"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { TrendingUp, Smile, Frown, Meh, Target, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgressPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    {
      value: "great",
      icon: Smile,
      label: "Great",
      borderClass: "border-success",
      bgClass: "bg-success/10",
      iconClass: "text-success"
    },
    {
      value: "good",
      icon: Smile,
      label: "Good",
      borderClass: "border-primary",
      bgClass: "bg-primary/10",
      iconClass: "text-primary"
    },
    {
      value: "okay",
      icon: Meh,
      label: "Okay",
      borderClass: "border-secondary",
      bgClass: "bg-secondary/10",
      iconClass: "text-secondary"
    },
    {
      value: "bad",
      icon: Frown,
      label: "Bad",
      borderClass: "border-accent",
      bgClass: "bg-accent/10",
      iconClass: "text-accent"
    },
    {
      value: "terrible",
      icon: Frown,
      label: "Terrible",
      borderClass: "border-primary",
      bgClass: "bg-primary/10",
      iconClass: "text-primary"
    },
  ];

  const moodHistory = [
    { date: "Mon", mood: "good" },
    { date: "Tue", mood: "great" },
    { date: "Wed", mood: "good" },
    { date: "Thu", mood: "okay" },
    { date: "Fri", mood: "good" },
    { date: "Sat", mood: "great" },
    { date: "Sun", mood: "good" },
  ];

  const goals = [
    { id: 1, text: "Practice breathing exercises daily", completed: true },
    { id: 2, text: "Journal for 10 minutes each evening", completed: true },
    { id: 3, text: "Attend all therapy sessions", completed: false },
    { id: 4, text: "Exercise 3 times per week", completed: false },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Progress</h1>
          <p className="text-text-secondary">Track your mental health journey</p>
        </div>

        {/* Mood Tracker */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">How are you feeling today?</h2>
          
          {/* Mood Selector */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMood === mood.value
                    ? `${mood.borderClass} ${mood.bgClass}`
                    : "border-border hover:border-primary/50"
                }`}
              >
                <mood.icon
                  size={32}
                  className={selectedMood === mood.value ? mood.iconClass : "text-text-secondary"}
                />
                <span className="text-sm font-medium text-foreground">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Week Overview */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">This Week</h3>
            <div className="grid grid-cols-7 gap-2">
              {moodHistory.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-text-secondary mb-2">{day.date}</div>
                  <div className="w-full aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                    <Smile className="text-primary" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">My Goals</h2>
            </div>
            <Button size="sm" variant="outline">
              <Plus size={16} className="mr-1" />
              Add Goal
            </Button>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {goals.map((goal) => (
              <label
                key={goal.id}
                className="flex items-center gap-3 p-4 bg-background rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    goal.completed
                      ? "bg-success border-success"
                      : "border-border"
                  }`}
                >
                  {goal.completed && <Check className="text-background" size={16} />}
                </div>
                <span
                  className={`flex-1 ${
                    goal.completed
                      ? "text-text-secondary line-through"
                      : "text-foreground"
                  }`}
                >
                  {goal.text}
                </span>
              </label>
            ))}
          </div>

          {/* Progress Stats */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {goals.filter((g) => g.completed).length}/{goals.length}
                </div>
                <div className="text-sm text-text-secondary">Goals Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-sm text-text-secondary">Days Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-text-secondary">Positive Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
