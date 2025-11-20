"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Sparkles,
  Heart,
  Calendar,
  TrendingUp,
  Award,
  LogOut,
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  Sunset,
  Star,
  Flame,
  Droplet,
  Brain,
  Smile,
  Plus,
} from "lucide-react";

type Profile = {
  id: string;
  email: string;
  full_name: string;
  age_range: string;
  main_goal: string;
  activity_level: string;
  skin_type: string;
};

type DailyRoutine = {
  id: string;
  user_id: string;
  date: string;
  task_name: string;
  task_type: string;
  completed: boolean;
  time_of_day: string;
};

type Achievement = {
  id: string;
  achievement_name: string;
  achievement_type: string;
  points: number;
  progress: number;
  target: number;
  completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      // Carregar perfil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Carregar rotinas do dia
      const today = new Date().toISOString().split("T")[0];
      const { data: routinesData } = await supabase
        .from("daily_routines")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today);

      if (routinesData && routinesData.length > 0) {
        setRoutines(routinesData);
      } else {
        // Criar rotinas padrão para o dia
        await createDefaultRoutines(user.id, today);
      }

      // Carregar conquistas
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id);

      if (achievementsData) {
        setAchievements(achievementsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultRoutines = async (userId: string, date: string) => {
    const defaultRoutines = [
      { task_name: "Beber 2L de água", task_type: "hydration", time_of_day: "morning" },
      { task_name: "Rotina de skincare matinal", task_type: "skincare", time_of_day: "morning" },
      { task_name: "30 min de exercício", task_type: "exercise", time_of_day: "afternoon" },
      { task_name: "Meditação 10 min", task_type: "wellness", time_of_day: "evening" },
      { task_name: "Rotina de skincare noturna", task_type: "skincare", time_of_day: "night" },
      { task_name: "8h de sono", task_type: "sleep", time_of_day: "night" },
    ];

    const routinesToInsert = defaultRoutines.map((routine) => ({
      user_id: userId,
      date,
      ...routine,
      completed: false,
    }));

    const { data } = await supabase
      .from("daily_routines")
      .insert(routinesToInsert)
      .select();

    if (data) {
      setRoutines(data);
    }
  };

  const toggleRoutine = async (routineId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("daily_routines")
      .update({ completed: !currentStatus })
      .eq("id", routineId);

    if (!error) {
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routineId ? { ...r, completed: !currentStatus } : r
        )
      );

      // Atualizar progresso de conquistas
      updateAchievements();
    }
  };

  const updateAchievements = async () => {
    const completedCount = routines.filter((r) => r.completed).length;
    
    // Atualizar conquista "Primeira Rotina"
    const firstRoutineAchievement = achievements.find(
      (a) => a.achievement_name === "Primeira Rotina"
    );

    if (firstRoutineAchievement && !firstRoutineAchievement.completed && completedCount > 0) {
      await supabase
        .from("achievements")
        .update({ progress: 1, completed: true, completed_at: new Date().toISOString() })
        .eq("id", firstRoutineAchievement.id);
    }

    loadUserData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case "morning":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "afternoon":
        return <Sunset className="w-5 h-5 text-orange-500" />;
      case "evening":
        return <Moon className="w-5 h-5 text-purple-500" />;
      case "night":
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-4 inline-block mb-4 animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <p className="text-xl font-semibold text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  const completedRoutines = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const completionPercentage = totalRoutines > 0 ? (completedRoutines / totalRoutines) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Viva Radiante
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Olá, {profile?.full_name || "Radiante"}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Vamos continuar sua jornada de transformação hoje
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-100 rounded-full p-2">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Progresso Hoje</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{Math.round(completionPercentage)}%</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 rounded-full p-2">
                <Flame className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Sequência</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">1 dia</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 rounded-full p-2">
                <Star className="w-6 h-6 text-teal-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Pontos</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {achievements.reduce((sum, a) => sum + (a.completed ? a.points : 0), 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 rounded-full p-2">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Conquistas</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {achievements.filter((a) => a.completed).length}/{achievements.length}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Routines */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Rotina de Hoje</h2>
                <span className="text-sm font-semibold text-purple-600">
                  {completedRoutines}/{totalRoutines} completas
                </span>
              </div>

              <div className="space-y-3">
                {routines.map((routine) => (
                  <button
                    key={routine.id}
                    onClick={() => toggleRoutine(routine.id, routine.completed)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      routine.completed
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {routine.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            routine.completed ? "text-green-700 line-through" : "text-gray-900"
                          }`}
                        >
                          {routine.task_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getTimeIcon(routine.time_of_day)}
                          <span className="text-sm text-gray-500 capitalize">
                            {routine.time_of_day === "morning" && "Manhã"}
                            {routine.time_of_day === "afternoon" && "Tarde"}
                            {routine.time_of_day === "evening" && "Noite"}
                            {routine.time_of_day === "night" && "Noite"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conquistas</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 ${
                      achievement.completed
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Award
                        className={`w-6 h-6 flex-shrink-0 ${
                          achievement.completed ? "text-yellow-500" : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {achievement.achievement_name}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progresso</span>
                            <span>
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                              style={{
                                width: `${(achievement.progress / achievement.target) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-purple-600 font-semibold mt-2">
                          +{achievement.points} pontos
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
