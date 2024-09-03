import React from 'react';

const EdgeMenu = ({ edge, nodes, onDelete, onCollapse }) => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);

    if (!sourceNode || !targetNode) {
        return null; // If nodes are not found, do not render the menu
    }

    const offset = 10; // Adjust this value to move the menu slightly north

    const menuStyle = {
        position: 'absolute',
        top: ((sourceNode.position.y + targetNode.position.y) / 2) - offset, // Position slightly north of the midpoint of the edge
        left: (sourceNode.position.x + targetNode.position.x) / 2, // Position at the midpoint of the edge
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        zIndex: 10,
    };

    return (
        <div style={menuStyle}>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onCollapse}>Collapse</button>
        </div>
    );
};

export default EdgeMenu;
