import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import '../styles/node.css';

const CustomNode = ({ data, isConnectable }) => {
    const [text, setText] = useState(data.label);

    const handleChange = useCallback((event) => {
        const newText = event.target.value;
        setText(newText);
        if (data.onChange) {
            data.onChange(newText);
        }
    }, [data]);

    return (
        <>
            <NodeResizer
                minWidth={100}
                minHeight={50}
                isVisible={true}
                lineClassName="noderesize-line" // Ensure this class is styled to cover full width
                handleClassName="noderesize-handle" // Ensure this class is styled appropriately
            />
            <div style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: 'white',
                width: '100%',
                height: '100%'
            }}>
                <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
                <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
                <textarea
                    value={text}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        height: '100%',
                        resize: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: 'inherit'
                    }}
                />
                <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            </div>
        </>
    );
};

export default CustomNode;
