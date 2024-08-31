import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';

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
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: 'white' }}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <textarea
                value={text}
                onChange={handleChange}
                style={{
                    width: '100%',
                    minWidth: '150px',
                    resize: 'both',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                }}
            />
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
};

export default CustomNode;
