import React from "react";
import { BattlefieldGrid } from "../../battlefield/battlefield.ts";
import "./Battlefield.css";
import {Unit} from "../../units/unit_basic_class/Unit.ts";

interface BattlefieldProps {
    grid: BattlefieldGrid;
    onUnitClick: (row: number, col: number) => void;
    highlightedCells: { row: number; col: number }[];
    currentMove: number;
    turnOrder: Unit[];
    selectedTarget: { row: number; col: number } | null;
    hoveredUnit: Unit | null;
}


const Battlefield: React.FC<BattlefieldProps> = ({
                                                     grid,
                                                     onUnitClick,
                                                     highlightedCells,
                                                     currentMove,
                                                     turnOrder,
                                                     selectedTarget,
                                                     hoveredUnit,
                                                 }) => {
    const isHighlighted = (row: number, col: number) =>
        highlightedCells.some(cell => cell.row === row && cell.col === col);

    const isCurrentUnit = (unit: Unit | null) =>
        unit && turnOrder[currentMove] === unit;

    const isHoveredUnit = (unit: Unit | null) => hoveredUnit && unit === hoveredUnit;

    const calculateHealthOverlay = (unit: Unit) => {
        if (unit.health <= 0) return { height: "100%", backgroundColor: "rgba(255, 0, 0, 0.8)" };
        if (unit.health < unit.maxHealth) {
            return {
                height: `${(1 - unit.health / unit.maxHealth) * 100}%`,
                backgroundColor: "rgba(255, 0, 0, 0.6)",
            };
        }
        return { height: "0%", backgroundColor: "rgba(255, 0, 0, 0)" };
    };

    return (
        <div className="battlefield">
            {grid.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {row.map((unit, colIndex) => (
                        <div
                            className={`cell _${unit?.team} 
                                ${isHighlighted(rowIndex, colIndex) ? `highlighted ${unit?.team}` : ""} 
                                ${isCurrentUnit(unit) ? "current_turn" : ""}
                                ${isHoveredUnit(unit) ? "hovered" : ""}
                                ${selectedTarget?.row === rowIndex && selectedTarget?.col === colIndex ? "selected_target" : ""}`}
                            key={colIndex}
                            onClick={() => onUnitClick(rowIndex, colIndex)}
                        >
                            {unit ? (
                                <div className={`unit ${unit.isDead ? "dead" : ""}`}>
                                    <img
                                        src={unit.image}
                                        alt={unit.name}
                                        className="unit_image"
                                    />
                                    {unit.isDefending && (
                                        <img
                                            src="/src/assets/shield_icon.png"
                                            alt="Defending"
                                            className="status_icon shield_icon"
                                        />
                                    )}
                                    {unit.isParalyzed && (
                                        <img
                                            src="/src/assets/snake_icon.png"
                                            alt="Paralyzed"
                                            className="status_icon snake_icon"
                                        />
                                    )}
                                    {unit.health > 0 && unit.health < unit.maxHealth && (
                                        <div
                                            className="unit_health_overlay"
                                            style={calculateHealthOverlay(unit)}
                                        />
                                    )}
                                    <p className="unit_name">{unit.name}</p>
                                    <p className="unit_health">
                                        {unit.health}/{unit.maxHealth}
                                    </p>
                                </div>
                            ) : (
                                <div className="empty_cell"/>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Battlefield;
