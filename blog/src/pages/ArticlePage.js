import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import axios from 'axios';

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ title: '', content: [], upvotes: 0, comments: [] });
    const { articleId } = useParams();

    useEffect(() => {
        const loadArticleInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/articles/${articleId}`);
                setArticleInfo(response.data);
            } catch (error) {
                console.error("Erro ao carregar o artigo:", error);
            }
        }

        loadArticleInfo();
    }, [articleId]);

    const addUpvote = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/articles/${articleId}/upvote`);
            const updatedArticle = response.data;

            if (updatedArticle && typeof updatedArticle.upvotes === 'number') {
                setArticleInfo((prevInfo) => ({
                    ...prevInfo,
                    upvotes: updatedArticle.upvotes,
                }));
            } else {
                console.error("API não está retornando corretamente os votos");
            }
        } catch (error) {
            console.error("Erro ao adicionar voto:", error);
        }
    };


    const handleNewComment = (newComment) => {
        setArticleInfo(prevInfo => ({
            ...prevInfo,
            comments: [...prevInfo.comments, newComment]
        }));
    }

    return (
        <>
            <h1>{articleInfo.title}</h1>
            <div className="upvotes-section">
                <button onClick={addUpvote}>Votar</button>
                <p>Este artigo possui {articleInfo.upvotes} votos</p>
            </div>
            <AddCommentForm
                articleName={articleId}
                onArticleUpdated={handleNewComment}
            />
            <CommentList comments={articleInfo.comments} />
        </>
    );
}

export default ArticlePage;
