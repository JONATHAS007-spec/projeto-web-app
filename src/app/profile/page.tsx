"use client";

import { useState, useEffect } from "react";
import { supabase, type Profile } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Save, User, Mail, Calendar, Target, Activity } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          age_range: profile.age_range,
          main_goal: profile.main_goal,
          activity_level: profile.activity_level,
          skin_type: profile.skin_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <Sparkles className="w-16 h-16 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

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
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Faixa Etária
              </label>
              <select
                value={profile.age_range || ""}
                onChange={(e) => setProfile({ ...profile, age_range: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="18-30">18-30 anos</option>
                <option value="31-45">31-45 anos</option>
                <option value="46-60">46-60 anos</option>
                <option value="60+">60+ anos</option>
              </select>
            </div>

            {/* Main Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Target className="inline w-4 h-4 mr-1" />
                Objetivo Principal
              </label>
              <select
                value={profile.main_goal || ""}
                onChange={(e) => setProfile({ ...profile, main_goal: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="skin_health">Saúde da Pele</option>
                <option value="energy_vitality">Energia e Vitalidade</option>
                <option value="stress_management">Gestão de Estresse</option>
                <option value="body_wellness">Bem-estar Corporal</option>
                <option value="complete_longevity">Longevidade Completa</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Activity className="inline w-4 h-4 mr-1" />
                Nível de Atividade
              </label>
              <select
                value={profile.activity_level || ""}
                onChange={(e) => setProfile({ ...profile, activity_level: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="sedentary">Sedentário</option>
                <option value="light">Leve</option>
                <option value="moderate">Moderado</option>
                <option value="active">Ativo</option>
                <option value="very_active">Muito Ativo</option>
              </select>
            </div>

            {/* Skin Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Sparkles className="inline w-4 h-4 mr-1" />
                Tipo de Pele
              </label>
              <select
                value={profile.skin_type || ""}
                onChange={(e) => setProfile({ ...profile, skin_type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="normal">Normal</option>
                <option value="dry">Seca</option>
                <option value="oily">Oleosa</option>
                <option value="combination">Mista</option>
                <option value="sensitive">Sensível</option>
                <option value="not_sure">Não sei</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
