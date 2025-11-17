"use client";

import { useEffect, useState } from "react";
import { supabase, type Profile, type DailyRoutine, type ProgressTracking, type Achievement } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Sparkles, LogOut, User, Calendar, TrendingUp, Award, 
  Sun, Moon, Bell, Droplet, Smile, Zap, Target, Check,
  ChevronRight, Heart, Brain, Activity
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayRoutines, setTodayRoutines] = useState<DailyRoutine[]>([]);
  const [latestProgress, setLatestProgress] = useState<ProgressTracking | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

      // Carregar rotinas de hoje
      const today = new Date().toISOString().split("T")[0];
      const { data: routinesData } = await supabase
        .from("daily_routines")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .order("time_of_day");

      if (routinesData) {
        setTodayRoutines(routinesData);
      } else {
        // Criar rotinas padrão se não existirem
        await createDefaultRoutines(user.id, today);
      }

      // Carregar progresso mais recente
      const { data: progressData } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (progressData) {
        setLatestProgress(progressData);
      }

      // Carregar conquistas
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (achievementsData) {
        setAchievements(achievementsData);
        const points = achievementsData.reduce((sum, a) => sum + (a.completed ? a.points : 0), 0);
        setTotalPoints(points);
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultRoutines = async (userId: string, date: string) => {
    const defaultRoutines = [
      { task_name: "Hidratação matinal (500ml)", task_type: "hydration", time_of_day: "morning" },
      { task_name: "Skincare completo (7 passos)", task_type: "skincare", time_of_day: "morning" },
      { task_name: "Exercícios faciais (10 min)", task_type: "exercise", time_of_day: "afternoon" },
      { task_name: "Momento mindfulness", task_type: "mindfulness", time_of_day: "evening" },
      { task_name: "Rotina noturna de pele", task_type: "skincare", time_of_day: "night" },
    ];

    for (const routine of defaultRoutines) {
      await supabase.from("daily_routines").insert({
        user_id: userId,
        date,
        ...routine,
      });
    }

    loadData();
  };

  const toggleRoutine = async (routineId: string, completed: boolean) => {
    await supabase
      .from("daily_routines")
      .update({ completed: !completed })
      .eq("id", routineId);

    loadData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  const completedRoutines = todayRoutines.filter(r => r.completed).length;
  const progressPercentage = todayRoutines.length > 0 ? (completedRoutines / todayRoutines.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Viva Radiante</h1>
                <p className="text-sm text-gray-600">Olá, {profile?.full_name || "Usuária"}! 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => router.push("/profile")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Routines */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sun className="w-8 h-8 text-yellow-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Rotina de Hoje</h2>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {todayRoutines.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => toggleRoutine(routine.id, routine.completed)}
                    className={`p-4 rounded-xl flex items-center justify-between border-2 hover:shadow-lg transition-all cursor-pointer ${
                      routine.completed
                        ? "bg-green-50 border-green-300"
                        : "bg-purple-50 border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={routine.completed}
                        onChange={() => {}}
                        className="w-6 h-6 rounded-full cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        {routine.task_type === "hydration" && <Droplet className="w-5 h-5 text-blue-500" />}
                        {routine.task_type === "skincare" && <Sparkles className="w-5 h-5 text-pink-500" />}
                        {routine.task_type === "exercise" && <Activity className="w-5 h-5 text-purple-500" />}
                        {routine.task_type === "mindfulness" && <Brain className="w-5 h-5 text-indigo-500" />}
                        <div>
                          <p className="font-semibold text-gray-900">{routine.task_name}</p>
                          <p className="text-sm text-gray-600 capitalize">{routine.time_of_day === "morning" ? "Manhã" : routine.time_of_day === "afternoon" ? "Tarde" : routine.time_of_day === "evening" ? "Noite" : "Madrugada"}</p>
                        </div>
                      </div>
                    </div>
                    {routine.completed && <Check className="w-5 h-5 text-green-600" />}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Progresso de Hoje</p>
                    <p className="text-sm text-gray-600">{completedRoutines} de {todayRoutines.length} tarefas concluídas</p>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Progress Dashboard */}
            {latestProgress && (
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Seu Progresso</h3>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="space-y-5">
                  {[
                    { label: "Energia", value: latestProgress.energy_level, color: "pink", icon: <Zap className="w-4 h-4" /> },
                    { label: "Qualidade da Pele", value: latestProgress.skin_quality, color: "purple", icon: <Sparkles className="w-4 h-4" /> },
                    { label: "Qualidade do Sono", value: latestProgress.sleep_quality, color: "indigo", icon: <Moon className="w-4 h-4" /> },
                    { label: "Hidratação", value: latestProgress.hydration, color: "blue", icon: <Droplet className="w-4 h-4" /> },
                    { label: "Humor", value: latestProgress.mood, color: "teal", icon: <Smile className="w-4 h-4" /> },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`text-${item.color}-500`}>{item.icon}</div>
                          <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                        </div>
                        <span className={`text-sm font-bold text-${item.color}-500`}>{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r from-${item.color}-400 to-${item.color}-500 h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Points Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Seus Pontos</h3>
                <Award className="w-8 h-8" />
              </div>
              <div className="text-5xl font-bold mb-2">{totalPoints.toLocaleString()}</div>
              <p className="text-white/90">pontos acumulados</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4" />
                <span>Nível Diamante</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Conquistas</h3>
              <div className="space-y-3">
                {achievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 ${
                      achievement.completed
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">{achievement.achievement_name}</p>
                      {achievement.completed && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {achievement.progress}/{achievement.target} • {achievement.points} pts
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Ver Todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push("/progress")}
                  className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-left font-semibold text-gray-900 transition-colors flex items-center justify-between"
                >
                  <span>Registrar Progresso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full p-3 bg-pink-50 hover:bg-pink-100 rounded-xl text-left font-semibold text-gray-900 transition-colors flex items-center justify-between">
                  <span>Conteúdo Premium</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full p-3 bg-teal-50 hover:bg-teal-100 rounded-xl text-left font-semibold text-gray-900 transition-colors flex items-center justify-between">
                  <span>Comunidade</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
