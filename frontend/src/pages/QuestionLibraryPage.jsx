// src/pages/QuestionLibraryPage.jsx - FINAL VERSION WITH VISIBLE TEXT & SEARCH BUTTON

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './QuestionLibraryPage.module.css';

const QuestionLibraryPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({ exams: [], subjects: [], years: [] });
    const [searchTerm, setSearchTerm] = useState(''); // New state to hold search input
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch filter options (like all subjects, years, etc.) when the page loads
    useEffect(() => {
        axios.get('http://localhost:3001/api/questions/filters')
            .then(res => setFilterOptions(res.data))
            .catch(err => console.error("Failed to fetch filter options", err));
    }, []);

    // Fetch questions whenever the URL parameters (filters/search) change
    useEffect(() => {
        setLoading(true);
        const currentParams = Object.fromEntries([...searchParams]);
        axios.get('http://localhost:3001/api/questions', { params: currentParams })
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Failed to fetch questions", err))
            .finally(() => setLoading(false));
    }, [searchParams]);
    
    // This function updates the URL parameters when a filter dropdown is changed
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newParams = Object.fromEntries([...searchParams]);
        if (value) {
            newParams[name] = value;
        } else {
            delete newParams[name];
        }
        setSearchParams(newParams);
    };

    // This function runs when the user clicks the "Search" button
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        const newParams = Object.fromEntries([...searchParams]);
        if (searchTerm) {
            newParams.search = searchTerm;
        } else {
            delete newParams.search;
        }
        setSearchParams(newParams);
    };

    return (
        <div>
            <h1>Question Library</h1>
            <p>Browse, search, and filter from our collection of questions.</p>
            
            {/* --- Filter Bar --- */}
            <div className={styles.filterBar}>
                {/* Search Form */}
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input 
                        type="text" 
                        placeholder="Search question text..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>Search</button>
                </form>

                {/* Filter Dropdowns */}
                <select name="exam" onChange={handleFilterChange} value={searchParams.get('exam') || ''}>
                    <option value="">All Exams</option>
                    {filterOptions.exams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                </select>
                <select name="subject" onChange={handleFilterChange} value={searchParams.get('subject') || ''}>
                    <option value="">All Subjects</option>
                    {filterOptions.subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                </select>
            </div>

            {/* --- Question List --- */}
            <div className={styles.questionList}>
                {loading ? (
                    <p>Loading questions...</p>
                ) : questions.length > 0 ? (
                    questions.map(q => (
                        <Link to={`/question/${q._id}`} key={q._id} className={styles.questionCard}>
                            <div className={styles.tags}>
                                <span className={styles.tag}>{q.exam}</span>
                                <span className={styles.tag}>{q.subject}</span>
                                {q.year && <span className={styles.tag}>{q.year}</span>}
                            </div>
                            
                            {/* This now displays a rich preview of the question text */}
                            <div 
                                className={styles.questionText} 
                                dangerouslySetInnerHTML={{ __html: q.questionText }}
                            ></div>
                            
                            <div className={styles.viewLink}>
                                Attempt Question & See Solution &rarr;
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No questions found for the selected filters.</p>
                )}
            </div>
        </div>
    );
};

export default QuestionLibraryPage;