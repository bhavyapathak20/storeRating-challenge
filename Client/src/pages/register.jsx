export default function Register(){
    return(
        <div className="flex flex-col h-auto bg-amber-500 w-md m-auto mt-[5%]">
            <div className="flex justify-center items-center text-center">
                <h1>SignUP</h1>
            </div>

            <div className="flex flex-col justify-center items-center gap 5 mt-10 mb-5">
                <p>Name</p>
                <input type="text" />
                <p>Email</p>
                <input type="text" />
                <p>Address</p>
                <input type="text" />
                <p>Password</p>
                <input type="text" />
                <button type="submit">Submit</button>
            </div>

        </div>
    )
}