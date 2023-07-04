const express = require('express')
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'dbuser',
		password: 'Perlin77!',
		database: 'smart-brain'
	}
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	console.log('Getting root');
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json("Success")
					})
				.catch(err => res.status(400).json('Error'))
			} else {
				res.status(400).json('Invalid credentials');
			}
		})
		.catch(err => res.status(400).json('Invalid credentials'));
})

app.post('/register', (req,res) => {
	const { name, email, password } = req.body;
	if (req.body.email.length > 3 && req.body.password.length > 3){
		const hash = bcrypt.hashSync(password)
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginemail => {
				trx('users')
					.returning('*')
					.insert({
					name: name,
					email: loginemail[0].email,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => {
			res.status(400).json('Unable to join');
			console.log(err);
		})
	}
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length > 0) {
				res.json(user[0])
			} else {
				res.json('User not found')
			}
		});
})

app.put('/image', (req, res) => {
	const { id } = req.params;
	let found = false;
	console.log('Getting profile');
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found){res.status(400).json('Not found')};
})

app.listen(3001, () => {
	console.log("app is running on 3001");
})
