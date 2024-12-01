const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connect = require('./db.js');
const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.set('port', process.env.PORT);

app.get('/user', checkToken, async (req, res) => { 
    let db;
    try{
        db = await connect();
        const query = `SELECT * FROM users WHERE id=${req.idUser}`;
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

app.post('/login', async (req, res) => { 
    let db;
    try{
        const { email, pass } = req.body
        db = await connect();
        const query = `SELECT id, pass FROM users WHERE email ='${email}'`;
        
        const [rows] = await db.execute(query);
        let idUser = 0;
        if(rows.length > 0){
            if( bcrypt.compareSync(pass, rows[0].pass))
                idUser=rows[0].id
            else
                throw new Error('Contraseña incorrecta');
        }
        else
            throw new Error('El usuario no existe');
        const token = jwt.sign({
            idUser, 
            exp: Date.now() + 60 * 10000
        }, process.env.SECRET)
        console.log(token);
        res.json({
        data: token,
        status: 200
        })
    } catch(err) {
        return res.status(500).json({message: err.message}) 
    } finally {
        if(db)
            db.end();
    }
});

app.get('/cardTypes' , async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = "SELECT * FROM cardTypes";
        const [rows] = await db.execute(query);
        res.json({
            data: rows,
            status: 200
        });
    }catch(err) {
        return res.status(500).json({message: db ? err.sqlMessage : "DB connection"}) 
        throw err;
    }finally {
        if (db)  await db.end();
    }    
});


app.post('/users', async (req, res) => { 
    let db;
    const saltRounds = 10;
    try{
        const { first_name, last_name, email, pass } = req.body
        db = await connect();
        const hashPassword = bcrypt.hashSync(pass, saltRounds);
        const query = `CALL SP_CREATE_USER('${first_name}', '${last_name}', '${email}', '${hashPassword}')`;
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

app.post('/cards', async (req, res) => { 
    let db;
    try{
        const { user_id, card_number, card_type, expiration_date, CVV, balance } = req.body
        db = await connect();
        const query = `CALL SP_NEW_CARD(${user_id}, '${card_number}', ${card_type}, '${expiration_date}', '${CVV}')`;
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

function checkToken(req, res, next){
    const token = req.headers['authorization'];
    if(typeof token === 'undefined')
        res.sendStatus(403)
    else{
        const tokenData = jwt.verify(token, process.env.SECRET, (err, data) =>{
            if(err)
                res.sendStatus(403);
            else
                req.idUser=data.idUser
        })
        next();
    }
}

app.listen(app.get('port'), () =>{
    console.log('app escuchando en el puerto', app.get('port'))
});


