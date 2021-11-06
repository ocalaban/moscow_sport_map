import React from "react";
import styles from "./Footer.module.css"
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';


export class Footer extends React.Component {
  render(){
    return(
      <div className={styles.footer}>
        <div className={styles.text}>mapsport</div>
        <div className={styles.img}>
          <div><img src={image1} alt="" /></div>
          <div><img src={image2} alt="" /></div>
          <div><img src={image3} alt="" /></div>
        </div>
        <div className={styles.mixText}>
        <a href="#">Соглашение о пользовании информационными системами и ресурсами города Москвы</a>
        <div className={styles.mixText_children}>
          <div>
            <a href="#">Сайты Москвы</a>
            <a href="#">Сайты России</a>
          </div>
          <div>
            <a href="#">Техническая поддержка</a>
            <a href="#">Лицензионное соглашение</a>
          </div>
        </div>
        </div>
      </div>
    )
  }
}