import React from "react";
import { useState, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import blue from "../assets/blue.png";
import red from "../assets/red.png";
import grey from "../assets/grey.png";
import "../App.css";
import { io } from "socket.io-client";
// const socket = io("https://quiz-fea21.azurewebsites.net", {withCredentials: true});
const socket = io("http://localhost:3000");

function Voter() {
    const [displayMessage, setDisplayMessage] = useState("");   
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
    useEffect(() => {
        socket.on("connect", () => {
            console.log(`You connected with id:${socket.id} `);
        });
        socket.on("reset", () => {
            localStorage.clear();
            setBlueProc(0);
            setRedProc(0);
            setBlueWidth(0);
            setRedWidth(0);

            setShowA("");
            setShowB("");
            setTotalVotes("");
            setCodeString("");
            setQuestionString("");
        });
        socket.on("recieveQuestion", (question, code) => {
            setQuestionString(question);
            setCodeString(code);
        });
        socket.emit("sendVote");
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
    }, []);
    useEffect(() => {
        setGreyWidth(300 - blueWidth);
        setGreyWidth2(300 - redWidth);
    }, [blueWidth]);
    function vote(x) {
        if (localStorage.getItem("voted")) {
            // alert("Du har redan röstat");
            // return;
        }
        socket.emit("sendVote", x);
        localStorage.setItem("voted", x);
    }
    return (
        <div>
            <h1>Elev-quiz</h1>
            <div>
                Fråga:
                <div className="question">{questionString}</div>
            </div>
            <div>
                Kod
                <SyntaxHighlighter className="preview" language="javascript" style={docco}>
                    {codeString}
                </SyntaxHighlighter>
            </div>
            <button
                onClick={() => {
                    vote("a");
                }}
            >
                Ja
            </button>
            <button
                onClick={() => {
                    vote("b");
                }}
            >
                Nej
            </button>
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
    );
}

export default Voter;
