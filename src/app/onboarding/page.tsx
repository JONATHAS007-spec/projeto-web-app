"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  {
    title: "Qual é a sua faixa etária?",
    field: "age_range",
    options: [
      { value: "18-30", label: "18-30 anos", emoji: "🌸" },
      { value: "31-45", label: "31-45 anos", emoji: "🌺" },
      { value: "46-60", label: "46-60 anos", emoji: "🌻" },
      { value: "60+", label: "60+ anos", emoji: "🌹" },
    ],
  },
  {
    title: "Qual é o seu principal objetivo?",
    field: "main_goal",
    options: [
      { value: "longevity", label: "Longevidade e Saúde", emoji: "💪" },
      { value: "skin_care", label: "Cuidados com a Pele", emoji: "✨" },
      { value: "energy", label: "Mais Energia", emoji: "⚡" },
      { value: "wellness", label: "Bem-estar Geral", emoji: "🧘‍♀️" },
      { value: "weight", label: "Controle de Peso", emoji: "⚖️" },
    ],
  },
  {
    title: "Qual é o seu nível de atividade física?",
    field: "activity_level",
    options: [
      { value: "sedentary", label: "Sedentário", emoji: "🛋️" },
      { value: "light", label: "Leve (1-2x/semana)", emoji: "🚶‍♀️" },
      { value: "moderate", label: "Moderado (3-4x/semana)", emoji: "🏃‍♀️" },
      { value: "active", label: "Ativo (5-6x/semana)", emoji: "💃" },
      { value: "very_active", label: "Muito Ativo (diário)", emoji: "🏋️‍♀️" },
    ],
  },
  {
    title: "Qual é o seu tipo de pele?",
    field: "skin_type",
    options: [
      { value: "normal", label: "Normal", emoji: "😊" },
      { value: "dry", label: "Seca", emoji: "🏜️" },
      { value: "oily", label: "Oleosa", emoji: "💧" },
      { value: "combination", label: "Mista", emoji: "🌓" },
      { value: "sensitive", label: "Sensível", emoji: "🌸" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age_range: "",
    main_goal: "",
    activity_level: "",
    skin_type: "",
  });

  const handleSelect = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            age_range: formData.age_range,
            main_goal: formData.main_goal,
            activity_level: formData.activity_level,
            skin_type: formData.skin_type,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;

        // Criar conquistas iniciais
        await supabase.from("achievements").insert([
          {
            user_id: user.id,
            achievement_name: "Primeira Rotina",
            achievement_type: "routine",
            points: 10,
            progress: 0,
            target: 1,
          },
          {
            user_id: user.id,
            achievement_name: "7 Dias Consecutivos",
            achievement_type: "streak",
            points: 50,
            progress: 0,
            target: 7,
          },
          {
            user_id: user.id,
            achievement_name: "30 Dias de Jornada",
            achievement_type: "streak",
            points: 100,
            progress: 0,
            target: 30,
          },
        ]);

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isStepComplete = formData[currentStepData.field as keyof typeof formData] !== "";
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentStepData.title}
          </h2>

          <div className="grid gap-4">
            {currentStepData.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(currentStepData.field, option.value)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  formData[currentStepData.field as keyof typeof formData] === option.value
                    ? "border-purple-500 bg-purple-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isStepComplete || loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Carregando..."
            ) : currentStep === steps.length - 1 ? (
              <>
                Finalizar
                <Sparkles className="w-5 h-5" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
