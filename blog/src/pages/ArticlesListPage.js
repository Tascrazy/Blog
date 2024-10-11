import { useEffect, useState } from 'react';
import ArticleList from "../components/ArticleList";
import axios from 'axios';

const ArticlesListPage = () => {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/articles');
                setArticles(response.data);
            } catch (error) {
                setError('Erro ao carregar os artigos: ' + (error.response ? error.response.data : error.message));
                console.error(error);
            }
        };
        loadArticles();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <h1>Confira os artigos</h1>
            <ArticleList articles={articles} /> { }
        </>
    );
}

export default ArticlesListPage;
