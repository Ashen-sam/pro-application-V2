import React, { useState, useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeCategories = {
    frontend: {
        label: 'Frontend',
        color: '#3b82f6',
        items: [
            { id: 'react-app', shape: 'default' },
            { id: 'vue-app', shape: 'default' },
            { id: 'mobile-app', shape: 'default' },
            { id: 'admin-dashboard', shape: 'default' },
        ]
    },
    backend: {
        label: 'Backend',
        color: '#10b981',
        items: [
            { id: 'rest-api', shape: 'default' },
            { id: 'graphql-api', shape: 'default' },
            { id: 'microservice', shape: 'default' },
            { id: 'serverless', shape: 'default' },
        ]
    },
    database: {
        label: 'Database',
        color: '#f59e0b',
        items: [
            { id: 'postgresql', shape: 'default' },
            { id: 'mongodb', shape: 'default' },
            { id: 'redis', shape: 'default' },
            { id: 'mysql', shape: 'default' },
        ]
    },
    auth: {
        label: 'Authentication',
        color: '#8b5cf6',
        items: [
            { id: 'auth-service', shape: 'default' },
            { id: 'oauth', shape: 'default' },
            { id: 'jwt', shape: 'default' },
            { id: 'api-gateway', shape: 'default' },
        ]
    },
    external: {
        label: 'External Services',
        color: '#ec4899',
        items: [
            { id: 'payment', shape: 'default' },
            { id: 'email', shape: 'default' },
            { id: 'sms', shape: 'default' },
            { id: 'storage', shape: 'default' },
            { id: 'cdn', shape: 'default' },
        ]
    },
    messaging: {
        label: 'Messaging',
        color: '#14b8a6',
        items: [
            { id: 'rabbitmq', shape: 'default' },
            { id: 'kafka', shape: 'default' },
            { id: 'websocket', shape: 'default' },
        ]
    },
    infrastructure: {
        label: 'Infrastructure',
        color: '#64748b',
        items: [
            { id: 'load-balancer', shape: 'default' },
            { id: 'nginx', shape: 'default' },
            { id: 'docker', shape: 'default' },
            { id: 'kubernetes', shape: 'default' },
        ]
    },
    monitoring: {
        label: 'Monitoring',
        color: '#ef4444',
        items: [
            { id: 'logging', shape: 'default' },
            { id: 'analytics', shape: 'default' },
            { id: 'error-tracking', shape: 'default' },
        ]
    }
};

const shapeOptions = [
    { value: 'default', label: 'Rectangle' },
    { value: 'input', label: 'Input' },
    { value: 'output', label: 'Output' },
];

const connectionTypes = [
    { value: 'http', label: 'HTTP/REST', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { value: 'websocket', label: 'WebSocket', style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' } },
    { value: 'database', label: 'Database Query', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { value: 'message', label: 'Message Queue', style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '10,5' } },
    { value: 'auth', label: 'Auth Flow', style: { stroke: '#ec4899', strokeWidth: 2 } },
];

const initialNodes = [];
const initialEdges = [];

export const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedCategory, setSelectedCategory] = useState('frontend');
    const [selectedConnection, setSelectedConnection] = useState('http');
    const [selectedShape, setSelectedShape] = useState('default');
    const [nodeIdCounter, setNodeIdCounter] = useState(1);
    const [nodeName, setNodeName] = useState('');

    const onConnect = useCallback(
        (params) => {
            const connectionStyle = connectionTypes.find(ct => ct.value === selectedConnection);
            setEdges((eds) => addEdge({
                ...params,
                label: connectionStyle?.label || 'Connection',
                style: connectionStyle?.style || {},
            }, eds));
        },
        [setEdges, selectedConnection]
    );

    const addNode = () => {
        if (!nodeName.trim()) {
            alert('Please enter a node name');
            return;
        }

        const category = nodeCategories[selectedCategory];
        const newNode = {
            id: `node-${nodeIdCounter}`,
            type: selectedShape,
            data: { label: nodeName.trim() },
            position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
            style: {
                background: category.color,
                color: 'white',
                border: `2px solid ${category.color}`,
                padding: 10,
                borderRadius: 5,
                minWidth: 120,
            }
        };
        setNodes((nds) => [...nds, newNode]);
        setNodeIdCounter(nodeIdCounter + 1);
        setNodeName('');
    };

    const deleteSelectedNodes = () => {
        setNodes((nds) => nds.filter(node => !node.selected));
        setEdges((eds) => eds.filter(edge => {
            const sourceExists = nodes.some(n => n.id === edge.source && !n.selected);
            const targetExists = nodes.some(n => n.id === edge.target && !n.selected);
            return sourceExists && targetExists;
        }));
    };

    const clearCanvas = () => {
        setNodes([]);
        setEdges([]);
    };

    const exportDiagram = () => {
        const diagramData = { nodes, edges };
        const dataStr = JSON.stringify(diagramData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'architecture-diagram.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const hasSelectedNodes = nodes.some(node => node.selected);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: '#1f2937',
                color: 'white',
                padding: '20px',
                overflowY: 'auto',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginTop: 0, fontSize: '20px', marginBottom: '20px' }}>Architecture Components</h2>

                {/* Category Selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        Category:
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#374151',
                            color: 'white'
                        }}
                    >
                        {Object.entries(nodeCategories).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Shape Selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        Shape:
                    </label>
                    <select
                        value={selectedShape}
                        onChange={(e) => setSelectedShape(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#374151',
                            color: 'white'
                        }}
                    >
                        {shapeOptions.map((shape) => (
                            <option key={shape.value} value={shape.value}>{shape.label}</option>
                        ))}
                    </select>
                </div>

                {/* Node Name Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        Node Name:
                    </label>
                    <input
                        type="text"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addNode();
                            }
                        }}
                        placeholder="Enter node name..."
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#374151',
                            color: 'white',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Add Node Button */}
                <div style={{ marginBottom: '30px' }}>
                    <button
                        onClick={addNode}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: nodeCategories[selectedCategory].color,
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        + Add Node
                    </button>
                </div>

                {/* Connection Type */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        Connection Type:
                    </label>
                    <select
                        value={selectedConnection}
                        onChange={(e) => setSelectedConnection(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#374151',
                            color: 'white'
                        }}
                    >
                        {connectionTypes.map((ct) => (
                            <option key={ct.value} value={ct.value}>{ct.label}</option>
                        ))}
                    </select>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                        Drag from one node to another to connect
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {hasSelectedNodes && (
                        <button
                            onClick={deleteSelectedNodes}
                            style={{
                                padding: '10px',
                                background: '#f97316',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Delete Selected
                        </button>
                    )}
                    <button
                        onClick={exportDiagram}
                        style={{
                            padding: '10px',
                            background: '#059669',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Export Diagram
                    </button>
                    <button
                        onClick={clearCanvas}
                        style={{
                            padding: '10px',
                            background: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Clear Canvas
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                    <Panel position="top-left">
                        <div style={{
                            background: 'white',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Software Architecture Designer</h3>
                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                                Name and add components, then connect them
                            </p>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
}