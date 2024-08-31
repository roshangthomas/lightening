import React from 'react';
import Mindmap from '../components/mindmap';
import styles from '../styles/Mindmap.module.css';

const MindmapPage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mindmap</h1>
            </header>
            <Mindmap />
        </div>
    );
};

export default MindmapPage;
