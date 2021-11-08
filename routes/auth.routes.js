const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs'); //модуль по хешированию
const jwt = require('jsonwebtoken');
const config = require ('config'); //подтяется default.json с /config
const User = require('../models/User.js'); //модель для добавления в базу
const {check,validationResult}=require('express-validator');

//контатинируется с заданным в app.js: app.use('/api/auth', require('./routes/auth.routes')) -  МОжно определить сразу тут, чтобі не путаться 
router.post('/register', 
  [
    check('email', 'Bad mail').isEmail(), /* валидатор express-validator*/
    check('password','Minimal length 6 symb').isLength({ min: 6})
  ],
  async (req,res)=>{
    try{
        if ( !validationResult(req).isEmpty()){
            res.status(400).json({
                errors: validationResult(req).array(),
                message: 'Bad data in registration fields'
            })
        }
        const {email, password} = req.body; //body - обїект для Пост
        //сверка с базой, занят ли емейл
        const candidate = await User.findOne({email: email});
        if (candidate) {
            res.status(400).json({message: 'This user already exists'});
            return;
        }
        //Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 12);

        //добавление пользователя в базу
        const newuser = new User({email: email, password: hashedPassword});
        await newuser.save();
        res.status(201).json({message: 'User was created'});
    }
    catch(e){
        res.status(500).json({message: 'something went wrong'});
    }
} ); //post zapros
/** */
router.post('/login', 
    [
    check('email', 'Bad mail').normalizeEmail().isEmail(), /* валидатор express-validator*/
    check('password','enterPassword that exists in DB').exists()
   ],
   async (req,res)=>{
    try{
        if ( !validationResult(req).isEmpty()){
            res.status(400).json({
                errors: validationResult(req).array(),
                message: 'Bad data in registration fields'
            })
        }
        const {email, password} = req.body; //body - обїект для Пост

        const user = await User.findOne({ email});
        if (!user){
            return res.status(400).json({message: 'there are no such user'});
        }
        //сверка пароля
        const isMatchPSW = await bcrypt.compare(password, user.password);
        if (!isMatchPSW){
            return res.status(400).json({message: 'password is wrong'});
        }
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        )
        res.json({ token, userId: user.id});
        

    }
    catch(e){
        res.status(500).json({message: 'something went wrong'});
    }
    
} )

module.exports=router;