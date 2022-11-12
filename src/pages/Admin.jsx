import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Votes from "../components/Votes";

const socket = io("https://petter-quiz-back.herokuapp.com");

function Admin() {
    const [showA, setShowA] = useState("");
    const [showB, setShowB] = useState("");
    const [totalVotes, setTotalVotes] = useState("");
    const [blueWidth, setBlueWidth] = useState("");
    const [redWidth, setRedWidth] = useState("");
    const [greyWidth, setGreyWidth] = useState("");
    const [greyWidth2, setGreyWidth2] = useState("");
    const [blueProc, setBlueProc] = useState("");
    const [redProc, setRedProc] = useState("");
    const [codeString, setCodeString] = useState("");
    const [questionString, setQuestionString] = useState("");
    const [welcome, setWelcome] = useState("");
    const [visible, setVisible] = useState(false);

    socket.on("recieveVote", (totalA, totalB) => {
        const totalt = totalA + totalB;
        setBlueProc(Math.ceil((totalA / totalt) * 100));
        setRedProc(Math.ceil((totalB / totalt) * 100));
        setBlueWidth(Math.ceil((totalA / totalt) * 100) * 3);
        setRedWidth(Math.ceil((totalB / totalt) * 100) * 3);

        setShowA(totalA);
        setShowB(totalB);
        setTotalVotes(totalt);
    });

    function reset() {
        socket.emit("reset");

        setBlueProc(0);
        setRedProc(0);
        setBlueWidth(0);
        setRedWidth(0);

        setShowA("");
        setShowB("");
        setTotalVotes("");
    }

    useEffect(() => {
        setGreyWidth(300 - blueWidth);
        setGreyWidth2(300 - redWidth);
    }, [blueWidth]);

    if (sessionStorage.getItem("token")) {
        const token = sessionStorage.getItem("token");

        socket.emit("checkToken", token);
        socket.on("confirmToken", (isConfirmed, userName) => {
            if (!isConfirmed) {
                window.location = "/login";
                return <div>Ej inloggad</div>;
            } else {
                setWelcome(`Välkommen ${userName}`);
            }
        });
    } else {
        window.location = "/login";
        return <div>Ej inloggad</div>;
    }
    return (
        <div>
            <h1>{welcome}</h1>
            {/* <div>
                <button>Lägg till fråga</button>
            </div> */}
            <div>
                Skriv en fråga
                <br />
                <textarea
                    name="questArea"
                    onChange={(e) => {
                        setQuestionString(e.target.value);
                    }}
                ></textarea>
            </div>
            <div>
                Kod
                <br />
            </div>
            <div>
                <textarea
                    name="codeArea"
                    onChange={(e) => {
                        setCodeString(e.target.value);
                        setVisible(true);
                    }}
                ></textarea>
                <br />
                {/* <button>Spara</button> */}
            </div>
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        reset();
                    }}
                >
                    Reset
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        socket.emit("sendQuestion", questionString, codeString);
                    }}
                >
                    Skicka
                </button>
                <button
                    onClick={() => {
                        sessionStorage.clear();
                        window.location = "/login";
                    }}
                >
                    Logga ut
                </button>

                <br />
                <div style={{ display: visible ? "block" : "none" }}>
                    <div>Kod-förhandsgranskning </div>
                    <div className="code-container">
                        <SyntaxHighlighter className="preview" language="javascript" style={docco}>
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            <Votes
                totalVotes={totalVotes}
                showA={showA}
                showB={showB}
                blueProc={blueProc}
                redProc={redProc}
                redWidth={redWidth}
                blueWidth={blueWidth}
                greyWidth={greyWidth}
                greyWidth2={greyWidth2}
            />
        </div>
    );
}

export default Admin;
