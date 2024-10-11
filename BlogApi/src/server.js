import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { db, connectToDb } from './db.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const articles = await db.collection('articles').find().toArray();

        if (articles.length > 0) {
            res.json(articles);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        res.status(500).json({ message: 'Erro ao buscar artigos' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Email ou senha inválido" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (isPasswordValid) {
        res.status(200).json({ message: "Login efetuado com sucesso" });
    }
    else {
        res.status(401).json({ message: "Senha ou email inválido(s)" });
    }

});

app.post('/api/create-article', async (req, res) => {
    const { name, title, content } = req.body;

    const existingArticle = await db.collection('articles').findOne({ name });
    if (existingArticle) {
        return res.status(400).json({ message: 'Já existe um artigo com este nome' });
    }

    try {
        await db.collection('articles').insertOne({
            name,
            title,
            content,
            upVotes: 0,
            comments: []
        });

        return res.status(201).json({ message: 'Artigo criado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar artigo' });
    }
});

app.post('/api/create-account', async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
        username,
        email,
        passwordHash
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
});


app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 }
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json({ upvotes: article.upvotes });
    } else {
        res.status(404).send("Este artigo não existe");
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text } }
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.send(article.comments);
    }
    else {
        res.send('Este artigo não existe');
    }
});

connectToDb(() => {
    console.log('Conectado com sucesso ao MongoDB');
    app.listen(8000, () => {
        console.log('Servidor sendo executado na porta 8000');
    });
});