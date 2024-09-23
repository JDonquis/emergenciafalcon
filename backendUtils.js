import bcryptjs from 'bcryptjs';

// @ts-ignore
export  const findUserByCiWithPassword = async (db, ci) => {

    const { rows: user } = await db.query('SELECT * FROM users WHERE ci = $1',[ci]);
    return user[0];

} 
