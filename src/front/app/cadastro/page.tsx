"use client";

import { useState, type SubmitEvent } from "react";

const inputClass =
    "border mt-2 mb-5 border-gray-300 rounded-md py-2 pl-4 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left w-full";

export default function Cadastro() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());

        if (data.senha !== data.confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        const { confirmarSenha, termos, ...payload } = data;
        console.log("Cadastro:", payload);
        // TODO: enviar `payload` para a API do back-end
        // await fetch("/api/cadastro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }

    return (
        <div>
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left pb-10 px-4 bg-fuchsia-100">
                <h1 className="mt-10 lg:ml-10 text-3xl font-bold sm:text-4xl">Sua jornada começa aqui.</h1>
                <span className="mt-2 lg:ml-10">Cadastre-se para ter acesso a todos os recursos do IBRADA</span>
            </div>
            <div className="mx-4 md:mx-12 lg:mx-40 my-5 p-5 md:p-10 rounded-2xl bg-fuchsia-100">
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
                        minLength={6}
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
                        minLength={6}
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
                        className="bg-lime-900 mt-8 w-full sm:w-auto text-center text-white px-6 py-2 rounded-md hover:bg-lime-800 transition-colors cursor-pointer"
                    >
                        Cadastrar
                    </button>
                </div>
                <span className="block mt-4 text-sm text-gray-500">
                    Após criar sua conta, você poderá completar as informações do seu perfil para se tornar um voluntário
                </span>
            </form>
        </div>
    );
}
