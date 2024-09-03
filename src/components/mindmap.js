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
import EdgeMenu from './edge';
import styles from '../styles/Mindmap.module.css';

import 'reactflow/dist/style.css';

const nodeTypes = {
    custom: CustomNode,
};

const getId = () => `node_${+new Date()}`;

const Mindmap = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedEdge, setSelectedEdge] = useState(null);
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

    const handleEdgeClick = (event, edge) => {
        event.stopPropagation();
        setSelectedEdge(edge);
    };

    const handleDeleteEdge = () => {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
        setSelectedEdge(null);
    };

    const handleCollapseEdge = () => {
        if (!selectedEdge) return;

        const { source, target } = selectedEdge;

        // Find all nodes connected to the source and target nodes
        const connectedNodes = new Set([source, target]);
        const connectedEdges = edges.filter(edge => {
            if (edge.source === source || edge.target === source || edge.source === target || edge.target === target) {
                connectedNodes.add(edge.source);
                connectedNodes.add(edge.target);
                return true;
            }
            return false;
        });

        // Create a placeholder node
        const placeholderNode = {
            id: `collapsed_${source}_${target}`,
            type: 'custom',
            data: {
                label: '...',
                onExpand: () => handleExpandEdge(source, target, connectedNodes, connectedEdges),
            },
            position: {
                x: (nodes.find(node => node.id === source).position.x + nodes.find(node => node.id === target).position.x) / 2,
                y: (nodes.find(node => node.id === source).position.y + nodes.find(node => node.id === target).position.y) / 2,
            },
            style: { backgroundColor: '#ffffff' },
        };

        // Update nodes and edges state
        setNodes(nds => [
            ...nds.filter(node => !connectedNodes.has(node.id)),
            placeholderNode,
        ]);
        setEdges(eds => eds.filter(edge => !connectedEdges.includes(edge)));

        setSelectedEdge(null);
    };

    const handleExpandEdge = (source, target, connectedNodes, connectedEdges) => {
        // Restore the hidden nodes and edges
        setNodes(nds => [
            ...nds.filter(node => node.id !== `collapsed_${source}_${target}`),
            ...Array.from(connectedNodes).map(id => nodes.find(node => node.id === id)),
        ]);
        setEdges(eds => [
            ...eds,
            ...connectedEdges,
        ]);
    };

    const handleClickOutside = (event) => {
        if (!reactFlowWrapper.current.contains(event.target)) {
            setSelectedEdge(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    onEdgeClick={handleEdgeClick}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MiniMap />
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
                {selectedEdge && (
                    <EdgeMenu
                        edge={selectedEdge}
                        nodes={nodes} // Pass nodes to EdgeMenu
                        onDelete={handleDeleteEdge}
                        onCollapse={handleCollapseEdge}
                    />
                )}
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
