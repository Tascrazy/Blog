import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateArticlePage = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const createArticle = async () => {
        if (!name || !title || !content) {
            setError('Preencha todos os campos!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/create-article', {
                name,
                title,
                content
            });
            if (response.status === 201) {
                navigate('/articlelist');
                alert('Artigo criado com sucesso')
            }
            else {
                setError("Falha ao criar um artigo");
            }
        }
        catch (error) {
            console.log(error)
            setError("Falha ao criar o artigo");
        }
    }

    return (
        <div>
            <h1>Criar um novo artigo</h1>
            {error && <p>{error}</p>}
            <input
                type="text"
                placeholder="Nome do artigo"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Título do artigo"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Conteúdo do artigo"
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <button onClick={createArticle}>Criar um novo artigo</button>
        </div>
    )
};

export default CreateArticlePage;