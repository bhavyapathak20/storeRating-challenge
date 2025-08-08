export default function Login(){
    return(
        <div className="flex flex-col h-auto w-md bg-amber-200 m-auto mt-[5%]">
            <div className="flex flex-col justify-center items-center w-full h-full gap-1 mt-3">
                <h1 className="text-center text-3xl font-semibold">Hello There</h1>
                <p className="text-center font-bold">Login</p>
            </div>

            <div className="justify-center items-center text-center mt-10 mb-3">
                <p>Username</p>
                <input type="text" />
                <p>password</p>
                <input type="text" />
                <br/>
                <button type="submit">Submit</button>
            </div>
        </div>
    )
}