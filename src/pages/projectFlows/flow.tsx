// import { Menu, X } from 'lucide-react';
// import { useCallback, useState } from 'react';
// import ReactFlow, {
//     addEdge,
//     Background,
//     Controls,
//     MiniMap,
//     Panel,
//     useEdgesState,
//     useNodesState,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// const shapeOptions = [
//     { value: 'default', label: '◻ Rectangle' },
//     { value: 'input', label: '◁ Triangle' },
//     { value: 'output', label: '▷ Arrow' },
// ];

// const initialNodes = [];
// const initialEdges = [];

// export const Flow = () => {
//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//     const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//     const [selectedShape, setSelectedShape] = useState('default');
//     const [nodeIdCounter, setNodeIdCounter] = useState(1);
//     const [nodeName, setNodeName] = useState('');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//     const onConnect = useCallback(
//         (params) => {
//             setEdges((eds) => addEdge({
//                 ...params,
//                 style: { stroke: '#64748b', strokeWidth: 2 },
//             }, eds));
//         },
//         [setEdges]
//     );

//     const addNode = () => {
//         if (!nodeName.trim()) {
//             alert('Please enter a node name');
//             return;
//         }

//         const newNode = {
//             id: `node-${nodeIdCounter}`,
//             type: selectedShape,
//             data: { label: nodeName.trim() },
//             position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 150 },
//             style: {
//                 background: '#3b82f6',
//                 color: 'white',
//                 border: '2px solid #2563eb',
//                 padding: 10,
//                 borderRadius: 5,
//                 minWidth: 120,
//                 fontSize: '12px',
//             }
//         };
//         setNodes((nds) => [...nds, newNode]);
//         setNodeIdCounter(nodeIdCounter + 1);
//         setNodeName('');
//     };

//     const deleteSelectedNodes = () => {
//         setNodes((nds) => nds.filter(node => !node.selected));
//         setEdges((eds) => eds.filter(edge => {
//             const sourceExists = nodes.some(n => n.id === edge.source && !n.selected);
//             const targetExists = nodes.some(n => n.id === edge.target && !n.selected);
//             return sourceExists && targetExists;
//         }));
//     };

//     const clearCanvas = () => {
//         setNodes([]);
//         setEdges([]);
//     };

//     const exportDiagram = () => {
//         const diagramData = { nodes, edges };
//         const dataStr = JSON.stringify(diagramData, null, 2);
//         const dataBlob = new Blob([dataStr], { type: 'application/json' });
//         const url = URL.createObjectURL(dataBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'architecture-diagram.json';
//         link.click();
//         URL.revokeObjectURL(url);
//     };

//     const hasSelectedNodes = nodes.some(node => node.selected);

//     return (
//         <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', position: 'relative' }}>
//             <div style={{
//                 position: 'absolute',
//                 left: 0,
//                 top: 0,
//                 height: '100vh',
//                 width: isSidebarOpen ? '280px' : '0',
//                 transition: 'width 0.3s ease',
//                 zIndex: 100,
//                 overflow: 'hidden'
//             }}>
//                 <div style={{
//                     background: 'rgba(30, 41, 59, 0.75)',
//                     backdropFilter: 'blur(10px)',
//                     color: 'white',
//                     padding: '24px 16px',
//                     boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '20px',
//                     width: '280px',
//                     height: '100%',
//                     overflowY: 'auto',
//                     overflowX: 'hidden'
//                 }}>
//                     <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>Diagram Builder</h2>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
//                         <label style={{ fontSize: '12px', fontWeight: '500' }}>Shape:</label>
//                         <select
//                             value={selectedShape}
//                             onChange={(e) => setSelectedShape(e.target.value)}
//                             style={{
//                                 width: '100%',
//                                 padding: '8px 12px',
//                                 borderRadius: '6px',
//                                 border: 'none',
//                                 background: '#334155',
//                                 color: 'white',
//                                 cursor: 'pointer',
//                                 fontSize: '12px'
//                             }}
//                         >
//                             {shapeOptions.map((shape) => (
//                                 <option key={shape.value} value={shape.value}>{shape.label}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
//                         <label style={{ fontSize: '12px', fontWeight: '500' }}>Name:</label>
//                         <input
//                             type="text"
//                             value={nodeName}
//                             onChange={(e) => setNodeName(e.target.value)}
//                             onKeyPress={(e) => {
//                                 if (e.key === 'Enter') {
//                                     addNode();
//                                 }
//                             }}
//                             placeholder="Enter node name..."
//                             style={{
//                                 width: '100%',
//                                 padding: '8px 12px',
//                                 borderRadius: '6px',
//                                 border: 'none',
//                                 background: '#334155',
//                                 color: 'white',
//                                 fontSize: '12px',
//                                 boxSizing: 'border-box'
//                             }}
//                         />
//                     </div>

