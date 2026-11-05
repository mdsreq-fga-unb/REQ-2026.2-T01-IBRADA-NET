export default function Login() {
    return (
        <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-16">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <h1 className="text-3xl font-bold sm:text-4xl">Bom ter você aqui!</h1>
                <span className="mt-2">Cadastre-se para ter acesso a todos os recursos do IBRADA</span>
                <div className="mt-5 w-full max-w-[550px] rounded-2xl">
                    <img
                        src="/equipe_login.jpg"
                        alt="Cadastro"
                        className="h-auto w-full rounded-2xl object-cover"
                    />
                </div>
                <span className="mt-3 text-sm text-gray-600">Crescer, cuidar e tranformar. Juntos!</span>
            </div>

            <div className="mx-auto w-full max-w-md rounded-md border border-gray-300 p-5 sm:p-8 lg:max-w-none lg:p-10">
                <h1 className="text-xl font-semibold">Entrar na sua conta</h1>
                <span className="text-sm text-gray-600">Preencha os campos abaixo para acessar sua conta</span>
                <form className="mt-4 flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Email"
                        className="min-h-11 w-full rounded-md border border-gray-300 p-2 text-base"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="min-h-11 w-full rounded-md border border-gray-300 p-2 text-base"
                    />
                    <button type="submit" className="min-h-11 rounded-md bg-green-800 p-2 text-white">
                        Entrar
                    </button>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="size-4" />
                        <span className="text-sm text-gray-600">Lembrar-me</span>
                    </label>
                    <label className="mb-3 flex items-center gap-2">
                        <input type="checkbox" className="size-4" />
                        <span className="text-sm text-gray-600">Exibir senha</span>
                    </label>
                </form>
                <span>
                    Não tem uma conta?{" "}
                    <a href="/cadastro" className="text-blue-500">
                        Faça seu cadastro
                    </a>
                </span>
                <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-amber-100 p-4 text-center sm:p-5">
                    <h2>Precisa de ajuda para acessar sua conta?</h2>
                    <span>Entre em contato com nosso suporte para obter assistência.</span>
                    <button className="mt-2 min-h-11 rounded-md bg-green-800 px-4 py-2 text-white">Suporte</button>
                </div>
            </div>
        </div>
    )
}
