'use client';

import { Heart, Flame, Star, Award, TrendingUp, User, Calendar, Loader2, BarChart3, Activity, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Achievement {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  created_at: string;
}

interface Habit {
  id: number;
  title: string;
  completed_today: boolean;
  streak: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect if not authenticated
        return;
      }
      setUser(user);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      // Fetch habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      setAchievements(achievementsData || []);
      setHabits(habitsData || []);
      setLoading(false);
    };

    fetchData();

    // Realtime subscriptions
    const achievementsChannel = supabase
      .channel('achievements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, (payload) => {
        fetchData(); // Refetch on changes
      })
      .subscribe();

    const habitsChannel = supabase
      .channel('habits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, (payload) => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(achievementsChannel);
      supabase.removeChannel(habitsChannel);
    };
  }, [router]);

  // Calculate dynamic progress
  const completionPercentage = useMemo(() => {
    if (achievements.length === 0) return 0;
    const completed = achievements.filter(a => a.completed).length;
    return Math.round((completed / achievements.length) * 100);
  }, [achievements]);

  const totalPoints = useMemo(() => {
    return achievements.reduce((sum, a) => sum + (a.completed ? a.points : 0), 0);
  }, [achievements]);

  const completedAchievements = useMemo(() => {
    return achievements.filter(a => a.completed).length;
  }, [achievements]);

  const activeDays = useMemo(() => {
    // Calculate based on habits completed in last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    return habits.filter(h => h.completed_today).length; // Simplified
  }, [habits]);

  // Chart data for progress over time
  const chartData = useMemo(() => {
    // Mock data for demonstration - in real app, fetch historical data
    return [
      { day: 'Mon', progress: 20 },
      { day: 'Tue', progress: 45 },
      { day: 'Wed', progress: 60 },
      { day: 'Thu', progress: 75 },
      { day: 'Fri', progress: 90 },
      { day: 'Sat', progress: 95 },
      { day: 'Sun', progress: completionPercentage },
    ];
  }, [completionPercentage]);

  // Bar chart data for achievements points
  const barChartData = useMemo(() => {
    return achievements.map(a => ({
      name: a.title.length > 10 ? a.title.substring(0, 10) + '...' : a.title,
      points: a.completed ? a.points : 0,
      completed: a.completed
    }));
  }, [achievements]);

  // Pie chart data for habits completion
  const pieChartData = useMemo(() => {
    const completed = habits.filter(h => h.completed_today).length;
    const notCompleted = habits.length - completed;
    return [
      { name: 'Completados', value: completed, color: '#10b981' },
      { name: 'Pendentes', value: notCompleted, color: '#f59e0b' },
    ];
  }, [habits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 font-inter transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Bem-vindo de volta! Aqui está o seu progresso.</p>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Progresso Hoje */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Progresso Hoje</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionPercentage}%</p>
          </div>

          {/* Pontos Totais */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Pontos Totais</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPoints}</p>
          </div>

          {/* Conquistas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Conquistas</span>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedAchievements}/{achievements.length}
            </p>
          </div>

          {/* Dias Ativos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Dias Ativos</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeDays}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Progresso Semanal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
                <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Achievements Points Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pontos por Conquista</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
                <Bar dataKey="points" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habits Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Status dos Hábitos</h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="md:ml-8 mt-4 md:mt-0">
              {pieChartData.map((entry, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-gray-700 dark:text-gray-300">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ações Rápidas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/habits')}
              className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              Ver Hábitos
            </button>
            <button
              onClick={() => router.push('/achievements')}
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Award className="w-5 h-5" />
              Ver Conquistas
            </button>
          </div>
        </div>

        {/* Lista de Conquistas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Suas Conquistas</h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  achievement.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      achievement.completed ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                    }`}
                  >
                    {achievement.completed ? (
                      <Award className="w-5 h-5 text-white" />
                    ) : (
                      <Flame className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{achievement.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.points} pontos</p>
                  </div>
                </div>
                {achievement.completed && (
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓ Concluído</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Hábitos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Seus Hábitos</h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  habit.completed_today
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      habit.completed_today ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'
                    }`}
                  >
                    {habit.completed_today ? (
                      <Heart className="w-5 h-5 text-white" />
                    ) : (
                      <Flame className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{habit.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sequência: {habit.streak} dias</p>
                  </div>
                </div>
                {habit.completed_today && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">✓ Hoje</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}