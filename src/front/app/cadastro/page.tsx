"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { register, type RegisterPayload } from "@/lib/api";
import { terms } from "@/lib/site";

// Mesma regra do back (CreateUserDto): 8+ caracteres, 1 maiúscula, 1 número, 1 especial.
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const inputClass =
    "border mt-2 mb-5 border-gray-300 rounded-md py-2 pl-4 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left w-full";

export default function Cadastro() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const data = Object.fromEntries(new FormData(e.currentTarget).entries());

        // US23: sem aceitar os termos, o cadastro não é enviado.
        if (!data.termos) {
            setError("É obrigatório aceitar os Termos de uso e a Política de Privacidade (LGPD).");
            return;
        }
        if (data.senha !== data.confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }
        if (!PASSWORD_REGEX.test(String(data.senha))) {
            setError("A senha deve ter no mínimo 8 caracteres, contendo 1 maiúscula, 1 número e 1 caractere especial.");
            return;
        }

        const payload: RegisterPayload = {
            name: String(data.nome).trim(),
            email: String(data.email).trim(),
            phone: String(data.telefone).trim(),
            password: String(data.senha),
            dataNascimento: String(data.dataNascimento),
            cidade: String(data.cidade).trim(),
            estado: String(data.estado).trim(),
            lgpdAccepted: true,
            lgpdVersion: terms.version,
        };

        setLoading(true);
        try {
            await register(payload);
            router.push("/login");
        } catch (err) {
            // Mensagem vem do back
            setError(err instanceof Error ? err.message : "Não foi possível concluir o cadastro.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left pb-10 px-4 bg-[#F8EFE2]">
                <h1 className="mt-10 lg:ml-10 text-3xl font-bold sm:text-4xl">Sua jornada começa aqui.</h1>
                <span className="mt-2 lg:ml-10">Cadastre-se para ter acesso a todos os recursos do IBRADA</span>
            </div>
            <div className="mx-4 md:mx-12 lg:mx-40 my-5 p-5 md:p-10 rounded-2xl bg-[#F8EFE2]">
                <h2 className="font-bold text-lime-900">Uma conta, muitas formas de participar</h2>
                <span>A mesma conta serve para turismo e voluntariado. O perfil voluntário é um complemento opcional, que você pode preencher depois.</span>
            </div>

            <form onSubmit={handleSubmit} className="mx-4 md:mx-12 lg:mx-40 py-6 md:p-10">
                <h1 className="text-xl font-bold mb-4">1. Informações Pessoais</h1>
                <span className="text-sm text-gray-600">Os campos * são obrigatórios</span>

                <label className="block mt-4">
                    Nome completo *
                    <input name="nome" required className={inputClass} type="text" placeholder="Digite seu nome completo" />
                </label>

                <label className="block mt-4">
                    Email *
                    <input name="email" required className={inputClass} type="email" placeholder="Digite seu email" />
                </label>

                <div className="flex flex-col lg:flex-row lg:gap-4 w-full">
                    <label className="block mt-4 w-full">
                        Telefone/Whatsapp *
                        <input name="telefone" required className={inputClass} type="tel" placeholder="Digite seu telefone/whatsapp" />
                    </label>
                    <label className="block mt-4 w-full">
                        Data de Nascimento *
                        <input name="dataNascimento" required className={inputClass} type="date" />
                    </label>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-4 w-full">
                    <label className="block mt-4 w-full">
                        Cidade *
                        <input name="cidade" required className={inputClass} type="text" placeholder="Digite sua cidade" />
                    </label>
                    <label className="block mt-4 w-full">
                        Estado *
                        <input name="estado" required className={inputClass} type="text" placeholder="Digite seu estado" />
                    </label>
                </div>

                <h1 className="text-xl font-bold mt-4 mb-4">2. Proteja sua conta</h1>

                <label className="block mt-4">
                    Senha *
                    <input
                        name="senha"
                        required
                        minLength={8}
                        className={inputClass}
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                    />
                    <span className="text-sm text-gray-500">
                    A senha do cadastro deve ter no mínimo 8 caracteres, contendo um caractere maiúsculo, um número e um caractere especial.
                </span>
                </label>
                
                <label className="block mt-4">
                    Confirme sua senha *
                    <input
                        name="confirmarSenha"
                        required
                        minLength={8}
                        className={inputClass}
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                    />
                </label>
                <label className="flex items-center cursor-pointer w-fit">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Exibir senha
                </label>

                <h1 className="text-xl font-bold my-8">3. Privacidade e consentimentos</h1>
                <label className="flex items-start">
                    <input name="termos" type="checkbox" required className="mr-2 mt-1.5" />
                    <span>
                        Li e concordo com os <a href="/termos#termos-de-uso" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Termos de uso</a> e a{" "}
                        <a href="/termos#privacidade" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Política de Privacidade (LGPD)</a> do IBRADA.
                    </span>
                </label>

                {error && <p className="mt-4 text-center text-red-600" role="alert">{error}</p>}

                <div className="flex justify-center w-full">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-lime-900 disabled:opacity-60 mt-8 w-full sm:w-auto text-center text-white px-6 py-2 rounded-md hover:bg-lime-800 transition-colors cursor-pointer"
                    >
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </div>
                <span className="block mt-4 text-sm text-gray-500">
                    Após criar sua conta, você poderá completar as informações do seu perfil para se tornar um voluntário
                </span>
            </form>
        </div>
    );
}
