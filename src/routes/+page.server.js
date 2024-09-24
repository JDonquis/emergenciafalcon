
import { createPool, sql } from '@vercel/postgres'

import { POSTGRES_URL } from '$env/static/private'

import {SECRET_INGREDIENT} from '$env/static/private';

import { error, redirect } from '@sveltejs/kit';

import { findUserByCiWithPassword } from '../../backendUtils.js';

import bcryptjs from 'bcryptjs';

import jwt from 'jsonwebtoken';

// @ts-ignore
export async function load({cookies}) {

  const authToken = cookies.get('authToken');

  if(!authToken)
     return {clearUser:true};

  return {clearUser:false};


}

export const actions = {

  // @ts-ignore
  login: async ({cookies, request}) => {
    const loginFormData = await request.formData();

    const ci = loginFormData.get('ci')?.toString()?? '';
    const password = loginFormData.get('password')?.toString()?? '';

    let loginResponse = {

      ci,
      error: false,
      message: ''
    
    };

    try{
      
      const db = createPool({ connectionString: POSTGRES_URL });
      const userAttemptingLogin = await findUserByCiWithPassword(db,ci);
      const authAttempt = await bcryptjs.compare(password,userAttemptingLogin?.password ?? '');

      if(!authAttempt){

        loginResponse.error = true
        loginResponse.message = "Cédula o contraseña incorrecta"

      }

      if(authAttempt){

        const {password,...userDataWithoutPassword} = userAttemptingLogin;
        const authToken = jwt.sign({authedUser:userDataWithoutPassword},SECRET_INGREDIENT, {expiresIn:'48h'});
        cookies.set('authToken',authToken,{httpOnly:true, maxAge: 60 * 60 * 48, sameSite:'strict', path:'/'})

        throw redirect(200,'dashboard');


      }

    }

    finally{
      
    }
    
    loginResponse.error = true;
    console.log(loginResponse)
    return loginResponse;

  }

}



  // const db = createPool({ connectionString: POSTGRES_URL })
  // const startTime = Date.now()

  // try {
  //   const { rows: users } = await db.query('SELECT * FROM users')
  //   const duration = Date.now() - startTime
  //   return {
  //     users: users,
  //     duration: duration,
  //   }
  // } catch (error) {
  //   if (error?.message === `relation "users" does not exist`) {
  //     console.log(
  //       'Table does not exist, creating and seeding it with dummy data now...'
  //     )
  //     // Table is not created yet
  //     await seed()
  //     const { rows: users } = await db.query('SELECT * FROM users')
  //     const duration = Date.now() - startTime
  //     return {
  //       users: users,
  //       duration: duration,
  //     }
  //   } else {
  //     throw error
  //   }
  // }