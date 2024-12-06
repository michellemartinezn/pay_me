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

app.get('/services' , async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = "SELECT * FROM services";
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

app.get('/cards', checkToken, async (req, res) => { 
    let db;
    try{
        db = await connect();
        const query = `SELECT * FROM v_user_cards WHERE user_id =${req.idUser}`;
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

app.get('/cards/:email', checkToken, async (req, res) => { 
    let db;
    try{
        db = await connect();
        const query = `SELECT card_id, card_number FROM v_user_cards WHERE email ='${req.params.email}'`;
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

app.post('/cards', checkToken, async (req, res) => { 
    let db;
    try{
        const { card_number, card_type, expiration_date, CVV, balance } = req.body
        let dateExpiration = "20"
        dateExpiration = dateExpiration.concat(expiration_date.substring(3), expiration_date.substring(0,2), "01")
        db = await connect();
        const query = `CALL SP_NEW_CARD(${req.idUser}, '${card_number}', ${card_type}, '${dateExpiration}', '${CVV}', ${balance})`;
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

app.post('/transaction', checkToken, async (req, res) => { 
    let db;
    try{
        let { source_card, recipient_id, amount, transaction_type, concept } = req.body
        let _date = new Date();
        let mysqlDate = _date.getFullYear() + String(_date.getMonth() + 1).padStart(2, '0') + String(_date.getDate()).padStart(2, '0');
        db = await connect();
        let query = `CALL SP_CREATE_TRANSACTION(${source_card}, ${recipient_id}, '${mysqlDate}', ${amount}, ${transaction_type}, '${concept}')`;
        let [rows] = await db.execute(query);
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

app.get('/movements', checkToken, async (req, res) => { 
    let db;
    try{
        db = await connect();
        const query = `SELECT description_type, card_number, transaction_date, amount, concept FROM v_movements WHERE user_id=${req.idUser}`;
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

app.post('/movements', checkToken, async (req, res) => { 
    let db;
    try{
        let {date, type} = req.body;
        db = await connect();
        let query = `SELECT description_type, card_number, transaction_date, amount, concept FROM v_movements WHERE user_id=${req.idUser}`;
        if(date.length > 0) {
            let [year, month, day] = date.split("-"); 
            query= query.concat(` AND transaction_date = '${day}-${month}-${year}'`);
        }
        if(type.length > 0){
            query= query.concat(` AND description_type = '${type}'`);
        }

        console.log(query)
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


