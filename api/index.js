const express = require('express');
const cors = require('cors');
const connect = require('./db.js');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.set('port', process.env.PORT);

app.get('/users' , async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = "SELECT * FROM users";
        const [rows] = await db.execute(query);
        res.json({
            data: rows,
            status: 200
        });
    }catch(err) {
        return res.status(500).json({message: db ? err.sqlMessage : "DB connection"}) 
        throw err;
    }finally {
        if (db)  await db.end(); // Cerrar la conexión
    }    
});

app.get('/users/:id', async (req, res) => { 
    let db;
    try{
        const id = req.params.id;
        db = await connect();
        const query = `SELECT * FROM users WHERE id=${id}`;
        const [rows] = await db.execute(query);
        res.json({
            data: rows,
            status: 200
        })
    } catch(err) {
        return res.status(500).json({message: db ? err.sqlMessage : "DB connection"}) 
    } finally {
        if(db)
            db.end();
    }
});

app.get('/login/:email&:pass', async (req, res) => { 
    let db;
    try{
        const { email, pass } = req.params
        db = await connect();
        const query = `CALL SP_LOGIN_USER('${email}', '${pass}')`;
        const [rows] = await db.execute(query);
        let idUser = 0;
        if(rows[0].length > 0)
            idUser=rows[0][0].id
        res.json({
            data: idUser,
            status: 200
        })
    } catch(err) {
        return res.status(500).json({message: db ? err.sqlMessage : "db connection problem"}) 
    } finally {
        if(db)
            db.end();
    }
});

app.post('/users', async (req, res) => { 
    let db;
    try{
        const { first_name, last_name, email, pass } = req.body
        let idUser;
        db = await connect();
        const query = `CALL SP_CREATE_USER('${first_name}', '${last_name}', '${email}', '${pass}')`;
        const [rows] = await db.execute(query);
        res.json({
            data: rows,
            status: 200
        })
    } catch(err) {
       return res.status(500).json({message: db ? err.sqlMessage : "DB connection"}) 
    } finally {
        if(db)
            db.end();
    }
});



app.listen(app.get('port'), () =>{
    console.log('app escuchando en el puerto', app.get('port'))
});

