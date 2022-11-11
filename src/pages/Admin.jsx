import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import blue from "../assets/blue.png";
import red from "../assets/red.png";
import grey from "../assets/grey.png";

const socket = io("http://localhost:3000");

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
        setCodeString("");
        setQuestionString("");
        setBlueProc(0);
        setRedProc(0);
        setBlueWidth(0);
        setRedWidth(0);

        setShowA("");
        setShowB("");
        setTotalVotes("");
        setCodeString("");
        setQuestionString("");
    }
    useEffect(() => {
        setGreyWidth(300 - blueWidth);
        setGreyWidth2(300 - redWidth);
    }, [blueWidth]);
    return (
        <div>
            <h1>Lärare</h1>
            {/* <div>
                <button>Lägg till fråga</button>
            </div> */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.target.questArea.value = "";
                    e.target.codeArea.value = "";
                }}
            >
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
                        }}
                    ></textarea>
                    <br />
                    {/* <button>Spara</button> */}
                    <button
                        onClick={() => {
                            reset();
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
            <div>
                <button
                    onClick={() => {
                        socket.emit("sendQuestion", questionString, codeString);
                    }}
                >
                    Skicka
                </button>

                <br />
                <br />
                <div>Kod-förhandsgranskning </div>
                <div className="code-container">
                    <SyntaxHighlighter className="preview" language="javascript" style={docco}>
                        {codeString}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div>
                {" "}
                <h3>Totalt: {totalVotes}</h3>
                <div className="dia-container">
                    <div className="box1">
                        Ja {showA} {blueProc | 0} %
                    </div>

                    <div className="box3">
                        <img src={blue} width={blueWidth | 0} height="50" />
                        <img src={grey} width={greyWidth | 0} height="50" />
                    </div>
                    <div className="box2">
                        Nej {showB} {redProc | 0} %
                    </div>
                    <div className="box4">
                        <img src={red} width={redWidth | 0} height="50" />
                        <img src={grey} width={greyWidth2 | 0} height="50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
