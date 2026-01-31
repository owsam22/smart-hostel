import bcrypt from 'bcryptjs';

const password = 'admin';

const hashed = await bcrypt.hash(password, 10);
console.log('Hashed password:', hashed);