//                     <button
//                         onClick={addNode}
//                         style={{
//                             width: '100%',
//                             padding: '10px 20px',
//                             background: '#3b82f6',
//                             border: 'none',
//                             borderRadius: '6px',
//                             color: 'white',
//                             cursor: 'pointer',
//                             fontSize: '12px',
//                             fontWeight: '600',
//                             transition: 'background 0.2s'
//                         }}
//                         onMouseOver={(e) => e.target.style.background = '#2563eb'}
//                         onMouseOut={(e) => e.target.style.background = '#3b82f6'}
//                     >
//                         + Add Node
//                     </button>

//                     <div style={{ borderTop: '1px solid #475569', margin: '10px 0' }}></div>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
//                         {hasSelectedNodes && (
//                             <button
//                                 onClick={deleteSelectedNodes}
//                                 style={{
//                                     width: '100%',
//                                     padding: '8px 16px',
//                                     background: '#f97316',
//                                     border: 'none',
//                                     borderRadius: '6px',
//                                     color: 'white',
//                                     cursor: 'pointer',
//                                     fontSize: '12px',
//                                     fontWeight: '500'
//                                 }}
//                             >
//                                 Delete Selected
//                             </button>
//                         )}
//                         <button
//                             onClick={exportDiagram}
//                             style={{
//                                 width: '100%',
//                                 padding: '8px 16px',
//                                 background: '#059669',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 color: 'white',
//                                 cursor: 'pointer',
//                                 fontSize: '12px',
//                                 fontWeight: '500'
//                             }}
//                         >
//                             Export
//                         </button>
//                         <button
//                             onClick={clearCanvas}
//                             style={{
//                                 width: '100%',
//                                 padding: '8px 16px',
//                                 background: '#dc2626',
//                                 border: 'none',
//                                 borderRadius: '6px',
//                                 color: 'white',
//                                 cursor: 'pointer',
//                                 fontSize: '12px',
//                                 fontWeight: '500'
//                             }}
//                         >
//                             Clear
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <button
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 style={{
//                     position: 'absolute',
//                     top: '16px',
//                     left: isSidebarOpen ? '296px' : '16px',
//                     zIndex: 1000,
//                     padding: '8px',
//                     background: 'rgba(59, 130, 246, 0.9)',
//                     backdropFilter: 'blur(10px)',
//                     border: 'none',
//                     borderRadius: '6px',
//                     color: 'white',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.3s ease',
//                     boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
//                 }}
//                 onMouseOver={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.9)'}
//                 onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'}
//             >
//                 {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>

//             <div style={{ flex: 1, background: 'transparent' }}>
//                 <ReactFlow
//                     nodes={nodes}
//                     edges={edges}
//                     onNodesChange={onNodesChange}
//                     onEdgesChange={onEdgesChange}
//                     onConnect={onConnect}
//                     fitView
//                 >
//                     <Controls />
//                     <MiniMap />
//                     <Background variant="dots" gap={12} size={1} color="#cbd5e1" />
//                     <Panel position="top-left" style={{ marginTop: '60px', marginLeft: isSidebarOpen ? '300px' : '60px', transition: 'margin-left 0.3s ease' }}>
//                         <div style={{
//                             background: 'rgba(255, 255, 255, 0.95)',
//                             padding: '10px 15px',
//                             borderRadius: '8px',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                             border: '1px solid #e2e8f0'
//                         }}>
//                             <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
//                                 💡 Drag from one node to another to connect them
//                             </p>
//                         </div>
//                     </Panel>
//                 </ReactFlow>
//             </div>
//         </div>
//     );
// }