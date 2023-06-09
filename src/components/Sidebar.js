import React, { useState } from 'react';
import Search from './Search';
import SearchResult from './SearchResult';
import { Modal, Button } from 'react-bootstrap'; // Add Button to the imports
import axios from 'axios';
import './Sidebar.css';
import { BsArrowBarRight } from 'react-icons/bs'; // Import the icon

const API_ACCESS = process.env.REACT_APP_API_BASE_URL

const modalStyle = {
    position: 'fixed',
    top: 0,
    right: 'auto',
    bottom: 0,
    left: 0,
    width: '300px',
    padding: 0,
    backgroundColor: '#ffffff',
};

const Sidebar = () => {
    const [show, setShow] = useState(false);
    const handleModalClose = () => setShow(false); // Change the function name
    const handleModalShow = () => setShow(true); // Change the function name
    const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態
    const [searchResults, setSearchResults] = useState([]); // 検索結果の状態
    const [isLoading, setIsLoading] = useState(false); // ローディング状態の管理
    const [error, setError] = useState(null); // エラーの管理

    const fetchRepositories = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${API_ACCESS}/listRepos?q=${searchQuery}`
            );
            const formattedData = response.data.map(repo => ({
                title: repo.name,
                abstract: repo.description || 'No description provided.',
                webUrl: repo.web_url,
            }));

            setSearchResults(formattedData);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button className="launch-button" variant="outline-primary" onClick={handleModalShow}>
                <BsArrowBarRight color="white" size={20} />
            </Button>
            <Modal
                show={show}
                onHide={handleModalClose}
                style={modalStyle}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Sidebar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Search
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={fetchRepositories}
                    />
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <SearchResult results={searchResults} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Sidebar;
