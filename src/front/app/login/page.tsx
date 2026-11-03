export default function Cadastro(){
    return(
        <div className="flex flex-wrap items-center justify-center min-h-screen py-2 gap-15 mb-10 mt-10">
            <div>
                <h1 className="text-4xl font-bold">Bom ter você aqui!</h1>
                <span>Cadastre-se para ter acesso a todos os recursos do IBRADA</span>
                <div className="w-100 h-80 bg-green-800 justify-center">
                    {/* <Image src="/images/cadastro.png" alt="Cadastro" width={400} height={400} /> */}
                </div>
                <span className="text-sm text-gray-600">Crescer, cuidar e tranformar. Juntos!</span>
            </div>
            <div className="border-1 border-gray rounded-md p-15">
                <h1>Entrar na sua conta</h1>
                <span className="text-sm text-gray-600">Preencha os campos abaixo para acessar sua conta</span>
                <form className="flex flex-col gap-4">
                   <input type="text" placeholder="Email" className="border-1 border-gray rounded-md p-2"/>
                    <input type="password" placeholder="Senha" className="border-1 border-gray rounded-md p-2"/>
                    <button type="submit" className="bg-green-800 text-white rounded-md p-2">Entrar</button>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="text-sm text-gray-600">Lembrar-me</span>
                    </label>
                    <label className="flex items-center gap-2 mb-3">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="text-sm text-gray-600">Exibir senha</span>
                    </label>
                </form>
                <span>Não tem uma conta? <a href="/login" className="text-blue-500">Faça seu cadastro</a></span>
                <div className="p-5 rounded-2xl mt-8 bg-amber-100 flex flex-col items-center justify-center gap-2">
                    <h2>Precisa de ajuda para acessar sua conta?</h2>
                    <span>Entre em contato com nosso suporte para obter assistência.</span>
                    <button className="bg-green-800 text-white rounded-md p-2 mt-2">Suporte</button>
                </div>
                
            </div>
            <div>
            </div>
        </div>
        
    )
}       
