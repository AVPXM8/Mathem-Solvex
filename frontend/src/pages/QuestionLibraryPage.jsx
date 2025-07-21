
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import useMathJax from '../hooks/useMathJax';
import { QuestionListSkeleton } from '../components/SkeletonLoader';  
import styles from './QuestionLibraryPage.module.css';

const QuestionLibraryPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({ exams: [], subjects: [], years: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch filter options (subjects, exams, years) once when the component loads
     useMathJax([questions]);
    useEffect(() => {
        api.get('/questions/filters')
            .then(res => setFilterOptions(res.data))
            .catch(err => console.error("Failed to fetch filter options", err));
    }, []);

    // Fetch the list of questions whenever the URL filters or search term change
    useEffect(() => {
        setLoading(true);
        const currentParams = Object.fromEntries([...searchParams]);
        api.get('/questions', { params: currentParams })
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Failed to fetch questions", err))
            .finally(() => setLoading(false));
    }, [searchParams]);
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newParams = Object.fromEntries([...searchParams]);
        if (value) { newParams[name] = value; } 
        else { delete newParams[name]; }
        setSearchParams(newParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = Object.fromEntries([...searchParams]);
        if (searchTerm) { newParams.search = searchTerm; } 
        else { delete newParams.search; }
        setSearchParams(newParams);
    };

    return (
        <div>
            <h1>Question Library</h1>
            <p>Browse, search, and filter from our collection of questions.</p>
            
            <div className={styles.filterBar}>
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

                <select name="exam" onChange={handleFilterChange} value={searchParams.get('exam') || ''}>
                    <option value="">All Exams</option>
                    {filterOptions.exams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                </select>
                <select name="subject" onChange={handleFilterChange} value={searchParams.get('subject') || ''}>
                    <option value="">All Subjects</option>
                    {filterOptions.subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                </select>
            </div>

            <div className={styles.questionList}>
                    {loading ? (
                    <QuestionListSkeleton />) : 
                 questions.length > 0 ? (
                    questions.map(q => (
                        <Link to={`/question/${q._id}`} key={q._id} className={styles.questionCard}>
                            <div className={styles.tags}>
                                <span className={styles.tag}>{q.exam}</span>
                                <span className={styles.tag}>{q.subject}</span>
                                {q.year && <span className={styles.tag}>{q.year}</span>}
                            </div>
                            <div className={styles.questionText} dangerouslySetInnerHTML={{ __html: q.questionText }}></div>
                            <div className={styles.viewLink}>
                                <span>Attempt Question & See Solution</span>
                            </div>
                        </Link>
                    ))
                ) : <div className={styles.noResults}>No questions found for the selected filters.</div>}
            </div>
        </div>
    );
};

export default QuestionLibraryPage;



