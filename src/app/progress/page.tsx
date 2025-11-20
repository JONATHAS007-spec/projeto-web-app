"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ArrowLeft, Save, Zap, Moon, Droplet, 
  Smile, TrendingUp, Calendar 
} from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    energyLevel: 50,
    skinQuality: 50,
    sleepQuality: 50,
    hydration: 50,
    mood: 50,
    notes: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      } else {
        setUserId(user.id);
        loadTodayProgress(user.id);
      }
    };
    checkAuth();
  }, [router]);

  const loadTodayProgress = async (userId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("progress_tracking")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (data) {
      setFormData({
        energyLevel: data.energy_level,
        skinQuality: data.skin_quality,
        sleepQuality: data.sleep_quality,
        hydration: data.hydration,
        mood: data.mood,
        notes: data.notes || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Verificar se já existe progresso para hoje
      const { data: existing } = await supabase
        .from("progress_tracking")
        .select("id")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        // Atualizar
        await supabase
          .from("progress_tracking")
          .update({
            energy_level: formData.energyLevel,
            skin_quality: formData.skinQuality,
            sleep_quality: formData.sleepQuality,
            hydration: formData.hydration,
            mood: formData.mood,
            notes: formData.notes,
          })
          .eq("id", existing.id);
      } else {
        // Inserir
        await supabase.from("progress_tracking").insert({
          user_id: userId,
          date: today,
          energy_level: formData.energyLevel,
          skin_quality: formData.skinQuality,
          sleep_quality: formData.sleepQuality,
          hydration: formData.hydration,
          mood: formData.mood,
          notes: formData.notes,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      label: "Nível de Energia",
      value: formData.energyLevel,
      key: "energyLevel",
      icon: <Zap className="w-5 h-5" />,
      color: "pink",
    },
    {
      label: "Qualidade da Pele",
      value: formData.skinQuality,
      key: "skinQuality",
      icon: <Sparkles className="w-5 h-5" />,
      color: "purple",
    },
    {
      label: "Qualidade do Sono",
      value: formData.sleepQuality,
      key: "sleepQuality",
      icon: <Moon className="w-5 h-5" />,
      color: "indigo",
    },
    {
      label: "Hidratação",
      value: formData.hydration,
      key: "hydration",
      icon: <Droplet className="w-5 h-5" />,
      color: "blue",
    },
    {
      label: "Humor",
      value: formData.mood,
      key: "mood",
      icon: <Smile className="w-5 h-5" />,
      color: "teal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold text-gray-900">
                Registrar Progresso
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Como você está hoje?</h2>
            </div>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {metrics.map((metric) => (
              <div key={metric.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`text-${metric.color}-500`}>{metric.icon}</div>
                    <label className="font-semibold text-gray-900">
                      {metric.label}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold text-${metric.color}-500`}>
                      {metric.value}
                    </span>
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metric.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [metric.key]: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      var(--tw-gradient-from) 0%, 
                      var(--tw-gradient-to) ${metric.value}%, 
                      #e5e7eb ${metric.value}%, 
                      #e5e7eb 100%)`,
                    "--tw-gradient-from": `var(--${metric.color}-400)`,
                    "--tw-gradient-to": `var(--${metric.color}-500)`,
                  } as React.CSSProperties}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito Baixo</span>
                  <span>Excelente</span>
                </div>
              </div>
            ))}

            <div>
              <label className="block font-semibold text-gray-900 mb-3">
                Observações (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                rows={4}
                placeholder="Como foi seu dia? Alguma observação importante?"
              />
            </div>

            {success && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-sm text-green-600 font-semibold text-center">
                  ✓ Progresso salvo com sucesso! Redirecionando...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Progresso
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
