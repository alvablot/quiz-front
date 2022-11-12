import React from "react";
import blue from "../assets/blue.png";
import red from "../assets/red.png";
import grey from "../assets/grey.png";

function Votes(props) {
    return (
        <div>
            <h3>Totalt: {props.totalVotes}</h3>
            <div className="dia-container">
                <div className="box1">
                    Ja {props.showA} {props.blueProc | 0} %
                </div>

                <div className="box3">
                    <img src={blue} width={props.blueWidth | 0} height="50" />
                    <img src={grey} width={props.greyWidth | 0} height="50" />
                </div>
                <div className="box2">
                    Nej {props.showB} {props.redProc | 0} %
                </div>
                <div className="box4">
                    <img src={red} width={props.redWidth | 0} height="50" />
                    <img src={grey} width={props.greyWidth2 | 0} height="50" />
                </div>
            </div>
        </div>
    );
}

export default Votes;
