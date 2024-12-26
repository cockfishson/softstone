import React, { useState, useEffect, useCallback } from "react";
import Battlefield from "./components/battlefield/battlefield_component.tsx";
import { Battlefield as BattlefieldLogic } from "./battlefield/battlefield.ts";
import { TeamGenerator } from "./team_creation/team_generator.ts";
import Queue from "./components/queue_ui/queue.tsx";
import "./App.css";
import {Unit} from "./units/unit_basic_class/Unit.ts";

const App: React.FC = () => {
    const rows = 2;
    const cols = 3;

    const createBattlefield = useCallback(() => {
        const logic = new BattlefieldLogic();
        const redTeam = TeamGenerator.createRandomTeam("red", rows, cols);
        const greenTeam = TeamGenerator.createRandomTeam("green", rows, cols);
        logic.placeTeams(redTeam, greenTeam);
        return logic;
    }, [rows, cols]);

    const [battlefield, setBattlefield] = useState(() => createBattlefield());
    const [grid, setGrid] = useState(battlefield.getGrid());
    const [highlightedCells, setHighlightedCells] = useState(battlefield.getHighlightedCells());
    const [turnOrder, setTurnOrder] = useState(battlefield.getTurnOrder());
    const [currentMove, setCurrentMove] = useState(battlefield.getCurrentMoveIndex());
    const [selectedTarget, setSelectedTarget] = useState<{ row: number; col: number } | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);

    const updateStateFromBattlefield = useCallback(() => {
        setGrid(battlefield.getGrid());
        setHighlightedCells(battlefield.getHighlightedCells());
        setTurnOrder(battlefield.getTurnOrder());
        setCurrentMove(battlefield.getCurrentMoveIndex());
        const redTeamAlive = battlefield.getTurnOrder().some(unit => unit.team === "red" && unit.health > 0);
        const greenTeamAlive = battlefield.getTurnOrder().some(unit => unit.team === "green" && unit.health > 0);
        if (!redTeamAlive) setWinner("Green Team");
        if (!greenTeamAlive) setWinner("Red Team");
    }, [battlefield]);

    useEffect(() => {
        updateStateFromBattlefield();
    }, [updateStateFromBattlefield]);

    const handleActionConfirm = () => {
        if (selectedTarget) {
            const { row, col } = selectedTarget;
            if (battlefield.invokeAction(row, col)) {
                setSelectedTarget(null);
                updateStateFromBattlefield();
            }
        }
    };

    const handleDefend = () => {
        battlefield.defendCurrentUnit();
        updateStateFromBattlefield();
        setSelectedTarget(null);
    };

    const handleRestart = () => {
        const newBattlefield = createBattlefield();
        setBattlefield(newBattlefield);
        setWinner(null);
        updateStateFromBattlefield();
        setWinner(null);
    };

    return (
        <div className="battlefield_container">
            {winner && (
                <div className="victory_modal">
                    <h2 className="modal_header">{winner} has won!</h2>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            )}
            <Battlefield
                grid={grid}
                onUnitClick={(row, col) => {
                    if (highlightedCells.some(cell => cell.row === row && cell.col === col)) {
                        setSelectedTarget({ row, col });
                    }
                }}
                highlightedCells={highlightedCells}
                currentMove={currentMove}
                turnOrder={turnOrder}
                selectedTarget={selectedTarget}
                hoveredUnit={hoveredUnit}
            />

            <div className="button_row">
                <button
                    onClick={handleActionConfirm}
                    disabled={!selectedTarget}
                    className="confirm_attack"
                >
                    Confirm Action
                </button>
                <button onClick={handleDefend} className="confirm_attack">
                    Defend
                </button>
            </div>
            <Queue
                queue={turnOrder}
                currentMove={currentMove}
                onHover={setHoveredUnit}
            />
        </div>
    );
};

export default App;
