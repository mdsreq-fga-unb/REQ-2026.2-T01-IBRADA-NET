export default function Cadastro(){
    return(
        <div className="flex flex-wrap items-center justify-center min-h-screen py-2 gap-15">
            <div>
                <h1 className="text-4xl font-bold">Bom ter você aqui!</h1>
                <span>Cadastre-se para ter acesso a todos os recursos do IBRADA</span>
                <div className="w-100 h-80 bg-green-800 justify-center">
                    {/* <Image src="/images/cadastro.png" alt="Cadastro" width={400} height={400} /> */}
                </div>
                <span className="text-sm text-gray-600">Crescer, cuidar e tranformar. Juntos!</span>
            </div>
            <div className="border-1 border-black rounded-md p-20">
                <form className="flex flex-col gap-4">
                   <input type="text" placeholder="Email" className="border-1 border-gray rounded-md p-2"/>
                    <input type="password" placeholder="Senha" className="border-1 border-gray rounded-md p-2"/>
                    <button type="submit" className="bg-green-800 text-white rounded-md p-2">Entrar</button>
                </form>
                <span>Já tem uma conta? <a href="/login" className="text-blue-500">Faça login</a></span>
            </div>
            <div>
                
            </div>
        </div>
    )
}       
