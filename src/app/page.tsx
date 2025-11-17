"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, Heart, Calendar, TrendingUp, Award, Users, BookOpen, Smile, Sun, Moon, Bell, ChevronRight, Play, Lock, Check, Star, Zap, Target, Activity, Brain, Droplet } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-teal-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
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
            <div className="hidden md:flex items-center gap-6">
              <a href="#recursos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Recursos</a>
              <a href="#planos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Planos</a>
              <a href="#comunidade" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Comunidade</a>
              <a href="#sobre" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Sobre</a>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/auth")}
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Entrar
              </button>
              <button 
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-teal-100/50 animate-pulse"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-8 shadow-2xl animate-bounce">
              <Sparkles className="w-20 h-20 text-white" />
            </div>
          </div>
          
          <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
            <span className="text-purple-700 font-semibold text-sm">✨ Mais de 100.000 mulheres transformadas</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-6 leading-tight">
            Viva Radiante
          </h1>
          
          <p className="text-2xl md:text-4xl text-gray-800 font-semibold mb-4">
            Seu app de longevidade e bem-estar feminino
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Rotinas personalizadas com IA, acompanhamento inteligente e conteúdo especializado 
            para você se sentir mais confiante, saudável e radiante em qualquer idade.
          </p>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className="w-7 h-7 fill-pink-400 text-pink-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-gray-800 font-bold text-xl">4.9</span>
            <span className="text-gray-600 font-medium">• 50K+ avaliações</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => router.push("/auth")}
              className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Começar Jornada Gratuita
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-purple-200 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Ver Demo (2 min)
            </button>
          </div>

          <p className="text-sm text-gray-500">✓ Sem cartão de crédito • ✓ Cancele quando quiser • ✓ Dados protegidos (LGPD)</p>

          <div className="mt-12 flex flex-wrap justify-center gap-6 items-center opacity-60">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Dados Seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">LGPD Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Aprovado por Especialistas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Resultados que falam por si
            </h2>
            <p className="text-xl text-gray-600">
              Milhares de mulheres já transformaram suas vidas com o Viva Radiante
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">100K+</div>
              <p className="text-xl text-gray-700 font-semibold">Mulheres Ativas</p>
              <p className="text-sm text-gray-500 mt-2">Em todo o Brasil</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-teal-500 bg-clip-text text-transparent mb-2">2M+</div>
              <p className="text-xl text-gray-700 font-semibold">Rotinas Completadas</p>
              <p className="text-sm text-gray-500 mt-2">E contando</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-6xl font-bold bg-gradient-to-r from-teal-500 to-pink-500 bg-clip-text text-transparent mb-2">95%</div>
              <p className="text-xl text-gray-700 font-semibold">Satisfação</p>
              <p className="text-sm text-gray-500 mt-2">Recomendariam</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">4.9★</div>
              <p className="text-xl text-gray-700 font-semibold">Avaliação Média</p>
              <p className="text-sm text-gray-500 mt-2">50K+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-500 via-purple-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Comece sua jornada de transformação hoje
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
            Junte-se a milhares de mulheres que já estão vivendo com mais saúde, 
            confiança e radiância em todas as fases da vida.
          </p>
          <button 
            onClick={() => router.push("/auth")}
            className="group bg-white text-purple-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Começar Agora - É Grátis!
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/90 mt-6 text-lg">✓ Sem cartão de crédito • ✓ Cancele quando quiser • ✓ Teste grátis por 7 dias</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Viva Radiante</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                O app de longevidade e bem-estar feminino mais completo do Brasil. 
                Transforme sua vida com rotinas personalizadas e conteúdo especializado.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Produto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Recursos</li>
                <li className="hover:text-white cursor-pointer transition-colors">Planos</li>
                <li className="hover:text-white cursor-pointer transition-colors">Comunidade</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Empresa</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Sobre Nós</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-white cursor-pointer transition-colors">Especialistas</li>
                <li className="hover:text-white cursor-pointer transition-colors">Carreiras</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Suporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Central de Ajuda</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contato</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacidade (LGPD)</li>
                <li className="hover:text-white cursor-pointer transition-colors">Termos de Uso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                © 2024 Viva Radiante. Todos os direitos reservados.
              </p>
              <div className="flex gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
