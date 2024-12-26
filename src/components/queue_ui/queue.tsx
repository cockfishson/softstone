import {Unit} from "../../units/unit_basic_class/Unit.ts";
import React from "react";
import "./queue.css"

interface QueueProps {
    queue: Unit[];
    currentMove: number;
    onHover: (unit: Unit | null) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, currentMove, onHover }) => {
    const units = [...queue];

    return (
        <div className="queue_panel">
            {units.map((unit, i) => (
                <div
                    key={i}
                    className={`queue_unit ${i === currentMove ? "selected" : ""} ${unit.team}`}
                    onMouseEnter={() => onHover(unit)}
                    onMouseLeave={() => onHover(null)}
                >
                    <img className="queue_img" src={unit.image} alt={unit.name} />
                    <p className={`queue_text ${i === currentMove ? "selected_text" : ""}`}>{unit.name}</p>
                </div>
            ))}
        </div>
    );
};

export default Queue;