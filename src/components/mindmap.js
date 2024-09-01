import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
} from 'reactflow';
import CustomNode from './node';
import styles from '../styles/Mindmap.module.css';

import 'reactflow/dist/style.css';

const nodeTypes = {
    custom: CustomNode,
};

const getId = () => `node_${+new Date()}`;

const Mindmap = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const reactFlowWrapper = useRef(null);

    const updateNodeText = useCallback((id, newText) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newText,
                        },
                    };
                }
                return node;
            })
        );
    }, [setNodes]);

    const addNode = useCallback(() => {
        const newNodeId = getId();
        const newNode = {
            id: newNodeId,
            type: 'custom',
            data: {
                label: `Node ${nodes.length + 1}`,
                onChange: (newText) => updateNodeText(newNodeId, newText),
            },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            style: { backgroundColor: '#ffffff' },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes, updateNodeText]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleKeyDown = useCallback((event) => {
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            addNode();
        }
    }, [addNode]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div style={{ height: '100vh' }} tabIndex={0}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={addNode}>Add Node</button>
            </div>
            <div style={{ height: 'calc(100% - 40px)' }} ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MiniMap />
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};

// Wrap the Mindmap component with ReactFlowProvider
export default () => (
    <ReactFlowProvider>
        <Mindmap />
    </ReactFlowProvider>
);
