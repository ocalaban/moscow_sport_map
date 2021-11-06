import React from 'react';
import styles from './LoginPage.module.css';
import human from './fitness.png';
import vector from './Vector.png';
import vector2 from './Vector2.png';
import FadeIn from 'react-fade-in';

export class LoginPage extends React.Component {
  render() {
    return (
      <div className={styles.loginPage}>
        <div className={styles.content}>
          <FadeIn delay={100}>
            <div className={styles.text}>

              <h1>
                <span>map</span>
                <span>sport</span>
              </h1>
            </div>
            <div className={styles.btn}><button>Вход</button></div>
          </FadeIn>
        </div>
        <div className={styles.img}>
          <img src={human} alt="" className={styles.human} />
          <img src={vector} alt="" className={styles.vector} />
          <img src={vector2} alt="" className={styles.vector2} />
        </div>
      </div>
    )
  }

}