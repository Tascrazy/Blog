import ArticleList from "../components/ArticleList";
import articles from "./article-content";


const ArticlesListPage = () => {
    return (
        <>
            <h1>Confira os artigos</h1>
            <ArticleList articles={articles} />
        </>
    )
}

export default ArticlesListPage;