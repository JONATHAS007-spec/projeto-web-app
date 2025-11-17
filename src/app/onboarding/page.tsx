"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age_range: "",
    main_goal: "",
    activity_level: "",
    skin_type: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id);

      if (error) throw error;

      // Criar conquistas iniciais
      const achievements = [
        { achievement_name: "7 Dias de Autocuidado", achievement_type: "streak", points: 500, target: 7 },
        { achievement_name: "30 Dias de Pele Saudável", achievement_type: "skincare", points: 1000, target: 30 },
        { achievement_name: "Desafio do Sono", achievement_type: "sleep", points: 750, target: 21 },
        { achievement_name: "Hidratação Master", achievement_type: "hydration", points: 600, target: 14 },
      ];

      for (const achievement of achievements) {
        await supabase.from("achievements").insert({
          user_id: user.id,
          ...achievement,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Viva Radiante
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            Vamos personalizar sua experiência
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Passo {step} de 4</span>
              <span className="text-sm font-semibold text-purple-600">{(step / 4) * 100}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Age Range */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Qual sua faixa etária?</h2>
              <p className="text-gray-600 mb-6">Isso nos ajuda a personalizar suas rotinas</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "18-30", label: "18-30 anos", emoji: "🌸" },
                  { value: "31-45", label: "31-45 anos", emoji: "✨" },
                  { value: "46-60", label: "46-60 anos", emoji: "💫" },
                  { value: "60+", label: "60+ anos", emoji: "🌟" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, age_range: option.value })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.age_range === option.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="font-semibold text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Main Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Qual seu objetivo principal?</h2>
              <p className="text-gray-600 mb-6">Escolha o que mais importa para você agora</p>
              <div className="space-y-3">
                {[
                  { value: "skin_health", label: "Saúde da Pele", desc: "Rotina de skincare e cuidados" },
                  { value: "energy_vitality", label: "Energia e Vitalidade", desc: "Mais disposição no dia a dia" },
                  { value: "stress_management", label: "Gestão de Estresse", desc: "Mindfulness e bem-estar mental" },
                  { value: "body_wellness", label: "Bem-estar Corporal", desc: "Exercícios e postura" },
                  { value: "complete_longevity", label: "Longevidade Completa", desc: "Abordagem 360° integrada" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, main_goal: option.value })}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      formData.main_goal === option.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Qual seu nível de atividade?</h2>
              <p className="text-gray-600 mb-6">Isso ajuda a ajustar suas rotinas</p>
              <div className="space-y-3">
                {[
                  { value: "sedentary", label: "Sedentário", desc: "Pouca ou nenhuma atividade física" },
                  { value: "light", label: "Leve", desc: "Exercícios leves 1-2x por semana" },
                  { value: "moderate", label: "Moderado", desc: "Exercícios 3-4x por semana" },
                  { value: "active", label: "Ativo", desc: "Exercícios 5-6x por semana" },
                  { value: "very_active", label: "Muito Ativo", desc: "Exercícios diários intensos" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, activity_level: option.value })}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      formData.activity_level === option.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Skin Type */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Qual seu tipo de pele?</h2>
              <p className="text-gray-600 mb-6">Para recomendações personalizadas</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "normal", label: "Normal", emoji: "😊" },
                  { value: "dry", label: "Seca", emoji: "🌵" },
                  { value: "oily", label: "Oleosa", emoji: "✨" },
                  { value: "combination", label: "Mista", emoji: "🌓" },
                  { value: "sensitive", label: "Sensível", emoji: "🌸" },
                  { value: "not_sure", label: "Não sei", emoji: "🤔" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, skin_type: option.value })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.skin_type === option.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="font-semibold text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            <button
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={
                (step === 1 && !formData.age_range) ||
                (step === 2 && !formData.main_goal) ||
                (step === 3 && !formData.activity_level) ||
                (step === 4 && !formData.skin_type) ||
                loading
              }
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Salvando..." : step === 4 ? "Finalizar" : "Próximo"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
