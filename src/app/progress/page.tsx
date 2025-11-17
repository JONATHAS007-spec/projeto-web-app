"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Save, Zap, Moon, Droplet, Smile, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    energy_level: 50,
    skin_quality: 50,
    sleep_quality: 50,
    hydration: 50,
    mood: 50,
    notes: "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Verificar se já existe registro hoje
      const { data: existing } = await supabase
        .from("progress_tracking")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (existing) {
        // Atualizar registro existente
        await supabase
          .from("progress_tracking")
          .update(formData)
          .eq("id", existing.id);
      } else {
        // Criar novo registro
        await supabase.from("progress_tracking").insert({
          user_id: user.id,
          date: today,
          ...formData,
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Registrar Progresso</h1>
              <p className="text-gray-600">Como você está se sentindo hoje?</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Energy Level */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pink-500" />
                  <label className="font-semibold text-gray-900">Nível de Energia</label>
                </div>
                <span className="text-2xl font-bold text-pink-500">{formData.energy_level}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.energy_level}
                onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Baixa</span>
                <span>Média</span>
                <span>Alta</span>
              </div>
            </div>

            {/* Skin Quality */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <label className="font-semibold text-gray-900">Qualidade da Pele</label>
                </div>
                <span className="text-2xl font-bold text-purple-500">{formData.skin_quality}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.skin_quality}
                onChange={(e) => setFormData({ ...formData, skin_quality: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Precisa cuidados</span>
                <span>Normal</span>
                <span>Radiante</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <label className="font-semibold text-gray-900">Qualidade do Sono</label>
                </div>
                <span className="text-2xl font-bold text-indigo-500">{formData.sleep_quality}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sleep_quality}
                onChange={(e) => setFormData({ ...formData, sleep_quality: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Ruim</span>
                <span>Regular</span>
                <span>Excelente</span>
              </div>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  <label className="font-semibold text-gray-900">Hidratação</label>
                </div>
                <span className="text-2xl font-bold text-blue-500">{formData.hydration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.hydration}
                onChange={(e) => setFormData({ ...formData, hydration: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Desidratada</span>
                <span>Moderada</span>
                <span>Bem hidratada</span>
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-teal-500" />
                  <label className="font-semibold text-gray-900">Humor</label>
                </div>
                <span className="text-2xl font-bold text-teal-500">{formData.mood}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Baixo</span>
                <span>Neutro</span>
                <span>Ótimo</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-gray-900 mb-3 block">Observações (opcional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Como foi seu dia? Alguma observação especial?"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                rows={4}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Progresso
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
