"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, Heart, Calendar, TrendingUp, Award, Users, BookOpen, Smile, Sun, Moon, Bell, ChevronRight, Play, Lock, Check, Star, Zap, Target, Activity, Brain, Droplet, Shield, Clock, Smartphone } from "lucide-react";

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
                Comecar Gratis
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
            <span className="text-purple-700 font-semibold text-sm">Mais de 100.000 mulheres transformadas</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-6 leading-tight">
            Viva Radiante
          </h1>
          
          <p className="text-2xl md:text-4xl text-gray-800 font-semibold mb-4">
            Seu app de longevidade e bem-estar feminino
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Rotinas personalizadas com IA, acompanhamento inteligente e conteudo especializado 
            para voce se sentir mais confiante, saudavel e radiante em qualquer idade.
          </p>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className="w-7 h-7 fill-pink-400 text-pink-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-gray-800 font-bold text-xl">4.9</span>
            <span className="text-gray-600 font-medium">50K+ avaliacoes</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => router.push("/auth")}
              className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Comecar Jornada Gratuita
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-purple-200 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Ver Demo (2 min)
            </button>
          </div>

          <p className="text-sm text-gray-500">Sem cartao de credito - Cancele quando quiser - Dados protegidos (LGPD)</p>

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
              Milhares de mulheres ja transformaram suas vidas com o Viva Radiante
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
              <p className="text-xl text-gray-700 font-semibold">Satisfacao</p>
              <p className="text-sm text-gray-500 mt-2">Recomendariam</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">4.9</div>
              <p className="text-xl text-gray-700 font-semibold">Avaliacao Media</p>
              <p className="text-sm text-gray-500 mt-2">50K+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section id="recursos" className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Recursos Poderosos para sua Transformacao
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que voce precisa para viver com mais saude, energia e confianca em um unico app
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rotinas com IA</h3>
              <p className="text-gray-600 leading-relaxed">
                Rotinas personalizadas criadas por inteligencia artificial baseadas no seu perfil, objetivos e fase da vida.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-purple-400 to-teal-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Acompanhamento Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitore seu progresso com graficos detalhados, conquistas e insights personalizados sobre sua evolucao.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-teal-400 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Conteudo Especializado</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesso a biblioteca completa com artigos, videos e dicas de especialistas em saude feminina e longevidade.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Metas Personalizadas</h3>
              <p className="text-gray-600 leading-relaxed">
                Defina e acompanhe suas metas de saude, bem-estar e longevidade com lembretes inteligentes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-purple-400 to-teal-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sistema de Conquistas</h3>
              <p className="text-gray-600 leading-relaxed">
                Ganhe badges e recompensas conforme completa desafios e mantem sua consistencia nas rotinas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="bg-gradient-to-br from-teal-400 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">App Intuitivo</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface moderna e facil de usar, sincronizada em todos os seus dispositivos para acessar onde estiver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para Voce
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comece gratuitamente e evolua conforme suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Gratuito */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">R$ 0</div>
                <p className="text-gray-600">Para sempre</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">3 rotinas basicas personalizadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Acompanhamento de progresso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Acesso a comunidade</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Conteudo basico</span>
                </li>
              </ul>
              <button 
                onClick={() => router.push("/auth")}
                className="w-full bg-gray-200 text-gray-900 py-4 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                Comecar Gratis
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                MAIS POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-5xl font-bold text-white mb-2">R$ 29,90</div>
                <p className="text-white/90">por mes</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Rotinas ilimitadas com IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Analises detalhadas de progresso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Biblioteca completa de conteudo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Suporte prioritario</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Acesso antecipado a novos recursos</span>
                </li>
              </ul>
              <button 
                onClick={() => router.push("/auth")}
                className="w-full bg-white text-purple-600 py-4 rounded-full font-bold hover:bg-gray-100 transition-all"
              >
                Assinar Premium
              </button>
            </div>

            {/* Plano Anual */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Anual</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">R$ 249</div>
                <p className="text-gray-600">por ano</p>
                <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Economize 30%
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Todos os recursos Premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Consultas mensais com especialistas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Planos nutricionais personalizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Workshops exclusivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Garantia de 30 dias</span>
                </li>
              </ul>
              <button 
                onClick={() => router.push("/auth")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-bold hover:shadow-xl transition-all"
              >
                Assinar Anual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comunidade Section */}
      <section id="comunidade" className="py-20 px-4 bg-gradient-to-b from-purple-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Faca Parte da Nossa Comunidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecte-se com milhares de mulheres que estao na mesma jornada de transformacao
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Grupos de Apoio</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Participe de grupos tematicos sobre menopausa, maternidade, fitness, nutricao e muito mais. 
                Compartilhe experiencias e aprenda com outras mulheres.
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span>100K+ membros ativos</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-teal-500 rounded-full p-3">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Eventos ao Vivo</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Participe de workshops, palestras e sessoes de perguntas e respostas com especialistas 
                em saude feminina, nutricao e bem-estar.
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span>Eventos semanais</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Depoimentos da Comunidade</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">O Viva Radiante mudou minha vida! Finalmente encontrei um app que entende as necessidades da mulher moderna.</p>
                <p className="font-bold">Maria Silva, 42 anos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">As rotinas personalizadas sao incriveis! Me sinto mais energizada e confiante a cada dia.</p>
                <p className="font-bold">Ana Paula, 35 anos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex gap-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">A comunidade e maravilhosa! Encontrei apoio e motivacao para continuar minha jornada de bem-estar.</p>
                <p className="font-bold">Juliana Costa, 48 anos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sobre o Viva Radiante
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                O Viva Radiante nasceu da missao de empoderar mulheres a viverem com mais saude, 
                confianca e qualidade de vida em todas as fases da vida.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Combinamos tecnologia de ponta com conhecimento especializado para criar um app 
                que realmente entende e atende as necessidades unicas da saude feminina.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Seguranca e Privacidade</h4>
                    <p className="text-gray-600">Seus dados sao protegidos com criptografia de ponta e conformidade total com a LGPD.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Aprovado por Especialistas</h4>
                    <p className="text-gray-600">Desenvolvido em parceria com medicos, nutricionistas e profissionais de saude feminina.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Feito por Mulheres, para Mulheres</h4>
                    <p className="text-gray-600">Nossa equipe e liderada por mulheres que entendem profundamente os desafios que voce enfrenta.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
                      <p className="text-gray-600 text-sm">Usuarios Ativos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">2M+</div>
                      <p className="text-gray-600 text-sm">Rotinas Feitas</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
                      <p className="text-gray-600 text-sm">Satisfacao</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">4.9</div>
                      <p className="text-gray-600 text-sm">Avaliacao</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-500 via-purple-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Comece sua jornada de transformacao hoje
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
            Junte-se a milhares de mulheres que ja estao vivendo com mais saude, 
            confianca e radiancia em todas as fases da vida.
          </p>
          <button 
            onClick={() => router.push("/auth")}
            className="group bg-white text-purple-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Comecar Agora - E Gratis!
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/90 mt-6 text-lg">Sem cartao de credito - Cancele quando quiser - Teste gratis por 7 dias</p>
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
                Transforme sua vida com rotinas personalizadas e conteudo especializado.
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
                <li className="hover:text-white cursor-pointer transition-colors">Sobre Nos</li>
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
                2024 Viva Radiante. Todos os direitos reservados.
              </p>
              <div className="flex gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Politica de Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Termos de Servico</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
