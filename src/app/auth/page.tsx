"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

// Funcao para normalizar mensagens de erro SEM ACENTOS
const normalizeErrorMessage = (message: string): string => {
  const errorMap: { [key: string]: string } = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'User already registered': 'Este email ja esta cadastrado',
    'Email not confirmed': 'Confirme seu email antes de fazer login',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address': 'Email invalido',
    'Signup requires a valid password': 'Senha invalida',
    'Failed to fetch': 'Erro de conexao. Verifique suas credenciais do Supabase.',
    'String contains non ISO-8859-1 code point': 'Erro de codificacao. Tente novamente.',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return 'Ocorreu um erro. Tente novamente.';
};

// Funcao para remover acentos de strings
const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    // Verificar se o Supabase esta configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl.includes('placeholder') || 
        supabaseKey.includes('placeholder')) {
      setSupabaseConfigured(false);
      setError('Configure as credenciais do Supabase para usar a autenticacao. Clique no banner laranja acima para configurar.');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseConfigured) {
      setError('Configure as credenciais do Supabase primeiro. Clique no banner laranja acima.');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Remover acentos do nome antes de enviar
      const normalizedFullName = removeAccents(fullName);

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setError(normalizeErrorMessage(error.message));
          setLoading(false);
          return;
        }

        if (data.user) {
          router.push("/dashboard");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: normalizedFullName,
            },
          },
        });

        if (error) {
          setError(normalizeErrorMessage(error.message));
          setLoading(false);
          return;
        }

        if (data.user) {
          // Criar perfil do usuario
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: normalizedFullName,
              },
            ]);

          if (profileError) {
            console.error("Erro ao criar perfil:", profileError);
          }

          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      setError(normalizeErrorMessage(err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            {isLogin ? "Bem-vinda de volta!" : "Comece sua jornada de transformacao"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseConfigured}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Carregando..."
              ) : (
                <>
                  {isLogin ? "Entrar" : "Criar Conta"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <p>
                Nao tem uma conta?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Cadastre-se gratis
                </button>
              </p>
            ) : (
              <p>
                Ja tem uma conta?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Faca login
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ao continuar, voce concorda com nossos{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Politica de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
