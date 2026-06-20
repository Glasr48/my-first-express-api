const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://Glasr:13468810@ac-zlfqfai-shard-00-00.rsmeudv.mongodb.net:27017,ac-zlfqfai-shard-00-01.rsmeudv.mongodb.net:27017,ac-zlfqfai-shard-00-02.rsmeudv.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-2h2c09-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('✅ Успешно подключились к базе данных MongoDB!'))
.catch((err) => console.log('❌ Ошибка подключения к базе:', err));

const usersSchema = new mongoose.Schema({
    name: String,
    age: Number,
    role: String,
    isActive: Boolean
});
const User = mongoose.model('User', usersSchema);


app.get('/', (req, res) => {
    res.send('<h1>Привет! Это главная страница нашего API.</h1>');
});

app.get('/users', async (req, res) => {
    console.log("👀 Кто-то запросил список пользователей");
    const allUsers = await User.find();
    res.json(allUsers);
});

app.post('/users', async (req, res) => {
    console.log("📥 Получен запрос на создание пользователя!");
    const userData = req.body; 
    
    const newUser = new User({
        name: userData.name,
        age: userData.age,
        role: userData.role || "user",
        isActive: true
    });

    try {
        await newUser.save();
        res.status(201).json(newUser); 
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании" });
    }
});

app.delete('/users/:id', async (req, res) => {
    console.log("🗑️ Получен запрос на удаление!");
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser === null) {
            return res.status(404).json({ message: "Пользователь не найден!" });
        }
        res.json({ message: "Пользователь успешно удален!", deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put('/users/:id', async (req, res) => {
    console.log("✏️ Получен запрос на обновление данных!");
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        
        if (updatedUser === null) {
            return res.status(404).json({ message: "Пользователь не найден!" });
        }

        res.status(200).json({ message: "Данные успешно обновлены!", updatedUser });
        console.log("✅ Пользователь обновлен!");

    } catch (error) {
        console.log("❌ Ошибка при обновлении:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Сервер запущен! Открой в браузере: http://localhost:${port}`);
});