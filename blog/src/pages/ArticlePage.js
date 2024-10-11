import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import axios from 'axios';



const ArticlePage = () => {

    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
    const { articleId } = useParams();
    console.log(articleId);

    useEffect(() => {
        const loadArticleInfo = async () => {
            const response = await axios.get(`http://localhost:8000/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, [articleId]);

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const response = await axios.put(
            `http://localhost:8000/api/articles/${articleId}/upvote`
        );
        const updateArticle = response.data;

        if (updateArticle && typeof updateArticle.upvotes === 'number') {
            setArticleInfo(prevInfo => ({
                ...prevInfo,
                upvotes: updateArticle.upvotes
            }));
        }
        else {
            console.error("API não está retornando corretamente os votos");
        }


    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                <button onClick={addUpvote}>Votar</button>
                <p>Este artigo possui {articleInfo.upvotes} votos</p>
            </div>
            {article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updateArticle => setArticleInfo(updateArticle)} />
            <CommentList comments={articleInfo.comments} />
        </>
    );
}

export default ArticlePage;