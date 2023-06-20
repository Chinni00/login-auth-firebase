import { useState,useRef,useContext  } from 'react';
import { useNavigate } from "react-router-dom";

import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading,setIsLoading] = useState(false)
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const authCtx = useContext(AuthContext)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler=(event)=>{
    event.preventDefault()
    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value
    // validation(optional currently im not validating)
    setIsLoading(true)
    let url;
    if(isLogin){
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCrOtlu3wHIa98YgNCO-lRW7F6WAvzD0Y0'
    }else{
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCrOtlu3wHIa98YgNCO-lRW7F6WAvzD0Y0'
    }
    fetch(url,{
      method:'POST',
      body:JSON.stringify({
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true
      }),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>{
      setIsLoading(false)
      if(res.ok){
        return res.json()
      }else{
       return res.json().then(data => {
               let errorMessage = 'Authentication failure'
               if(data && data.error && data.error.message){
                errorMessage = data.error.message
               }
               
               throw new Error(errorMessage)
        } )
      }
    }).then(data =>{
      
      authCtx.login(data.idToken)
      navigate('/')
    }).catch(err=>{
      alert(err.message)
    })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required  ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin?'login':'create account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
