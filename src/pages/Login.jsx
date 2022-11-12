import { useState, useEffect } from "react";
import { io } from "socket.io-client";
// const socket = io("https://quiz-fea21.azurewebsites.net", {withCredentials: true});
const socket = io("https://eloquent-alpaca-2a04ea.netlify.app");

function Login() {
    const [passwordValue, setPasswordValue] = useState("");
    const [loginStatus, setLoginStatus] = useState("Login Password");

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`You connected with id:${socket.id} `);
        });
        socket.on("token", (token) => {
            if (token === 404) {
                setLoginStatus("Wrong password");
                setTimeout(() => {
                    setLoginStatus("Login Password");
                }, 3000);
                return;
            } else {
                sessionStorage.setItem("token", token);
                window.location = "/admin";
            }
        });
    }, []);

    return (
        <div>
            {loginStatus}
            <br />
            <input
                type="password"
                value={passwordValue}
                onChange={(e) => {
                    setPasswordValue(e.target.value);
                }}
            />
            <div>
                <button
                    onClick={() => {
                        socket.emit("login", passwordValue);
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
